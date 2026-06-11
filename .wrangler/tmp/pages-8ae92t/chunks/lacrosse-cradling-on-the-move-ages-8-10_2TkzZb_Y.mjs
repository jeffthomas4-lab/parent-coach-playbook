globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Cradling is a rhythm. Young players need to feel the ball staying in the pocket while they move at different speeds. This drill builds that feel.</p>\n<p><strong>Equipment needed:</strong> 8 cones, 1 ball per player, 1 stick per player.</p>\n<p><strong>Setup:</strong> Create a straight line of cones 15 yards long, spaced 1 yard apart. Players line up at one end with a ball in their stick.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Player walks down the line of cones, cradling the ball in the stick pocket. The cradle is the motion of rotating the stick with the wrists and arms to keep the ball in the pocket.</li>\n<li>Walk down slowly (3 reps), then jog down (3 reps), then run down (3 reps).</li>\n<li>The ball should never leave the stick during any speed. If it does, the cradle is loose.</li>\n<li>Rest and repeat with a new player.</li>\n</ol>\n<p><strong>What to look for:</strong></p>\n<p>The cradle is an active motion with the wrists and arms, not a grip. If a player is holding the stick tight, they’ll lose the ball. The stick should move with the player’s body, not out in front. If the ball is rolling or bouncing, the cradle is too loose or off-rhythm. By the run-through, the cradle should feel automatic.</p>\n<p><strong>Variation:</strong> Add direction changes. After cradling through the cones, the player adds a left turn and right turn while maintaining the cradle. This teaches the ball stays in the pocket no matter what the body is doing.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/lacrosse-ball/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Lacrosse balls →</a> — official 6-pack, NOCSAE-stamped.</p>\n<p><a href=\"/go/lacrosse-starter-kit-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">STX Stallion complete stick →</a> — complete youth stick (shaft + head) for first-season players.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Cradling on the Move","summary":"Build ball control while running: the foundation of all lacrosse. 10 minutes.","sport":"lacrosse","age":"8-10","focus":"fundamentals","publishedAt":"2026-03-04T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":7,"originalityGrade":7,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Generic lacrosse tag; cradle works for both boys' and girls' rule sets. Affiliate disclosure present."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/lacrosse-cradling-on-the-move-ages-8-10.md";
				const url = undefined;
				function rawContent() {
					return "\nCradling is a rhythm. Young players need to feel the ball staying in the pocket while they move at different speeds. This drill builds that feel.\n\n**Equipment needed:** 8 cones, 1 ball per player, 1 stick per player.\n\n**Setup:** Create a straight line of cones 15 yards long, spaced 1 yard apart. Players line up at one end with a ball in their stick.\n\n**How to run it:**\n\n1. Player walks down the line of cones, cradling the ball in the stick pocket. The cradle is the motion of rotating the stick with the wrists and arms to keep the ball in the pocket.\n2. Walk down slowly (3 reps), then jog down (3 reps), then run down (3 reps).\n3. The ball should never leave the stick during any speed. If it does, the cradle is loose.\n4. Rest and repeat with a new player.\n\n**What to look for:**\n\nThe cradle is an active motion with the wrists and arms, not a grip. If a player is holding the stick tight, they'll lose the ball. The stick should move with the player's body, not out in front. If the ball is rolling or bouncing, the cradle is too loose or off-rhythm. By the run-through, the cradle should feel automatic.\n\n**Variation:** Add direction changes. After cradling through the cones, the player adds a left turn and right turn while maintaining the cradle. This teaches the ball stays in the pocket no matter what the body is doing.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Lacrosse balls →](/go/lacrosse-ball/) — official 6-pack, NOCSAE-stamped.\n\n[STX Stallion complete stick →](/go/lacrosse-starter-kit-youth/) — complete youth stick (shaft + head) for first-season players.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
