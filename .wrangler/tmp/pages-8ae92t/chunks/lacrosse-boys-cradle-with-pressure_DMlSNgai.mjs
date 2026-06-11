globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>In a game, the defender is hitting the stick to dislodge the ball. Good ball handlers cradle through the contact. Body between defender and stick. Cradle tight. This drill simulates that pressure.</p>\n<p><strong>What you need:</strong> Two lacrosse sticks, a ball, two players, full gear.</p>\n<p><strong>Setup:</strong> Ball carrier with the ball in the stick. Defender 5 feet away.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Coach calls “go.”</li>\n<li>Defender approaches and stick-checks (tap the ball carrier’s stick).</li>\n<li>Ball carrier shields the stick with the body and continues to cradle.</li>\n<li>Goal: hold the ball for 10 seconds.</li>\n<li>Reset. Switch roles. Do 6 rounds.</li>\n</ol>\n<p><strong>What to watch:</strong> Body position. The body should be between the defender and the stick. If the stick is exposed to the defender, every check works.</p>\n<p><strong>If they’re struggling:</strong> Slower defender. Lighter checks.</p>\n<p><strong>If they’ve got it:</strong> Two defenders. Or open ground (no boards or sideline to lean on).</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/lacrosse-ball/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Lacrosse balls (6-pack) →</a> — NOCSAE-stamped practice balls.</p>\n<p><a href=\"/go/lacrosse-starter-kit-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">STX Stallion complete stick →</a> — shaft and head combo for new players.</p>\n<p><a href=\"/what-to-buy/lacrosse-boys/\">Full lacrosse (boys) gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Cradle with Pressure","summary":"Cradle while a defender stick-checks. 12 minutes. Ages 11-12.","sport":"lacrosse-boys","ages":["11-12"],"fundamental":"cradling","progression":"refine","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Two players: ball carrier cradling and shielding the stick with their body, defender attempting to stick-check the ball loose.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":true,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Boys 11-12 stick-check pressure; legal contact context. Sensitive flag for contact."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/lacrosse-boys-cradle-with-pressure.md";
				const url = undefined;
				function rawContent() {
					return "\nIn a game, the defender is hitting the stick to dislodge the ball. Good ball handlers cradle through the contact. Body between defender and stick. Cradle tight. This drill simulates that pressure.\n\n**What you need:** Two lacrosse sticks, a ball, two players, full gear.\n\n**Setup:** Ball carrier with the ball in the stick. Defender 5 feet away.\n\n**How to run it:**\n\n1. Coach calls \"go.\"\n2. Defender approaches and stick-checks (tap the ball carrier's stick).\n3. Ball carrier shields the stick with the body and continues to cradle.\n4. Goal: hold the ball for 10 seconds.\n5. Reset. Switch roles. Do 6 rounds.\n\n**What to watch:** Body position. The body should be between the defender and the stick. If the stick is exposed to the defender, every check works.\n\n**If they're struggling:** Slower defender. Lighter checks.\n\n**If they've got it:** Two defenders. Or open ground (no boards or sideline to lean on).\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Lacrosse balls (6-pack) →](/go/lacrosse-ball/) — NOCSAE-stamped practice balls.\n\n[STX Stallion complete stick →](/go/lacrosse-starter-kit-youth/) — shaft and head combo for new players.\n\n[Full lacrosse (boys) gear guide →](/what-to-buy/lacrosse-boys/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
