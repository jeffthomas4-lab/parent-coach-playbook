globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The long jump is about speed at the right place. This drill teaches young athletes to build speed on approach and hit the board consistently.</p>\n<p><strong>Equipment needed:</strong> 1 long jump pit (or sandpit), markers at 20, 30, and 40 meters from the board, tape measure.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Athlete starts 40 meters from the board.</li>\n<li>First rep: jog to the board at 50-60 percent effort, focusing on staying relaxed and controlled.</li>\n<li>Second rep: increase effort to 70-75 percent, adding more power but maintaining control.</li>\n<li>Third rep: go to 90 percent effort, feeling the momentum building but not out of control.</li>\n<li>Fourth rep: all-out effort. Athlete should be moving at near-maximum speed when they hit the board.</li>\n<li>Do 4 reps, rest.</li>\n</ol>\n<p><strong>What to look for:</strong></p>\n<p>The acceleration should be gradual, not sudden. If an athlete jumps too fast too early, they’ll slow down by the board. The step count should be consistent rep to rep. If the athlete is off the board on one jump and too close on the next, the approach is inconsistent. The final strides should feel powerful and rhythmic, not choppy.</p>\n<p><strong>Variation:</strong> Add a takeoff phase. After hitting the board, the athlete focuses on driving the legs and arms up for maximum height and distance. This teaches the jump as a continuation of the approach, not a separate movement.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/xc-trainers-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth running trainers →</a> — everyday training shoe for track and XC.</p>\n<p><a href=\"/what-to-buy/track-field/\">Full track field gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Long Jump Approach","summary":"Teach controlled acceleration and consistent step count to the board. 12 minutes.","sport":"track-field","ages":["13-14"],"focus":"fundamentals","layer":"foundations","fundamental":"jumping","progression":"refine","illustrationBrief":"Approach speed and board placement","publishedAt":"2026-04-15T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":true,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Long-jump approach; sensitive flag for jumping injury risk."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/track-long-jump-approach-ages-13-14.md";
				const url = undefined;
				function rawContent() {
					return "\nThe long jump is about speed at the right place. This drill teaches young athletes to build speed on approach and hit the board consistently.\n\n**Equipment needed:** 1 long jump pit (or sandpit), markers at 20, 30, and 40 meters from the board, tape measure.\n\n**How to run it:**\n\n1. Athlete starts 40 meters from the board.\n2. First rep: jog to the board at 50-60 percent effort, focusing on staying relaxed and controlled.\n3. Second rep: increase effort to 70-75 percent, adding more power but maintaining control.\n4. Third rep: go to 90 percent effort, feeling the momentum building but not out of control.\n5. Fourth rep: all-out effort. Athlete should be moving at near-maximum speed when they hit the board.\n6. Do 4 reps, rest.\n\n**What to look for:**\n\nThe acceleration should be gradual, not sudden. If an athlete jumps too fast too early, they'll slow down by the board. The step count should be consistent rep to rep. If the athlete is off the board on one jump and too close on the next, the approach is inconsistent. The final strides should feel powerful and rhythmic, not choppy.\n\n**Variation:** Add a takeoff phase. After hitting the board, the athlete focuses on driving the legs and arms up for maximum height and distance. This teaches the jump as a continuation of the approach, not a separate movement.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth running trainers →](/go/xc-trainers-youth/) — everyday training shoe for track and XC.\n\n[Full track field gear guide →](/what-to-buy/track-field/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
