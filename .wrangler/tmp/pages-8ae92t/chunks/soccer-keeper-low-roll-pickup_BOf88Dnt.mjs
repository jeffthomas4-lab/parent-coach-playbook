globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>This drill is for kids who want to play goalkeeper. Rolling balls come at keepers all the time. They have to bend down, stay soft with their hands, and pick it up cleanly.</p>\n<p><strong>What you need:</strong> A goal. A soccer ball. Open space.</p>\n<p><strong>Setup:</strong> Goalkeeper is in the goal. You stand 15 feet away with a ball.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Roll the ball slowly toward the keeper along the ground.</li>\n<li>Keeper watches the ball come (See).</li>\n<li>Keeper bends at the waist and knees, getting low.</li>\n<li>Keeper scoops the ball with soft hands, cushioning the rolling motion.</li>\n<li>Keeper holds the ball to their chest.</li>\n<li>Do 10 rolls.</li>\n</ol>\n<p><strong>What to watch:</strong> Are the hands soft and relaxed? Or tense and stiff? Soft hands catch cleanly. Stiff hands let it bounce away.</p>\n<p><strong>If they’re struggling:</strong> Roll slower. Get closer.</p>\n<p><strong>If they’ve got it:</strong> Roll from different angles. Not straight at them.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size4/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 4 soccer ball →</a> — right size for ages 8–12.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Keeper Low Roll Pickup","summary":"Goalkeeper picks up a rolling ball cleanly from the ground. 8 minutes. Ages 8-10.","sport":"soccer","ages":["8-10"],"fundamental":"goalkeeping","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Goalkeeper bending with soft hands to scoop a rolling ball from the ground.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Foundational keeper drill. Soccer vocab correct."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-keeper-low-roll-pickup.md";
				const url = undefined;
				function rawContent() {
					return "\nThis drill is for kids who want to play goalkeeper. Rolling balls come at keepers all the time. They have to bend down, stay soft with their hands, and pick it up cleanly.\n\n**What you need:** A goal. A soccer ball. Open space.\n\n**Setup:** Goalkeeper is in the goal. You stand 15 feet away with a ball.\n\n**How to run it:**\n\n1. Roll the ball slowly toward the keeper along the ground.\n2. Keeper watches the ball come (See).\n3. Keeper bends at the waist and knees, getting low.\n4. Keeper scoops the ball with soft hands, cushioning the rolling motion.\n5. Keeper holds the ball to their chest.\n6. Do 10 rolls.\n\n**What to watch:** Are the hands soft and relaxed? Or tense and stiff? Soft hands catch cleanly. Stiff hands let it bounce away.\n\n**If they're struggling:** Roll slower. Get closer.\n\n**If they've got it:** Roll from different angles. Not straight at them.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 4 soccer ball →](/go/soccer-ball-size4/) — right size for ages 8–12.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
