globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>This drill is for kids who want to play goalkeeper. Diving is the signature keeper move. At 11-12, they can handle the impact. Keeper pushes off their feet and extends to cover space.</p>\n<p><strong>What you need:</strong> A goal. A soccer ball. Soft ground or mat preferred.</p>\n<p><strong>Setup:</strong> Keeper in the goal. You stand 8 feet away with the ball.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>You shoot a gentle shot toward one corner of the goal.</li>\n<li>Keeper pushes off their feet and dives sideways.</li>\n<li>Keeper extends their arms and body to block the shot.</li>\n<li>Keeper lands on their side, not their stomach.</li>\n<li>Do 3 dives to each side (6 total).</li>\n</ol>\n<p><strong>What to watch:</strong> Do they push off hard? Or just fall? A good dive starts with a strong push.</p>\n<p><strong>If they’re struggling:</strong> Start with no shot. Just have them practice the diving motion without a ball.</p>\n<p><strong>If they’ve got it:</strong> Shoot with more pace and accuracy. The keeper has to react faster and extend farther.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size4/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 4 soccer ball →</a> — right size for ages 8–12.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Keeper Diving to Side","summary":"Goalkeeper dives to either side to make a save. 10 minutes. Ages 11-12.","sport":"soccer","ages":["11-12"],"fundamental":"goalkeeping","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Goalkeeper diving sideways with arms extended to block a shot, landing on their side.","editorial":{"qualityGrade":7,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":true,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Diving carries impact risk; soft ground noted. Sensitive flag for injury risk."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-keeper-diving-to-side.md";
				const url = undefined;
				function rawContent() {
					return "\nThis drill is for kids who want to play goalkeeper. Diving is the signature keeper move. At 11-12, they can handle the impact. Keeper pushes off their feet and extends to cover space.\n\n**What you need:** A goal. A soccer ball. Soft ground or mat preferred.\n\n**Setup:** Keeper in the goal. You stand 8 feet away with the ball.\n\n**How to run it:**\n\n1. You shoot a gentle shot toward one corner of the goal.\n2. Keeper pushes off their feet and dives sideways.\n3. Keeper extends their arms and body to block the shot.\n4. Keeper lands on their side, not their stomach.\n5. Do 3 dives to each side (6 total).\n\n**What to watch:** Do they push off hard? Or just fall? A good dive starts with a strong push.\n\n**If they're struggling:** Start with no shot. Just have them practice the diving motion without a ball.\n\n**If they've got it:** Shoot with more pace and accuracy. The keeper has to react faster and extend farther.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 4 soccer ball →](/go/soccer-ball-size4/) — right size for ages 8–12.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
