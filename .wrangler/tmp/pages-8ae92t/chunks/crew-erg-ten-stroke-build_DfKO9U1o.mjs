globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The erg is where rowing is built. Start every session with a controlled ten-stroke warm-up.</p>\n<p><strong>Equipment needed:</strong> A Concept2 (or comparable) erg, set to damper 4.</p>\n<p><strong>Setup:</strong> Rower seated, feet strapped, hands on the handle.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li><strong>Strokes 1-3:</strong> Arms-only. Hands move; body stays.</li>\n<li><strong>Strokes 4-6:</strong> Arms and back. Hinge from the hips after the hands clear the knees.</li>\n<li><strong>Strokes 7-10:</strong> Full stroke. Legs drive first, then back, then arms.</li>\n<li>Hold a 24-stroke-per-minute rate. Don’t sprint.</li>\n</ol>\n<p><strong>What to look for:</strong> Smooth sequencing on the drive — legs, then back, then arms. On the recovery, reverse it: arms out, body forward, knees up.</p>\n<p><strong>Variation:</strong> Do the same drill in reverse — start with full strokes, regress to arms-only — as a cool-down.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/resistance-bands-set/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Resistance band set →</a> — land-based strength and conditioning supplement.</p>\n<p><a href=\"/what-to-buy/crew/\">Full crew gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Erg Ten-Stroke Build","summary":"Warm up the rowing motion on the erg. Ten strokes, building intensity. Ages 13-14.","sport":"crew","age":"13-14","ages":["13-14"],"focus":"warm-up","layer":"foundations","fundamental":"warm-up","progression":"intro","illustrationBrief":"A young rower on a Concept2 erg, taking a slow controlled stroke with arms extended and knees compressed.","publishedAt":"2026-05-12T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":6,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-12T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Generated as part of the per-sport content baseline. Voice may need a Jeff pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/crew-erg-ten-stroke-build.md";
				const url = undefined;
				function rawContent() {
					return "\nThe erg is where rowing is built. Start every session with a controlled ten-stroke warm-up.\n\n**Equipment needed:** A Concept2 (or comparable) erg, set to damper 4.\n\n**Setup:** Rower seated, feet strapped, hands on the handle.\n\n**How to run it:**\n\n1. **Strokes 1-3:** Arms-only. Hands move; body stays.\n2. **Strokes 4-6:** Arms and back. Hinge from the hips after the hands clear the knees.\n3. **Strokes 7-10:** Full stroke. Legs drive first, then back, then arms.\n4. Hold a 24-stroke-per-minute rate. Don't sprint.\n\n**What to look for:** Smooth sequencing on the drive — legs, then back, then arms. On the recovery, reverse it: arms out, body forward, knees up.\n\n**Variation:** Do the same drill in reverse — start with full strokes, regress to arms-only — as a cool-down.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Resistance band set →](/go/resistance-bands-set/) — land-based strength and conditioning supplement.\n\n[Full crew gear guide →](/what-to-buy/crew/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
