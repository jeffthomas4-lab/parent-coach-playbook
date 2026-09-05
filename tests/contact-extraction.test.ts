// Contact extraction from organization websites.
//
// These cover the two things that decide whether org_contacts is worth having:
// does it find the real person, and does it refuse to invent one. The second
// matters more. A missed contact costs an outreach email; a fabricated contact
// puts a made-up human being into a CRM and then into somebody's inbox.
//
// Every case here is a bug that was actually shipped and caught in review, not
// a hypothetical:
//   * a staff page stapled the first person's title onto the second person's
//     address, because the text window reached back over the previous card;
//   * <a href="mailto:x@y.com">Email Us</a> lost its name entirely, because the
//     address exists only in the attribute and the search ran on stripped text;
//   * "Marketing Coordinator" was stored as a person's full_name, because it is
//     a valid-looking pair of capitalized words;
//   * "Alicia Moreau Head Coach" produced the name "Moreau Head", because a
//     left-to-right regex consumes "Coach Alicia" and never offers the real
//     pair as a candidate.

import { afterAll, beforeAll, describe, it, expect } from 'vitest';
import { extractContacts, findContactPages, writeContact } from '../workers-activity-radar/enrichment-worker';
import { computeContentHash } from '../src/lib/org-contacts';
import { createDisposableOpsDatabase } from './helpers/disposable-ops-db';

describe('extractContacts — finds the real person', () => {
  it('pairs each name with its OWN title on a multi-person staff page', () => {
    const html = `
      <div><h3>Dana Reyes</h3><p>Camp Director</p>
        <a href="mailto:dana.reyes@sunridgeymca.org">dana.reyes@sunridgeymca.org</a></div>
      <div><h3>Marcus Webb</h3><p>Registrar</p>
        <a href="mailto:mwebb@sunridgeymca.org">mwebb@sunridgeymca.org</a></div>`;
    const out = extractContacts(html, 'https://sunridgeymca.org/staff', true);

    expect(out).toHaveLength(2);
    const dana = out.find((c) => c.email === 'dana.reyes@sunridgeymca.org');
    const marcus = out.find((c) => c.email === 'mwebb@sunridgeymca.org');
    expect(dana).toMatchObject({ fullName: 'Dana Reyes', role: 'director' });
    // The regression: Marcus used to come back as "Dana Reyes / Camp Director".
    expect(marcus).toMatchObject({ fullName: 'Marcus Webb', role: 'registrar' });
  });

  it('reads a mailto: whose link text is not the address', () => {
    const html = `<td><strong>Ben Ortiz</strong></td><td>Assistant Coach</td>
      <td><a href="mailto:bortiz@riversideclub.org">Email Ben</a></td>`;
    const [c] = extractContacts(html, 'https://riversideclub.org/coaches', true);
    expect(c).toMatchObject({ fullName: 'Ben Ortiz', role: 'coach' });
  });

  it('classifies by the whole title, not just the noun that matched', () => {
    const cases: [string, string][] = [
      ['Executive Director', 'director'],
      ['Head Coach', 'coach'],
      ['Owner', 'owner'],
      ['Office Manager', 'admin'],
      // "Coordinator" alone is admin; the qualifying word decides.
      ['Marketing Coordinator', 'marketing'],
    ];
    for (const [title, role] of cases) {
      const html = `<p>Jamie Fletcher</p><p>${title}</p><p><a href="mailto:jf@org.com">e</a></p>`;
      expect(extractContacts(html, 'https://org.com/staff', true)[0]?.role).toBe(role);
    }
  });

  it('does not let a nearby generic mailbox inherit a person', () => {
    const html = `<p>Nina Halvorsen</p><p>Executive Director</p>
      <p><a href="mailto:nina@lakesidey.org">nina@lakesidey.org</a></p>
      <p>General questions: <a href="mailto:info@lakesidey.org">info@lakesidey.org</a></p>`;
    const out = extractContacts(html, 'https://lakesidey.org/about', false);
    expect(out.find((c) => c.fullName === 'Nina Halvorsen')).toBeTruthy();
    // info@ is a channel. It belongs on organizations.email, not to a human.
    expect(out.find((c) => c.email === 'info@lakesidey.org')).toBeUndefined();
  });

  it('collapses an address that appears in both the href and the body', () => {
    const html = `<p>Rita Cho</p><p>Registrar</p>
      <p><a href="mailto:rita@org.com">rita@org.com</a></p><p>Reach Rita at rita@org.com</p>`;
    expect(extractContacts(html, 'https://org.com/staff', true)).toHaveLength(1);
  });
});

describe('extractContacts — refuses to invent a person', () => {
  it('never stores a job title as a name', () => {
    const html = `<h2>Contact Us</h2><p>Marketing Coordinator</p>
      <p><a href="mailto:someone@org.com">someone@org.com</a></p>`;
    const names = extractContacts(html, 'https://org.com/contact', false).map((c) => c.fullName);

    // null is the CORRECT answer for this page. There is no person on it, only
    // a job title sitting next to a shared mailbox, so refusing to name anyone
    // is the pass condition — not a gap in the assertion.
    expect(names).not.toContain('Marketing Coordinator');
    for (const n of names) {
      if (n === null) continue;
      expect(n).not.toMatch(/coordinator|director|coach|manager|contact/i);
    }
  });

  it('does not straddle the name/title boundary', () => {
    const html = `<strong>Alicia Moreau</strong> Head Coach
      <a href="mailto:amoreau@riversideclub.org">Email</a>`;
    const [c] = extractContacts(html, 'https://riversideclub.org/coaches', true);
    // Used to return "Moreau Head".
    expect(c.fullName).toBe('Alicia Moreau');
  });

  it('keeps the address but drops the name when no title is present', () => {
    const html = `<p>Sarah Kim</p><p><a href="mailto:skim@org.com">skim@org.com</a></p>`;
    const [c] = extractContacts(html, 'https://org.com/contact', false);
    expect(c.email).toBe('skim@org.com');
    // A capitalized pair next to an address is not evidence of a staff member.
    expect(c.fullName).toBeNull();
  });

  it('invents nothing on a page with no contacts', () => {
    const html = `<h1>Welcome</h1><p>Sign up for summer camp. Learn more about our programs.</p>`;
    expect(extractContacts(html, 'https://org.com/', false)).toEqual([]);
  });

  it('filters transactional, vendor, and image-filename addresses', () => {
    const html = `<a href="mailto:noreply@site.com">x</a>
      <img src="logo@2x.png"><p>sentry@sentry.io</p><p>you@example.com</p>`;
    expect(extractContacts(html, 'https://realorg.com/contact', false)).toEqual([]);
  });
});

describe('extractContacts — child-safety guardrails', () => {
  it('skips a roster URL outright', () => {
    const html = `<h2>Team Roster</h2><p>Tommy Nguyen - tommy.n@familymail.com</p>`;
    expect(extractContacts(html, 'https://club.org/teams/roster', false)).toEqual([]);
  });

  it('drops a contact whose context reads like a child, even on an allowed URL', () => {
    const html = `<h2>Contact</h2><p>Jordan Blake, 5th grade, jordan.blake@familymail.com</p>`;
    expect(extractContacts(html, 'https://club.org/contact', false)).toEqual([]);
  });

  it.each(['Parent Coach', 'Guardian Volunteer Coach', 'Student Coach'])(
    'drops explicit family or student context even when it also contains a staff title: %s',
    (title) => {
      const html = `<p>Taylor Example</p><p>${title}</p><p><a href="mailto:taylor@familymail.example">Email</a></p>`;
      expect(extractContacts(html, 'https://club.example/staff', true)).toEqual([]);
    },
  );

  it('drops an explicit team-parent role even when the same card also says assistant coach', () => {
    const html = `<h3>Taylor Example</h3><p>Team Parent and Assistant Coach</p>
      <a href="mailto:taylor@realclub.org">Email</a>`;
    expect(extractContacts(html, 'https://realclub.org/staff', true)).toEqual([]);
  });

  it.each(['Parent Resources', 'Student Programs'])(
    'keeps a valid professional staff card when unrelated page furniture says %s',
    (pageFurniture) => {
      const html = `<nav>${pageFurniture}</nav><article><p>Dana Reyes</p><p>Club Director</p>
        <p><a href="mailto:dana@club.example">Email</a></p></article>`;
      expect(extractContacts(html, 'https://club.example/staff', true)).toMatchObject([{
        fullName: 'Dana Reyes', title: 'Director', role: 'director', email: 'dana@club.example',
      }]);
    },
  );

  it('recognizes a chief operating officer as an adult professional role', () => {
    const html = `<article><h3>Morgan Rivera</h3><p>Chief Operating Officer</p>
      <a href="mailto:morgan@club.example">Email</a></article>`;
    expect(extractContacts(html, 'https://club.example/staff', true)).toMatchObject([{
      fullName: 'Morgan Rivera', title: 'Chief Operating Officer', role: 'admin', email: 'morgan@club.example',
    }]);
  });

  it('does not let an adjacent participant card veto a separate adult staff card', () => {
    const html = `<article><p>Jordan Child</p><p>5th grade participant</p></article>
      <article><p>Dana Reyes</p><p>Camp Director</p><a href="mailto:dana@club.example">Email</a></article>`;
    expect(extractContacts(html, 'https://club.example/staff', true)).toMatchObject([{
      fullName: 'Dana Reyes', title: 'Camp Director', role: 'director', email: 'dana@club.example',
    }]);
  });

  it('never marks a scraped contact public', () => {
    const html = `<p>Dana Reyes</p><p>Camp Director</p><p><a href="mailto:d@org.com">e</a></p>`;
    const out = extractContacts(html, 'https://org.com/staff', true);
    // is_public is set at the write layer, not here; assert this shape carries
    // no publication signal an injected page could flip.
    expect(Object.keys(out[0])).not.toContain('isPublic');
  });
});

describe('findContactPages', () => {
  const nav = `<a href="/about">About Us</a><a href="/staff">Our Staff</a>
    <a href="/contact">Contact</a><a href="/teams/roster">Roster</a>
    <a href="/login">Login</a><a href="https://other-site.com/staff">External</a>`;

  it('ranks staff pages above generic contact pages', () => {
    expect(findContactPages(nav, 'https://org.com/')[0]).toBe('https://org.com/staff');
  });

  it('excludes rosters, authenticated paths, and other origins', () => {
    const pages = findContactPages(nav, 'https://org.com/');
    expect(pages.some((p) => p.includes('roster'))).toBe(false);
    expect(pages.some((p) => p.includes('login'))).toBe(false);
    expect(pages.some((p) => p.includes('other-site'))).toBe(false);
  });

  it('returns nothing when there is nothing to follow', () => {
    expect(findContactPages('<p>no links here</p>', 'https://org.com/')).toEqual([]);
  });
});

describe('writeContact — CRM context boundary', () => {
  let resource: Awaited<ReturnType<typeof createDisposableOpsDatabase>>;

  beforeAll(async () => {
    resource = await createDisposableOpsDatabase('contact-enrichment-write-test');
  }, 30_000);

  afterAll(async () => {
    await resource.mf.dispose();
  });

  const contact = {
    fullName: 'Dana Reyes',
    title: 'Camp Director',
    role: 'director',
    email: 'dana@example.invalid',
    confidence: 'high' as const,
    sourceUrl: 'https://club.example/staff',
  };

  it('classifies a newly extracted adult-role contact as professional', async () => {
    await expect(writeContact(resource.db, 'org-new', contact, '2026-09-04T12:00:00.000Z')).resolves.toBe('created');
    const row = await resource.db.prepare(
      `SELECT contact_context, content_hash FROM org_contacts WHERE organization_id=?`,
    ).bind('org-new').first<{ contact_context: string; content_hash: string }>();

    expect(row?.contact_context).toBe('professional');
    expect(row?.content_hash).toBe(await computeContentHash({
      organization_id: 'org-new',
      full_name: contact.fullName,
      title: contact.title,
      role: contact.role,
      email: contact.email,
      do_not_contact: 0,
      contact_context: 'professional',
    }));
  });

  it('holds an address with no adult professional role as unknown', async () => {
    await expect(writeContact(resource.db, 'org-unknown-role', {
      ...contact,
      fullName: null,
      title: null,
      role: 'unknown',
      email: 'person@example.invalid',
    }, '2026-09-04T12:00:30.000Z')).resolves.toBe('created');
    const row = await resource.db.prepare(
      `SELECT contact_context FROM org_contacts WHERE organization_id=?`,
    ).bind('org-unknown-role').first<{ contact_context: string }>();
    expect(row?.contact_context).toBe('unknown');
  });

  it('upgrades only legacy unknown context', async () => {
    await resource.db.prepare(
      `INSERT INTO org_contacts (id, organization_id, full_name, role, email, source, contact_context)
       VALUES ('unknown-contact','org-unknown','Dana Reyes','director',?,'enrichment','unknown')`,
    ).bind(contact.email).run();

    await expect(writeContact(resource.db, 'org-unknown', contact, '2026-09-04T12:01:00.000Z')).resolves.toBe('updated');
    const row = await resource.db.prepare(
      `SELECT contact_context FROM org_contacts WHERE id='unknown-contact'`,
    ).first<{ contact_context: string }>();
    expect(row?.contact_context).toBe('professional');
  });

  it('preserves an explicit guardian context', async () => {
    await resource.db.prepare(
      `INSERT INTO org_contacts (id, organization_id, full_name, role, email, source, contact_context)
       VALUES ('guardian-contact','org-guardian','Dana Reyes','director',?,'enrichment','guardian')`,
    ).bind(contact.email).run();

    await expect(writeContact(resource.db, 'org-guardian', contact, '2026-09-04T12:02:00.000Z')).resolves.toBe('updated');
    const row = await resource.db.prepare(
      `SELECT contact_context FROM org_contacts WHERE id='guardian-contact'`,
    ).first<{ contact_context: string }>();
    expect(row?.contact_context).toBe('guardian');
  });
});
