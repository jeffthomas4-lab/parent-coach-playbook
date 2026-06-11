globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The release is where rowers lose speed. A clean tap-down keeps the boat moving.</p>\n<p><strong>Equipment needed:</strong> Boat or erg.</p>\n<p><strong>Setup:</strong> Rowing at low rate.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Take a normal stroke.</li>\n<li>At the finish, instead of feathering and recovering, press the hands DOWN to lift the blades cleanly out.</li>\n<li>THEN feather. Hands first, feather second. Two separate motions.</li>\n<li>Recover. Repeat for ten strokes.</li>\n</ol>\n<p><strong>What to look for:</strong> The blade should pop out of the water without splashing backward. If water sprays, the hands aren’t pressing down fast enough.</p>\n<p><strong>Variation:</strong> Exaggerate the tap-down — make the hands drop dramatically at the finish. Then dial it back to a natural motion.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/resistance-bands-set/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Resistance band set →</a> — land-based strength and conditioning supplement.</p>\n<p><a href=\"/what-to-buy/crew/\">Full crew gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Release Tap-Down","summary":"Practice the hand-press at the finish. Clean exits. Ages 11-14.","sport":"crew","age":"11-12","ages":["11-12","13-14"],"focus":"fundamentals","layer":"skills","fundamental":"positioning","progression":"build","illustrationBrief":"A young rower's hands tapping down at the finish of the stroke, blades just clearing the water.","publishedAt":"2026-05-12T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":6,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-12T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Generated as part of the per-sport content baseline. Voice may need a Jeff pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/crew-release-tap-down.md";
				const url = undefined;
				function rawContent() {
					return "\nThe release is where rowers lose speed. A clean tap-down keeps the boat moving.\n\n**Equipment needed:** Boat or erg.\n\n**Setup:** Rowing at low rate.\n\n**How to run it:**\n\n1. Take a normal stroke.\n2. At the finish, instead of feathering and recovering, press the hands DOWN to lift the blades cleanly out.\n3. THEN feather. Hands first, feather second. Two separate motions.\n4. Recover. Repeat for ten strokes.\n\n**What to look for:** The blade should pop out of the water without splashing backward. If water sprays, the hands aren't pressing down fast enough.\n\n**Variation:** Exaggerate the tap-down — make the hands drop dramatically at the finish. Then dial it back to a natural motion.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Resistance band set →](/go/resistance-bands-set/) — land-based strength and conditioning supplement.\n\n[Full crew gear guide →](/what-to-buy/crew/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
