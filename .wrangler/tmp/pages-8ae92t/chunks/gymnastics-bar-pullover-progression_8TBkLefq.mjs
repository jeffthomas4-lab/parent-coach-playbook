globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The pullover is the entry-level skill that opens up the bars. Three steps gets there.</p>\n<p><strong>Equipment needed:</strong> A low bar (set at standing-reach height). A mat below.</p>\n<p><strong>Setup:</strong> Gymnast standing under the bar, hands gripping.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li><strong>Step 1 — Kick-up with feet.</strong> Jump up, kick legs up to the bar. Held position for two seconds. Five reps.</li>\n<li><strong>Step 2 — Pull and tuck.</strong> Pull chest to bar, tuck knees toward the bar, head tucks. Five reps.</li>\n<li><strong>Step 3 — Full pullover.</strong> Pull, tuck, and rotate over the bar until the hips rest on the bar.</li>\n</ol>\n<p><strong>What to look for:</strong> Active arms — chest stays close to the bar throughout. If the kid is hanging straight-armed, they’re not pulling.</p>\n<p><strong>Variation:</strong> Use a spotter at the hips for the first full pullover. Gradually remove the spot as the kid gets stronger.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/resistance-bands-set/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Resistance band set →</a> — for conditioning, stretching, and mobility work.</p>\n<p><a href=\"/what-to-buy/gymnastics/\">Full gymnastics gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Bar Pullover Progression","summary":"Three steps to build a clean pullover on the low bar. Ages 8-12.","sport":"gymnastics","age":"8-10","ages":["8-10","11-12"],"focus":"fundamentals","layer":"skills","fundamental":"conditioning","progression":"build","illustrationBrief":"A young gymnast at a low bar mid-pullover, hips rising toward the bar, head tucking.","publishedAt":"2026-05-12T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":6,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-12T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Generated as part of the per-sport content baseline. Voice may need a Jeff pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/gymnastics-bar-pullover-progression.md";
				const url = undefined;
				function rawContent() {
					return "\nThe pullover is the entry-level skill that opens up the bars. Three steps gets there.\n\n**Equipment needed:** A low bar (set at standing-reach height). A mat below.\n\n**Setup:** Gymnast standing under the bar, hands gripping.\n\n**How to run it:**\n\n1. **Step 1 — Kick-up with feet.** Jump up, kick legs up to the bar. Held position for two seconds. Five reps.\n2. **Step 2 — Pull and tuck.** Pull chest to bar, tuck knees toward the bar, head tucks. Five reps.\n3. **Step 3 — Full pullover.** Pull, tuck, and rotate over the bar until the hips rest on the bar.\n\n**What to look for:** Active arms — chest stays close to the bar throughout. If the kid is hanging straight-armed, they're not pulling.\n\n**Variation:** Use a spotter at the hips for the first full pullover. Gradually remove the spot as the kid gets stronger.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Resistance band set →](/go/resistance-bands-set/) — for conditioning, stretching, and mobility work.\n\n[Full gymnastics gear guide →](/what-to-buy/gymnastics/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
