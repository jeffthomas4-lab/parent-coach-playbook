globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Receiving a throw-in is different from receiving a pass. The ball comes down from above, and the receiver has to be ready to move immediately.</p>\n<p><strong>Equipment needed:</strong> 2-3 soccer balls, cones to mark a sideline, 6-8 kids.</p>\n<p><strong>Setup:</strong> Mark a 15-yard section of sideline with cones. Two kids are on the line (throw-in position), two kids are receiving 5 yards away, and two kids are backup receivers 10 yards away.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Thrower performs a proper throw-in to the nearest receiver.</li>\n<li>Receiver takes the ball and immediately passes back to a different thrower or dribbles forward.</li>\n<li>Rotate: after each throw, players move one position (thrower becomes receiver, receiver becomes backup, backup becomes thrower).</li>\n<li>Do 10 throw-ins per group.</li>\n</ol>\n<p><strong>What to look for:</strong> Reception quality and movement immediately after. Good receivers turn and pass or dribble in one motion.</p>\n<p><strong>Variation:</strong> For younger kids (8-9), throw from 3 yards away so the pass is easier. For older kids (10), add defenders so the receiver has to turn away from pressure.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size4/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 4 soccer ball →</a> — right size for ages 8–12.</p>\n<p><a href=\"/go/soccer-cones-12pk/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Disc cones (50-pack) →</a> — flat cones for gates, grids, and boundary markers.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Throw-In Toss","summary":"Practice receiving a throw-in with a quick pass or dribble. 15 minutes. Ages 8-10.","sport":"soccer","ages":["8-10"],"focus":"fundamentals","layer":"foundations","fundamental":"passing","progression":"intro","illustrationBrief":"Receiving and passing after throw-in","publishedAt":"2026-02-25T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":7,"originalityGrade":7,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Could note proper throw-in form (both feet down, hands behind head) for completeness."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-throw-in-toss-ages-8-10.md";
				const url = undefined;
				function rawContent() {
					return "\nReceiving a throw-in is different from receiving a pass. The ball comes down from above, and the receiver has to be ready to move immediately.\n\n**Equipment needed:** 2-3 soccer balls, cones to mark a sideline, 6-8 kids.\n\n**Setup:** Mark a 15-yard section of sideline with cones. Two kids are on the line (throw-in position), two kids are receiving 5 yards away, and two kids are backup receivers 10 yards away.\n\n**How to run it:**\n\n1. Thrower performs a proper throw-in to the nearest receiver.\n2. Receiver takes the ball and immediately passes back to a different thrower or dribbles forward.\n3. Rotate: after each throw, players move one position (thrower becomes receiver, receiver becomes backup, backup becomes thrower).\n4. Do 10 throw-ins per group.\n\n**What to look for:** Reception quality and movement immediately after. Good receivers turn and pass or dribble in one motion.\n\n**Variation:** For younger kids (8-9), throw from 3 yards away so the pass is easier. For older kids (10), add defenders so the receiver has to turn away from pressure.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 4 soccer ball →](/go/soccer-ball-size4/) — right size for ages 8–12.\n\n[Disc cones (50-pack) →](/go/soccer-cones-12pk/) — flat cones for gates, grids, and boundary markers.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
