globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A squad that counts together moves together. This drill is a warm-up and a unity check.</p>\n<p><strong>Equipment needed:</strong> Open space, the squad.</p>\n<p><strong>Setup:</strong> Squad in formation.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Captain calls “ready, OK!” to start.</li>\n<li>Squad counts “one-two-three-four, five-six-seven-eight” out loud, hitting a motion on each count.</li>\n<li>Motions: 1=T, 2=high-V, 3=T, 4=low-V, 5=T, 6=clap, 7=daggers, 8=clean position.</li>\n<li>Three full eight-counts.</li>\n</ol>\n<p><strong>What to look for:</strong> Volume is even across the squad. If one or two voices dominate, the others aren’t committed. All motions hit at the same instant.</p>\n<p><strong>Variation:</strong> Run it again with no voices — only motions on the count. Tests whether the timing is internalized or dependent on calling out.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/cheer-shoes-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth cheer shoes →</a> — lightweight split-sole shoes for stunts and tumbling.</p>\n<p><a href=\"/what-to-buy/cheer/\">Full cheer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Count-Out Timing","summary":"The whole squad counts out a routine together. Ten counts. Ages 8-14.","sport":"cheer","age":"8-10","ages":["8-10","11-12","13-14"],"focus":"culture","layer":"skills","fundamental":"warm-up","progression":"build","illustrationBrief":"A row of cheerleaders in stance counting out a routine together with sharp arm motions.","publishedAt":"2026-05-12T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":6,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-12T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Generated as part of the per-sport content baseline. Voice may need a Jeff pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/cheer-count-out-timing.md";
				const url = undefined;
				function rawContent() {
					return "\nA squad that counts together moves together. This drill is a warm-up and a unity check.\n\n**Equipment needed:** Open space, the squad.\n\n**Setup:** Squad in formation.\n\n**How to run it:**\n\n1. Captain calls \"ready, OK!\" to start.\n2. Squad counts \"one-two-three-four, five-six-seven-eight\" out loud, hitting a motion on each count.\n3. Motions: 1=T, 2=high-V, 3=T, 4=low-V, 5=T, 6=clap, 7=daggers, 8=clean position.\n4. Three full eight-counts.\n\n**What to look for:** Volume is even across the squad. If one or two voices dominate, the others aren't committed. All motions hit at the same instant.\n\n**Variation:** Run it again with no voices — only motions on the count. Tests whether the timing is internalized or dependent on calling out.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth cheer shoes →](/go/cheer-shoes-youth/) — lightweight split-sole shoes for stunts and tumbling.\n\n[Full cheer gear guide →](/what-to-buy/cheer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
