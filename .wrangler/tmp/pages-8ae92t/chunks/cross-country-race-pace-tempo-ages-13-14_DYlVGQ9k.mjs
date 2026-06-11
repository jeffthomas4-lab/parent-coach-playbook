globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Tempo runs teach runners to hold a hard pace for an extended time. This builds mental toughness and aerobic capacity needed for racing.</p>\n<p><strong>Equipment needed:</strong> 1 track or marked course, cones at 1-mile and 2-mile marks.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Warm up with 1 mile easy jogging.</li>\n<li>Run 2 miles at tempo pace. Tempo pace is faster than easy, slower than a true race. Think 7-8 out of 10 effort, sustainable but hard.</li>\n<li>Jog 0.5 miles easy recovery.</li>\n<li>Run 1 mile at tempo pace (a shorter second tempo at the same pace).</li>\n<li>Cool down with 1 mile easy jogging.</li>\n</ol>\n<p><strong>What to look for:</strong></p>\n<p>The tempo effort should feel consistent across both segments. If the runner is significantly slower on the second tempo, the first one was too fast. Tempo runs teach the runner what “hard but manageable” feels like. This translates directly to racing because races are paced similarly: hard but sustainable. The runner should feel like they could go on, but they’re glad they don’t have to.</p>\n<p><strong>If they’re struggling:</strong> Cut to a single 1.5 mile tempo and a 0.5 mile recovery. End the workout there if the pace falls off by more than 30 seconds per mile.</p>\n<p><strong>If they’ve got it:</strong> Stretch the first tempo to 2.5 miles and hold the same pace. Or add a 30-second pickup at the end of the second tempo to practice closing strong.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/xc-trainers-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth running trainers →</a> — everyday training shoe for road and trail.</p>\n<p><a href=\"/what-to-buy/cross-country/\">Full cross country gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Race-Pace Tempo","summary":"Build aerobic capacity at a steady, challenging pace. 20 minutes.","sport":"cross-country","ages":["13-14"],"focus":"fundamentals","layer":"foundations","fundamental":"pacing","progression":"build","illustrationBrief":"Young runners running at tempo effort on a measured course, maintaining a steady hard pace for 15-20 minutes.","publishedAt":"2026-04-27T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":6,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":true,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Body completed by editorial agent on 2026-05-09. Truncated original ended at 'but they\\'r'. Sensitive flag on tempo-effort load retained."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/cross-country-race-pace-tempo-ages-13-14.md";
				const url = undefined;
				function rawContent() {
					return "\nTempo runs teach runners to hold a hard pace for an extended time. This builds mental toughness and aerobic capacity needed for racing.\n\n**Equipment needed:** 1 track or marked course, cones at 1-mile and 2-mile marks.\n\n**How to run it:**\n\n1. Warm up with 1 mile easy jogging.\n2. Run 2 miles at tempo pace. Tempo pace is faster than easy, slower than a true race. Think 7-8 out of 10 effort, sustainable but hard.\n3. Jog 0.5 miles easy recovery.\n4. Run 1 mile at tempo pace (a shorter second tempo at the same pace).\n5. Cool down with 1 mile easy jogging.\n\n**What to look for:**\n\nThe tempo effort should feel consistent across both segments. If the runner is significantly slower on the second tempo, the first one was too fast. Tempo runs teach the runner what \"hard but manageable\" feels like. This translates directly to racing because races are paced similarly: hard but sustainable. The runner should feel like they could go on, but they're glad they don't have to.\n\n**If they're struggling:** Cut to a single 1.5 mile tempo and a 0.5 mile recovery. End the workout there if the pace falls off by more than 30 seconds per mile.\n\n**If they've got it:** Stretch the first tempo to 2.5 miles and hold the same pace. Or add a 30-second pickup at the end of the second tempo to practice closing strong.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth running trainers →](/go/xc-trainers-youth/) — everyday training shoe for road and trail.\n\n[Full cross country gear guide →](/what-to-buy/cross-country/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
