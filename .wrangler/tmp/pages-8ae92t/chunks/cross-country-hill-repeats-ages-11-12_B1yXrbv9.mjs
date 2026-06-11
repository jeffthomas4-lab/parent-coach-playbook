globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Hill repeats teach young runners to maintain effort on challenging terrain. They build strength and confidence for racing over varied ground.</p>\n<p><strong>Equipment needed:</strong> 1 hill (200-300 meters long, moderate gradient), cones at base and top.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Athletes warm up with 800 meters easy jogging on flat ground.</li>\n<li>Run up the hill at hard effort (breathing heavy, 8-9 out of 10 intensity). This takes about 2-3 minutes depending on hill length and grade.</li>\n<li>Jog down easy for recovery (same distance, easy pace).</li>\n<li>Rest at the bottom for 1 minute.</li>\n<li>Repeat the climb. Do 4-5 total repeats.</li>\n<li>Cool down with 600 meters easy jogging.</li>\n</ol>\n<p><strong>What to look for:</strong></p>\n<p>Runners should maintain effort on the hill, not slow down as they get tired. On the first few repeats, they should feel strong. If a runner is struggling on repeat 2, the pace was too hard on repeat 1. The descent should be controlled, not reckless. Hill training builds confidence for racing, but only if the effort is honest and the recovery is full.</p>\n<p><strong>If they’re struggling:</strong> Cut to 3 repeats and a shorter hill (100-150 meters). Add 30 seconds of rest at the bottom.</p>\n<p><strong>If they’ve got it:</strong> Add a sixth repeat with a hard finish. The last 50 meters of the climb at near-sprint, then a full minute walk-down before the easy jog.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/xc-trainers-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth running trainers →</a> — everyday training shoe for road and trail.</p>\n<p><a href=\"/what-to-buy/cross-country/\">Full cross country gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Hill Repeats","summary":"Build leg strength and mental toughness on a slope. 20 minutes.","sport":"cross-country","ages":["11-12"],"focus":"fundamentals","layer":"skills","fundamental":"conditioning","progression":"build","illustrationBrief":"Young runners sprinting up a moderate slope, recovering at the top, then jogging back down for the next repetition.","publishedAt":"2026-04-21T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":6,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":true,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Body completed by editorial agent on 2026-05-09. Truncated original ended at 'Hill training builds confidence for racing,'. Sensitive flag on hill effort retained."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/cross-country-hill-repeats-ages-11-12.md";
				const url = undefined;
				function rawContent() {
					return "\nHill repeats teach young runners to maintain effort on challenging terrain. They build strength and confidence for racing over varied ground.\n\n**Equipment needed:** 1 hill (200-300 meters long, moderate gradient), cones at base and top.\n\n**How to run it:**\n\n1. Athletes warm up with 800 meters easy jogging on flat ground.\n2. Run up the hill at hard effort (breathing heavy, 8-9 out of 10 intensity). This takes about 2-3 minutes depending on hill length and grade.\n3. Jog down easy for recovery (same distance, easy pace).\n4. Rest at the bottom for 1 minute.\n5. Repeat the climb. Do 4-5 total repeats.\n6. Cool down with 600 meters easy jogging.\n\n**What to look for:**\n\nRunners should maintain effort on the hill, not slow down as they get tired. On the first few repeats, they should feel strong. If a runner is struggling on repeat 2, the pace was too hard on repeat 1. The descent should be controlled, not reckless. Hill training builds confidence for racing, but only if the effort is honest and the recovery is full.\n\n**If they're struggling:** Cut to 3 repeats and a shorter hill (100-150 meters). Add 30 seconds of rest at the bottom.\n\n**If they've got it:** Add a sixth repeat with a hard finish. The last 50 meters of the climb at near-sprint, then a full minute walk-down before the easy jog.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth running trainers →](/go/xc-trainers-youth/) — everyday training shoe for road and trail.\n\n[Full cross country gear guide →](/what-to-buy/cross-country/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
