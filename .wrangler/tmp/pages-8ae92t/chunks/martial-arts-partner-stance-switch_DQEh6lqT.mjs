globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Stance switches build the ability to change direction mid-fight. This is the foundation.</p>\n<p><strong>Equipment needed:</strong> A mat. Two students.</p>\n<p><strong>Setup:</strong> Both students face each other in a left-foot-forward fighting stance.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>On “one,” both students slide the back foot forward and the front foot back — switching to right-foot-forward.</li>\n<li>On “two,” they switch back.</li>\n<li>Six switches total. Hands stay up the whole time.</li>\n<li>Increase the count speed each round.</li>\n</ol>\n<p><strong>What to look for:</strong> Feet should stay shoulder-width apart. If a kid’s feet get crossed or too narrow, they’ll lose balance.</p>\n<p><strong>Variation:</strong> Add a quick punch on each switch. Reinforces that the stance change is a position from which to attack, not just a drill.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/resistance-bands-set/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Resistance band set →</a> — for flexibility, mobility, and conditioning work.</p>\n<p><a href=\"/what-to-buy/martial-arts/\">Full martial arts gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Partner Stance Switch","summary":"Two students switch fighting stances on a count. Six reps. Ages 8-12.","sport":"martial-arts","age":"8-10","ages":["8-10","11-12"],"focus":"fundamentals","layer":"foundations","fundamental":"stance","progression":"intro","illustrationBrief":"Two young martial-arts students in fighting stances mirroring each other on a mat.","publishedAt":"2026-05-12T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":6,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-12T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Generated as part of the per-sport content baseline. Voice may need a Jeff pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/martial-arts-partner-stance-switch.md";
				const url = undefined;
				function rawContent() {
					return "\nStance switches build the ability to change direction mid-fight. This is the foundation.\n\n**Equipment needed:** A mat. Two students.\n\n**Setup:** Both students face each other in a left-foot-forward fighting stance.\n\n**How to run it:**\n\n1. On \"one,\" both students slide the back foot forward and the front foot back — switching to right-foot-forward.\n2. On \"two,\" they switch back.\n3. Six switches total. Hands stay up the whole time.\n4. Increase the count speed each round.\n\n**What to look for:** Feet should stay shoulder-width apart. If a kid's feet get crossed or too narrow, they'll lose balance.\n\n**Variation:** Add a quick punch on each switch. Reinforces that the stance change is a position from which to attack, not just a drill.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Resistance band set →](/go/resistance-bands-set/) — for flexibility, mobility, and conditioning work.\n\n[Full martial arts gear guide →](/what-to-buy/martial-arts/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
