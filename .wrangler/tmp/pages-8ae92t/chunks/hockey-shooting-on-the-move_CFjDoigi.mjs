globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Stationary shots don’t happen in real games. A real shot comes off the rush, off a pass, off a turnover. The shooter is moving and the goalie has less time to read it. This drill is the live-game version.</p>\n<p><strong>What you need:</strong> Stick, 5 pucks, full gear, ice rink, net or target.</p>\n<p><strong>Setup:</strong> Player at the blue line with a puck. Net at the top of the goalie crease.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Load, Sweep, Snap, Follow.</li>\n<li>Skater pushes off from the blue line carrying the puck.</li>\n<li>At the top of the faceoff circle (high slot), the skater takes a wrist or snap shot without stopping.</li>\n<li>Continue skating past the net.</li>\n<li>Pick up another puck. Repeat. 5 reps.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the skater stop to shoot? Stopping kills the shot in a game. The shot has to come out of the skating motion.</p>\n<p><strong>If they’re struggling:</strong> Slower skating speed. Or pre-stop the skater and let them shoot from set position first.</p>\n<p><strong>If they’ve got it:</strong> Add a goalie. Or add a defender chasing.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/hockey-puck/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Hockey pucks (6-pack) →</a> — regulation pucks for drills and scrimmage.</p>\n<p><a href=\"/go/hockey-stick-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth hockey stick →</a> — Franklin Ripper, flex rated for young players.</p>\n<p><a href=\"/what-to-buy/hockey/\">Full hockey gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Shooting on the Move","summary":"Take a shot off the rush while skating forward. 12 minutes. Ages 11-12.","sport":"hockey","ages":["11-12"],"fundamental":"shooting","progression":"refine","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player skating from the blue line toward the net, taking a wrist shot at the high slot, body leaning into the shot.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Stationary shots don't happen in real games is the right framing."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/hockey-shooting-on-the-move.md";
				const url = undefined;
				function rawContent() {
					return "\nStationary shots don't happen in real games. A real shot comes off the rush, off a pass, off a turnover. The shooter is moving and the goalie has less time to read it. This drill is the live-game version.\n\n**What you need:** Stick, 5 pucks, full gear, ice rink, net or target.\n\n**Setup:** Player at the blue line with a puck. Net at the top of the goalie crease.\n\n**How to run it:**\n\n1. Cue: Load, Sweep, Snap, Follow.\n2. Skater pushes off from the blue line carrying the puck.\n3. At the top of the faceoff circle (high slot), the skater takes a wrist or snap shot without stopping.\n4. Continue skating past the net.\n5. Pick up another puck. Repeat. 5 reps.\n\n**What to watch:** Does the skater stop to shoot? Stopping kills the shot in a game. The shot has to come out of the skating motion.\n\n**If they're struggling:** Slower skating speed. Or pre-stop the skater and let them shoot from set position first.\n\n**If they've got it:** Add a goalie. Or add a defender chasing.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Hockey pucks (6-pack) →](/go/hockey-puck/) — regulation pucks for drills and scrimmage.\n\n[Youth hockey stick →](/go/hockey-stick-youth/) — Franklin Ripper, flex rated for young players.\n\n[Full hockey gear guide →](/what-to-buy/hockey/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
