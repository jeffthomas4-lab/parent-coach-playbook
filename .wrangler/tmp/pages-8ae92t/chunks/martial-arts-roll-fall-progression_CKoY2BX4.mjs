globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Knowing how to fall is more useful than knowing how to throw. Every grappling-adjacent art needs this.</p>\n<p><strong>Equipment needed:</strong> Mats.</p>\n<p><strong>Setup:</strong> Student standing on the mat.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li><strong>Phase 1 — From knees.</strong> Tuck chin, place one hand on the mat, roll over the shoulder diagonally. Five reps.</li>\n<li><strong>Phase 2 — Standing forward roll.</strong> Same motion but starting upright. Tuck, place hand, roll. Five reps each side.</li>\n<li><strong>Phase 3 — Backward break-fall.</strong> Sit, fall back, slap the mat with both hands as you land. Ten reps.</li>\n</ol>\n<p><strong>What to look for:</strong> The chin tucks every time. Eyes look at the belt. Heads should never hit the mat.</p>\n<p><strong>Variation:</strong> Progress to a backward roll after the breakfall is solid. Most kids find it harder than forward.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/resistance-bands-set/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Resistance band set →</a> — for flexibility, mobility, and conditioning work.</p>\n<p><a href=\"/what-to-buy/martial-arts/\">Full martial arts gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Roll-Fall Progression","summary":"Learn to fall safely. Three progressions over five minutes. Ages 8-12.","sport":"martial-arts","age":"8-10","ages":["8-10","11-12"],"focus":"fundamentals","layer":"foundations","fundamental":"footwork","progression":"intro","illustrationBrief":"A young student tucking and rolling forward on a martial-arts mat, arms tucked in.","publishedAt":"2026-05-12T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":6,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-12T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Generated as part of the per-sport content baseline. Voice may need a Jeff pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/martial-arts-roll-fall-progression.md";
				const url = undefined;
				function rawContent() {
					return "\nKnowing how to fall is more useful than knowing how to throw. Every grappling-adjacent art needs this.\n\n**Equipment needed:** Mats.\n\n**Setup:** Student standing on the mat.\n\n**How to run it:**\n\n1. **Phase 1 — From knees.** Tuck chin, place one hand on the mat, roll over the shoulder diagonally. Five reps.\n2. **Phase 2 — Standing forward roll.** Same motion but starting upright. Tuck, place hand, roll. Five reps each side.\n3. **Phase 3 — Backward break-fall.** Sit, fall back, slap the mat with both hands as you land. Ten reps.\n\n**What to look for:** The chin tucks every time. Eyes look at the belt. Heads should never hit the mat.\n\n**Variation:** Progress to a backward roll after the breakfall is solid. Most kids find it harder than forward.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Resistance band set →](/go/resistance-bands-set/) — for flexibility, mobility, and conditioning work.\n\n[Full martial arts gear guide →](/what-to-buy/martial-arts/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
