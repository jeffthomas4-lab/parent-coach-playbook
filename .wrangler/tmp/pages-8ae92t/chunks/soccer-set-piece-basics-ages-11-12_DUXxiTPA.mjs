globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Set pieces are organized chances to score. This drill teaches two basic plays: the near-post corner and the direct free kick.</p>\n<p><strong>Equipment needed:</strong> One goal, 2-3 soccer balls, cones, 8 kids (6 attackers, 1 defender, 1 keeper).</p>\n<p><strong>Setup:</strong> Mark a corner flag area and a free-kick area 20 yards out.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>First part (10 minutes): Corner kick play. Kicker stands at corner. Four attackers in box. One defender. Kicker sends a ball to the near post. Attackers try to score. Do 5 reps.</li>\n<li>Second part (10 minutes): Free kick. Kicker stands 20 yards out. Five attackers in box. One defender. Kicker shoots or passes. Attackers finish. Do 5 reps.</li>\n</ol>\n<p><strong>What to look for:</strong> Communication and movement. On the corner, do attackers know where the ball is going? On the free kick, do they time their runs?</p>\n<p><strong>Variation:</strong> For younger kids (11), use just the corner (simpler). For older kids (12), add variations: near post, far post, short corner, different free-kick heights.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size4/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 4 soccer ball →</a> — right size for ages 8–12.</p>\n<p><a href=\"/go/soccer-cones-12pk/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Disc cones (50-pack) →</a> — flat cones for gates, grids, and boundary markers.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Set-Piece Basics","summary":"Practice one corner kick and one free kick play. 20 minutes. Ages 11-12.","sport":"soccer","ages":["11-12"],"focus":"situational","layer":"situational","fundamental":"set-pieces","progression":"build","illustrationBrief":"Attacking corner and free kick formations","publishedAt":"2026-03-25T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":7,"originalityGrade":7,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Two plays in 20 minutes is tight but workable."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-set-piece-basics-ages-11-12.md";
				const url = undefined;
				function rawContent() {
					return "\nSet pieces are organized chances to score. This drill teaches two basic plays: the near-post corner and the direct free kick.\n\n**Equipment needed:** One goal, 2-3 soccer balls, cones, 8 kids (6 attackers, 1 defender, 1 keeper).\n\n**Setup:** Mark a corner flag area and a free-kick area 20 yards out.\n\n**How to run it:**\n\n1. First part (10 minutes): Corner kick play. Kicker stands at corner. Four attackers in box. One defender. Kicker sends a ball to the near post. Attackers try to score. Do 5 reps.\n2. Second part (10 minutes): Free kick. Kicker stands 20 yards out. Five attackers in box. One defender. Kicker shoots or passes. Attackers finish. Do 5 reps.\n\n**What to look for:** Communication and movement. On the corner, do attackers know where the ball is going? On the free kick, do they time their runs?\n\n**Variation:** For younger kids (11), use just the corner (simpler). For older kids (12), add variations: near post, far post, short corner, different free-kick heights.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 4 soccer ball →](/go/soccer-ball-size4/) — right size for ages 8–12.\n\n[Disc cones (50-pack) →](/go/soccer-cones-12pk/) — flat cones for gates, grids, and boundary markers.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
