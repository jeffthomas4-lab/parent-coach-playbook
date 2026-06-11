globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Sharp motions sell every cheer. Sloppy motions read amateur. This drill builds the snap.</p>\n<p><strong>Equipment needed:</strong> Open space.</p>\n<p><strong>Setup:</strong> Cheerleader in a stance, arms relaxed.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>On “one”: T motion (arms straight out to the sides).</li>\n<li>On “two”: High-V (arms at 45 degrees up).</li>\n<li>On “three”: T again.</li>\n<li>On “four”: Low-V (arms at 45 degrees down).</li>\n<li>Reset. Repeat eight times.</li>\n</ol>\n<p><strong>What to look for:</strong> Hard stops at each position. Fists closed. Elbows locked. No wobble between positions — the arms snap from one to the next.</p>\n<p><strong>Variation:</strong> Run the drill with eyes closed for the last four reps. Forces muscle memory.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/cheer-shoes-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth cheer shoes →</a> — lightweight split-sole shoes for stunts and tumbling.</p>\n<p><a href=\"/what-to-buy/cheer/\">Full cheer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Motion Drill: T to High-V","summary":"Snap clean motions on the count. T, high-V, T, low-V. Ages 8-12.","sport":"cheer","age":"8-10","ages":["8-10","11-12"],"focus":"fundamentals","layer":"foundations","fundamental":"warm-up","progression":"intro","illustrationBrief":"A young cheerleader holding a high-V motion with arms extended at 45 degrees above the shoulders.","publishedAt":"2026-05-12T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":6,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-12T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Generated as part of the per-sport content baseline. Voice may need a Jeff pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/cheer-motion-drill-t-to-high-v.md";
				const url = undefined;
				function rawContent() {
					return "\nSharp motions sell every cheer. Sloppy motions read amateur. This drill builds the snap.\n\n**Equipment needed:** Open space.\n\n**Setup:** Cheerleader in a stance, arms relaxed.\n\n**How to run it:**\n\n1. On \"one\": T motion (arms straight out to the sides).\n2. On \"two\": High-V (arms at 45 degrees up).\n3. On \"three\": T again.\n4. On \"four\": Low-V (arms at 45 degrees down).\n5. Reset. Repeat eight times.\n\n**What to look for:** Hard stops at each position. Fists closed. Elbows locked. No wobble between positions — the arms snap from one to the next.\n\n**Variation:** Run the drill with eyes closed for the last four reps. Forces muscle memory.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth cheer shoes →](/go/cheer-shoes-youth/) — lightweight split-sole shoes for stunts and tumbling.\n\n[Full cheer gear guide →](/what-to-buy/cheer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
