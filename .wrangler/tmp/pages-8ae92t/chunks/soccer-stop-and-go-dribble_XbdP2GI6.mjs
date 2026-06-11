globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Kids need to learn they can stop the ball whenever they want. This drill teaches them that the sole of the foot is the brake. Tap, roll, stop. That’s control.</p>\n<p><strong>What you need:</strong> 1 soccer ball per child. Open grass area.</p>\n<p><strong>Setup:</strong> Each child stands with a ball 20 feet in front of them toward a line or tree.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Child taps the ball forward using the inside of the foot. Rolling toward the target.</li>\n<li>After 3 taps, they press the sole of their foot down on top of the ball and stop it.</li>\n<li>Ball stops. They pause for 1 second.</li>\n<li>Tap it forward again. 3 taps, then stop.</li>\n<li>Repeat until they reach the target line, about 20 feet away.</li>\n</ol>\n<p><strong>What to watch:</strong> Can they stop the ball cleanly with the sole of their foot? Or does it squirt out to the side? Sole contact takes practice.</p>\n<p><strong>If they’re struggling:</strong> Reduce the taps to 2 before each stop. Let them move slower.</p>\n<p><strong>If they’ve got it:</strong> Increase to 5 taps before each stop. Add a voice call. You say “Go” or “Stop” and they respond.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size3/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 3 soccer ball →</a> — right size for ages 5–7.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Stop and Go Dribble","summary":"Tap the ball, stop it with the sole of the foot, repeat. 8 minutes. Ages 5-7.","sport":"soccer","ages":["5-7"],"fundamental":"dribbling","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Child's sole of the foot pressing down on a moving soccer ball to stop it.","editorial":{"qualityGrade":7,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Sole-of-foot brake metaphor is concrete and age-right."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-stop-and-go-dribble.md";
				const url = undefined;
				function rawContent() {
					return "\nKids need to learn they can stop the ball whenever they want. This drill teaches them that the sole of the foot is the brake. Tap, roll, stop. That's control.\n\n**What you need:** 1 soccer ball per child. Open grass area.\n\n**Setup:** Each child stands with a ball 20 feet in front of them toward a line or tree.\n\n**How to run it:**\n\n1. Child taps the ball forward using the inside of the foot. Rolling toward the target.\n2. After 3 taps, they press the sole of their foot down on top of the ball and stop it.\n3. Ball stops. They pause for 1 second.\n4. Tap it forward again. 3 taps, then stop.\n5. Repeat until they reach the target line, about 20 feet away.\n\n**What to watch:** Can they stop the ball cleanly with the sole of their foot? Or does it squirt out to the side? Sole contact takes practice.\n\n**If they're struggling:** Reduce the taps to 2 before each stop. Let them move slower.\n\n**If they've got it:** Increase to 5 taps before each stop. Add a voice call. You say \"Go\" or \"Stop\" and they respond.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 3 soccer ball →](/go/soccer-ball-size3/) — right size for ages 5–7.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
