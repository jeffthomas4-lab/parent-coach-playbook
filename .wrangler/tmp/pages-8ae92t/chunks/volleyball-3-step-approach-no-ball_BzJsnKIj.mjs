globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The spike approach is a three-step rhythm: left, right, left-right. Most kids try to jump from a standstill or run flat-footed. The three-step builds momentum into the jump and lifts the body higher than any other footwork.</p>\n<p><strong>What you need:</strong> Open space, no ball, no net.</p>\n<p><strong>Setup:</strong> Kid 10 feet behind an imaginary net. Open space to jump.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Approach, Plant, Reach, Snap. Today’s focus is Approach.</li>\n<li>Show the three-step rhythm: left foot, right foot, left-right plant. Arms swing back during the second step, forward during the plant.</li>\n<li>Have them mirror it without a jump. 5 reps.</li>\n<li>Add the jump at the end of the plant. Arms swing up. 5 reps.</li>\n<li>Last 3 reps: full speed approach with full jump. Land soft.</li>\n</ol>\n<p><strong>What to watch:</strong> The rhythm of the steps. Most kids will do “left, right, jump.” The correct rhythm is “left, right, LEFT-RIGHT” with both feet planting nearly together for the takeoff.</p>\n<p><strong>If they’re struggling:</strong> Walk through it slowly. Mark the foot positions with chalk or tape.</p>\n<p><strong>If they’ve got it:</strong> Add the spike motion: arm pulls back, swings forward, snaps over the imaginary ball.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/volleyball-volley-lite/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Volley Lite training ball →</a> — lightweight ball for beginners learning to pass.</p>\n<p><a href=\"/go/volleyball-net/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Portable volleyball net →</a> — 32-ft set with adjustable steel poles.</p>\n<p><a href=\"/what-to-buy/volleyball/\">Full volleyball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Three-Step Approach No Ball","summary":"Build the spike approach footwork without a ball. 8 minutes. Ages 8-10.","sport":"volleyball","ages":["8-10"],"fundamental":"spiking","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player demonstrating the three-step approach: left foot, right foot, left-right plant, arms swinging back then forward into a jump.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean no-ball footwork drill. Volleyball vocab correct throughout."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/volleyball-3-step-approach-no-ball.md";
				const url = undefined;
				function rawContent() {
					return "\nThe spike approach is a three-step rhythm: left, right, left-right. Most kids try to jump from a standstill or run flat-footed. The three-step builds momentum into the jump and lifts the body higher than any other footwork.\n\n**What you need:** Open space, no ball, no net.\n\n**Setup:** Kid 10 feet behind an imaginary net. Open space to jump.\n\n**How to run it:**\n\n1. Cue: Approach, Plant, Reach, Snap. Today's focus is Approach.\n2. Show the three-step rhythm: left foot, right foot, left-right plant. Arms swing back during the second step, forward during the plant.\n3. Have them mirror it without a jump. 5 reps.\n4. Add the jump at the end of the plant. Arms swing up. 5 reps.\n5. Last 3 reps: full speed approach with full jump. Land soft.\n\n**What to watch:** The rhythm of the steps. Most kids will do \"left, right, jump.\" The correct rhythm is \"left, right, LEFT-RIGHT\" with both feet planting nearly together for the takeoff.\n\n**If they're struggling:** Walk through it slowly. Mark the foot positions with chalk or tape.\n\n**If they've got it:** Add the spike motion: arm pulls back, swings forward, snaps over the imaginary ball.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Volley Lite training ball →](/go/volleyball-volley-lite/) — lightweight ball for beginners learning to pass.\n\n[Portable volleyball net →](/go/volleyball-net/) — 32-ft set with adjustable steel poles.\n\n[Full volleyball gear guide →](/what-to-buy/volleyball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
