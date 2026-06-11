globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>US Soccer guidelines limit heading before age 11-12. This is introductory heading at low volume and with soft balls. Beach-ball-style ball or oversized soft ball. Five reps per player, not twenty. Safe introduction to heading technique.</p>\n<p><strong>What you need:</strong> 1 soft ball per pair. 8 feet of space between partners.</p>\n<p><strong>Setup:</strong> Two kids 8 feet apart. One has the ball.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Tosser underhands the ball to the header at forehead height.</li>\n<li>Header watches the ball come (See).</li>\n<li>Header keeps neck firm and eyes open.</li>\n<li>Header leans forward and heads the ball back to the tosser, using the forehead.</li>\n<li>Do 5 headers each, then switch roles.</li>\n</ol>\n<p><strong>What to watch:</strong> Is the header meeting the ball? Or letting it come to them passively?</p>\n<p><strong>If they’re struggling:</strong> Toss from closer distance. Use a softer ball.</p>\n<p><strong>If they’ve got it:</strong> Toss from 10 feet away. Increase the height of the toss.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size4/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 4 soccer ball →</a> — right size for ages 8–12.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Heading from Partner Toss","summary":"Partner tosses the ball and player heads it back to them. 8 minutes. Ages 11-12.","sport":"soccer","ages":["11-12"],"fundamental":"heading","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Partner tossing a soft ball to a player's forehead, player heading it back with a firm neck.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":true,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Heading drill at 11-12, includes US Soccer rule note. Sensitive flag for head-injury topic."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-heading-from-partner-toss.md";
				const url = undefined;
				function rawContent() {
					return "\nUS Soccer guidelines limit heading before age 11-12. This is introductory heading at low volume and with soft balls. Beach-ball-style ball or oversized soft ball. Five reps per player, not twenty. Safe introduction to heading technique.\n\n**What you need:** 1 soft ball per pair. 8 feet of space between partners.\n\n**Setup:** Two kids 8 feet apart. One has the ball.\n\n**How to run it:**\n\n1. Tosser underhands the ball to the header at forehead height.\n2. Header watches the ball come (See).\n3. Header keeps neck firm and eyes open.\n4. Header leans forward and heads the ball back to the tosser, using the forehead.\n5. Do 5 headers each, then switch roles.\n\n**What to watch:** Is the header meeting the ball? Or letting it come to them passively?\n\n**If they're struggling:** Toss from closer distance. Use a softer ball.\n\n**If they've got it:** Toss from 10 feet away. Increase the height of the toss.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 4 soccer ball →](/go/soccer-ball-size4/) — right size for ages 8–12.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
