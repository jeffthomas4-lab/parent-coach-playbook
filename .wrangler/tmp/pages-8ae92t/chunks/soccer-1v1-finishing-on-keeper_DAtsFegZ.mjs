globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Breakaway goals are the most realistic shooting situations in games. The attacker has space and time but one defender (the keeper). This is the highest pressure scenario and the most rewarding.</p>\n<p><strong>What you need:</strong> 1 soccer ball, 1 attacker, 1 goalkeeper (or you), a goal, 20 feet of space.</p>\n<p><strong>Setup:</strong> Attacker starts 20 feet from goal with the ball. Keeper is in the goal.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>You call “Go.” Attacker dribbles forward using Touch, Look, Push, Go.</li>\n<li>Keeper comes out to narrow the angle.</li>\n<li>Attacker shoots or passes around the keeper, using Plant, Lock, Strike, Finish.</li>\n<li>If it goes in, goal. If keeper saves or blocks, that’s a save.</li>\n<li>Do 4 attempts per attacker.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the attacker shoot or try to dribble past? Smart attackers read the keeper’s positioning and make the right choice.</p>\n<p><strong>If they’re struggling:</strong> Keep keeper in the goal and passive. Let the attacker shoot freely.</p>\n<p><strong>If they’ve got it:</strong> Keeper actively comes out. Attacker has to be composed and clinical.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size4/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 4 soccer ball →</a> — right size for ages 8–12.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"1v1 Finishing on Keeper","summary":"Attacker faces goalkeeper in a 1v1 to score. 12 minutes. Ages 11-12.","sport":"soccer","ages":["11-12"],"fundamental":"shooting","progression":"refine","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Attacker with the ball facing a goalkeeper 6 feet from goal, about to shoot.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-1v1-finishing-on-keeper.md";
				const url = undefined;
				function rawContent() {
					return "\nBreakaway goals are the most realistic shooting situations in games. The attacker has space and time but one defender (the keeper). This is the highest pressure scenario and the most rewarding.\n\n**What you need:** 1 soccer ball, 1 attacker, 1 goalkeeper (or you), a goal, 20 feet of space.\n\n**Setup:** Attacker starts 20 feet from goal with the ball. Keeper is in the goal.\n\n**How to run it:**\n\n1. You call \"Go.\" Attacker dribbles forward using Touch, Look, Push, Go.\n2. Keeper comes out to narrow the angle.\n3. Attacker shoots or passes around the keeper, using Plant, Lock, Strike, Finish.\n4. If it goes in, goal. If keeper saves or blocks, that's a save.\n5. Do 4 attempts per attacker.\n\n**What to watch:** Does the attacker shoot or try to dribble past? Smart attackers read the keeper's positioning and make the right choice.\n\n**If they're struggling:** Keep keeper in the goal and passive. Let the attacker shoot freely.\n\n**If they've got it:** Keeper actively comes out. Attacker has to be composed and clinical.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 4 soccer ball →](/go/soccer-ball-size4/) — right size for ages 8–12.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
