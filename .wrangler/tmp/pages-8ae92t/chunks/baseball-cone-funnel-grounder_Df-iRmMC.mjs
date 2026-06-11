globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The Funnel step in our cue (Drop, Show, Funnel, Send) is the part most kids skip. Funnel means the glove and the throwing hand bring the ball up the centerline of the body to the chest. Cones on the ground show them where that path starts.</p>\n<p><strong>What you need:</strong> 2 <a href=\"/go/agility-cones/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">cones</a>, a <a href=\"/go/baseball-glove-9in-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">glove</a>, 8 tennis balls or soft baseballs.</p>\n<p><strong>Setup:</strong> Place two cones about 18 inches apart on the grass directly in front of where the kid stands, like the start of a funnel.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Drop, Show, Funnel, Send. Focus on Funnel today.</li>\n<li>The kid stands behind the cones. They drop into fielding position so the glove is between the cones, on the ground.</li>\n<li>Roll a slow ball through the cones into their glove.</li>\n<li>As they catch, both hands come up the middle of the body to the chest. That’s the Funnel.</li>\n<li>Do 10 rolls. After each, freeze them at the chest position so they feel the right finish.</li>\n</ol>\n<p><strong>What to watch:</strong> Where the hands go after the catch. If the hands go to the side, they can’t throw fast. Up the middle is the only path that works.</p>\n<p><strong>If they’re struggling:</strong> Skip the rolls. Have them practice the Drop, Show, Funnel motion 10 times without a ball.</p>\n<p><strong>If they’ve got it:</strong> Roll faster. Or move the cones</p>";

				const frontmatter = {"title":"Cone Funnel Grounder","summary":"Use cones to teach the path of the ball into the chest. 10 minutes. T-ball and ages 5-7.","sport":"baseball","ages":["t-ball","5-7"],"fundamental":"fielding","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Two cones placed about 18 inches apart on the ground, marking the spot where a child's glove and throwing hand should funnel the ball into the chest.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-cone-funnel-grounder.md";
				const url = undefined;
				function rawContent() {
					return "\nThe Funnel step in our cue (Drop, Show, Funnel, Send) is the part most kids skip. Funnel means the glove and the throwing hand bring the ball up the centerline of the body to the chest. Cones on the ground show them where that path starts.\n\n**What you need:** 2 [cones](/go/agility-cones/), a [glove](/go/baseball-glove-9in-youth/), 8 tennis balls or soft baseballs.\n\n**Setup:** Place two cones about 18 inches apart on the grass directly in front of where the kid stands, like the start of a funnel.\n\n**How to run it:**\n\n1. Cue: Drop, Show, Funnel, Send. Focus on Funnel today.\n2. The kid stands behind the cones. They drop into fielding position so the glove is between the cones, on the ground.\n3. Roll a slow ball through the cones into their glove.\n4. As they catch, both hands come up the middle of the body to the chest. That's the Funnel.\n5. Do 10 rolls. After each, freeze them at the chest position so they feel the right finish.\n\n**What to watch:** Where the hands go after the catch. If the hands go to the side, they can't throw fast. Up the middle is the only path that works.\n\n**If they're struggling:** Skip the rolls. Have them practice the Drop, Show, Funnel motion 10 times without a ball.\n\n**If they've got it:** Roll faster. Or move the cones ";
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
