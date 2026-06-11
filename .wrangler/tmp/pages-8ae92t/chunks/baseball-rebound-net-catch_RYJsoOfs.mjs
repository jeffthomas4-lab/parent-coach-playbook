globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A <a href=\"/go/baseball-throwback-net/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">rebound net</a> (sometimes called a pitch-back) is the best money a baseball parent can spend. It returns the ball at different angles depending on where the throw hits, so the kid never gets the same catch twice. This is volume training for catching.</p>\n<p><strong>What you need:</strong> A rebound net. A glove. 1 baseball or tennis ball.</p>\n<p><strong>Setup:</strong> Set the net at the angle that returns balls slightly above ground. Kid stands 10 feet from the net.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Eyes, Hands, Squeeze, Pull.</li>\n<li>They throw at the net. Wherever the ball comes back, they catch it.</li>\n<li>15 catches in 3 minutes is the goal. Set a timer.</li>\n<li>After 3 minutes, change the net angle so balls come back higher.</li>\n<li>Another 15 catches in 3 minutes.</li>\n</ol>\n<p><strong>What to watch:</strong> Are they catching with two hands every time, even on the easy returns? It’s tempting to one-hand the easy ones. Two hands every rep.</p>\n<p><strong>If they’re struggling:</strong> Throw softer at the net so the rebounds are slower.</p>\n<p><strong>If they’ve got it:</strong> Throw harder. Or stand closer to the net so they h</p>";

				const frontmatter = {"title":"Rebound Net Catch","summary":"Use a pitch-back net to get hundreds of catches in 15 minutes. Ages 5-7 and 8-10.","sport":"baseball","ages":["5-7","8-10"],"fundamental":"catching","progression":"build","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A child throwing a ball into an angled rebound net and catching the return at different heights.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Product price removed for affiliate compliance; product claim is generic, not a brand recommendation."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-rebound-net-catch.md";
				const url = undefined;
				function rawContent() {
					return "\nA [rebound net](/go/baseball-throwback-net/) (sometimes called a pitch-back) is the best money a baseball parent can spend. It returns the ball at different angles depending on where the throw hits, so the kid never gets the same catch twice. This is volume training for catching.\n\n**What you need:** A rebound net. A glove. 1 baseball or tennis ball.\n\n**Setup:** Set the net at the angle that returns balls slightly above ground. Kid stands 10 feet from the net.\n\n**How to run it:**\n\n1. Cue: Eyes, Hands, Squeeze, Pull.\n2. They throw at the net. Wherever the ball comes back, they catch it.\n3. 15 catches in 3 minutes is the goal. Set a timer.\n4. After 3 minutes, change the net angle so balls come back higher.\n5. Another 15 catches in 3 minutes.\n\n**What to watch:** Are they catching with two hands every time, even on the easy returns? It's tempting to one-hand the easy ones. Two hands every rep.\n\n**If they're struggling:** Throw softer at the net so the rebounds are slower.\n\n**If they've got it:** Throw harder. Or stand closer to the net so they h";
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
