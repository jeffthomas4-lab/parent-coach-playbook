globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The vault is won at the run-up. A consistent approach makes a consistent vault.</p>\n<p><strong>Equipment needed:</strong> A vault runway, vault, springboard. Chalk or tape to mark steps.</p>\n<p><strong>Setup:</strong> Gymnast does a comfortable run-up and a coach marks where each foot lands. The pattern becomes the template.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Gymnast walks back to the start mark.</li>\n<li>Sprint full speed, hit the marked steps.</li>\n<li>At the springboard, just touch — no vault yet.</li>\n<li>Five reps. Steps should land on the same marks each time.</li>\n<li>Once consistent, add the vault.</li>\n</ol>\n<p><strong>What to look for:</strong> Acceleration through the run. Don’t slow down at the springboard. Same number of steps every time (typically 8-12 for ages 11-14).</p>\n<p><strong>Variation:</strong> Have a coach hold a stopwatch and time the run from start mark to springboard. Aim for consistency within 0.2 seconds across five reps.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/resistance-bands-set/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Resistance band set →</a> — for conditioning, stretching, and mobility work.</p>\n<p><a href=\"/what-to-buy/gymnastics/\">Full gymnastics gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Vault Run-Up Tempo","summary":"Mark the run-up steps and match the tempo across five reps. Ages 11-14.","sport":"gymnastics","age":"11-12","ages":["11-12","13-14"],"focus":"fundamentals","layer":"skills","fundamental":"running-form","progression":"build","illustrationBrief":"A young gymnast sprinting toward a vault with the spring board and vault visible at the end of the runway.","publishedAt":"2026-05-12T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":6,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-12T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Generated as part of the per-sport content baseline. Voice may need a Jeff pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/gymnastics-vault-run-up-tempo.md";
				const url = undefined;
				function rawContent() {
					return "\nThe vault is won at the run-up. A consistent approach makes a consistent vault.\n\n**Equipment needed:** A vault runway, vault, springboard. Chalk or tape to mark steps.\n\n**Setup:** Gymnast does a comfortable run-up and a coach marks where each foot lands. The pattern becomes the template.\n\n**How to run it:**\n\n1. Gymnast walks back to the start mark.\n2. Sprint full speed, hit the marked steps.\n3. At the springboard, just touch — no vault yet.\n4. Five reps. Steps should land on the same marks each time.\n5. Once consistent, add the vault.\n\n**What to look for:** Acceleration through the run. Don't slow down at the springboard. Same number of steps every time (typically 8-12 for ages 11-14).\n\n**Variation:** Have a coach hold a stopwatch and time the run from start mark to springboard. Aim for consistency within 0.2 seconds across five reps.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Resistance band set →](/go/resistance-bands-set/) — for conditioning, stretching, and mobility work.\n\n[Full gymnastics gear guide →](/what-to-buy/gymnastics/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
