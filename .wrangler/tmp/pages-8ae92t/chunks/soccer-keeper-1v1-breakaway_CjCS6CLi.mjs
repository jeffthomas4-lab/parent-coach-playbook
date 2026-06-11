globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>This drill is for kids who want to play goalkeeper. The breakaway is the most critical situation. Keeper has to come out quickly, narrow the angle, and make the save.</p>\n<p><strong>What you need:</strong> A goal. A soccer ball. 20 feet of space.</p>\n<p><strong>Setup:</strong> Attacker starts 20 feet from goal with the ball. Keeper is in the goal.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Attacker dribbles toward goal using Touch, Look, Push, Go.</li>\n<li>Keeper charges out toward the attacker, narrowing the angle.</li>\n<li>Attacker shoots or tries to go around the keeper.</li>\n<li>Keeper makes a save by blocking or diving.</li>\n<li>Do 4 breakaway attempts.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the keeper come out and narrow the angle? Or stay in the goal?</p>\n<p><strong>If they’re struggling:</strong> Start the attacker closer (15 feet). Keeper has more time to react.</p>\n<p><strong>If they’ve got it:</strong> Attacker gets more time and space. Keeper has to read the situation faster.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size4/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 4 soccer ball →</a> — right size for ages 8–12.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Keeper 1v1 Breakaway","summary":"Goalkeeper faces a breakaway attacker and makes a save. 10 minutes. Ages 11-12.","sport":"soccer","ages":["11-12"],"fundamental":"goalkeeping","progression":"refine","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Goalkeeper charging out to narrow the angle as an attacker approaches with the ball.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean keeper drill. Soccer vocab correct."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-keeper-1v1-breakaway.md";
				const url = undefined;
				function rawContent() {
					return "\nThis drill is for kids who want to play goalkeeper. The breakaway is the most critical situation. Keeper has to come out quickly, narrow the angle, and make the save.\n\n**What you need:** A goal. A soccer ball. 20 feet of space.\n\n**Setup:** Attacker starts 20 feet from goal with the ball. Keeper is in the goal.\n\n**How to run it:**\n\n1. Attacker dribbles toward goal using Touch, Look, Push, Go.\n2. Keeper charges out toward the attacker, narrowing the angle.\n3. Attacker shoots or tries to go around the keeper.\n4. Keeper makes a save by blocking or diving.\n5. Do 4 breakaway attempts.\n\n**What to watch:** Does the keeper come out and narrow the angle? Or stay in the goal?\n\n**If they're struggling:** Start the attacker closer (15 feet). Keeper has more time to react.\n\n**If they've got it:** Attacker gets more time and space. Keeper has to read the situation faster.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 4 soccer ball →](/go/soccer-ball-size4/) — right size for ages 8–12.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
