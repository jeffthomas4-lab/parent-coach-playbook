globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The lacrosse pass is a controlled flick. Top hand pushes, bottom hand pulls. Ball flies off the head with backspin. This drill is the first pass and catch with a partner.</p>\n<p><strong>What you need:</strong> Two lacrosse sticks, one ball, two players.</p>\n<p><strong>Setup:</strong> Two players face each other 15 feet apart, sticks ready.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Player A puts the ball in the stick.</li>\n<li>Player A passes by pushing the top hand forward and pulling the bottom hand back. Ball releases over the front shoulder.</li>\n<li>Player B catches with the stick head up at face level. Soft hands give as the ball arrives.</li>\n<li>Player B passes back. Same motion.</li>\n<li>Do 20 passes. Switch hands every 10.</li>\n</ol>\n<p><strong>What to watch:</strong> The release point. Ball should release at face height or higher. A low release (waist) means the pass is at the receiver’s feet.</p>\n<p><strong>If they’re struggling:</strong> Move closer to 8 feet. Slower passes.</p>\n<p><strong>If they’ve got it:</strong> Move back to 25 feet. Add accuracy targets (left shoulder, right shoulder of the partner).</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/lacrosse-ball/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Lacrosse balls (6-pack) →</a> — NOCSAE-stamped practice balls.</p>\n<p><a href=\"/go/lacrosse-starter-kit-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">STX Stallion complete stick →</a> — beginner stick for first-season players.</p>\n<p><a href=\"/what-to-buy/lacrosse-girls/\">Full lacrosse (girls) gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Stationary Pass with Partner","summary":"Pass the lacrosse ball to a partner standing 15 feet away. 10 minutes. Ages 8-10.","sport":"lacrosse-girls","ages":["8-10"],"fundamental":"passing","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Two young players facing each other 15 feet apart, one releasing a pass with the lacrosse stick, the other catching with the head of the stick high.","editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean intro pass mechanics."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/lacrosse-girls-stationary-pass-partner.md";
				const url = undefined;
				function rawContent() {
					return "\nThe lacrosse pass is a controlled flick. Top hand pushes, bottom hand pulls. Ball flies off the head with backspin. This drill is the first pass and catch with a partner.\n\n**What you need:** Two lacrosse sticks, one ball, two players.\n\n**Setup:** Two players face each other 15 feet apart, sticks ready.\n\n**How to run it:**\n\n1. Player A puts the ball in the stick.\n2. Player A passes by pushing the top hand forward and pulling the bottom hand back. Ball releases over the front shoulder.\n3. Player B catches with the stick head up at face level. Soft hands give as the ball arrives.\n4. Player B passes back. Same motion.\n5. Do 20 passes. Switch hands every 10.\n\n**What to watch:** The release point. Ball should release at face height or higher. A low release (waist) means the pass is at the receiver's feet.\n\n**If they're struggling:** Move closer to 8 feet. Slower passes.\n\n**If they've got it:** Move back to 25 feet. Add accuracy targets (left shoulder, right shoulder of the partner).\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Lacrosse balls (6-pack) →](/go/lacrosse-ball/) — NOCSAE-stamped practice balls.\n\n[STX Stallion complete stick →](/go/lacrosse-starter-kit-youth/) — beginner stick for first-season players.\n\n[Full lacrosse (girls) gear guide →](/what-to-buy/lacrosse-girls/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
