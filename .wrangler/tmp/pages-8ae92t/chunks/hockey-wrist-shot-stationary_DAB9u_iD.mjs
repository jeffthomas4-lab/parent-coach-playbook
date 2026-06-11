globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The wrist shot is the most useful shot a young hockey player will learn. Quick, accurate, no big windup. This drill teaches the four phases of the shot.</p>\n<p><strong>What you need:</strong> Stick, 5 pucks, a target (net or wall), ice or off-ice space.</p>\n<p><strong>Setup:</strong> Player 15 feet from the target, puck on the forehand side.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Load, Sweep, Snap, Follow.</li>\n<li>Load: weight on back foot, blade cupped behind the puck.</li>\n<li>Sweep: blade pulls forward through the puck along the ice.</li>\n<li>Snap: wrists roll over at the moment of release, the heel of the blade follows the toe.</li>\n<li>Follow: blade finishes pointing at the target, weight transfers to front foot.</li>\n</ol>\n<p><strong>What to watch:</strong> The wrist roll. Without the roll, the puck slides flat with no rise. The roll lifts the puck off the ice and adds power.</p>\n<p><strong>If they’re struggling:</strong> Reduce distance to 10 feet. Use a street hockey ball off-ice.</p>\n<p><strong>If they’ve got it:</strong> Move back to 20 feet. Add target zones (top corners). They have to hit the corners, not just the net.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/hockey-puck/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Hockey pucks (6-pack) →</a> — regulation pucks for drills and scrimmage.</p>\n<p><a href=\"/go/hockey-stick-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth hockey stick →</a> — Franklin Ripper, flex rated for young players.</p>\n<p><a href=\"/what-to-buy/hockey/\">Full hockey gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Wrist Shot Stationary","summary":"Basic wrist shot from a stationary position. 12 minutes. Ages 8-10.","sport":"hockey","ages":["8-10"],"fundamental":"shooting","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player in shooting stance with weight loaded on back foot, stick blade cupped behind the puck, ready to sweep forward and snap the wrist.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Load Sweep Snap Follow phases give a memorable structure."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/hockey-wrist-shot-stationary.md";
				const url = undefined;
				function rawContent() {
					return "\nThe wrist shot is the most useful shot a young hockey player will learn. Quick, accurate, no big windup. This drill teaches the four phases of the shot.\n\n**What you need:** Stick, 5 pucks, a target (net or wall), ice or off-ice space.\n\n**Setup:** Player 15 feet from the target, puck on the forehand side.\n\n**How to run it:**\n\n1. Cue: Load, Sweep, Snap, Follow.\n2. Load: weight on back foot, blade cupped behind the puck.\n3. Sweep: blade pulls forward through the puck along the ice.\n4. Snap: wrists roll over at the moment of release, the heel of the blade follows the toe.\n5. Follow: blade finishes pointing at the target, weight transfers to front foot.\n\n**What to watch:** The wrist roll. Without the roll, the puck slides flat with no rise. The roll lifts the puck off the ice and adds power.\n\n**If they're struggling:** Reduce distance to 10 feet. Use a street hockey ball off-ice.\n\n**If they've got it:** Move back to 20 feet. Add target zones (top corners). They have to hit the corners, not just the net.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Hockey pucks (6-pack) →](/go/hockey-puck/) — regulation pucks for drills and scrimmage.\n\n[Youth hockey stick →](/go/hockey-stick-youth/) — Franklin Ripper, flex rated for young players.\n\n[Full hockey gear guide →](/what-to-buy/hockey/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
