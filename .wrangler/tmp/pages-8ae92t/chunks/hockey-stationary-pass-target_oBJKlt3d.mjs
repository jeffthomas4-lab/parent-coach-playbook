globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A pass is a controlled push of the puck to a target. The blade stays low, the puck slides flat, the follow-through points at the receiver. Most kids slap at the puck. This drill teaches them to push.</p>\n<p><strong>What you need:</strong> Sticks, pucks, two players, ice or off-ice space.</p>\n<p><strong>Setup:</strong> Two players 15 feet apart facing each other.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Player A puts the puck on the forehand side.</li>\n<li>Push the puck along the ice toward Player B’s stick. Follow through with the blade pointing at the target.</li>\n<li>Player B receives with a soft stick (gives a little so the puck doesn’t bounce off).</li>\n<li>Player B passes back. Same motion.</li>\n<li>Do 20 passes total.</li>\n</ol>\n<p><strong>What to watch:</strong> The follow-through. The blade should finish pointing at the partner’s stick. If the blade scoops up, the puck flips off the ice.</p>\n<p><strong>If they’re struggling:</strong> Move closer to 8 feet. Or use a street hockey ball off-ice.</p>\n<p><strong>If they’ve got it:</strong> Move back to 25 feet. Add a tape target on the partner’s stick. They have to hit the tape.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/hockey-puck/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Hockey pucks (6-pack) →</a> — regulation pucks for drills and scrimmage.</p>\n<p><a href=\"/go/hockey-stick-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth hockey stick →</a> — Franklin Ripper, flex rated for young players.</p>\n<p><a href=\"/what-to-buy/hockey/\">Full hockey gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Stationary Pass to Target","summary":"Pass the puck to a stationary partner at 15 feet. 10 minutes. Ages 8-10.","sport":"hockey","ages":["8-10"],"fundamental":"passing","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Two players facing each other 15 feet apart, one passing a puck along the ice with a flat blade follow-through pointing at the partner's stick.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Push not slap framing is the right diagnostic for new passers."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/hockey-stationary-pass-target.md";
				const url = undefined;
				function rawContent() {
					return "\nA pass is a controlled push of the puck to a target. The blade stays low, the puck slides flat, the follow-through points at the receiver. Most kids slap at the puck. This drill teaches them to push.\n\n**What you need:** Sticks, pucks, two players, ice or off-ice space.\n\n**Setup:** Two players 15 feet apart facing each other.\n\n**How to run it:**\n\n1. Player A puts the puck on the forehand side.\n2. Push the puck along the ice toward Player B's stick. Follow through with the blade pointing at the target.\n3. Player B receives with a soft stick (gives a little so the puck doesn't bounce off).\n4. Player B passes back. Same motion.\n5. Do 20 passes total.\n\n**What to watch:** The follow-through. The blade should finish pointing at the partner's stick. If the blade scoops up, the puck flips off the ice.\n\n**If they're struggling:** Move closer to 8 feet. Or use a street hockey ball off-ice.\n\n**If they've got it:** Move back to 25 feet. Add a tape target on the partner's stick. They have to hit the tape.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Hockey pucks (6-pack) →](/go/hockey-puck/) — regulation pucks for drills and scrimmage.\n\n[Youth hockey stick →](/go/hockey-stick-youth/) — Franklin Ripper, flex rated for young players.\n\n[Full hockey gear guide →](/what-to-buy/hockey/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
