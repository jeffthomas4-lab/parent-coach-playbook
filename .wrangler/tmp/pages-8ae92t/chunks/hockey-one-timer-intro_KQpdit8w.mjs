globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A one-timer is a shot taken on a moving puck without stopping it. The pass arrives, the stick is already loaded, the puck gets hit on contact and flies at the net. This is the goal-scoring play in hockey. Hard to learn but very high value.</p>\n<p><strong>What you need:</strong> Sticks, pucks, two players, a target.</p>\n<p><strong>Setup:</strong> Player A (passer) on one side. Player B (shooter) 15 feet away on the other side. Net or target at Player B’s shooting angle.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Load, Sweep, Snap, Follow. The Sweep happens while the puck is in the air.</li>\n<li>Player B sets up in shooting position with stick already loaded behind.</li>\n<li>Player A passes hard along the ice toward Player B.</li>\n<li>Player B times the swing so the blade meets the puck on arrival, no stop.</li>\n<li>Do 8 attempts. Many will miss at first.</li>\n</ol>\n<p><strong>What to watch:</strong> The timing. If the swing is too early, the puck hasn’t arrived. If too late, it slides past. The blade has to meet the puck.</p>\n<p><strong>If they’re struggling:</strong> Slower passes. Or have the shooter stop the puck and shoot in two motions before trying the one-timer.</p>\n<p><strong>If they’ve got it:</strong> Add accuracy. Aim for top corners only. Or do it with a goalie.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/hockey-puck/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Hockey pucks (6-pack) →</a> — regulation pucks for drills and scrimmage.</p>\n<p><a href=\"/go/hockey-stick-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth hockey stick →</a> — Franklin Ripper, flex rated for young players.</p>\n<p><a href=\"/what-to-buy/hockey/\">Full hockey gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"One Timer Intro","summary":"Receive a pass and shoot in one motion without stopping the puck. 12 minutes. Ages 11-12.","sport":"hockey","ages":["11-12"],"fundamental":"shooting","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Two players: one passing the puck across, the other in shooting stance about to swing through the puck without stopping it, contact happening as the puck arrives.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Honest about misses is the right voice. Eight tries, many will miss."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/hockey-one-timer-intro.md";
				const url = undefined;
				function rawContent() {
					return "\nA one-timer is a shot taken on a moving puck without stopping it. The pass arrives, the stick is already loaded, the puck gets hit on contact and flies at the net. This is the goal-scoring play in hockey. Hard to learn but very high value.\n\n**What you need:** Sticks, pucks, two players, a target.\n\n**Setup:** Player A (passer) on one side. Player B (shooter) 15 feet away on the other side. Net or target at Player B's shooting angle.\n\n**How to run it:**\n\n1. Cue: Load, Sweep, Snap, Follow. The Sweep happens while the puck is in the air.\n2. Player B sets up in shooting position with stick already loaded behind.\n3. Player A passes hard along the ice toward Player B.\n4. Player B times the swing so the blade meets the puck on arrival, no stop.\n5. Do 8 attempts. Many will miss at first.\n\n**What to watch:** The timing. If the swing is too early, the puck hasn't arrived. If too late, it slides past. The blade has to meet the puck.\n\n**If they're struggling:** Slower passes. Or have the shooter stop the puck and shoot in two motions before trying the one-timer.\n\n**If they've got it:** Add accuracy. Aim for top corners only. Or do it with a goalie.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Hockey pucks (6-pack) →](/go/hockey-puck/) — regulation pucks for drills and scrimmage.\n\n[Youth hockey stick →](/go/hockey-stick-youth/) — Franklin Ripper, flex rated for young players.\n\n[Full hockey gear guide →](/what-to-buy/hockey/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
