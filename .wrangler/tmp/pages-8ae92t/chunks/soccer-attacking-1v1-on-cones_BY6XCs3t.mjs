globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>At 11-12, attackers need to score under pressure. This drill simulates that reality. The dribbler has to beat the defender and hit a target. One shot to earn it.</p>\n<p><strong>What you need:</strong> 1 soccer ball, 4 cones total. 2 cones form a 4-foot wide goal 20 feet away.</p>\n<p><strong>Setup:</strong> Dribbler starts at a line. Defender lines up 5 feet behind the dribbler. Goal cones are 20 feet ahead.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>You call “Go.” Dribbler sprints forward with the ball using Touch, Look, Push, Go.</li>\n<li>Defender pressures from behind, not trying to tackle yet, just closing space.</li>\n<li>Dribbler must beat the defender and dribble through the cone goal.</li>\n<li>If the defender wins the ball, the drill ends.</li>\n<li>4 attempts per player, then switch roles.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the attacker look for space and exploit it? Or do they just run straight and get tackled?</p>\n<p><strong>If they’re struggling:</strong> Move the goal back to 25 feet. Give the dribbler a 2-yard head start.</p>\n<p><strong>If they’ve got it:</strong> Defender now starts beside the dribbler. That’s a harder angle to beat.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size4/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 4 soccer ball →</a> — right size for ages 8–12.</p>\n<p><a href=\"/go/soccer-cones-12pk/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Disc cones (50-pack) →</a> — flat cones for gates, grids, and boundary markers.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Attacking 1v1 on Cones","summary":"Dribbler attacks a cone goal while defending against a live opponent. 12 minutes. Ages 11-12.","sport":"soccer","ages":["11-12"],"fundamental":"dribbling","progression":"refine","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Dribbler sprinting toward 2 cones that form a small goal while a defender closes in from behind.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-attacking-1v1-on-cones.md";
				const url = undefined;
				function rawContent() {
					return "\nAt 11-12, attackers need to score under pressure. This drill simulates that reality. The dribbler has to beat the defender and hit a target. One shot to earn it.\n\n**What you need:** 1 soccer ball, 4 cones total. 2 cones form a 4-foot wide goal 20 feet away.\n\n**Setup:** Dribbler starts at a line. Defender lines up 5 feet behind the dribbler. Goal cones are 20 feet ahead.\n\n**How to run it:**\n\n1. You call \"Go.\" Dribbler sprints forward with the ball using Touch, Look, Push, Go.\n2. Defender pressures from behind, not trying to tackle yet, just closing space.\n3. Dribbler must beat the defender and dribble through the cone goal.\n4. If the defender wins the ball, the drill ends.\n5. 4 attempts per player, then switch roles.\n\n**What to watch:** Does the attacker look for space and exploit it? Or do they just run straight and get tackled?\n\n**If they're struggling:** Move the goal back to 25 feet. Give the dribbler a 2-yard head start.\n\n**If they've got it:** Defender now starts beside the dribbler. That's a harder angle to beat.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 4 soccer ball →](/go/soccer-ball-size4/) — right size for ages 8–12.\n\n[Disc cones (50-pack) →](/go/soccer-cones-12pk/) — flat cones for gates, grids, and boundary markers.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
