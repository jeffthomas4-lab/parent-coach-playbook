globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Good fielders are made by reps, not by lectures. A bucket of 20 balls gets the kid in the position 20 times in a row. Same body shape. Same hands. Same finish. The repetition builds the habit.</p>\n<p><strong>What you need:</strong> 20 baseballs in a 5-gallon bucket, a <a href=\"/go/baseball-glove-9in-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">glove</a>, a flat field.</p>\n<p><strong>Setup:</strong> Kid stands 20 feet from you in fielding ready position. Bucket of balls next to you.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Drop, Show, Funnel, Send.</li>\n<li>Roll or fungo (hit with a bat) a grounder every 4 seconds. They field and toss back to a target near you.</li>\n<li>No coaching during the round. Just feed the balls.</li>\n<li>After 20 reps, stop. Tell them what you saw. One thing only.</li>\n<li>Refill the bucket. One more round of 20.</li>\n</ol>\n<p><strong>What to watch:</strong> The shape on rep 18, 19, 20. Most kids look perfect on the first 5 and fall apart at the end. The end of the round is where the real habits show.</p>\n<p><strong>If they’re struggling:</strong> Cut to 10 grounders per round. Slow the tempo to one every 6 seconds.</p>\n<p><strong>If they’ve got it:</strong> Push to 30 reps per round. Or hit the grounders harder. Or alternate between glove side</p>";

				const frontmatter = {"title":"Bucket of Grounders","summary":"20 grounders in a row to build fielding volume. 12 minutes. Ages 5-7 and 8-10.","sport":"baseball","ages":["5-7","8-10"],"fundamental":"fielding","progression":"build","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Adult standing next to a 5-gallon bucket of baseballs, hitting or rolling grounders in rapid succession to a child fielding 20 feet away.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":9,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass. Good 'reps, not lectures' framing."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-bucket-of-grounders.md";
				const url = undefined;
				function rawContent() {
					return "\nGood fielders are made by reps, not by lectures. A bucket of 20 balls gets the kid in the position 20 times in a row. Same body shape. Same hands. Same finish. The repetition builds the habit.\n\n**What you need:** 20 baseballs in a 5-gallon bucket, a [glove](/go/baseball-glove-9in-youth/), a flat field.\n\n**Setup:** Kid stands 20 feet from you in fielding ready position. Bucket of balls next to you.\n\n**How to run it:**\n\n1. Cue: Drop, Show, Funnel, Send.\n2. Roll or fungo (hit with a bat) a grounder every 4 seconds. They field and toss back to a target near you.\n3. No coaching during the round. Just feed the balls.\n4. After 20 reps, stop. Tell them what you saw. One thing only.\n5. Refill the bucket. One more round of 20.\n\n**What to watch:** The shape on rep 18, 19, 20. Most kids look perfect on the first 5 and fall apart at the end. The end of the round is where the real habits show.\n\n**If they're struggling:** Cut to 10 grounders per round. Slow the tempo to one every 6 seconds.\n\n**If they've got it:** Push to 30 reps per round. Or hit the grounders harder. Or alternate between glove side ";
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
