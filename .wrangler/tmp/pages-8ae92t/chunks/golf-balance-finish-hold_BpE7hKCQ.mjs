globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>If you can’t hold the finish, you swung off-balance. Simple as that.</p>\n<p><strong>Equipment needed:</strong> Any club, ten balls (or none — air swings work).</p>\n<p><strong>Setup:</strong> Range tee or open grass.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Take a normal swing.</li>\n<li>Freeze the finish: weight on the front foot, hips facing the target, back foot on the toe.</li>\n<li>Hold for three seconds out loud — “one, two, three.”</li>\n<li>If they can’t, the swing was too aggressive or too off-line.</li>\n<li>Ten reps.</li>\n</ol>\n<p><strong>What to look for:</strong> The back foot up on the toe, not flat. The body facing the target, not still sideways. If the kid is teetering, they’re not getting through the ball.</p>\n<p><strong>Variation:</strong> Try it with eyes closed for the last few reps. Forces real balance instead of visual compensation.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/agility-cones/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Agility cones →</a> — useful for alignment and target drills.</p>\n<p><a href=\"/what-to-buy/golf/\">Full golf gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Balance Finish Hold","summary":"Hold the finish position for three seconds. Reveals balance flaws. Ages 8-14.","sport":"golf","age":"8-10","ages":["8-10","11-12","13-14"],"focus":"fundamentals","layer":"foundations","fundamental":"stance","progression":"intro","illustrationBrief":"A young golfer holding the finish position after a swing: hips facing the target, weight on the front foot.","publishedAt":"2026-05-12T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":6,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-12T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Generated as part of the per-sport content baseline. Voice may need a Jeff pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/golf-balance-finish-hold.md";
				const url = undefined;
				function rawContent() {
					return "\nIf you can't hold the finish, you swung off-balance. Simple as that.\n\n**Equipment needed:** Any club, ten balls (or none — air swings work).\n\n**Setup:** Range tee or open grass.\n\n**How to run it:**\n\n1. Take a normal swing.\n2. Freeze the finish: weight on the front foot, hips facing the target, back foot on the toe.\n3. Hold for three seconds out loud — \"one, two, three.\"\n4. If they can't, the swing was too aggressive or too off-line.\n5. Ten reps.\n\n**What to look for:** The back foot up on the toe, not flat. The body facing the target, not still sideways. If the kid is teetering, they're not getting through the ball.\n\n**Variation:** Try it with eyes closed for the last few reps. Forces real balance instead of visual compensation.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Agility cones →](/go/agility-cones/) — useful for alignment and target drills.\n\n[Full golf gear guide →](/what-to-buy/golf/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
