globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A tip is a controlled spike. Player approaches, jumps, but instead of attacking with full force, they push the ball over the net with the fingertips. Useful in real games when the defense is set deep, and a great drill for younger kids who aren’t ready for full attack.</p>\n<p><strong>What you need:</strong> A volleyball, a net (lowered for younger kids), a setter or coach to set the ball.</p>\n<p><strong>Setup:</strong> Hitter at left front. Coach setting from center. Empty court on the other side.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Approach, Plant, Reach, Snap. Snap becomes “tip.”</li>\n<li>Coach sets the ball.</li>\n<li>Hitter does the three-step approach.</li>\n<li>Plants and reaches up high.</li>\n<li>Instead of snapping the wrist hard, the hitter pushes the ball with the fingertips over the net into the empty court.</li>\n</ol>\n<p><strong>What to watch:</strong> Reach height. A tip from below the net height becomes a free ball for the defense. The contact point should be above the net.</p>\n<p><strong>If they’re struggling:</strong> Lower the net. Or have them hit off a tossed ball instead of a set.</p>\n<p><strong>If they’ve got it:</strong> Add a target zone (back left corner, a cone they have to land the tip near).</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/volleyball-volley-lite/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Volley Lite training ball →</a> — lightweight ball for beginners learning to pass.</p>\n<p><a href=\"/go/volleyball-net/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Portable volleyball net →</a> — 32-ft set with adjustable steel poles.</p>\n<p><a href=\"/what-to-buy/volleyball/\">Full volleyball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Approach and Tip","summary":"Three-step approach to a controlled tip over the net. 10 minutes. Ages 8-10 and 11-12.","sport":"volleyball","ages":["8-10","11-12"],"fundamental":"spiking","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player completing the three-step approach and lightly tipping the ball over the net with the fingertips, ball arcing softly to the empty court.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Tip is correctly defined. Useful younger-age progression off the spike."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/volleyball-approach-and-tip.md";
				const url = undefined;
				function rawContent() {
					return "\nA tip is a controlled spike. Player approaches, jumps, but instead of attacking with full force, they push the ball over the net with the fingertips. Useful in real games when the defense is set deep, and a great drill for younger kids who aren't ready for full attack.\n\n**What you need:** A volleyball, a net (lowered for younger kids), a setter or coach to set the ball.\n\n**Setup:** Hitter at left front. Coach setting from center. Empty court on the other side.\n\n**How to run it:**\n\n1. Cue: Approach, Plant, Reach, Snap. Snap becomes \"tip.\"\n2. Coach sets the ball.\n3. Hitter does the three-step approach.\n4. Plants and reaches up high.\n5. Instead of snapping the wrist hard, the hitter pushes the ball with the fingertips over the net into the empty court.\n\n**What to watch:** Reach height. A tip from below the net height becomes a free ball for the defense. The contact point should be above the net.\n\n**If they're struggling:** Lower the net. Or have them hit off a tossed ball instead of a set.\n\n**If they've got it:** Add a target zone (back left corner, a cone they have to land the tip near).\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Volley Lite training ball →](/go/volleyball-volley-lite/) — lightweight ball for beginners learning to pass.\n\n[Portable volleyball net →](/go/volleyball-net/) — 32-ft set with adjustable steel poles.\n\n[Full volleyball gear guide →](/what-to-buy/volleyball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
