globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The first rule of defense is simple: get between the ball and the goal. Five-year-olds don’t know that naturally. This drill teaches them where to stand.</p>\n<p><strong>What you need:</strong> 1 soccer ball, 2 kids, 1 small goal or 2 cones, 15 feet of space.</p>\n<p><strong>Setup:</strong> Goal or cones are 15 feet away. Attacker has the ball. Defender starts 5 feet away.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Attacker dribbles toward the goal using Touch, Look, Push, Go.</li>\n<li>Defender runs toward the attacker and the goal, positioning themselves between the ball and the goal line.</li>\n<li>Defender doesn’t try to tackle. Just stay in the way.</li>\n<li>After 5 seconds, drill ends.</li>\n<li>Do 3 rounds, then switch roles.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the defender move toward the goal? Or toward the attacker? They should move toward the goal first.</p>\n<p><strong>If they’re struggling:</strong> Defender is closer to goal (10 feet away). Less ground to cover.</p>\n<p><strong>If they’ve got it:</strong> Attacker gets a faster dribble. Defender has to react quicker.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size3/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 3 soccer ball →</a> — right size for ages 5–7.</p>\n<p><a href=\"/go/soccer-cones-12pk/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Disc cones (50-pack) →</a> — flat cones for gates, grids, and boundary markers.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Stay Between Ball and Goal","summary":"Defender positions themselves between the attacker and the goal. 8 minutes. Ages 5-7.","sport":"soccer","ages":["5-7"],"fundamental":"defending","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Young child standing between an attacker and a goal, blocking the direct path.","editorial":{"qualityGrade":8,"originalityGrade":8,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Direct, age-honest framing of the first defensive principle."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-stay-between-ball-and-goal.md";
				const url = undefined;
				function rawContent() {
					return "\nThe first rule of defense is simple: get between the ball and the goal. Five-year-olds don't know that naturally. This drill teaches them where to stand.\n\n**What you need:** 1 soccer ball, 2 kids, 1 small goal or 2 cones, 15 feet of space.\n\n**Setup:** Goal or cones are 15 feet away. Attacker has the ball. Defender starts 5 feet away.\n\n**How to run it:**\n\n1. Attacker dribbles toward the goal using Touch, Look, Push, Go.\n2. Defender runs toward the attacker and the goal, positioning themselves between the ball and the goal line.\n3. Defender doesn't try to tackle. Just stay in the way.\n4. After 5 seconds, drill ends.\n5. Do 3 rounds, then switch roles.\n\n**What to watch:** Does the defender move toward the goal? Or toward the attacker? They should move toward the goal first.\n\n**If they're struggling:** Defender is closer to goal (10 feet away). Less ground to cover.\n\n**If they've got it:** Attacker gets a faster dribble. Defender has to react quicker.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 3 soccer ball →](/go/soccer-ball-size3/) — right size for ages 5–7.\n\n[Disc cones (50-pack) →](/go/soccer-cones-12pk/) — flat cones for gates, grids, and boundary markers.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
