globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Numbered passing forces players to read the field quickly and make the right decision. It’s not random. Pass to the next number in sequence. Under pressure, that takes focus.</p>\n<p><strong>What you need:</strong> 1 soccer ball, 3 attackers, 2 defenders, 6 cones marking a 20x30 grid.</p>\n<p><strong>Setup:</strong> Attackers 1, 2, 3 start in the grid with the ball. Two defenders in the middle trying to intercept.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Player 1 passes to Player 2. Using Plant, Open, Strike, Follow.</li>\n<li>Player 2 receives and passes to Player 3.</li>\n<li>Player 3 receives and passes back to Player 1.</li>\n<li>Continuous sequence while defending team pressures.</li>\n<li>If attackers complete 10 passes without interception, they win. If defenders steal it, drill ends.</li>\n<li>Play 2 minutes, then switch roles.</li>\n</ol>\n<p><strong>What to watch:</strong> Do the attackers look for space before passing? Or do they just pass to the number regardless of pressure?</p>\n<p><strong>If they’re struggling:</strong> Remove one defender. Make it 3v1.</p>\n<p><strong>If they’ve got it:</strong> Add a third defender. Make it 3v3 and call out who receives each pass.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size4/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 4 soccer ball →</a> — right size for ages 8–12.</p>\n<p><a href=\"/go/soccer-cones-12pk/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Disc cones (50-pack) →</a> — flat cones for gates, grids, and boundary markers.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Numbered Passing 3v0","summary":"Three players pass in numerical order through defenders. 12 minutes. Ages 11-12.","sport":"soccer","ages":["11-12"],"fundamental":"passing","progression":"refine","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Three attackers with numbers on their jerseys passing among themselves in a defined sequence while avoiding defenders.","editorial":{"qualityGrade":7,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Title says 3v0 but setup uses 2 defenders; minor inconsistency. Soccer vocab correct."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-numbered-passing-3v0.md";
				const url = undefined;
				function rawContent() {
					return "\nNumbered passing forces players to read the field quickly and make the right decision. It's not random. Pass to the next number in sequence. Under pressure, that takes focus.\n\n**What you need:** 1 soccer ball, 3 attackers, 2 defenders, 6 cones marking a 20x30 grid.\n\n**Setup:** Attackers 1, 2, 3 start in the grid with the ball. Two defenders in the middle trying to intercept.\n\n**How to run it:**\n\n1. Player 1 passes to Player 2. Using Plant, Open, Strike, Follow.\n2. Player 2 receives and passes to Player 3.\n3. Player 3 receives and passes back to Player 1.\n4. Continuous sequence while defending team pressures.\n5. If attackers complete 10 passes without interception, they win. If defenders steal it, drill ends.\n6. Play 2 minutes, then switch roles.\n\n**What to watch:** Do the attackers look for space before passing? Or do they just pass to the number regardless of pressure?\n\n**If they're struggling:** Remove one defender. Make it 3v1.\n\n**If they've got it:** Add a third defender. Make it 3v3 and call out who receives each pass.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 4 soccer ball →](/go/soccer-ball-size4/) — right size for ages 8–12.\n\n[Disc cones (50-pack) →](/go/soccer-cones-12pk/) — flat cones for gates, grids, and boundary markers.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
