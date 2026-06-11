globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Intervals at this age build the fitness needed for racing. This structured workout teaches pacing and effort management.</p>\n<p><strong>Equipment needed:</strong> 1 track or marked 400-meter loop, cones at 400-meter and 1-mile marks.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Warm up with 1 mile easy jogging.</li>\n<li>Run 1 mile at goal race pace (fast but sustainable, about 8 out of 10 effort).</li>\n<li>Jog 400 meters easy recovery.</li>\n<li>Run 1 mile at goal race pace again.</li>\n<li>Jog 400 meters easy recovery.</li>\n<li>Run 1 mile at goal race pace one more time.</li>\n<li>Cool down with 1 mile easy jogging.</li>\n</ol>\n<p><strong>What to look for:</strong></p>\n<p>Each mile repeat should be similar in time. If the third mile is significantly slower, the first pace was too fast. If all three are slow, the athlete is being cautious instead of committed. Goal race pace should feel hard but sustainable. By the third mile, fatigue is setting in, but the time should still hold within 5-10 seconds of the first.</p>\n<p><strong>If they’re struggling:</strong> Cut to two mile repeats and stretch the recovery to 600 meters. If the second mile is more than 20 seconds off the first, end the workout.</p>\n<p><strong>If they’ve got it:</strong> Add a fourth mile at goal pace, or shorten the recovery to 200 meters. Keep the goal time honest; don’t let them coast to fit the volume.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/xc-trainers-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth running trainers →</a> — everyday training shoe for road and trail.</p>\n<p><a href=\"/what-to-buy/cross-country/\">Full cross country gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Interval Work","summary":"Teach pace control with tempo runs and mile repeats. 25 minutes.","sport":"cross-country","ages":["13-14"],"focus":"fundamentals","layer":"foundations","fundamental":"intervals","progression":"build","illustrationBrief":"Young runners on a track completing a mile repeat at hard effort, recovering briefly, then beginning another mile at measured pace.","publishedAt":"2026-04-24T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":6,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":true,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Body completed by editorial agent on 2026-05-09. Truncated original ended at 'fatigue is setting in, bu'. Sensitive flag on mile-repeat load retained."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/cross-country-interval-work-ages-13-14.md";
				const url = undefined;
				function rawContent() {
					return "\nIntervals at this age build the fitness needed for racing. This structured workout teaches pacing and effort management.\n\n**Equipment needed:** 1 track or marked 400-meter loop, cones at 400-meter and 1-mile marks.\n\n**How to run it:**\n\n1. Warm up with 1 mile easy jogging.\n2. Run 1 mile at goal race pace (fast but sustainable, about 8 out of 10 effort).\n3. Jog 400 meters easy recovery.\n4. Run 1 mile at goal race pace again.\n5. Jog 400 meters easy recovery.\n6. Run 1 mile at goal race pace one more time.\n7. Cool down with 1 mile easy jogging.\n\n**What to look for:**\n\nEach mile repeat should be similar in time. If the third mile is significantly slower, the first pace was too fast. If all three are slow, the athlete is being cautious instead of committed. Goal race pace should feel hard but sustainable. By the third mile, fatigue is setting in, but the time should still hold within 5-10 seconds of the first.\n\n**If they're struggling:** Cut to two mile repeats and stretch the recovery to 600 meters. If the second mile is more than 20 seconds off the first, end the workout.\n\n**If they've got it:** Add a fourth mile at goal pace, or shorten the recovery to 200 meters. Keep the goal time honest; don't let them coast to fit the volume.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth running trainers →](/go/xc-trainers-youth/) — everyday training shoe for road and trail.\n\n[Full cross country gear guide →](/what-to-buy/cross-country/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
