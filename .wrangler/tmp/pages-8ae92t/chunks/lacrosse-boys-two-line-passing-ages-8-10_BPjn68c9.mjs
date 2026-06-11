globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Passing in lacrosse requires timing. Two lines of players passing back and forth teaches spacing and accuracy without complexity.</p>\n<p><strong>Equipment needed:</strong> 4 cones, 2 balls, 4 sticks per pair of lines.</p>\n<p><strong>Setup:</strong> Create two lines of 4 players facing each other, 15 yards apart. Place cones at the ends to mark the lines.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Player in line A passes to the first player in line B. That player passes back to the second player in line A. Continue down the lines.</li>\n<li>Players should move forward as they pass. Each pass moves both players closer together.</li>\n<li>Do one set of passes from each end.</li>\n<li>Second rep: increase speed. Passes should be quicker and players should be moving faster.</li>\n</ol>\n<p><strong>What to look for:</strong></p>\n<p>The pass should be accurate and catchable. If the receiving player has to reach way out or step back, the pass is off. The catch should happen on the stick naturally, with the stick in ready position. If a player is reaching for a bad pass or dropping the ball, accuracy is the problem. Communicate about timing: players need to call out when they’re ready to receive. The next pass leaves the stick when the receiver’s stick is up and looking.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/lacrosse-ball/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Lacrosse balls (6-pack) →</a> — NOCSAE-stamped practice balls.</p>\n<p><a href=\"/go/lacrosse-starter-kit-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">STX Stallion complete stick →</a> — shaft and head combo for new players.</p>\n<p><a href=\"/what-to-buy/lacrosse-boys/\">Full lacrosse (boys) gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Two-Line Passing","summary":"Build accurate passing and receiving in lines with game-speed positioning. 12 minutes.","sport":"lacrosse-boys","ages":["8-10"],"focus":"fundamentals","layer":"foundations","fundamental":"passing","progression":"build","illustrationBrief":"Two lines of players facing each other, passing a lacrosse ball back and forth at game speed with accurate stick-to-stick passes.","publishedAt":"2026-03-07T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":7,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Completed truncated 'Communicate about timing: pla...' tail with two voice-matched sentences."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/lacrosse-boys-two-line-passing-ages-8-10.md";
				const url = undefined;
				function rawContent() {
					return "\nPassing in lacrosse requires timing. Two lines of players passing back and forth teaches spacing and accuracy without complexity.\n\n**Equipment needed:** 4 cones, 2 balls, 4 sticks per pair of lines.\n\n**Setup:** Create two lines of 4 players facing each other, 15 yards apart. Place cones at the ends to mark the lines.\n\n**How to run it:**\n\n1. Player in line A passes to the first player in line B. That player passes back to the second player in line A. Continue down the lines.\n2. Players should move forward as they pass. Each pass moves both players closer together.\n3. Do one set of passes from each end.\n4. Second rep: increase speed. Passes should be quicker and players should be moving faster.\n\n**What to look for:**\n\nThe pass should be accurate and catchable. If the receiving player has to reach way out or step back, the pass is off. The catch should happen on the stick naturally, with the stick in ready position. If a player is reaching for a bad pass or dropping the ball, accuracy is the problem. Communicate about timing: players need to call out when they're ready to receive. The next pass leaves the stick when the receiver's stick is up and looking.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Lacrosse balls (6-pack) →](/go/lacrosse-ball/) — NOCSAE-stamped practice balls.\n\n[STX Stallion complete stick →](/go/lacrosse-starter-kit-youth/) — shaft and head combo for new players.\n\n[Full lacrosse (boys) gear guide →](/what-to-buy/lacrosse-boys/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
