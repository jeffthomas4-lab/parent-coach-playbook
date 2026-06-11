globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A shot in the middle of the goal hits the goalie. A shot in the corner is a goal. This drill teaches kids to aim, not just shoot. Cones in the corners are the targets. Hit the cone, score the goal.</p>\n<p><strong>What you need:</strong> Lacrosse stick, 5 balls, lacrosse goal, 4 cones.</p>\n<p><strong>Setup:</strong> 4 cones placed in the corners of the goal (top right, top left, bottom right, bottom left). Player 10 yards out.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Pull, Step, Snap, Follow.</li>\n<li>Pull: stick back behind the head.</li>\n<li>Step: front foot toward the goal.</li>\n<li>Snap: hard wrist snap, ball flies off the head.</li>\n<li>Follow: stick finishes pointing at the target. Do 8 shots, alternating which corner.</li>\n</ol>\n<p><strong>What to watch:</strong> The follow-through direction. The stick finishes wherever the ball is going. If the stick finishes at the goalie’s chest, the shot was wasted.</p>\n<p><strong>If they’re struggling:</strong> Move closer to 5 yards. Bigger cone targets.</p>\n<p><strong>If they’ve got it:</strong> Add a goalie. Or add target zones with point values.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/lacrosse-ball/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Lacrosse balls (6-pack) →</a> — NOCSAE-stamped practice balls.</p>\n<p><a href=\"/go/lacrosse-starter-kit-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">STX Stallion complete stick →</a> — shaft and head combo for new players.</p>\n<p><a href=\"/what-to-buy/lacrosse-boys/\">Full lacrosse (boys) gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Shot on Cones Stationary","summary":"Shoot at cones standing in for goalie zones. 10 minutes. Ages 8-10.","sport":"lacrosse-boys","ages":["8-10"],"fundamental":"shooting","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player shooting at four cones placed in the corners of an empty lacrosse goal, ball flying toward the upper-right cone.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Pull-Step-Snap-Follow shooting cue is clear and correct."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/lacrosse-boys-shot-on-cones-stationary.md";
				const url = undefined;
				function rawContent() {
					return "\nA shot in the middle of the goal hits the goalie. A shot in the corner is a goal. This drill teaches kids to aim, not just shoot. Cones in the corners are the targets. Hit the cone, score the goal.\n\n**What you need:** Lacrosse stick, 5 balls, lacrosse goal, 4 cones.\n\n**Setup:** 4 cones placed in the corners of the goal (top right, top left, bottom right, bottom left). Player 10 yards out.\n\n**How to run it:**\n\n1. Cue: Pull, Step, Snap, Follow.\n2. Pull: stick back behind the head.\n3. Step: front foot toward the goal.\n4. Snap: hard wrist snap, ball flies off the head.\n5. Follow: stick finishes pointing at the target. Do 8 shots, alternating which corner.\n\n**What to watch:** The follow-through direction. The stick finishes wherever the ball is going. If the stick finishes at the goalie's chest, the shot was wasted.\n\n**If they're struggling:** Move closer to 5 yards. Bigger cone targets.\n\n**If they've got it:** Add a goalie. Or add target zones with point values.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Lacrosse balls (6-pack) →](/go/lacrosse-ball/) — NOCSAE-stamped practice balls.\n\n[STX Stallion complete stick →](/go/lacrosse-starter-kit-youth/) — shaft and head combo for new players.\n\n[Full lacrosse (boys) gear guide →](/what-to-buy/lacrosse-boys/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
