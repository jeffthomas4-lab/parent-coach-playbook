globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Going straight to full slide on a cold body is how backs get hurt. Half slide warms the engine.</p>\n<p><strong>Equipment needed:</strong> Boat or erg.</p>\n<p><strong>Setup:</strong> Standard rowing position.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Start at the finish (legs flat, body back, arms in).</li>\n<li>Recover only halfway up the slide — knees bent about 45 degrees.</li>\n<li>Drive back through. Twenty strokes at this length.</li>\n<li>Move to three-quarter slide for ten strokes.</li>\n<li>Full slide for the rest of the session.</li>\n</ol>\n<p><strong>What to look for:</strong> Smooth, controlled motion. No rushing the recovery. The hands and body should move at the same speed on the way up.</p>\n<p><strong>Variation:</strong> Add a pause at the half-slide position for two beats. Builds patience on the recovery.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/resistance-bands-set/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Resistance band set →</a> — land-based strength and conditioning supplement.</p>\n<p><a href=\"/what-to-buy/crew/\">Full crew gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Half-Slide Warm-Up","summary":"Row at half slide before going full. Five minutes. Ages 11-14.","sport":"crew","age":"11-12","ages":["11-12","13-14"],"focus":"warm-up","layer":"foundations","fundamental":"warm-up","progression":"intro","illustrationBrief":"Young rowers in a four taking half-slide strokes, knees only partially compressed.","publishedAt":"2026-05-12T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":6,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-12T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Generated as part of the per-sport content baseline. Voice may need a Jeff pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/crew-half-slide-warm-up.md";
				const url = undefined;
				function rawContent() {
					return "\nGoing straight to full slide on a cold body is how backs get hurt. Half slide warms the engine.\n\n**Equipment needed:** Boat or erg.\n\n**Setup:** Standard rowing position.\n\n**How to run it:**\n\n1. Start at the finish (legs flat, body back, arms in).\n2. Recover only halfway up the slide — knees bent about 45 degrees.\n3. Drive back through. Twenty strokes at this length.\n4. Move to three-quarter slide for ten strokes.\n5. Full slide for the rest of the session.\n\n**What to look for:** Smooth, controlled motion. No rushing the recovery. The hands and body should move at the same speed on the way up.\n\n**Variation:** Add a pause at the half-slide position for two beats. Builds patience on the recovery.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Resistance band set →](/go/resistance-bands-set/) — land-based strength and conditioning supplement.\n\n[Full crew gear guide →](/what-to-buy/crew/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
