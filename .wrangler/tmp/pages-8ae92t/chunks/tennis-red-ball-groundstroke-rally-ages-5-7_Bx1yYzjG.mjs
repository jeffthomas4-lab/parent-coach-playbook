globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>At 5-7, the red ball (larger and softer) lets young players focus on tracking and hitting, not fear. This drill builds basic stroke mechanics in a rally setting.</p>\n<p><strong>Equipment needed:</strong> 1 smaller court (or marked 20-foot square), 4 red tennis balls, 2 kid-sized rackets, 1 net (lowered if possible).</p>\n<p><strong>Setup:</strong> Two young players stand on opposite sides of the net, about 12 feet back from the baseline.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>One player feeds the ball to the other (gentle toss to them).</li>\n<li>Receiver hits the ball back over the net (forehand or backhand).</li>\n<li>Feeder hits it back. They rally, trying to keep the ball in play.</li>\n<li>Goal is 3 consecutive hits over the net (a “3-rally”).</li>\n<li>Do 4 reps per pair, then switch.</li>\n</ol>\n<p><strong>What to look for:</strong></p>\n<p>Young players should be tracking the ball with their eyes. If they’re looking away or at their feet, focus it back on the ball. The swing should be simple: step, turn, swing, follow through. Over-thinking mechanics is not helpful at this age. If the ball is wobbling, they’re hitting it off-center. If they’re swinging too hard, they’re out of control. Controlled, easy swings let the ball stay on the court.</p>\n<p><strong>Variation:</strong> Add a target. Place a cone on the opponent’s court. Young players try to hit near the cone, not just over the net. This teaches direction without adding complexity.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/tennis-net/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Portable tennis net →</a> — set up in a driveway or grass for ages 5-7 mini-court reps.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Red-Ball Groundstroke Rally","summary":"Build ball tracking and basic forehand/backhand at a young age. 12 minutes.","sport":"tennis","ages":["5-7"],"focus":"fundamentals","layer":"foundations","fundamental":"forehand","progression":"intro","illustrationBrief":"Groundstroke rally with oversized red ball","publishedAt":"2026-04-30T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":7,"originalityGrade":7,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Red-ball intro for 5-7; affiliate disclosure present."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/tennis-red-ball-groundstroke-rally-ages-5-7.md";
				const url = undefined;
				function rawContent() {
					return "\nAt 5-7, the red ball (larger and softer) lets young players focus on tracking and hitting, not fear. This drill builds basic stroke mechanics in a rally setting.\n\n**Equipment needed:** 1 smaller court (or marked 20-foot square), 4 red tennis balls, 2 kid-sized rackets, 1 net (lowered if possible).\n\n**Setup:** Two young players stand on opposite sides of the net, about 12 feet back from the baseline.\n\n**How to run it:**\n\n1. One player feeds the ball to the other (gentle toss to them).\n2. Receiver hits the ball back over the net (forehand or backhand).\n3. Feeder hits it back. They rally, trying to keep the ball in play.\n4. Goal is 3 consecutive hits over the net (a \"3-rally\").\n5. Do 4 reps per pair, then switch.\n\n**What to look for:**\n\nYoung players should be tracking the ball with their eyes. If they're looking away or at their feet, focus it back on the ball. The swing should be simple: step, turn, swing, follow through. Over-thinking mechanics is not helpful at this age. If the ball is wobbling, they're hitting it off-center. If they're swinging too hard, they're out of control. Controlled, easy swings let the ball stay on the court.\n\n**Variation:** Add a target. Place a cone on the opponent's court. Young players try to hit near the cone, not just over the net. This teaches direction without adding complexity.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Portable tennis net →](/go/tennis-net/) — set up in a driveway or grass for ages 5-7 mini-court reps.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
