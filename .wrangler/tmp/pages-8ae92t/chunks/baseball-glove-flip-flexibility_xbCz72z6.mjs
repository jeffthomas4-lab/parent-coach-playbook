globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A new glove is stiff. A kid’s hand inside a stiff glove can’t squeeze, so balls bounce out. Five minutes a day of glove flexing fixes both problems and makes the glove feel like part of their hand.</p>\n<p><strong>What you need:</strong> Their <a href=\"/go/baseball-glove-9in-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">glove</a>. One baseball or tennis ball.</p>\n<p><strong>Setup:</strong> They sit cross-legged on the floor with the glove on their hand.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Show them how to squeeze the glove closed with the throwing hand, then open it. Slow.</li>\n<li>Have them do that 20 times. The glove should feel a little floppier by rep 20.</li>\n<li>Now put a ball in the pocket. They squeeze the glove closed on the ball, hold for 2 seconds, open.</li>\n<li>20 reps with the ball.</li>\n<li>Last drill: they pop the ball out of the glove with one squeeze, catch it with the throwing hand, put it back, repeat. 15 reps.</li>\n</ol>\n<p><strong>What to watch:</strong> Are they actually squeezing the glove closed? Some kids will fake the squeeze and the glove stays half-open. Hold the glove for them on a few reps so they feel what closed should feel like.</p>\n<p><strong>If they’re struggling:</strong> Use a softer glove or a glove a size too big. Some kids’ hands are not ready for their own glove yet.</p>\n<p><strong>If they’ve got it:</strong> Have them flex the glove with their eyes closed. They have to feel the open and c</p>";

				const frontmatter = {"title":"Glove Flip Flexibility","summary":"Break in the glove and the kid's hand at the same time. 5 minutes. T-ball and ages 5-7.","sport":"baseball","ages":["t-ball","5-7"],"fundamental":"catching","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A child squeezing and flexing a baseball glove with both hands, opening and closing the pocket.","editorial":{"qualityGrade":7,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-glove-flip-flexibility.md";
				const url = undefined;
				function rawContent() {
					return "\nA new glove is stiff. A kid's hand inside a stiff glove can't squeeze, so balls bounce out. Five minutes a day of glove flexing fixes both problems and makes the glove feel like part of their hand.\n\n**What you need:** Their [glove](/go/baseball-glove-9in-youth/). One baseball or tennis ball.\n\n**Setup:** They sit cross-legged on the floor with the glove on their hand.\n\n**How to run it:**\n\n1. Show them how to squeeze the glove closed with the throwing hand, then open it. Slow.\n2. Have them do that 20 times. The glove should feel a little floppier by rep 20.\n3. Now put a ball in the pocket. They squeeze the glove closed on the ball, hold for 2 seconds, open.\n4. 20 reps with the ball.\n5. Last drill: they pop the ball out of the glove with one squeeze, catch it with the throwing hand, put it back, repeat. 15 reps.\n\n**What to watch:** Are they actually squeezing the glove closed? Some kids will fake the squeeze and the glove stays half-open. Hold the glove for them on a few reps so they feel what closed should feel like.\n\n**If they're struggling:** Use a softer glove or a glove a size too big. Some kids' hands are not ready for their own glove yet.\n\n**If they've got it:** Have them flex the glove with their eyes closed. They have to feel the open and c";
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
