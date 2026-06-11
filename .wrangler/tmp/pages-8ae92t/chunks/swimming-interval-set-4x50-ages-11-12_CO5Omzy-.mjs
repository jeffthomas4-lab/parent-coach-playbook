globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Interval sets teach swimmers to hold consistent effort across multiple repeats. This 4x50 set is short enough to be doable but long enough to build fitness.</p>\n<p><strong>Equipment needed:</strong> 1 pool, kickboard or fins (optional), timer or clock.</p>\n<p><strong>Setup:</strong> Swimmers line up at one end of the pool.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Warm up: 2x50 freestyle easy pace, 30 seconds rest between each.</li>\n<li>Main set: 4x50 freestyle at moderate effort (7-8 out of 10 intensity), 20 seconds rest between each.</li>\n<li>Cool down: 1x50 freestyle easy.</li>\n</ol>\n<p><strong>What to look for:</strong></p>\n<p>Each 50-yard repeat should be similar in time. If the third and fourth are significantly slower, the effort on the first two was too hard. Swimmers should feel like they’re working hard but could do one or two more repeats at the same pace. The rest interval (20 seconds) should allow heart rate to drop slightly before the next repeat.</p>\n<p><strong>Variation:</strong> Change the distance or intensity. For younger swimmers (closer to 11), use 6x25 at moderate effort with 15 seconds rest. For more experienced swimmers, use 5x75 at moderate effort with 20 seconds rest.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/swim-goggles-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth swim goggles →</a> — Speedo Hydrospex, no-fog, fits ages 6–14.</p>\n<p><a href=\"/what-to-buy/swimming/\">Full swimming gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Interval Set: 4x50","summary":"Build pace control and fitness with a simple interval set. 12 minutes.","sport":"swimming","ages":["11-12"],"focus":"fundamentals","layer":"skills","fundamental":"freestyle","progression":"build","illustrationBrief":"Repeated 50-yard swims with rest intervals","publishedAt":"2026-05-01T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"4x50 interval; uses yards correctly."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/swimming-interval-set-4x50-ages-11-12.md";
				const url = undefined;
				function rawContent() {
					return "\nInterval sets teach swimmers to hold consistent effort across multiple repeats. This 4x50 set is short enough to be doable but long enough to build fitness.\n\n**Equipment needed:** 1 pool, kickboard or fins (optional), timer or clock.\n\n**Setup:** Swimmers line up at one end of the pool.\n\n**How to run it:**\n\n1. Warm up: 2x50 freestyle easy pace, 30 seconds rest between each.\n2. Main set: 4x50 freestyle at moderate effort (7-8 out of 10 intensity), 20 seconds rest between each.\n3. Cool down: 1x50 freestyle easy.\n\n**What to look for:**\n\nEach 50-yard repeat should be similar in time. If the third and fourth are significantly slower, the effort on the first two was too hard. Swimmers should feel like they're working hard but could do one or two more repeats at the same pace. The rest interval (20 seconds) should allow heart rate to drop slightly before the next repeat.\n\n**Variation:** Change the distance or intensity. For younger swimmers (closer to 11), use 6x25 at moderate effort with 15 seconds rest. For more experienced swimmers, use 5x75 at moderate effort with 20 seconds rest.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth swim goggles →](/go/swim-goggles-youth/) — Speedo Hydrospex, no-fog, fits ages 6–14.\n\n[Full swimming gear guide →](/what-to-buy/swimming/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
