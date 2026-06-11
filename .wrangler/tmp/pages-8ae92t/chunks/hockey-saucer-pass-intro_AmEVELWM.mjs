globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A saucer pass is a flat-arc pass that flies over a defender’s stick and lands flat for the receiver. It’s one of the trickier passes to learn but worth it. This is what beats stick-checking defenders in tight spaces.</p>\n<p><strong>What you need:</strong> Sticks, puck, two players, optional defender’s stick on the ice as a “blocker.”</p>\n<p><strong>Setup:</strong> Two players 20 feet apart. A third stick laid flat on the ice between them.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Player A puts the puck on the forehand side.</li>\n<li>Push down on the puck with the heel of the blade and roll the wrist forward as the blade scoops the puck.</li>\n<li>Puck rises off the ice in a low arc, flies over the stick on the ice, and lands flat for Player B.</li>\n<li>Player B receives with a soft stick. Reset.</li>\n<li>Do 10 passes. Switch sides.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the puck land flat or on edge? An edge landing means the wrist roll wasn’t complete. Flat landing means the saucer was clean.</p>\n<p><strong>If they’re struggling:</strong> Drop the stick blocker. Just practice the lift.</p>\n<p><strong>If they’ve got it:</strong> Add a real defender between the two passers. The saucer has to fly over a moving stick.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/hockey-puck/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Hockey pucks (6-pack) →</a> — regulation pucks for drills and scrimmage.</p>\n<p><a href=\"/go/hockey-stick-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth hockey stick →</a> — Franklin Ripper, flex rated for young players.</p>\n<p><a href=\"/what-to-buy/hockey/\">Full hockey gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Saucer Pass Intro","summary":"Lift the puck off the ice in a flat arc to clear a defender's stick. 12 minutes. Ages 11-12.","sport":"hockey","ages":["11-12"],"fundamental":"passing","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Puck flying through the air in a low flat arc above the ice, going over a defender's stick that's lying flat on the ice between two passing players.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Wrist-roll diagnostic for flat-versus-edge landing is concrete."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/hockey-saucer-pass-intro.md";
				const url = undefined;
				function rawContent() {
					return "\nA saucer pass is a flat-arc pass that flies over a defender's stick and lands flat for the receiver. It's one of the trickier passes to learn but worth it. This is what beats stick-checking defenders in tight spaces.\n\n**What you need:** Sticks, puck, two players, optional defender's stick on the ice as a \"blocker.\"\n\n**Setup:** Two players 20 feet apart. A third stick laid flat on the ice between them.\n\n**How to run it:**\n\n1. Player A puts the puck on the forehand side.\n2. Push down on the puck with the heel of the blade and roll the wrist forward as the blade scoops the puck.\n3. Puck rises off the ice in a low arc, flies over the stick on the ice, and lands flat for Player B.\n4. Player B receives with a soft stick. Reset.\n5. Do 10 passes. Switch sides.\n\n**What to watch:** Does the puck land flat or on edge? An edge landing means the wrist roll wasn't complete. Flat landing means the saucer was clean.\n\n**If they're struggling:** Drop the stick blocker. Just practice the lift.\n\n**If they've got it:** Add a real defender between the two passers. The saucer has to fly over a moving stick.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Hockey pucks (6-pack) →](/go/hockey-puck/) — regulation pucks for drills and scrimmage.\n\n[Youth hockey stick →](/go/hockey-stick-youth/) — Franklin Ripper, flex rated for young players.\n\n[Full hockey gear guide →](/what-to-buy/hockey/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
