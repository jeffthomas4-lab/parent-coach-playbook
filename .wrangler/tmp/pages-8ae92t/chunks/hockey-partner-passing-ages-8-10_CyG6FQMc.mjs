globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>By 8-10, young players can pass and receive with control. This drill builds timing and accuracy in a partner setting where communication matters.</p>\n<p><strong>Equipment needed:</strong> 4 cones, 2 pucks, 2 sticks per pair.</p>\n<p><strong>Setup:</strong> Create a 15-yard by 10-yard rectangle. Partners line up opposite each other at the ends.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Partner A passes to partner B, who receives and passes back.</li>\n<li>Both partners are moving toward each other slowly, like they’re moving up ice.</li>\n<li>Passes should be crisp: firm enough to move, not so hard the receiver can’t handle it.</li>\n<li>Do 6 passes each direction, then switch partners.</li>\n<li>Second rep: increase speed. Partners move at a light jog while passing.</li>\n</ol>\n<p><strong>What to look for:</strong></p>\n<p>The pass should arrive flat on the ice, not bouncing. A bouncing pass is too hard. The receiver should be reaching forward slightly to meet the pass. The puck should stick to the receiving player’s stick, not roll past. If a player is reaching backward for the pass, the passer is leading too far. Communication matters: partners should call “Ready” or “Here” to stay in sync.</p>\n<p><strong>Variation:</strong> Add a third partner so passes go in a triangle. Or add a defender in the middle who tries to poke check the puck between exchanges.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/hockey-puck/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Hockey pucks (6-pack) →</a> — regulation pucks for drills and scrimmage.</p>\n<p><a href=\"/go/hockey-stick-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth hockey stick →</a> — Franklin Ripper, flex rated for young players.</p>\n<p><a href=\"/what-to-buy/hockey/\">Full hockey gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Partner Passing Drill","summary":"Build accurate passing and receiving in pairs with game-speed movement. 12 minutes.","sport":"hockey","ages":["8-10"],"focus":"fundamentals","layer":"foundations","fundamental":"passing","progression":"build","illustrationBrief":"Two skaters passing a puck back and forth while moving across the ice, maintaining speed and accuracy in the exchange.","publishedAt":"2026-02-20T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Variation was truncated. Completed it."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/hockey-partner-passing-ages-8-10.md";
				const url = undefined;
				function rawContent() {
					return "\nBy 8-10, young players can pass and receive with control. This drill builds timing and accuracy in a partner setting where communication matters.\n\n**Equipment needed:** 4 cones, 2 pucks, 2 sticks per pair.\n\n**Setup:** Create a 15-yard by 10-yard rectangle. Partners line up opposite each other at the ends.\n\n**How to run it:**\n\n1. Partner A passes to partner B, who receives and passes back.\n2. Both partners are moving toward each other slowly, like they're moving up ice.\n3. Passes should be crisp: firm enough to move, not so hard the receiver can't handle it.\n4. Do 6 passes each direction, then switch partners.\n5. Second rep: increase speed. Partners move at a light jog while passing.\n\n**What to look for:**\n\nThe pass should arrive flat on the ice, not bouncing. A bouncing pass is too hard. The receiver should be reaching forward slightly to meet the pass. The puck should stick to the receiving player's stick, not roll past. If a player is reaching backward for the pass, the passer is leading too far. Communication matters: partners should call \"Ready\" or \"Here\" to stay in sync.\n\n**Variation:** Add a third partner so passes go in a triangle. Or add a defender in the middle who tries to poke check the puck between exchanges.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Hockey pucks (6-pack) →](/go/hockey-puck/) — regulation pucks for drills and scrimmage.\n\n[Youth hockey stick →](/go/hockey-stick-youth/) — Franklin Ripper, flex rated for young players.\n\n[Full hockey gear guide →](/what-to-buy/hockey/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
