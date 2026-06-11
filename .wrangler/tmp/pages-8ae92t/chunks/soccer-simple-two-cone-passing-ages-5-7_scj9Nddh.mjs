globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Passing is touch and accuracy. This drill teaches both by making it simple: pass to your partner and pass it back.</p>\n<p><strong>Equipment needed:</strong> 10 <a href=\"/go/soccer-cones-12pk/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">cones</a> (creating 5 two-cone gates), 8-10 <a href=\"/go/soccer-ball-size3/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">soccer balls</a>, open space.</p>\n<p><strong>Setup:</strong> Place two cones 15 feet apart. Two kids stand between the cones, facing each other, about 10 feet away from the cones.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Kid A passes to Kid B and Kid B passes back to Kid A.</li>\n<li>After each pass, the passer takes a step back (away from the cones).</li>\n<li>After five back-and-forth passes, they reset and go again.</li>\n<li>Do three rounds of five passes.</li>\n<li>Rotate pairs so everyone gets multiple turns.</li>\n</ol>\n<p><strong>What to look for:</strong> One-touch passing and accuracy. The ball should go directly to the partner without bouncing or rolling.</p>\n<p><strong>Variation:</strong> For younger kids (5-6), reduce the distance to 8 feet. For older kids (7), increase it to 12 feet and add a rule: you can’t stop the ball</p>";

				const frontmatter = {"title":"Simple Two-Cone Passing","summary":"Two kids pass between two cones and back. 15 minutes. Ages 5-7.","sport":"soccer","ages":["5-7"],"focus":"fundamentals","layer":"foundations","fundamental":"passing","progression":"intro","illustrationBrief":"Two cones with pass between them","publishedAt":"2026-01-24T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Solid intro passing drill; stepping-back rule adds structure."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-simple-two-cone-passing-ages-5-7.md";
				const url = undefined;
				function rawContent() {
					return "\nPassing is touch and accuracy. This drill teaches both by making it simple: pass to your partner and pass it back.\n\n**Equipment needed:** 10 [cones](/go/soccer-cones-12pk/) (creating 5 two-cone gates), 8-10 [soccer balls](/go/soccer-ball-size3/), open space.\n\n**Setup:** Place two cones 15 feet apart. Two kids stand between the cones, facing each other, about 10 feet away from the cones.\n\n**How to run it:**\n\n1. Kid A passes to Kid B and Kid B passes back to Kid A.\n2. After each pass, the passer takes a step back (away from the cones).\n3. After five back-and-forth passes, they reset and go again.\n4. Do three rounds of five passes.\n5. Rotate pairs so everyone gets multiple turns.\n\n**What to look for:** One-touch passing and accuracy. The ball should go directly to the partner without bouncing or rolling.\n\n**Variation:** For younger kids (5-6), reduce the distance to 8 feet. For older kids (7), increase it to 12 feet and add a rule: you can't stop the ball";
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
