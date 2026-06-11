globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Juggling is the best warm-up for touch and rhythm. It requires focus and soft feet. Kids compete against themselves to beat their record. It’s fun, hard, and builds real skill.</p>\n<p><strong>What you need:</strong> 1 ball per child. Open space, 5x5 feet per child.</p>\n<p><strong>Setup:</strong> Each child stands alone with a ball.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Child starts with the ball in their hands.</li>\n<li>They drop the ball and touch it with their right foot just below waist height.</li>\n<li>Ball bounces up. They touch it with their left foot.</li>\n<li>Continue alternating feet for as long as possible.</li>\n<li>Count the touches. That’s their score.</li>\n<li>Rest. Try again. Try to beat the score.</li>\n<li>Do 3 attempts total.</li>\n</ol>\n<p><strong>What to watch:</strong> Are the touches controlled or wild? Controlled means soft feet.</p>\n<p><strong>If they’re struggling:</strong> Let them use their hands to help between touches. Less pressure.</p>\n<p><strong>If they’ve got it:</strong> Challenge them to a personal best. See who gets the highest count in the group.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size4/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 4 soccer ball →</a> — right size for ages 8–12.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Juggling Ladder","summary":"Players juggle the ball, trying to beat their personal record. 10 minutes. Ages 8-10, 11-12.","sport":"soccer","ages":["8-10","11-12"],"fundamental":"warm-up","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player alternating feet in a juggling pattern, ball at chest height on each touch.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Solid juggling warm-up. Soccer vocab correct."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-juggling-ladder.md";
				const url = undefined;
				function rawContent() {
					return "\nJuggling is the best warm-up for touch and rhythm. It requires focus and soft feet. Kids compete against themselves to beat their record. It's fun, hard, and builds real skill.\n\n**What you need:** 1 ball per child. Open space, 5x5 feet per child.\n\n**Setup:** Each child stands alone with a ball.\n\n**How to run it:**\n\n1. Child starts with the ball in their hands.\n2. They drop the ball and touch it with their right foot just below waist height.\n3. Ball bounces up. They touch it with their left foot.\n4. Continue alternating feet for as long as possible.\n5. Count the touches. That's their score.\n6. Rest. Try again. Try to beat the score.\n7. Do 3 attempts total.\n\n**What to watch:** Are the touches controlled or wild? Controlled means soft feet.\n\n**If they're struggling:** Let them use their hands to help between touches. Less pressure.\n\n**If they've got it:** Challenge them to a personal best. See who gets the highest count in the group.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 4 soccer ball →](/go/soccer-ball-size4/) — right size for ages 8–12.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
