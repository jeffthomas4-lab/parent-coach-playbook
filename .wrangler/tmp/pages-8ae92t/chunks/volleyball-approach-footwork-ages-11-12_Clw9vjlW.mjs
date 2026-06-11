globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The approach footwork builds momentum for hitting. Young players at this age can learn to coordinate the steps and timing to the jump.</p>\n<p><strong>Equipment needed:</strong> 4 cones, 1 net, 4 balls.</p>\n<p><strong>Setup:</strong> Place cones about 10 feet from the net in a line across the court. Hitters line up at the cones.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Hitter starts with a small shuffle (two feet quick steps to get momentum).</li>\n<li>Then takes a full step (left foot) followed by a bound onto the right foot, then both feet land together at takeoff.</li>\n<li>That’s the two-step approach. Hitter jumps toward the net, reaches, comes down.</li>\n<li>Do 4 reps per hitter at controlled speed.</li>\n<li>Second set: add a three-step approach (extra step before the two-step).</li>\n</ol>\n<p><strong>What to look for:</strong></p>\n<p>The approach should feel coordinated, not choppy. The final two steps should be quick and powerful. The jump should be straight up at the net, not leaning forward or back. If a hitter is landing awkwardly, the approach footwork is off. Arms should swing forward as the jump happens, generating power.</p>\n<p><strong>Variation:</strong> Add a setter. The setter tosses the ball to a spot, and the hitter approaches and attacks it. This teaches timing between approach and the ball location.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/volleyball-net/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Portable volleyball net →</a> — adjustable height for 11-12 size court. Sets up in a driveway or backyard.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Approach Footwork","summary":"Teach the two-step and three-step approach to the net. 10 minutes.","sport":"volleyball","ages":["11-12"],"focus":"fundamentals","layer":"skills","fundamental":"spiking","progression":"build","illustrationBrief":"Footwork rhythm before spiking contact","publishedAt":"2026-03-31T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Two-step + three-step progression. Affiliate disclosure present."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/volleyball-approach-footwork-ages-11-12.md";
				const url = undefined;
				function rawContent() {
					return "\nThe approach footwork builds momentum for hitting. Young players at this age can learn to coordinate the steps and timing to the jump.\n\n**Equipment needed:** 4 cones, 1 net, 4 balls.\n\n**Setup:** Place cones about 10 feet from the net in a line across the court. Hitters line up at the cones.\n\n**How to run it:**\n\n1. Hitter starts with a small shuffle (two feet quick steps to get momentum).\n2. Then takes a full step (left foot) followed by a bound onto the right foot, then both feet land together at takeoff.\n3. That's the two-step approach. Hitter jumps toward the net, reaches, comes down.\n4. Do 4 reps per hitter at controlled speed.\n5. Second set: add a three-step approach (extra step before the two-step).\n\n**What to look for:**\n\nThe approach should feel coordinated, not choppy. The final two steps should be quick and powerful. The jump should be straight up at the net, not leaning forward or back. If a hitter is landing awkwardly, the approach footwork is off. Arms should swing forward as the jump happens, generating power.\n\n**Variation:** Add a setter. The setter tosses the ball to a spot, and the hitter approaches and attacks it. This teaches timing between approach and the ball location.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Portable volleyball net →](/go/volleyball-net/) — adjustable height for 11-12 size court. Sets up in a driveway or backyard.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
