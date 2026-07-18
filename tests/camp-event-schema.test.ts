import { describe, expect, it } from 'vitest';
import { buildCampEventSchema } from '../src/lib/camp-event-schema';

const camp = {
  name: 'North Sound Skills Camp', start_date: '2026-08-03', end_date: '2026-08-07',
  address: '100 Field Way', city: 'Tacoma', state: 'WA', zip: '98402',
  description: 'A week of position work and small-sided games.', hero_photo_key: 'camps/north-sound.webp',
  age_known: 1, age_min: 9, age_max: 12,
};

describe('camp Event structured data', () => {
  it('emits a bounded dated offline event without inventing an organizer', () => {
    const schema = buildCampEventSchema(camp, { siteUrl: 'https://parentcoachdesk.com', sportLabel: 'Soccer' });
    expect(schema).toMatchObject({
      '@type': 'Event', startDate: '2026-08-03', endDate: '2026-08-07',
      location: { '@type': 'Place', address: { addressLocality: 'Tacoma', addressRegion: 'WA' } },
      image: ['https://parentcoachdesk.com/camp-photos/camps/north-sound.webp'],
    });
    expect(JSON.stringify(schema)).not.toMatch(/organizer|offers|price|email|phone/i);
  });

  it('emits nothing for missing, malformed, reversed, or incomplete event evidence', () => {
    expect(buildCampEventSchema({ ...camp, start_date: null }, { siteUrl: 'https://parentcoachdesk.com', sportLabel: 'Soccer' })).toBeNull();
    expect(buildCampEventSchema({ ...camp, start_date: '2026-02-30' }, { siteUrl: 'https://parentcoachdesk.com', sportLabel: 'Soccer' })).toBeNull();
    expect(buildCampEventSchema({ ...camp, start_date: '9999-99-99' }, { siteUrl: 'https://parentcoachdesk.com', sportLabel: 'Soccer' })).toBeNull();
    expect(buildCampEventSchema({ ...camp, end_date: '2026-08-01' }, { siteUrl: 'https://parentcoachdesk.com', sportLabel: 'Soccer' })).toBeNull();
    expect(buildCampEventSchema({ ...camp, zip: '' }, { siteUrl: 'https://parentcoachdesk.com', sportLabel: 'Soccer' })).toBeNull();
  });

  it('drops unsafe image keys and uses an honest fallback description', () => {
    const schema = buildCampEventSchema({ ...camp, description: '', hero_photo_key: '../secret', age_known: 0 }, { siteUrl: 'https://parentcoachdesk.com', sportLabel: 'Soccer' });
    expect(schema).toMatchObject({ description: 'Soccer camp in Tacoma, WA.' });
    expect(schema).not.toHaveProperty('image');
  });
});
