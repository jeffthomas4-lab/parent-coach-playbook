globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>US Soccer guidelines limit heading before age 11-12. Attacking heading is about placing the header on goal. Soft ball, low volume (5 reps). Power and placement matter. The header is trying to score, not just clear it.</p>\n<p><strong>What you need:</strong> 1 soft ball, 2 kids (passer and attacker), a goal marked with cones.</p>\n<p><strong>Setup:</strong> Goal is 12 feet away. Passer is on the side with the ball. Attacker is in front of goal, 8 feet away.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Passer crosses the ball high and firm to the attacker.</li>\n<li>Attacker watches the ball come (See).</li>\n<li>Attacker times their jump and positions themselves.</li>\n<li>Attacker heads the ball on goal with power, using the forehead, aiming for the top corner.</li>\n<li>Do 5 header attempts per attacker.</li>\n</ol>\n<p><strong>What to watch:</strong> Is the attacker timing the jump or starting too early?</p>\n<p><strong>If they’re struggling:</strong> Passer throws instead of kicks. Easier to head.</p>\n<p><strong>If they’ve got it:</strong> Passer crosses faster. Add a defender who pressures the header.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size4/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 4 soccer ball →</a> — right size for ages 8–12.</p>\n<p><a href=\"/go/soccer-cones-12pk/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Disc cones (50-pack) →</a> — flat cones for gates, grids, and boundary markers.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Attacking Heading on Goal","summary":"Attacker heads the ball on goal from a cross. 10 minutes. Ages 11-12.","sport":"soccer","ages":["11-12"],"fundamental":"heading","progression":"refine","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Attacker jumping and heading a crossed ball toward goal with power and direction.","editorial":{"qualityGrade":7,"originalityGrade":7,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":true,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Heading drill restricted to ages 11-12 with US Soccer rule note and 5-rep cap. Flagged sensitive due to heading injury concerns. Could cite US Soccer/NFHS heading guidance directly for stronger compliance."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-attacking-heading-on-goal.md";
				const url = undefined;
				function rawContent() {
					return "\nUS Soccer guidelines limit heading before age 11-12. Attacking heading is about placing the header on goal. Soft ball, low volume (5 reps). Power and placement matter. The header is trying to score, not just clear it.\n\n**What you need:** 1 soft ball, 2 kids (passer and attacker), a goal marked with cones.\n\n**Setup:** Goal is 12 feet away. Passer is on the side with the ball. Attacker is in front of goal, 8 feet away.\n\n**How to run it:**\n\n1. Passer crosses the ball high and firm to the attacker.\n2. Attacker watches the ball come (See).\n3. Attacker times their jump and positions themselves.\n4. Attacker heads the ball on goal with power, using the forehead, aiming for the top corner.\n5. Do 5 header attempts per attacker.\n\n**What to watch:** Is the attacker timing the jump or starting too early?\n\n**If they're struggling:** Passer throws instead of kicks. Easier to head.\n\n**If they've got it:** Passer crosses faster. Add a defender who pressures the header.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 4 soccer ball →](/go/soccer-ball-size4/) — right size for ages 8–12.\n\n[Disc cones (50-pack) →](/go/soccer-cones-12pk/) — flat cones for gates, grids, and boundary markers.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
