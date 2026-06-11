globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The interval ladder teaches young distance runners pace and builds fitness. It’s structured, so athletes can focus on execution rather than figuring out what effort is needed.</p>\n<p><strong>Equipment needed:</strong> 1 track (or 400-meter marked straightaway), cones at 200-meter, 400-meter, 600-meter, 800-meter marks.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Athletes warm up with 400 meters easy jogging.</li>\n<li>Run: 200 meters at hard effort (breathing heavy), 200 meters easy recovery.</li>\n<li>Run: 400 meters at hard effort, 200 meters easy recovery.</li>\n<li>Run: 600 meters at hard effort, 200 meters easy recovery.</li>\n<li>Run: 800 meters at hard effort, 200 meters easy recovery.</li>\n<li>Then reverse (descend): 600 meters hard, 200 easy. 400 meters hard, 200 easy. 200 meters hard.</li>\n<li>Cool down with 400 meters easy jogging.</li>\n</ol>\n<p><strong>What to look for:</strong></p>\n<p>Athletes should be hitting their hard intervals at similar effort each time, not slowing down as they get tired. The easy recovery intervals should be truly easy, not another hard push. If an athlete is struggling by the descend portion, the initial effort was too hard. Teach them to save some gas for the later intervals.</p>\n<p><strong>Variation:</strong> For older runners (closer to 13-14), increase distances: 400-600-800-1000-800-600-400. For younger 11-year-olds, use: 100-200-300-400-300-200-100.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/xc-trainers-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth running trainers →</a> — everyday training shoe for track and XC.</p>\n<p><a href=\"/what-to-buy/track-field/\">Full track field gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Interval Ladder","summary":"Build aerobic capacity through ascending and descending intervals. 20 minutes.","sport":"track-field","ages":["11-12"],"focus":"fundamentals","layer":"skills","fundamental":"intervals","progression":"build","illustrationBrief":"Increasing then decreasing sprint distances","publishedAt":"2026-04-12T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":true,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Ladder intervals; sensitive flag for distance-effort load on 11-12s."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/track-interval-ladder-ages-11-12.md";
				const url = undefined;
				function rawContent() {
					return "\nThe interval ladder teaches young distance runners pace and builds fitness. It's structured, so athletes can focus on execution rather than figuring out what effort is needed.\n\n**Equipment needed:** 1 track (or 400-meter marked straightaway), cones at 200-meter, 400-meter, 600-meter, 800-meter marks.\n\n**How to run it:**\n\n1. Athletes warm up with 400 meters easy jogging.\n2. Run: 200 meters at hard effort (breathing heavy), 200 meters easy recovery.\n3. Run: 400 meters at hard effort, 200 meters easy recovery.\n4. Run: 600 meters at hard effort, 200 meters easy recovery.\n5. Run: 800 meters at hard effort, 200 meters easy recovery.\n6. Then reverse (descend): 600 meters hard, 200 easy. 400 meters hard, 200 easy. 200 meters hard.\n7. Cool down with 400 meters easy jogging.\n\n**What to look for:**\n\nAthletes should be hitting their hard intervals at similar effort each time, not slowing down as they get tired. The easy recovery intervals should be truly easy, not another hard push. If an athlete is struggling by the descend portion, the initial effort was too hard. Teach them to save some gas for the later intervals.\n\n**Variation:** For older runners (closer to 13-14), increase distances: 400-600-800-1000-800-600-400. For younger 11-year-olds, use: 100-200-300-400-300-200-100.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth running trainers →](/go/xc-trainers-youth/) — everyday training shoe for track and XC.\n\n[Full track field gear guide →](/what-to-buy/track-field/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
