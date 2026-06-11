globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Running straight is easy. Weaving teaches them to use both feet and steer the ball. Five cones in a line with space between them makes it simple and repeatable.</p>\n<p><strong>What you need:</strong> 5 <a href=\"/go/soccer-cones-12pk/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">cones</a> or water bottles. 1 <a href=\"/go/soccer-ball-size3/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">soccer ball</a> per child. Flat area.</p>\n<p><strong>Setup:</strong> Line up 5 cones in a straight line, 4 feet apart. Starting line 5 feet before the first cone.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Child dribbles from the start toward the first cone, tapping the ball.</li>\n<li>They weave left of the first cone, right of the second, left of the third, and so on.</li>\n<li>After the last cone, they turn and dribble back.</li>\n<li>One lap per turn. 4 turns total.</li>\n<li>Rest between laps.</li>\n</ol>\n<p><strong>What to watch:</strong> Are they keeping the ball close to their feet? Or is it rolling away from them? Close means control.</p>\n<p><strong>If they’re struggling:</strong> Space the cones 5 feet apart instead. Move slower through the course.</p>\n<p><strong>If they’ve got it:</strong> Reduce spacing</p>";

				const frontmatter = {"title":"Cone Slalom Dribble","summary":"Dribble through a line of 5 cones in a slalom pattern. 10 minutes. Ages 5-7, 8-10.","sport":"soccer","ages":["5-7","8-10"],"fundamental":"dribbling","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Child weaving through 5 cones spaced 4 feet apart, ball at their feet, body leaning into each turn.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-cone-slalom-dribble.md";
				const url = undefined;
				function rawContent() {
					return "\nRunning straight is easy. Weaving teaches them to use both feet and steer the ball. Five cones in a line with space between them makes it simple and repeatable.\n\n**What you need:** 5 [cones](/go/soccer-cones-12pk/) or water bottles. 1 [soccer ball](/go/soccer-ball-size3/) per child. Flat area.\n\n**Setup:** Line up 5 cones in a straight line, 4 feet apart. Starting line 5 feet before the first cone.\n\n**How to run it:**\n\n1. Child dribbles from the start toward the first cone, tapping the ball.\n2. They weave left of the first cone, right of the second, left of the third, and so on.\n3. After the last cone, they turn and dribble back.\n4. One lap per turn. 4 turns total.\n5. Rest between laps.\n\n**What to watch:** Are they keeping the ball close to their feet? Or is it rolling away from them? Close means control.\n\n**If they're struggling:** Space the cones 5 feet apart instead. Move slower through the course.\n\n**If they've got it:** Reduce spacing ";
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
