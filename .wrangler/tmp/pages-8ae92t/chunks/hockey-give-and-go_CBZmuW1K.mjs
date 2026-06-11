globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Give and go is movement after the pass. Pass it, skate, get it back. The receiver of the first pass is the next passer. This is how teams break the puck up the ice past defenders who only watch the puck.</p>\n<p><strong>What you need:</strong> Sticks, puck, two players, ice rink.</p>\n<p><strong>Setup:</strong> Player A at the blue line with the puck. Player B at center ice, 25 feet away.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Player A passes to Player B (the give).</li>\n<li>Player A skates forward to a new spot 20 feet ahead and to the side.</li>\n<li>Player B catches and passes the puck back to Player A’s new position (the go).</li>\n<li>Player A receives at the new spot and either continues with the puck or repeats the pattern.</li>\n<li>Do 6 reps. Switch starting roles.</li>\n</ol>\n<p><strong>What to watch:</strong> Does Player A skate after passing? Standing still is the wrong move. The pass triggers the skate.</p>\n<p><strong>If they’re struggling:</strong> Walk through the pattern slowly without a puck. Build the timing.</p>\n<p><strong>If they’ve got it:</strong> Add a defender between Player A and Player B. The give-and-go has to beat the defender.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/hockey-puck/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Hockey pucks (6-pack) →</a> — regulation pucks for drills and scrimmage.</p>\n<p><a href=\"/what-to-buy/hockey/\">Full hockey gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Give and Go","summary":"Pass to a teammate, skate to a new spot, get the return pass. 12 minutes. Ages 11-12.","sport":"hockey","ages":["11-12"],"fundamental":"passing","progression":"refine","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player A passing to Player B at center ice, then skating diagonally to a new spot, Player B passing back to the new spot.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Pass triggers the skate framing names the failure mode kids fall into."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/hockey-give-and-go.md";
				const url = undefined;
				function rawContent() {
					return "\nGive and go is movement after the pass. Pass it, skate, get it back. The receiver of the first pass is the next passer. This is how teams break the puck up the ice past defenders who only watch the puck.\n\n**What you need:** Sticks, puck, two players, ice rink.\n\n**Setup:** Player A at the blue line with the puck. Player B at center ice, 25 feet away.\n\n**How to run it:**\n\n1. Player A passes to Player B (the give).\n2. Player A skates forward to a new spot 20 feet ahead and to the side.\n3. Player B catches and passes the puck back to Player A's new position (the go).\n4. Player A receives at the new spot and either continues with the puck or repeats the pattern.\n5. Do 6 reps. Switch starting roles.\n\n**What to watch:** Does Player A skate after passing? Standing still is the wrong move. The pass triggers the skate.\n\n**If they're struggling:** Walk through the pattern slowly without a puck. Build the timing.\n\n**If they've got it:** Add a defender between Player A and Player B. The give-and-go has to beat the defender.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Hockey pucks (6-pack) →](/go/hockey-puck/) — regulation pucks for drills and scrimmage.\n\n[Full hockey gear guide →](/what-to-buy/hockey/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
