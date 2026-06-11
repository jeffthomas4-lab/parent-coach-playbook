globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>At 13-14, players are ready for game-speed competition with structure. This controlled scrimmage keeps the focus on execution, not chaos.</p>\n<p><strong>Equipment needed:</strong> 1 net, 12 players (2 teams of 6), 2 balls, 4 cones.</p>\n<p><strong>Setup:</strong> Standard 6v6 volleyball. Each team has a setter, two hitters, three passers (with rotation based on rally).</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Rally scoring to 15 points (first to 15 wins).</li>\n<li>Serve every other play. After each serve, the team has three touches to get the ball over the net.</li>\n<li>If the serve is an ace or the receiving team fails to get three touches, the serving team scores.</li>\n<li>Rotate serving every 4 points so both teams serve equally.</li>\n<li>Play two sets (best of three if time allows).</li>\n</ol>\n<p><strong>What to look for:</strong></p>\n<p>Do players communicate? Are they running offensive plays (set and attack) or just bouncing it back? Do passers move to receive or wait in place? Is the setter directing the hitters or just sending the ball wherever? Do covering players communicate before plays? In a controlled scrimmage, the goal is to see execution and teamwork, not just winning.</p>\n<p><strong>Variation:</strong> Add a libero (defensive specialist). This teaches rotation and gives struggling passers a chance to focus on one position. Or set a rule: every player must touch the ball on one rally. This forces movement and involvement.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/volleyball-net/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Portable volleyball net →</a> — adjustable height, quick setup. Useful for backyard reps when gym time gets tight.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"6v6 Controlled Scrimmage","summary":"Run a game with scoring and stoppages to teach decision-making. 25 minutes.","sport":"volleyball","ages":["13-14"],"focus":"scrimmage","layer":"situational","fundamental":"scrimmage","progression":"refine","illustrationBrief":"Full game format with coaching pauses","publishedAt":"2026-04-06T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Standard 6v6 format with affiliate disclosure present. Vocab correct."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/volleyball-6v6-controlled-scrimmage-ages-13-14.md";
				const url = undefined;
				function rawContent() {
					return "\nAt 13-14, players are ready for game-speed competition with structure. This controlled scrimmage keeps the focus on execution, not chaos.\n\n**Equipment needed:** 1 net, 12 players (2 teams of 6), 2 balls, 4 cones.\n\n**Setup:** Standard 6v6 volleyball. Each team has a setter, two hitters, three passers (with rotation based on rally).\n\n**How to run it:**\n\n1. Rally scoring to 15 points (first to 15 wins).\n2. Serve every other play. After each serve, the team has three touches to get the ball over the net.\n3. If the serve is an ace or the receiving team fails to get three touches, the serving team scores.\n4. Rotate serving every 4 points so both teams serve equally.\n5. Play two sets (best of three if time allows).\n\n**What to look for:**\n\nDo players communicate? Are they running offensive plays (set and attack) or just bouncing it back? Do passers move to receive or wait in place? Is the setter directing the hitters or just sending the ball wherever? Do covering players communicate before plays? In a controlled scrimmage, the goal is to see execution and teamwork, not just winning.\n\n**Variation:** Add a libero (defensive specialist). This teaches rotation and gives struggling passers a chance to focus on one position. Or set a rule: every player must touch the ball on one rally. This forces movement and involvement.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Portable volleyball net →](/go/volleyball-net/) — adjustable height, quick setup. Useful for backyard reps when gym time gets tight.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
