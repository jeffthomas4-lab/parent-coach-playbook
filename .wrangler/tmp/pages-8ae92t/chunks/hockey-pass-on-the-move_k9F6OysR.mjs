globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Real game passing happens while moving. Both players have momentum, both are reading each other. This drill is the live-game version of stationary passing. The puck has to lead the receiver into the next stride.</p>\n<p><strong>What you need:</strong> Sticks, puck, two players, ice rink.</p>\n<p><strong>Setup:</strong> Two players at one blue line, 20 feet apart in parallel lanes.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Both players push off and skate forward in their lanes.</li>\n<li>After 10 feet, Player A passes to Player B. Lead the pass (aim ahead of where the partner is).</li>\n<li>Player B receives the puck with a soft stick, takes a stride, passes back.</li>\n<li>Continue passing back and forth across the ice.</li>\n<li>Do 4 trips down the ice.</li>\n</ol>\n<p><strong>What to watch:</strong> Are the passes leading the receiver? A pass behind the receiver is a turnover. Tell them: “Pass to where they’re going, not where they are.”</p>\n<p><strong>If they’re struggling:</strong> Slow the skating speed. Walk-skate to build the timing.</p>\n<p><strong>If they’ve got it:</strong> Add a defender at center ice. Now the pass has to beat the defender too.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/hockey-puck/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Hockey pucks (6-pack) →</a> — regulation pucks for drills and scrimmage.</p>\n<p><a href=\"/go/hockey-stick-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth hockey stick →</a> — Franklin Ripper, flex rated for young players.</p>\n<p><a href=\"/what-to-buy/hockey/\">Full hockey gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Pass on the Move","summary":"Pass while skating forward, both players moving. 12 minutes. Ages 8-10 and 11-12.","sport":"hockey","ages":["8-10","11-12"],"fundamental":"passing","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Two players skating up the ice in parallel lanes 20 feet apart, exchanging passes while continuing to skate forward.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Pass to where they're going cue is the heart of the drill."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/hockey-pass-on-the-move.md";
				const url = undefined;
				function rawContent() {
					return "\nReal game passing happens while moving. Both players have momentum, both are reading each other. This drill is the live-game version of stationary passing. The puck has to lead the receiver into the next stride.\n\n**What you need:** Sticks, puck, two players, ice rink.\n\n**Setup:** Two players at one blue line, 20 feet apart in parallel lanes.\n\n**How to run it:**\n\n1. Both players push off and skate forward in their lanes.\n2. After 10 feet, Player A passes to Player B. Lead the pass (aim ahead of where the partner is).\n3. Player B receives the puck with a soft stick, takes a stride, passes back.\n4. Continue passing back and forth across the ice.\n5. Do 4 trips down the ice.\n\n**What to watch:** Are the passes leading the receiver? A pass behind the receiver is a turnover. Tell them: \"Pass to where they're going, not where they are.\"\n\n**If they're struggling:** Slow the skating speed. Walk-skate to build the timing.\n\n**If they've got it:** Add a defender at center ice. Now the pass has to beat the defender too.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Hockey pucks (6-pack) →](/go/hockey-puck/) — regulation pucks for drills and scrimmage.\n\n[Youth hockey stick →](/go/hockey-stick-youth/) — Franklin Ripper, flex rated for young players.\n\n[Full hockey gear guide →](/what-to-buy/hockey/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
