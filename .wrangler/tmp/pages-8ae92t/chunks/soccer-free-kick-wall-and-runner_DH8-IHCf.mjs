globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Free kicks teach technique and strategy. A wall blocks the direct shot. The runner curves the ball around the wall or a teammate passes it to an open space. Both require planning.</p>\n<p><strong>What you need:</strong> 1 ball, 4 kids (kicker, runner, wall players, goalkeeper), a goal marked.</p>\n<p><strong>Setup:</strong> Free kick is 18 feet from goal. Wall of 2-3 defenders forms 8 feet in front of goal. Kicker prepares to shoot.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Kicker strikes the ball using Plant, Lock, Strike, Finish, curving it around the wall.</li>\n<li>Or a teammate runs alongside and the kicker passes to them in space.</li>\n<li>Runner or receiver shoots on goal using Plant, Lock, Strike, Finish.</li>\n<li>Goalkeeper defends.</li>\n<li>Do 4 free kick attempts.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the kicker curve it or hit it straight? Curved free kicks are more effective.</p>\n<p><strong>If they’re struggling:</strong> Move the free kick to 15 feet. Closer is easier.</p>\n<p><strong>If they’ve got it:</strong> Move back to 20 feet. Add defenders who pressure the kicker.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size4/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 4 soccer ball →</a> — right size for ages 8–12.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Free Kick Wall and Runner","summary":"Attacking team takes a free kick with a wall defending. 12 minutes. Ages 11-12.","sport":"soccer","ages":["11-12"],"fundamental":"set-pieces","progression":"refine","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Kicker standing 18 feet from goal with a wall of defenders between them and the goal, runner curving the ball around the wall.","editorial":{"qualityGrade":7,"originalityGrade":7,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"18-foot free kick distance is short relative to typical youth scenarios; consider verifying against age-group standards. Drill is otherwise solid."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-free-kick-wall-and-runner.md";
				const url = undefined;
				function rawContent() {
					return "\nFree kicks teach technique and strategy. A wall blocks the direct shot. The runner curves the ball around the wall or a teammate passes it to an open space. Both require planning.\n\n**What you need:** 1 ball, 4 kids (kicker, runner, wall players, goalkeeper), a goal marked.\n\n**Setup:** Free kick is 18 feet from goal. Wall of 2-3 defenders forms 8 feet in front of goal. Kicker prepares to shoot.\n\n**How to run it:**\n\n1. Kicker strikes the ball using Plant, Lock, Strike, Finish, curving it around the wall.\n2. Or a teammate runs alongside and the kicker passes to them in space.\n3. Runner or receiver shoots on goal using Plant, Lock, Strike, Finish.\n4. Goalkeeper defends.\n5. Do 4 free kick attempts.\n\n**What to watch:** Does the kicker curve it or hit it straight? Curved free kicks are more effective.\n\n**If they're struggling:** Move the free kick to 15 feet. Closer is easier.\n\n**If they've got it:** Move back to 20 feet. Add defenders who pressure the kicker.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 4 soccer ball →](/go/soccer-ball-size4/) — right size for ages 8–12.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
