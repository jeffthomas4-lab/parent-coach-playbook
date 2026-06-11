globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Rebounding is a fundamental. Not every shot is clean. Sometimes the keeper makes a save or the post gives it back. The second shot often goes in because the keeper is out of position.</p>\n<p><strong>What you need:</strong> 1 soccer ball, 2-3 kids (one as attacker, one as shooter/feeder, one as keeper if available), a goal.</p>\n<p><strong>Setup:</strong> Attacker stands 12 feet from goal. You or another kid is the shooter at 18 feet.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>You take a shot from 18 feet toward goal. Using Plant, Lock, Strike, Finish.</li>\n<li>Keeper makes a save or the ball rebounds off the post.</li>\n<li>Attacker is ready. They rush in and shoot the rebound using Plant, Lock, Strike, Finish.</li>\n<li>Do 5 rebound situations.</li>\n</ol>\n<p><strong>What to watch:</strong> Is the attacker already moving to the rebound spot? Good positioning means they’re ready to finish.</p>\n<p><strong>If they’re struggling:</strong> Move the attacker closer to the goal (8 feet). Give them more time to react.</p>\n<p><strong>If they’ve got it:</strong> Add a defender who pressures the attacker before they shoot the rebound.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size4/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 4 soccer ball →</a> — right size for ages 8–12.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Rebound Shooting","summary":"Follow up a missed shot with a second shot. 10 minutes. Ages 11-12.","sport":"soccer","ages":["11-12"],"fundamental":"shooting","progression":"refine","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Attacker shooting toward goal, ball rebounds off the goalkeeper or post, attacker immediately gets the second shot.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Realistic situational shooting drill. Soccer vocab correct."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-rebound-shooting.md";
				const url = undefined;
				function rawContent() {
					return "\nRebounding is a fundamental. Not every shot is clean. Sometimes the keeper makes a save or the post gives it back. The second shot often goes in because the keeper is out of position.\n\n**What you need:** 1 soccer ball, 2-3 kids (one as attacker, one as shooter/feeder, one as keeper if available), a goal.\n\n**Setup:** Attacker stands 12 feet from goal. You or another kid is the shooter at 18 feet.\n\n**How to run it:**\n\n1. You take a shot from 18 feet toward goal. Using Plant, Lock, Strike, Finish.\n2. Keeper makes a save or the ball rebounds off the post.\n3. Attacker is ready. They rush in and shoot the rebound using Plant, Lock, Strike, Finish.\n4. Do 5 rebound situations.\n\n**What to watch:** Is the attacker already moving to the rebound spot? Good positioning means they're ready to finish.\n\n**If they're struggling:** Move the attacker closer to the goal (8 feet). Give them more time to react.\n\n**If they've got it:** Add a defender who pressures the attacker before they shoot the rebound.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 4 soccer ball →](/go/soccer-ball-size4/) — right size for ages 8–12.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
