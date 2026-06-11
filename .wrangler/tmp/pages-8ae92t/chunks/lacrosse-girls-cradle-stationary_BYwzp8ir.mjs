globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Cradling is the rhythm that keeps the ball in the stick. Wrist rolls one way, then back. Ball stays cupped in the head. This is the first lacrosse skill. Without it, the ball falls out before the kid takes a step.</p>\n<p><strong>What you need:</strong> A youth lacrosse stick, a soft lacrosse ball, open space.</p>\n<p><strong>Setup:</strong> Kid stands still with the stick held vertically beside the body, ball already in the head.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Grip, Roll, Cup, Run.</li>\n<li>Grip: dominant hand on the throat of the stick (top), other hand on the bottom. Stick held upright.</li>\n<li>Roll: dominant wrist rolls back and forth in a small motion.</li>\n<li>Cup: the head of the stick stays cupped toward the body so the ball doesn’t fall out.</li>\n<li>Hold the cradle for 30 seconds. Reset. 4 rounds.</li>\n</ol>\n<p><strong>What to watch:</strong> Is the ball staying in the stick? If it falls out, the cradle is too aggressive or the cup angle is wrong.</p>\n<p><strong>If they’re struggling:</strong> Smaller cradle motion. Or use a heavier ball (the ball stays in better).</p>\n<p><strong>If they’ve got it:</strong> Add a head turn (look left, look right) while cradling. Eyes have to leave the stick.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/lacrosse-ball/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Lacrosse balls (6-pack) →</a> — NOCSAE-stamped practice balls.</p>\n<p><a href=\"/go/lacrosse-starter-kit-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">STX Stallion complete stick →</a> — beginner stick for first-season players.</p>\n<p><a href=\"/what-to-buy/lacrosse-girls/\">Full lacrosse (girls) gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Stationary Cradle","summary":"Hold the lacrosse stick and cradle the ball without moving. 8 minutes. Ages 5-7.","sport":"lacrosse-girls","ages":["5-7"],"fundamental":"cradling","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A young player holding a lacrosse stick vertically, rolling the wrist back and forth to keep the ball cupped in the head of the stick.","editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Foundations cradle drill, ages 5-7. Title misalignment (file says 'cradle-stationary,' title says 'Stationary Cradle') is fine."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/lacrosse-girls-cradle-stationary.md";
				const url = undefined;
				function rawContent() {
					return "\nCradling is the rhythm that keeps the ball in the stick. Wrist rolls one way, then back. Ball stays cupped in the head. This is the first lacrosse skill. Without it, the ball falls out before the kid takes a step.\n\n**What you need:** A youth lacrosse stick, a soft lacrosse ball, open space.\n\n**Setup:** Kid stands still with the stick held vertically beside the body, ball already in the head.\n\n**How to run it:**\n\n1. Cue: Grip, Roll, Cup, Run.\n2. Grip: dominant hand on the throat of the stick (top), other hand on the bottom. Stick held upright.\n3. Roll: dominant wrist rolls back and forth in a small motion.\n4. Cup: the head of the stick stays cupped toward the body so the ball doesn't fall out.\n5. Hold the cradle for 30 seconds. Reset. 4 rounds.\n\n**What to watch:** Is the ball staying in the stick? If it falls out, the cradle is too aggressive or the cup angle is wrong.\n\n**If they're struggling:** Smaller cradle motion. Or use a heavier ball (the ball stays in better).\n\n**If they've got it:** Add a head turn (look left, look right) while cradling. Eyes have to leave the stick.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Lacrosse balls (6-pack) →](/go/lacrosse-ball/) — NOCSAE-stamped practice balls.\n\n[STX Stallion complete stick →](/go/lacrosse-starter-kit-youth/) — beginner stick for first-season players.\n\n[Full lacrosse (girls) gear guide →](/what-to-buy/lacrosse-girls/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
