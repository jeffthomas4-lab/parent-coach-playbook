globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A high press means attacking the player with the ball immediately. This drill teaches trigger recognition: when the pass is made, when to close down.</p>\n<p><strong>Equipment needed:</strong> One soccer ball, cones to mark a 50-yard zone, 8 kids (4 attackers, 4 defenders).</p>\n<p><strong>Setup:</strong> Mark a 40-by-40-yard square. Defenders start in their defensive half. Attackers start in their attacking half, with one attacker at the top ready to press.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Defenders pass the ball back and sideways in their half.</li>\n<li>The moment a defender receives the ball in the open, the nearest attacker presses (runs at them to close down).</li>\n<li>If the attacker wins the ball, defenders reset and attack the other direction.</li>\n<li>If the defender keeps the ball, play continues.</li>\n<li>Play for 25 minutes continuous.</li>\n</ol>\n<p><strong>What to look for:</strong> Press timing. Too early and the defender has space. Too late and the ball is gone. Also watch if the attacker is closing down at the right angle (cutting off the passing lane, not just running at the player).</p>\n<p><strong>Variation:</strong> For younger kids (13), press only in certain zones. For older kids (14), add a trigger call (coach calls “Press now”) so they learn to react to signal.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size5/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 5 soccer ball →</a> — regulation ball for ages 13 and up.</p>\n<p><a href=\"/go/soccer-cones-12pk/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Disc cones (50-pack) →</a> — flat cones for gates, grids, and boundary markers.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"High-Press Triggers","summary":"Practice pressing the ball when the opponent receives it. 25 minutes. Ages 13-14+.","sport":"soccer","ages":["13-14"],"focus":"situational","layer":"skills","fundamental":"defending","progression":"refine","illustrationBrief":"Defensive pressure shapes pressing triggers","publishedAt":"2026-03-31T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":7,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Setup says 50-yard zone but mark a 40-by-40 square; minor inconsistency. Soccer vocab correct."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-high-press-triggers-ages-13-14.md";
				const url = undefined;
				function rawContent() {
					return "\nA high press means attacking the player with the ball immediately. This drill teaches trigger recognition: when the pass is made, when to close down.\n\n**Equipment needed:** One soccer ball, cones to mark a 50-yard zone, 8 kids (4 attackers, 4 defenders).\n\n**Setup:** Mark a 40-by-40-yard square. Defenders start in their defensive half. Attackers start in their attacking half, with one attacker at the top ready to press.\n\n**How to run it:**\n\n1. Defenders pass the ball back and sideways in their half.\n2. The moment a defender receives the ball in the open, the nearest attacker presses (runs at them to close down).\n3. If the attacker wins the ball, defenders reset and attack the other direction.\n4. If the defender keeps the ball, play continues.\n5. Play for 25 minutes continuous.\n\n**What to look for:** Press timing. Too early and the defender has space. Too late and the ball is gone. Also watch if the attacker is closing down at the right angle (cutting off the passing lane, not just running at the player).\n\n**Variation:** For younger kids (13), press only in certain zones. For older kids (14), add a trigger call (coach calls \"Press now\") so they learn to react to signal.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 5 soccer ball →](/go/soccer-ball-size5/) — regulation ball for ages 13 and up.\n\n[Disc cones (50-pack) →](/go/soccer-cones-12pk/) — flat cones for gates, grids, and boundary markers.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
