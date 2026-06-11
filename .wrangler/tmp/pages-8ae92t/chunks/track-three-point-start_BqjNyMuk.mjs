globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Sprint races are won in the first 10 yards. The start matters. Three-point start (one hand down, two feet down) is the basic version. Build the position before adding starting blocks.</p>\n<p><strong>What you need:</strong> A track or flat surface, a coach to call the start.</p>\n<p><strong>Setup:</strong> Runner at the starting line.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Show the position: dominant foot forward (about a shoe length behind the line), other foot back, dominant hand on the ground beside the front foot.</li>\n<li>Weight loaded on the back leg. Hips up. Eyes down at the ground.</li>\n<li>Coach calls “set.” Runner lifts the hips so they’re slightly above the shoulders.</li>\n<li>Coach calls “go.” Runner explodes forward with the back leg.</li>\n<li>Sprint 20 yards. Walk back. Do 5 reps.</li>\n</ol>\n<p><strong>What to watch:</strong> First step direction. The first step should be forward, not up. Up means the runner stands tall too fast. Forward means they stay low and accelerate.</p>\n<p><strong>If they’re struggling:</strong> Drop the hand. Use a standing start.</p>\n<p><strong>If they’ve got it:</strong> Add starting blocks. Or add a partner racing to add competitive pressure.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/xc-trainers-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth running trainers →</a> — everyday training shoe for track and XC.</p>\n<p><a href=\"/what-to-buy/track-field/\">Full track field gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Three Point Start","summary":"First exposure to a sprint start without blocks. 10 minutes. Ages 11-12.","sport":"track-field","ages":["11-12"],"fundamental":"starts","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Runner crouched at the starting line with one hand on the ground, dominant foot forward, weight loaded on the back leg.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":true,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Three-point start before blocks; sensitive flag for sprint-start injury."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/track-three-point-start.md";
				const url = undefined;
				function rawContent() {
					return "\nSprint races are won in the first 10 yards. The start matters. Three-point start (one hand down, two feet down) is the basic version. Build the position before adding starting blocks.\n\n**What you need:** A track or flat surface, a coach to call the start.\n\n**Setup:** Runner at the starting line.\n\n**How to run it:**\n\n1. Show the position: dominant foot forward (about a shoe length behind the line), other foot back, dominant hand on the ground beside the front foot.\n2. Weight loaded on the back leg. Hips up. Eyes down at the ground.\n3. Coach calls \"set.\" Runner lifts the hips so they're slightly above the shoulders.\n4. Coach calls \"go.\" Runner explodes forward with the back leg.\n5. Sprint 20 yards. Walk back. Do 5 reps.\n\n**What to watch:** First step direction. The first step should be forward, not up. Up means the runner stands tall too fast. Forward means they stay low and accelerate.\n\n**If they're struggling:** Drop the hand. Use a standing start.\n\n**If they've got it:** Add starting blocks. Or add a partner racing to add competitive pressure.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth running trainers →](/go/xc-trainers-youth/) — everyday training shoe for track and XC.\n\n[Full track field gear guide →](/what-to-buy/track-field/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
