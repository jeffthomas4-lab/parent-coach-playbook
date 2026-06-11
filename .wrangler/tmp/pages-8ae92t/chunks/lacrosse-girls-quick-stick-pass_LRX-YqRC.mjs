globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The quick stick is the lacrosse one-timer. Ball arrives, ball leaves. No cradle in between. This is a high-skill move that creates fast offense and beats defenders who haven’t recovered.</p>\n<p><strong>What you need:</strong> Two sticks, ball, two players.</p>\n<p><strong>Setup:</strong> Two players 12 feet apart, sticks held high at face level.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Player A passes to Player B.</li>\n<li>Player B catches and releases in one motion. Stick head doesn’t drop.</li>\n<li>Pass goes back to Player A.</li>\n<li>Player A does the same: catch and release.</li>\n<li>Continuous quick stick passes. Goal: 10 in a row without a drop.</li>\n</ol>\n<p><strong>What to watch:</strong> The stick height. A drop in the stick after the catch breaks the rhythm. Stick stays high.</p>\n<p><strong>If they’re struggling:</strong> Slow the passes. Or allow one cradle between catch and release.</p>\n<p><strong>If they’ve got it:</strong> Move further apart (20 feet). Or add a third player for a three-way quick stick rotation.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/lacrosse-ball/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Lacrosse balls (6-pack) →</a> — NOCSAE-stamped practice balls.</p>\n<p><a href=\"/go/lacrosse-starter-kit-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">STX Stallion complete stick →</a> — beginner stick for first-season players.</p>\n<p><a href=\"/what-to-buy/lacrosse-girls/\">Full lacrosse (girls) gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Quick Stick Pass","summary":"Receive and release the ball in one motion without cradling. 10 minutes. Ages 8-10.","sport":"lacrosse-girls","ages":["8-10"],"fundamental":"passing","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player receiving a pass and immediately redirecting it back to the partner without lowering the stick or cradling.","editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean quick-stick mechanics; no contact issues."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/lacrosse-girls-quick-stick-pass.md";
				const url = undefined;
				function rawContent() {
					return "\nThe quick stick is the lacrosse one-timer. Ball arrives, ball leaves. No cradle in between. This is a high-skill move that creates fast offense and beats defenders who haven't recovered.\n\n**What you need:** Two sticks, ball, two players.\n\n**Setup:** Two players 12 feet apart, sticks held high at face level.\n\n**How to run it:**\n\n1. Player A passes to Player B.\n2. Player B catches and releases in one motion. Stick head doesn't drop.\n3. Pass goes back to Player A.\n4. Player A does the same: catch and release.\n5. Continuous quick stick passes. Goal: 10 in a row without a drop.\n\n**What to watch:** The stick height. A drop in the stick after the catch breaks the rhythm. Stick stays high.\n\n**If they're struggling:** Slow the passes. Or allow one cradle between catch and release.\n\n**If they've got it:** Move further apart (20 feet). Or add a third player for a three-way quick stick rotation.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Lacrosse balls (6-pack) →](/go/lacrosse-ball/) — NOCSAE-stamped practice balls.\n\n[STX Stallion complete stick →](/go/lacrosse-starter-kit-youth/) — beginner stick for first-season players.\n\n[Full lacrosse (girls) gear guide →](/what-to-buy/lacrosse-girls/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
