globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Most amateur misses come from bad alignment, not bad swings. This drill makes proper setup a habit.</p>\n<p><strong>Equipment needed:</strong> Two alignment sticks (or two clubs), a target down the range.</p>\n<p><strong>Setup:</strong> Lay one stick on the ground pointed at the target. Lay the second stick parallel to the first, six inches inside (closer to the player’s feet).</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Step in so toes are aligned with the inner stick.</li>\n<li>Ball sits on the outer-stick line.</li>\n<li>Take a normal swing. The stance is built before the swing starts.</li>\n<li>Ten reps. Move the target every few reps so the kid has to re-align.</li>\n</ol>\n<p><strong>What to look for:</strong> Feet, hips, and shoulders all parallel to the stick. Most kids aim too far right (for righties) by closing the shoulders.</p>\n<p><strong>Variation:</strong> Remove the sticks and see if the kid still aligns the same way. Builds the eye for square setup.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/agility-cones/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Agility cones →</a> — useful for alignment and target drills.</p>\n<p><a href=\"/what-to-buy/golf/\">Full golf gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Alignment Stick Stance","summary":"Set up parallel to the target line every time. Ten reps. Ages 8-12.","sport":"golf","age":"8-10","ages":["8-10","11-12"],"focus":"fundamentals","layer":"foundations","fundamental":"stance","progression":"intro","illustrationBrief":"A young golfer using two alignment sticks on the ground to set up a square stance to the target.","publishedAt":"2026-05-12T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":6,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-12T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Generated as part of the per-sport content baseline. Voice may need a Jeff pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/golf-alignment-stick-stance.md";
				const url = undefined;
				function rawContent() {
					return "\nMost amateur misses come from bad alignment, not bad swings. This drill makes proper setup a habit.\n\n**Equipment needed:** Two alignment sticks (or two clubs), a target down the range.\n\n**Setup:** Lay one stick on the ground pointed at the target. Lay the second stick parallel to the first, six inches inside (closer to the player's feet).\n\n**How to run it:**\n\n1. Step in so toes are aligned with the inner stick.\n2. Ball sits on the outer-stick line.\n3. Take a normal swing. The stance is built before the swing starts.\n4. Ten reps. Move the target every few reps so the kid has to re-align.\n\n**What to look for:** Feet, hips, and shoulders all parallel to the stick. Most kids aim too far right (for righties) by closing the shoulders.\n\n**Variation:** Remove the sticks and see if the kid still aligns the same way. Builds the eye for square setup.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Agility cones →](/go/agility-cones/) — useful for alignment and target drills.\n\n[Full golf gear guide →](/what-to-buy/golf/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
