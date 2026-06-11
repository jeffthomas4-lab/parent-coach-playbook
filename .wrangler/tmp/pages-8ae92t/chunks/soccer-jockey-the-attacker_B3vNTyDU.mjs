globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Jockeying is active defending. The defender moves toward the attacker while staying in control, ready to react to their move. Not diving. Not standing still. Active positioning.</p>\n<p><strong>What you need:</strong> 1 soccer ball, 2 kids, 3 cones marking a 15x15 grid.</p>\n<p><strong>Setup:</strong> Attacker and defender start inside the grid. Attacker has the ball.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Using Drop, Show, Stay, Win cue: drop the back foot to a staggered stance, show one direction forcing the attacker that way, stay patient don’t dive in, win the ball at the right moment.</li>\n<li>Defender jockeys forward, staying on their feet, in a staggered stance.</li>\n<li>Attacker dribbles using Touch, Look, Push, Go.</li>\n<li>Defender stays close but doesn’t tackle yet.</li>\n<li>Play for 30 seconds. Then switch roles.</li>\n</ol>\n<p><strong>What to watch:</strong> Is the defender in a low staggered stance? Or upright and on their heels?</p>\n<p><strong>If they’re struggling:</strong> Make the grid bigger. Less pressure.</p>\n<p><strong>If they’ve got it:</strong> Shrink the grid to 12x12. Tighter space makes defending harder.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size4/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 4 soccer ball →</a> — right size for ages 8–12.</p>\n<p><a href=\"/go/soccer-cones-12pk/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Disc cones (50-pack) →</a> — flat cones for gates, grids, and boundary markers.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Jockey the Attacker","summary":"Defender closes down the attacker while staying on their feet. 10 minutes. Ages 8-10.","sport":"soccer","ages":["8-10"],"fundamental":"defending","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Defender moving sideways toward an attacker with the ball, staying upright and ready.","editorial":{"qualityGrade":7,"originalityGrade":7,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Step 1 mashes the cue list with steps; could split for clarity. Soccer vocab correct."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-jockey-the-attacker.md";
				const url = undefined;
				function rawContent() {
					return "\nJockeying is active defending. The defender moves toward the attacker while staying in control, ready to react to their move. Not diving. Not standing still. Active positioning.\n\n**What you need:** 1 soccer ball, 2 kids, 3 cones marking a 15x15 grid.\n\n**Setup:** Attacker and defender start inside the grid. Attacker has the ball.\n\n**How to run it:**\n\n1. Using Drop, Show, Stay, Win cue: drop the back foot to a staggered stance, show one direction forcing the attacker that way, stay patient don't dive in, win the ball at the right moment.\n2. Defender jockeys forward, staying on their feet, in a staggered stance.\n3. Attacker dribbles using Touch, Look, Push, Go.\n4. Defender stays close but doesn't tackle yet.\n5. Play for 30 seconds. Then switch roles.\n\n**What to watch:** Is the defender in a low staggered stance? Or upright and on their heels?\n\n**If they're struggling:** Make the grid bigger. Less pressure.\n\n**If they've got it:** Shrink the grid to 12x12. Tighter space makes defending harder.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 4 soccer ball →](/go/soccer-ball-size4/) — right size for ages 8–12.\n\n[Disc cones (50-pack) →](/go/soccer-cones-12pk/) — flat cones for gates, grids, and boundary markers.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
