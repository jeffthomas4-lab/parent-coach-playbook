globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A kid who can’t toss to themselves and catch can’t play backyard catch. This is the first drill where they don’t need a partner. They build hand-eye coordination on their own time, on their own.</p>\n<p><strong>What you need:</strong> A <a href=\"/go/baseball-glove-9in-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">glove</a> and one tennis ball or soft baseball.</p>\n<p><strong>Setup:</strong> Open space, indoors or outdoors. They stand with feet apart and the glove ready.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Eyes, Hands, Squeeze, Pull. Today the focus is Eyes and Squeeze.</li>\n<li>They toss the ball straight up about 3 feet (head height to a kid).</li>\n<li>Eyes track the ball all the way up and all the way down.</li>\n<li>Both hands meet under the ball. Squeeze when it lands in the glove. Pull it into the chest.</li>\n<li>20 reps. Count out loud with them.</li>\n</ol>\n<p><strong>What to watch:</strong> Are they watching the ball all the way down? Most kids look up and then look at where they think the ball will land. Track the whole flight.</p>\n<p><strong>If they’re struggling:</strong> Lower the toss to 1 foot. Or have them toss with both hands so they don’t get tangled.</p>\n<p><strong>If they’ve got it:</strong> Higher tosses, up to 6 feet. Or they have to c</p>";

				const frontmatter = {"title":"Self-Toss Catch","summary":"Toss to yourself and catch. The first independent catching drill. 8 minutes. T-ball and ages 5-7.","sport":"baseball","ages":["t-ball","5-7"],"fundamental":"catching","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A child tossing a ball straight up about 3 feet high and catching it with two hands in the glove.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-self-toss-catch.md";
				const url = undefined;
				function rawContent() {
					return "\nA kid who can't toss to themselves and catch can't play backyard catch. This is the first drill where they don't need a partner. They build hand-eye coordination on their own time, on their own.\n\n**What you need:** A [glove](/go/baseball-glove-9in-youth/) and one tennis ball or soft baseball.\n\n**Setup:** Open space, indoors or outdoors. They stand with feet apart and the glove ready.\n\n**How to run it:**\n\n1. Cue: Eyes, Hands, Squeeze, Pull. Today the focus is Eyes and Squeeze.\n2. They toss the ball straight up about 3 feet (head height to a kid).\n3. Eyes track the ball all the way up and all the way down.\n4. Both hands meet under the ball. Squeeze when it lands in the glove. Pull it into the chest.\n5. 20 reps. Count out loud with them.\n\n**What to watch:** Are they watching the ball all the way down? Most kids look up and then look at where they think the ball will land. Track the whole flight.\n\n**If they're struggling:** Lower the toss to 1 foot. Or have them toss with both hands so they don't get tangled.\n\n**If they've got it:** Higher tosses, up to 6 feet. Or they have to c";
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
