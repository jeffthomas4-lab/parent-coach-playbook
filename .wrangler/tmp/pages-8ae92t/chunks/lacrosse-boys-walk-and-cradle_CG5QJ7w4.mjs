globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Standing still and cradling is one thing. Moving while cradling is another. The body moves, the ball has to stay in the stick. Walking before running.</p>\n<p><strong>What you need:</strong> Lacrosse stick, ball, 20x20 yard area.</p>\n<p><strong>Setup:</strong> Kid in the box with the stick and ball.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Grip, Roll, Cup, Run. Today the focus is Run (walking version).</li>\n<li>Walk around the box at a comfortable pace.</li>\n<li>Cradle the ball continuously while walking.</li>\n<li>Coach calls “stop.” Kid stops without dropping the ball.</li>\n<li>Continue for 90 seconds. Rest. 4 rounds.</li>\n</ol>\n<p><strong>What to watch:</strong> Are they running or walking? At this age, walking is the right pace. Running causes drops.</p>\n<p><strong>If they’re struggling:</strong> Slower walk. Or mark a path on the ground (chalk line) they have to follow.</p>\n<p><strong>If they’ve got it:</strong> Jog instead of walk. Or add a partner to weave around.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/lacrosse-ball/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Lacrosse balls (6-pack) →</a> — NOCSAE-stamped practice balls.</p>\n<p><a href=\"/go/lacrosse-starter-kit-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">STX Stallion complete stick →</a> — shaft and head combo for new players.</p>\n<p><a href=\"/what-to-buy/lacrosse-boys/\">Full lacrosse (boys) gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Walk and Cradle","summary":"Walk around an area cradling the ball without dropping it. 10 minutes. Ages 5-7 and 8-10.","sport":"lacrosse-boys","ages":["5-7","8-10"],"fundamental":"cradling","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A child walking forward through a 20x20 yard area cradling a lacrosse ball in the stick, head turning side to side.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Walk-before-run cradle progression for the youngest players."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/lacrosse-boys-walk-and-cradle.md";
				const url = undefined;
				function rawContent() {
					return "\nStanding still and cradling is one thing. Moving while cradling is another. The body moves, the ball has to stay in the stick. Walking before running.\n\n**What you need:** Lacrosse stick, ball, 20x20 yard area.\n\n**Setup:** Kid in the box with the stick and ball.\n\n**How to run it:**\n\n1. Cue: Grip, Roll, Cup, Run. Today the focus is Run (walking version).\n2. Walk around the box at a comfortable pace.\n3. Cradle the ball continuously while walking.\n4. Coach calls \"stop.\" Kid stops without dropping the ball.\n5. Continue for 90 seconds. Rest. 4 rounds.\n\n**What to watch:** Are they running or walking? At this age, walking is the right pace. Running causes drops.\n\n**If they're struggling:** Slower walk. Or mark a path on the ground (chalk line) they have to follow.\n\n**If they've got it:** Jog instead of walk. Or add a partner to weave around.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Lacrosse balls (6-pack) →](/go/lacrosse-ball/) — NOCSAE-stamped practice balls.\n\n[STX Stallion complete stick →](/go/lacrosse-starter-kit-youth/) — shaft and head combo for new players.\n\n[Full lacrosse (boys) gear guide →](/what-to-buy/lacrosse-boys/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
