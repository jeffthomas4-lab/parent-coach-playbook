globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>In a real game, the setter receives the bump and sets the hitter. This drill builds that sequence. Bump-set-target. The setter has to read the incoming bump, get to the spot, and deliver an accurate set.</p>\n<p><strong>What you need:</strong> A volleyball, three players (passer, setter, target hitter), a net or rope.</p>\n<p><strong>Setup:</strong> Passer at the back court. Setter at the net center. Target hitter at the outside (left side of the net).</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Window, Soft, Push, Target.</li>\n<li>Coach tosses to the passer.</li>\n<li>Passer bumps to the setter at the net.</li>\n<li>Setter forms the window, gets behind the ball, sets to the outside hitter target.</li>\n<li>Set should be 8-10 feet high, 1-2 feet off the net, arriving at the hitter’s hitting position.</li>\n</ol>\n<p><strong>What to watch:</strong> Setter footwork. Are they getting BEHIND the ball before setting? Setting from beside the ball means a sideways set. Setting from behind means a clean set toward the target.</p>\n<p><strong>If they’re struggling:</strong> Slower passes. Coach tosses directly to the setter (skip the passer step).</p>\n<p><strong>If they’ve got it:</strong> Add a real hitter who attacks the set. Or alternate between left and right side targets.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/volleyball-volley-lite/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Volley Lite training ball →</a> — lightweight ball for beginners learning to pass.</p>\n<p><a href=\"/go/volleyball-net/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Portable volleyball net →</a> — 32-ft set with adjustable steel poles.</p>\n<p><a href=\"/what-to-buy/volleyball/\">Full volleyball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Set from a Bump","summary":"Receive a bump pass and set to a hitter target. 12 minutes. Ages 11-12.","sport":"volleyball","ages":["11-12"],"fundamental":"setting","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Three players in a triangle: a passer bumping the ball to a setter at the net, who sets it to a hitter on the outside.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Bump-set sequence. Setter behind-the-ball footwork is the keeper detail."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/volleyball-set-from-bump.md";
				const url = undefined;
				function rawContent() {
					return "\nIn a real game, the setter receives the bump and sets the hitter. This drill builds that sequence. Bump-set-target. The setter has to read the incoming bump, get to the spot, and deliver an accurate set.\n\n**What you need:** A volleyball, three players (passer, setter, target hitter), a net or rope.\n\n**Setup:** Passer at the back court. Setter at the net center. Target hitter at the outside (left side of the net).\n\n**How to run it:**\n\n1. Cue: Window, Soft, Push, Target.\n2. Coach tosses to the passer.\n3. Passer bumps to the setter at the net.\n4. Setter forms the window, gets behind the ball, sets to the outside hitter target.\n5. Set should be 8-10 feet high, 1-2 feet off the net, arriving at the hitter's hitting position.\n\n**What to watch:** Setter footwork. Are they getting BEHIND the ball before setting? Setting from beside the ball means a sideways set. Setting from behind means a clean set toward the target.\n\n**If they're struggling:** Slower passes. Coach tosses directly to the setter (skip the passer step).\n\n**If they've got it:** Add a real hitter who attacks the set. Or alternate between left and right side targets.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Volley Lite training ball →](/go/volleyball-volley-lite/) — lightweight ball for beginners learning to pass.\n\n[Portable volleyball net →](/go/volleyball-net/) — 32-ft set with adjustable steel poles.\n\n[Full volleyball gear guide →](/what-to-buy/volleyball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
