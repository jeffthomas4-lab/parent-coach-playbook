globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The freestyle kick is the engine. Most kids try to kick from the knees and bend their legs. The right kick comes from the hips, with mostly-straight legs. The kickboard isolates the kick so the kid can focus on it.</p>\n<p><strong>What you need:</strong> A kickboard, a pool with a shallow end.</p>\n<p><strong>Setup:</strong> Kid in the shallow end holding a kickboard out front.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Body floats horizontally with the kickboard supporting the upper body.</li>\n<li>Legs straight (slight knee bend), feet relaxed.</li>\n<li>Flutter kick from the hips. Small, fast kicks. Toes pointed.</li>\n<li>Kick across the pool (or 25 feet).</li>\n<li>Rest. Do 4 trips.</li>\n</ol>\n<p><strong>What to watch:</strong> Knee bend. If the legs bend a lot at the knees, the kick is from the knees. The kick should be from the hips with mostly straight legs.</p>\n<p><strong>If they’re struggling:</strong> Use a smaller pool or shallower water. Or kick while holding the wall instead of a board.</p>\n<p><strong>If they’ve got it:</strong> Drop the kickboard. Kick with arms in streamline (overhead, hands stacked).</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/swim-goggles-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth swim goggles →</a> — Speedo Hydrospex, no-fog, fits ages 6–14.</p>\n<p><a href=\"/what-to-buy/swimming/\">Full swimming gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Freestyle Kick on a Board","summary":"Hold a kickboard and practice the freestyle flutter kick. 10 minutes. Ages 5-7.","sport":"swimming","ages":["5-7"],"fundamental":"freestyle","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Young swimmer holding a kickboard with both hands, body horizontal in the water, flutter kicking with straight legs from the hips.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Flutter kick from hips; clean."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/swimming-freestyle-kick-on-board.md";
				const url = undefined;
				function rawContent() {
					return "\nThe freestyle kick is the engine. Most kids try to kick from the knees and bend their legs. The right kick comes from the hips, with mostly-straight legs. The kickboard isolates the kick so the kid can focus on it.\n\n**What you need:** A kickboard, a pool with a shallow end.\n\n**Setup:** Kid in the shallow end holding a kickboard out front.\n\n**How to run it:**\n\n1. Body floats horizontally with the kickboard supporting the upper body.\n2. Legs straight (slight knee bend), feet relaxed.\n3. Flutter kick from the hips. Small, fast kicks. Toes pointed.\n4. Kick across the pool (or 25 feet).\n5. Rest. Do 4 trips.\n\n**What to watch:** Knee bend. If the legs bend a lot at the knees, the kick is from the knees. The kick should be from the hips with mostly straight legs.\n\n**If they're struggling:** Use a smaller pool or shallower water. Or kick while holding the wall instead of a board.\n\n**If they've got it:** Drop the kickboard. Kick with arms in streamline (overhead, hands stacked).\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth swim goggles →](/go/swim-goggles-youth/) — Speedo Hydrospex, no-fog, fits ages 6–14.\n\n[Full swimming gear guide →](/what-to-buy/swimming/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
