globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The long jump is half run-up, half jump. A bad approach means a bad jump no matter how strong the legs. This drill builds the approach in stages: walk, jog, run, then the full jump.</p>\n<p><strong>What you need:</strong> A long jump runway and pit (or grass area with a marker for the takeoff board), measuring tape.</p>\n<p><strong>Setup:</strong> Mark the takeoff board. Measure 30 feet back as the start.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Walk the approach. Note which foot lands on the takeoff board.</li>\n<li>Jog the approach. Foot should still hit the board (adjust the start if not).</li>\n<li>Run the approach at half speed. Hit the board.</li>\n<li>Run at three-quarter speed. Add the jump after takeoff.</li>\n<li>Full speed approach with full jump. Land in the pit.</li>\n</ol>\n<p><strong>What to watch:</strong> The takeoff foot. Most kids are right-foot dominant. The right foot has to land on the takeoff board. If they hit with the wrong foot, the start position is off.</p>\n<p><strong>If they’re struggling:</strong> Shorter approach (15 feet). Just work on the takeoff foot accuracy.</p>\n<p><strong>If they’ve got it:</strong> Lengthen the approach to 50 feet. Full speed jumps with measured landings.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/xc-trainers-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth running trainers →</a> — everyday training shoe for track and XC.</p>\n<p><a href=\"/what-to-buy/track-field/\">Full track field gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Long Jump Approach Progression","summary":"Build the run-up to the long jump board. 15 minutes. Ages 11-12.","sport":"track-field","ages":["11-12"],"fundamental":"jumping","progression":"refine","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Long jumper running down the runway, hitting the takeoff board with the dominant foot, exploding upward and forward into the sand pit.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":true,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Walk-jog-run-jump progression; sensitive flag for jump injury risk."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/track-long-jump-approach-progression.md";
				const url = undefined;
				function rawContent() {
					return "\nThe long jump is half run-up, half jump. A bad approach means a bad jump no matter how strong the legs. This drill builds the approach in stages: walk, jog, run, then the full jump.\n\n**What you need:** A long jump runway and pit (or grass area with a marker for the takeoff board), measuring tape.\n\n**Setup:** Mark the takeoff board. Measure 30 feet back as the start.\n\n**How to run it:**\n\n1. Walk the approach. Note which foot lands on the takeoff board.\n2. Jog the approach. Foot should still hit the board (adjust the start if not).\n3. Run the approach at half speed. Hit the board.\n4. Run at three-quarter speed. Add the jump after takeoff.\n5. Full speed approach with full jump. Land in the pit.\n\n**What to watch:** The takeoff foot. Most kids are right-foot dominant. The right foot has to land on the takeoff board. If they hit with the wrong foot, the start position is off.\n\n**If they're struggling:** Shorter approach (15 feet). Just work on the takeoff foot accuracy.\n\n**If they've got it:** Lengthen the approach to 50 feet. Full speed jumps with measured landings.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth running trainers →](/go/xc-trainers-youth/) — everyday training shoe for track and XC.\n\n[Full track field gear guide →](/what-to-buy/track-field/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
