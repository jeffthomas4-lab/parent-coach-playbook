globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The full spike is the goal of every offense. Approach, jump, snap the wrist over the ball, drive it down. Hard to learn at first. Easier once the approach footwork is solid.</p>\n<p><strong>What you need:</strong> A volleyball, a net, two players (setter or coach + hitter).</p>\n<p><strong>Setup:</strong> Hitter at left front. Setter at center. Empty court target.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Approach, Plant, Reach, Snap.</li>\n<li>Setter sets the ball 1-2 feet off the net, 10 feet high.</li>\n<li>Hitter does the three-step approach.</li>\n<li>Plant. Reach up with the hitting arm.</li>\n<li>Snap the wrist over the ball at the highest point of the jump. Ball drives down.</li>\n</ol>\n<p><strong>What to watch:</strong> Wrist snap. A flat hand pushes the ball. A snapped wrist drives the ball. The wrist has to crack at contact.</p>\n<p><strong>If they’re struggling:</strong> Lower the net. Or hit off a tossed ball.</p>\n<p><strong>If they’ve got it:</strong> Add a defender on the other side. Hitter has to aim around the block. Or hit from the right side instead of left.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/volleyball-volley-lite/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Volley Lite training ball →</a> — lightweight ball for beginners learning to pass.</p>\n<p><a href=\"/go/volleyball-net/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Portable volleyball net →</a> — 32-ft set with adjustable steel poles.</p>\n<p><a href=\"/what-to-buy/volleyball/\">Full volleyball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Approach and Spike Off a Set","summary":"Full approach and full spike off a set ball. 12 minutes. Ages 11-12.","sport":"volleyball","ages":["11-12"],"fundamental":"spiking","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player at the peak of a jump, arm pulled back, hand high above the net, about to snap down on a set ball.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Full spike rep. Approach, plant, reach, snap cue is consistent."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/volleyball-approach-and-spike-off-set.md";
				const url = undefined;
				function rawContent() {
					return "\nThe full spike is the goal of every offense. Approach, jump, snap the wrist over the ball, drive it down. Hard to learn at first. Easier once the approach footwork is solid.\n\n**What you need:** A volleyball, a net, two players (setter or coach + hitter).\n\n**Setup:** Hitter at left front. Setter at center. Empty court target.\n\n**How to run it:**\n\n1. Cue: Approach, Plant, Reach, Snap.\n2. Setter sets the ball 1-2 feet off the net, 10 feet high.\n3. Hitter does the three-step approach.\n4. Plant. Reach up with the hitting arm.\n5. Snap the wrist over the ball at the highest point of the jump. Ball drives down.\n\n**What to watch:** Wrist snap. A flat hand pushes the ball. A snapped wrist drives the ball. The wrist has to crack at contact.\n\n**If they're struggling:** Lower the net. Or hit off a tossed ball.\n\n**If they've got it:** Add a defender on the other side. Hitter has to aim around the block. Or hit from the right side instead of left.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Volley Lite training ball →](/go/volleyball-volley-lite/) — lightweight ball for beginners learning to pass.\n\n[Portable volleyball net →](/go/volleyball-net/) — 32-ft set with adjustable steel poles.\n\n[Full volleyball gear guide →](/what-to-buy/volleyball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
