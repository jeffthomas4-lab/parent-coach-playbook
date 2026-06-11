globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>When the ball is lost, defenders have 2 seconds to recover shape. This drill trains that reaction. Defenders lose it, turn, and sprint back to form a line. Speed and organization matter.</p>\n<p><strong>What you need:</strong> 6 kids (3 defenders, 3 attackers), 1 ball, cones marking a half field.</p>\n<p><strong>Setup:</strong> Defenders have possession. Attackers are ready to counter. Goal line is marked.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Defenders pass the ball using Plant, Open, Strike, Follow.</li>\n<li>After 3 passes, attackers steal it (or you play a turnover).</li>\n<li>Immediately, defenders turn and sprint back using Drop, Show, Stay, Win.</li>\n<li>Defenders form a line between the ball and their goal.</li>\n<li>Attackers attack. Defenders defend the line.</li>\n<li>Play for 30 seconds. Then reset.</li>\n</ol>\n<p><strong>What to watch:</strong> How fast do defenders recover? Do they form a line or scatter?</p>\n<p><strong>If they’re struggling:</strong> Give defenders a 2-second head start before the attackers move.</p>\n<p><strong>If they’ve got it:</strong> Attackers get a faster counter. Defenders have less time to recover.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size4/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 4 soccer ball →</a> — right size for ages 8–12.</p>\n<p><a href=\"/go/soccer-cones-12pk/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Disc cones (50-pack) →</a> — flat cones for gates, grids, and boundary markers.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Defensive Shape Recovery","summary":"Defenders reset their shape after losing the ball. 12 minutes. Ages 11-12.","sport":"soccer","ages":["11-12"],"fundamental":"positioning","progression":"refine","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Team of defenders sprinting back to form a line between the ball and goal after a turnover.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-defensive-shape-recovery.md";
				const url = undefined;
				function rawContent() {
					return "\nWhen the ball is lost, defenders have 2 seconds to recover shape. This drill trains that reaction. Defenders lose it, turn, and sprint back to form a line. Speed and organization matter.\n\n**What you need:** 6 kids (3 defenders, 3 attackers), 1 ball, cones marking a half field.\n\n**Setup:** Defenders have possession. Attackers are ready to counter. Goal line is marked.\n\n**How to run it:**\n\n1. Defenders pass the ball using Plant, Open, Strike, Follow.\n2. After 3 passes, attackers steal it (or you play a turnover).\n3. Immediately, defenders turn and sprint back using Drop, Show, Stay, Win.\n4. Defenders form a line between the ball and their goal.\n5. Attackers attack. Defenders defend the line.\n6. Play for 30 seconds. Then reset.\n\n**What to watch:** How fast do defenders recover? Do they form a line or scatter?\n\n**If they're struggling:** Give defenders a 2-second head start before the attackers move.\n\n**If they've got it:** Attackers get a faster counter. Defenders have less time to recover.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 4 soccer ball →](/go/soccer-ball-size4/) — right size for ages 8–12.\n\n[Disc cones (50-pack) →](/go/soccer-cones-12pk/) — flat cones for gates, grids, and boundary markers.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
