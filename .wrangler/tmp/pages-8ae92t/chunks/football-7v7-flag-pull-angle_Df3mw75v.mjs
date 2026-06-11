globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Pulling flags is about angles, not speed. The defender who takes the right line beats the defender who runs hard but late.</p>\n<p><strong>Equipment needed:</strong> Flag belts for both players, a ball.</p>\n<p><strong>Setup:</strong> Ball carrier 15 yards downfield. Defender starts at a 45-degree angle, not directly behind.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Ball carrier runs straight, full speed.</li>\n<li>Defender runs at an angle that intercepts the carrier’s path, not where they currently are.</li>\n<li>Both hands reach for the flag — never one. One hand can be blocked easily.</li>\n<li>Repeat six times each side.</li>\n</ol>\n<p><strong>What to look for:</strong> The pursuit angle should be a triangle, not a straight line behind. If the defender ends up trailing, they took the wrong angle.</p>\n<p><strong>Variation:</strong> Add a cut by the ball carrier. Defender has to adjust the angle mid-run. Builds the habit of reading hips, not feet.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/football-rubber-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber football →</a> — Wilson youth rubber ball for rec and practice.</p>\n<p><a href=\"/what-to-buy/football-7v7/\">Full football 7v7 gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Flag-Pull Angle","summary":"Take the right angle to the ball carrier. Six reps each side. Ages 8-12.","sport":"football-7v7","age":"8-10","ages":["8-10","11-12"],"focus":"fundamentals","layer":"foundations","fundamental":"flag-pulling","progression":"intro","illustrationBrief":"A youth defender approaching a ball carrier at an angle with both hands reaching for the flag belt.","publishedAt":"2026-05-12T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":6,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-12T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Generated as part of the per-sport content baseline. Voice may need a Jeff pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/football-7v7-flag-pull-angle.md";
				const url = undefined;
				function rawContent() {
					return "\nPulling flags is about angles, not speed. The defender who takes the right line beats the defender who runs hard but late.\n\n**Equipment needed:** Flag belts for both players, a ball.\n\n**Setup:** Ball carrier 15 yards downfield. Defender starts at a 45-degree angle, not directly behind.\n\n**How to run it:**\n\n1. Ball carrier runs straight, full speed.\n2. Defender runs at an angle that intercepts the carrier's path, not where they currently are.\n3. Both hands reach for the flag — never one. One hand can be blocked easily.\n4. Repeat six times each side.\n\n**What to look for:** The pursuit angle should be a triangle, not a straight line behind. If the defender ends up trailing, they took the wrong angle.\n\n**Variation:** Add a cut by the ball carrier. Defender has to adjust the angle mid-run. Builds the habit of reading hips, not feet.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber football →](/go/football-rubber-youth/) — Wilson youth rubber ball for rec and practice.\n\n[Full football 7v7 gear guide →](/what-to-buy/football-7v7/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
