globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Real ground balls are contested. Two players going for the same ball. The kid who gets there first, with the right body position, wins. This drill simulates that battle. Hard but essential at this age.</p>\n<p><strong>What you need:</strong> Sticks, ball, two players, full gear.</p>\n<p><strong>Setup:</strong> Two players 10 feet from a ball, each on opposite sides. Coach with the ball.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Coach drops the ball between the two players.</li>\n<li>Both players sprint to the ball.</li>\n<li>First to arrive gets low, scoops, and uses body position to shield from the other.</li>\n<li>Other player can stick-check or body-position to dislodge.</li>\n<li>Whoever comes up with the ball wins. Do 8 reps.</li>\n</ol>\n<p><strong>What to watch:</strong> Body position. The winner uses the body to shield, not just the stick. Box out, scoop, hold.</p>\n<p><strong>If they’re struggling:</strong> Slower start. Or shorter distance to the ball.</p>\n<p><strong>If they’ve got it:</strong> 2v2 battle. Or three balls dropped at once with multiple players competing.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/lacrosse-ball/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Lacrosse balls (6-pack) →</a> — NOCSAE-stamped practice balls.</p>\n<p><a href=\"/go/lacrosse-starter-kit-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">STX Stallion complete stick →</a> — beginner stick for first-season players.</p>\n<p><a href=\"/what-to-buy/lacrosse-girls/\">Full lacrosse (girls) gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"1v1 Ground Ball Battle","summary":"Two players compete for a loose ball. 12 minutes. Ages 11-12.","sport":"lacrosse-girls","ages":["11-12"],"fundamental":"ground-balls","progression":"refine","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Two players sprinting toward the same loose ball, both dropping low to scoop, one boxing the other out with the body.","editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Body shielding is legal in girls' (incidental contact in pursuit of the ball); piece does not describe deliberate body checks."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/lacrosse-girls-1v1-ground-ball-battle.md";
				const url = undefined;
				function rawContent() {
					return "\nReal ground balls are contested. Two players going for the same ball. The kid who gets there first, with the right body position, wins. This drill simulates that battle. Hard but essential at this age.\n\n**What you need:** Sticks, ball, two players, full gear.\n\n**Setup:** Two players 10 feet from a ball, each on opposite sides. Coach with the ball.\n\n**How to run it:**\n\n1. Coach drops the ball between the two players.\n2. Both players sprint to the ball.\n3. First to arrive gets low, scoops, and uses body position to shield from the other.\n4. Other player can stick-check or body-position to dislodge.\n5. Whoever comes up with the ball wins. Do 8 reps.\n\n**What to watch:** Body position. The winner uses the body to shield, not just the stick. Box out, scoop, hold.\n\n**If they're struggling:** Slower start. Or shorter distance to the ball.\n\n**If they've got it:** 2v2 battle. Or three balls dropped at once with multiple players competing.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Lacrosse balls (6-pack) →](/go/lacrosse-ball/) — NOCSAE-stamped practice balls.\n\n[STX Stallion complete stick →](/go/lacrosse-starter-kit-youth/) — beginner stick for first-season players.\n\n[Full lacrosse (girls) gear guide →](/what-to-buy/lacrosse-girls/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
