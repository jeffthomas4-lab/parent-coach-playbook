globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Lacrosse is a ground ball game. Most teams that win possession the most win the game. The scoop is the basic skill. Get low, head of the stick on the ground, scoop the ball into the cradle. Done right, easy. Done wrong, a constant turnover.</p>\n<p><strong>What you need:</strong> Stick, ball, open grass.</p>\n<p><strong>Setup:</strong> Ball on the ground. Player 5 feet away.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Player walks to the ball.</li>\n<li>Drops to a deep knee bend, low body position.</li>\n<li>Bottom hand drops to the ground level. Top hand pushes the stick head under the ball.</li>\n<li>Scoop the ball into the head. Stand up, cradle.</li>\n<li>Do 10 scoops. Mix sides (forehand and backhand scoops).</li>\n</ol>\n<p><strong>What to watch:</strong> The body position. Standing tall and reaching down is wrong. The body has to be low. Knee bend is the move.</p>\n<p><strong>If they’re struggling:</strong> Use a larger ball (whiffleball or street hockey ball). Or scoop a stationary ball with the stick already on the ground.</p>\n<p><strong>If they’ve got it:</strong> Add a moving ball (rolled by coach). Or do scoops on the run.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/lacrosse-ball/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Lacrosse balls (6-pack) →</a> — NOCSAE-stamped practice balls.</p>\n<p><a href=\"/go/lacrosse-starter-kit-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">STX Stallion complete stick →</a> — shaft and head combo for new players.</p>\n<p><a href=\"/what-to-buy/lacrosse-boys/\">Full lacrosse (boys) gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Stationary Scoop","summary":"Pick up a ground ball with proper form. 10 minutes. Ages 5-7 and 8-10.","sport":"lacrosse-boys","ages":["5-7","8-10"],"fundamental":"ground-balls","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player low to the ground with knees bent, the head of the stick scooping a ball, bottom hand near the ground for leverage.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Foundational scoop fundamentals; clean."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/lacrosse-boys-stationary-scoop.md";
				const url = undefined;
				function rawContent() {
					return "\nLacrosse is a ground ball game. Most teams that win possession the most win the game. The scoop is the basic skill. Get low, head of the stick on the ground, scoop the ball into the cradle. Done right, easy. Done wrong, a constant turnover.\n\n**What you need:** Stick, ball, open grass.\n\n**Setup:** Ball on the ground. Player 5 feet away.\n\n**How to run it:**\n\n1. Player walks to the ball.\n2. Drops to a deep knee bend, low body position.\n3. Bottom hand drops to the ground level. Top hand pushes the stick head under the ball.\n4. Scoop the ball into the head. Stand up, cradle.\n5. Do 10 scoops. Mix sides (forehand and backhand scoops).\n\n**What to watch:** The body position. Standing tall and reaching down is wrong. The body has to be low. Knee bend is the move.\n\n**If they're struggling:** Use a larger ball (whiffleball or street hockey ball). Or scoop a stationary ball with the stick already on the ground.\n\n**If they've got it:** Add a moving ball (rolled by coach). Or do scoops on the run.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Lacrosse balls (6-pack) →](/go/lacrosse-ball/) — NOCSAE-stamped practice balls.\n\n[STX Stallion complete stick →](/go/lacrosse-starter-kit-youth/) — shaft and head combo for new players.\n\n[Full lacrosse (boys) gear guide →](/what-to-buy/lacrosse-boys/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
