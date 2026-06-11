globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Most young teams clump together around the ball. This drill forces spacing so they learn to spread and pass.</p>\n<p><strong>Equipment needed:</strong> 6 <a href=\"/go/soccer-cones-12pk/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">cones</a>, 10-12 kids, 3-4 <a href=\"/go/soccer-ball-size4/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">soccer balls</a>, a 40-by-30-yard space.</p>\n<p><strong>Setup:</strong> Mark three zones with cones: a back zone (20 yards wide at one end), a middle zone (20 yards wide in the middle), a forward zone (20 yards wide at the other end). Kids are divided into three groups: defenders, midfielders, forwards.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Defenders pass in the back zone. When ready, they pass to a midfielder.</li>\n<li>Midfielder receives and passes to a forward.</li>\n<li>Forward shoots or passes back.</li>\n<li>Ball goes back to defense and repeats.</li>\n<li>Rule: No one leaves their zone. Defenders stay in the back, midfielders in the middle, forwards in the front.</li>\n<li>Play for 10 minutes, then rotate positions and play another 10.</li>\n</ol>\n<p><strong>What to look for:</strong> Spacing and movement. Do they spread out in their zones or bunch up? Bunching means no one is open.</p>\n<p><strong>Variation:</strong> For younger kids (8-9), reduce zones to two (back and forward). For older kids (10), add an offside li</p>";

				const frontmatter = {"title":"The No-Bunching Drill","summary":"Spread out the field while passing. 20 minutes. Ages 8-10.","sport":"soccer","ages":["8-10"],"focus":"fundamentals","layer":"foundations","fundamental":"positioning","progression":"intro","illustrationBrief":"Three zones marking correct field spacing","publishedAt":"2026-02-11T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Solves the universal bunching problem at this age. Soccer vocab correct."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-no-bunching-drill-ages-8-10.md";
				const url = undefined;
				function rawContent() {
					return "\nMost young teams clump together around the ball. This drill forces spacing so they learn to spread and pass.\n\n**Equipment needed:** 6 [cones](/go/soccer-cones-12pk/), 10-12 kids, 3-4 [soccer balls](/go/soccer-ball-size4/), a 40-by-30-yard space.\n\n**Setup:** Mark three zones with cones: a back zone (20 yards wide at one end), a middle zone (20 yards wide in the middle), a forward zone (20 yards wide at the other end). Kids are divided into three groups: defenders, midfielders, forwards.\n\n**How to run it:**\n\n1. Defenders pass in the back zone. When ready, they pass to a midfielder.\n2. Midfielder receives and passes to a forward.\n3. Forward shoots or passes back.\n4. Ball goes back to defense and repeats.\n5. Rule: No one leaves their zone. Defenders stay in the back, midfielders in the middle, forwards in the front.\n6. Play for 10 minutes, then rotate positions and play another 10.\n\n**What to look for:** Spacing and movement. Do they spread out in their zones or bunch up? Bunching means no one is open.\n\n**Variation:** For younger kids (8-9), reduce zones to two (back and forward). For older kids (10), add an offside li";
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
