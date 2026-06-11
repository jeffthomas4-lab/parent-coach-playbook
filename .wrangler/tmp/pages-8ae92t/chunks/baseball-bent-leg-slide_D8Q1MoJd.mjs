globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The bent leg slide (also called the figure-4 slide) is the safest and most common slide. The back leg bends into a 4 shape under the body. The lead leg extends out and touches the base. Done right, the runner stays on the bag and is hard to tag.</p>\n<p><strong>What you need:</strong> Sliding shorts or sweatpants. A base. Soft dirt or grass.</p>\n<p><strong>Setup:</strong> Set a base on grass first. Move to dirt only after the kid is confident.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Walk through the slide on the ground. Show: back leg bent under the front leg, lead leg straight out, body slightly leaning back.</li>\n<li>Kid lies down and gets into the position. Hold the position for 5 seconds.</li>\n<li>Stand up. Walk the slide motion. Run, drop down, slide.</li>\n<li>Do 3 slides at half speed.</li>\n<li>Last 5 slides at full speed into the base.</li>\n</ol>\n<p><strong>What to watch:</strong> Where the lead foot lands. The cleat should hit the FRONT edge of the base, not the side or top. Front edge gets the bag earliest.</p>\n<p><strong>If they’re struggling:</strong> Stay on grass. Stay at half speed. Sliding takes confidence.</p>\n<p><strong>If they’ve got it:</strong> Add a fielder with a tag. The slider has to land the foot on the base before the tag.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Bent Leg Slide","summary":"The basic feet-first slide into a base. 12 minutes. Ages 8-10 and 11-12.","sport":"baseball","ages":["8-10","11-12"],"fundamental":"base-running","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Side view of a runner sliding feet-first into a base, back leg bent in a 4-shape underneath, lead leg extended to touch the base.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":true,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Sliding is injury-adjacent. Sensible 'grass first, dirt later' progression."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-bent-leg-slide.md";
				const url = undefined;
				function rawContent() {
					return "\nThe bent leg slide (also called the figure-4 slide) is the safest and most common slide. The back leg bends into a 4 shape under the body. The lead leg extends out and touches the base. Done right, the runner stays on the bag and is hard to tag.\n\n**What you need:** Sliding shorts or sweatpants. A base. Soft dirt or grass.\n\n**Setup:** Set a base on grass first. Move to dirt only after the kid is confident.\n\n**How to run it:**\n\n1. Walk through the slide on the ground. Show: back leg bent under the front leg, lead leg straight out, body slightly leaning back.\n2. Kid lies down and gets into the position. Hold the position for 5 seconds.\n3. Stand up. Walk the slide motion. Run, drop down, slide.\n4. Do 3 slides at half speed.\n5. Last 5 slides at full speed into the base.\n\n**What to watch:** Where the lead foot lands. The cleat should hit the FRONT edge of the base, not the side or top. Front edge gets the bag earliest.\n\n**If they're struggling:** Stay on grass. Stay at half speed. Sliding takes confidence.\n\n**If they've got it:** Add a fielder with a tag. The slider has to land the foot on the base before the tag.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
