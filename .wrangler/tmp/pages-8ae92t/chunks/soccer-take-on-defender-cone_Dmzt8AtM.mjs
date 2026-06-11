globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Now the defender doesn’t chase. They’re set. This teaches the attacker to read where the defender is set and go the opposite way. Speed and timing matter more than flashy moves.</p>\n<p><strong>What you need:</strong> 1 soccer ball, 3 cones. One cone marks the defender’s position.</p>\n<p><strong>Setup:</strong> Defender stands at a cone. Dribbler starts 15 feet away with the ball. Goal line is 10 feet past the defender.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Dribbler accelerates toward the defender using Touch, Look, Push, Go.</li>\n<li>At 3 feet away, the dribbler plants their outside foot and cuts the ball to the opposite side of the defender.</li>\n<li>Dribbler explodes past the defender toward the goal line.</li>\n<li>If the dribbler gets past, they’ve won. If the defender pokes the ball away, drill ends.</li>\n<li>4 attempts per player, then switch.</li>\n</ol>\n<p><strong>What to watch:</strong> Do they commit to the cut or hesitate? Hesitation gives the defender time to react.</p>\n<p><strong>If they’re struggling:</strong> Move the starting point closer to 10 feet. Slow the defender down by having them stand still without reaching.</p>\n<p><strong>If they’ve got it:</strong> Defender can now move to pressure. Dribbler has to read the movement and adjust.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size4/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 4 soccer ball →</a> — right size for ages 8–12.</p>\n<p><a href=\"/go/soccer-cones-12pk/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Disc cones (50-pack) →</a> — flat cones for gates, grids, and boundary markers.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Take On Defender at Cone","summary":"Dribbler uses a move to beat a defender stationed at a cone. 12 minutes. Ages 11-12.","sport":"soccer","ages":["11-12"],"fundamental":"dribbling","progression":"refine","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Dribbler approaching a defender who is positioned at a cone, preparing to execute a quick cut or push past them.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Read-the-defender framing avoids fancy-move pitfall."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-take-on-defender-cone.md";
				const url = undefined;
				function rawContent() {
					return "\nNow the defender doesn't chase. They're set. This teaches the attacker to read where the defender is set and go the opposite way. Speed and timing matter more than flashy moves.\n\n**What you need:** 1 soccer ball, 3 cones. One cone marks the defender's position.\n\n**Setup:** Defender stands at a cone. Dribbler starts 15 feet away with the ball. Goal line is 10 feet past the defender.\n\n**How to run it:**\n\n1. Dribbler accelerates toward the defender using Touch, Look, Push, Go.\n2. At 3 feet away, the dribbler plants their outside foot and cuts the ball to the opposite side of the defender.\n3. Dribbler explodes past the defender toward the goal line.\n4. If the dribbler gets past, they've won. If the defender pokes the ball away, drill ends.\n5. 4 attempts per player, then switch.\n\n**What to watch:** Do they commit to the cut or hesitate? Hesitation gives the defender time to react.\n\n**If they're struggling:** Move the starting point closer to 10 feet. Slow the defender down by having them stand still without reaching.\n\n**If they've got it:** Defender can now move to pressure. Dribbler has to read the movement and adjust.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 4 soccer ball →](/go/soccer-ball-size4/) — right size for ages 8–12.\n\n[Disc cones (50-pack) →](/go/soccer-cones-12pk/) — flat cones for gates, grids, and boundary markers.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
