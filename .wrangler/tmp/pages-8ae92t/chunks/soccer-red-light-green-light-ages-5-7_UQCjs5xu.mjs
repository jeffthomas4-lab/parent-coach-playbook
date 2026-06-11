globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>This is the classic game with a ball. It teaches first touch, ball control, and stopping power. And kids will run hard because it’s a game.</p>\n<p><strong>Equipment needed:</strong> One <a href=\"/go/soccer-ball-size3/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">soccer ball</a> per child, a 40-yard by 20-yard space, <a href=\"/go/soccer-cones-12pk/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">cones</a> to mark start and finish lines.</p>\n<p><strong>Setup:</strong> Mark a start line and a finish line 40 yards apart. All kids start at the start line with a ball.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Call “Green light.” Kids dribble toward the finish line as fast as they can.</li>\n<li>Call “Red light.” Kids must stop their ball dead within two steps.</li>\n<li>Any kid whose ball goes past them or keeps rolling gets sent back to the start.</li>\n<li>First kid to cross the finish line wins.</li>\n<li>Play four rounds.</li>\n</ol>\n<p><strong>What to look for:</strong> Deceleration and control. Kids who can stop fast will win. Kids who just kick the ball and hope won’t.</p>\n<p><strong>Variation:</strong> For younger kids (5-6), reduce the distance to 20 yards. For older kids (7), add a rule: once you reach the finish, you have to dribble back to st</p>";

				const frontmatter = {"title":"Red Light Green Light","summary":"Sprint and stop with the ball at their feet. 15 minutes. Ages 5-7.","sport":"soccer","ages":["5-7"],"focus":"fundamentals","layer":"foundations","fundamental":"warm-up","progression":"intro","illustrationBrief":"Players accelerate and stop to traffic light signals","publishedAt":"2026-01-17T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Game-based 5-7 warm-up. Soccer vocab correct."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-red-light-green-light-ages-5-7.md";
				const url = undefined;
				function rawContent() {
					return "\nThis is the classic game with a ball. It teaches first touch, ball control, and stopping power. And kids will run hard because it's a game.\n\n**Equipment needed:** One [soccer ball](/go/soccer-ball-size3/) per child, a 40-yard by 20-yard space, [cones](/go/soccer-cones-12pk/) to mark start and finish lines.\n\n**Setup:** Mark a start line and a finish line 40 yards apart. All kids start at the start line with a ball.\n\n**How to run it:**\n\n1. Call \"Green light.\" Kids dribble toward the finish line as fast as they can.\n2. Call \"Red light.\" Kids must stop their ball dead within two steps.\n3. Any kid whose ball goes past them or keeps rolling gets sent back to the start.\n4. First kid to cross the finish line wins.\n5. Play four rounds.\n\n**What to look for:** Deceleration and control. Kids who can stop fast will win. Kids who just kick the ball and hope won't.\n\n**Variation:** For younger kids (5-6), reduce the distance to 20 yards. For older kids (7), add a rule: once you reach the finish, you have to dribble back to st";
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
