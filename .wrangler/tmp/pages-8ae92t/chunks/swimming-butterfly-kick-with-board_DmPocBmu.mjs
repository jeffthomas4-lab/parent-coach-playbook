globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Butterfly is the hardest stroke. The dolphin kick is its foundation. Both legs together, body undulating, kick from the core. Most kids try to flutter kick. The right kick is two legs as one.</p>\n<p><strong>What you need:</strong> A pool, kickboard.</p>\n<p><strong>Setup:</strong> Swimmer in the water with a kickboard.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Hold the kickboard with both hands, arms extended.</li>\n<li>Body undulates: chest down, hips up, then chest up, hips down. Continuous wave.</li>\n<li>Legs stay together. Both feet kick down, both feet kick up.</li>\n<li>Kick across the pool with the wave motion.</li>\n<li>Do 4 lengths with rest.</li>\n</ol>\n<p><strong>What to watch:</strong> Are the legs separating? They should stay together like a fish tail. Bands or kicking with a pool noodle between the ankles can help.</p>\n<p><strong>If they’re struggling:</strong> Do the dolphin kick on the back instead. Easier to feel the undulation.</p>\n<p><strong>If they’ve got it:</strong> Drop the kickboard. Streamline arms overhead. Or add a butterfly arm stroke.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/swim-goggles-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth swim goggles →</a> — Speedo Hydrospex, no-fog, fits ages 6–14.</p>\n<p><a href=\"/what-to-buy/swimming/\">Full swimming gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Butterfly Kick with Kickboard","summary":"Build the dolphin kick on a kickboard. 12 minutes. Ages 11-12.","sport":"swimming","ages":["11-12"],"fundamental":"butterfly","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Swimmer holding a kickboard with both hands, body undulating in the water, legs together moving up and down in a dolphin kick.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Dolphin kick on board; clean undulation cue."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/swimming-butterfly-kick-with-board.md";
				const url = undefined;
				function rawContent() {
					return "\nButterfly is the hardest stroke. The dolphin kick is its foundation. Both legs together, body undulating, kick from the core. Most kids try to flutter kick. The right kick is two legs as one.\n\n**What you need:** A pool, kickboard.\n\n**Setup:** Swimmer in the water with a kickboard.\n\n**How to run it:**\n\n1. Hold the kickboard with both hands, arms extended.\n2. Body undulates: chest down, hips up, then chest up, hips down. Continuous wave.\n3. Legs stay together. Both feet kick down, both feet kick up.\n4. Kick across the pool with the wave motion.\n5. Do 4 lengths with rest.\n\n**What to watch:** Are the legs separating? They should stay together like a fish tail. Bands or kicking with a pool noodle between the ankles can help.\n\n**If they're struggling:** Do the dolphin kick on the back instead. Easier to feel the undulation.\n\n**If they've got it:** Drop the kickboard. Streamline arms overhead. Or add a butterfly arm stroke.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth swim goggles →](/go/swim-goggles-youth/) — Speedo Hydrospex, no-fog, fits ages 6–14.\n\n[Full swimming gear guide →](/what-to-buy/swimming/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
