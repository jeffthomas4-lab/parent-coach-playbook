globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The snap shot is faster than a wrist shot. Smaller windup, harder release. The puck leaves the blade quicker so the goalie has less time to react. Worth learning at 10 because in a real game, time is the difference between a goal and a save.</p>\n<p><strong>What you need:</strong> Stick, 5 pucks, a target.</p>\n<p><strong>Setup:</strong> Player 15 feet from the target.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Load, Sweep, Snap, Follow. The Sweep is shorter on a snap shot.</li>\n<li>Load: blade behind the puck, only a 6-inch backswing.</li>\n<li>Sweep: pull the blade forward fast, but only a short distance.</li>\n<li>Snap: hard wrist snap at release. This is what generates the speed.</li>\n<li>Follow: blade finishes high, pointing at the target.</li>\n</ol>\n<p><strong>What to watch:</strong> The wrist snap. A weak snap turns the snap shot into a slow wrist shot. The wrist has to crack like a whip at release.</p>\n<p><strong>If they’re struggling:</strong> Stay with the wrist shot for now. Add the snap shot when the wrist shot is solid.</p>\n<p><strong>If they’ve got it:</strong> Add movement. Take the snap shot off a one-stride approach. Or off a pass.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/hockey-puck/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Hockey pucks (6-pack) →</a> — regulation pucks for drills and scrimmage.</p>\n<p><a href=\"/go/hockey-stick-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth hockey stick →</a> — Franklin Ripper, flex rated for young players.</p>\n<p><a href=\"/what-to-buy/hockey/\">Full hockey gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Snap Shot Intro","summary":"Quick release shot with a small windup. 10 minutes. Ages 8-10 and 11-12.","sport":"hockey","ages":["8-10","11-12"],"fundamental":"shooting","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player taking a quick snap shot with a 6-inch backswing, releasing the puck with a hard wrist snap and the stick lifting off the ice.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"6-inch backswing number gives a real measurable shape to the cue."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/hockey-snap-shot-intro.md";
				const url = undefined;
				function rawContent() {
					return "\nThe snap shot is faster than a wrist shot. Smaller windup, harder release. The puck leaves the blade quicker so the goalie has less time to react. Worth learning at 10 because in a real game, time is the difference between a goal and a save.\n\n**What you need:** Stick, 5 pucks, a target.\n\n**Setup:** Player 15 feet from the target.\n\n**How to run it:**\n\n1. Cue: Load, Sweep, Snap, Follow. The Sweep is shorter on a snap shot.\n2. Load: blade behind the puck, only a 6-inch backswing.\n3. Sweep: pull the blade forward fast, but only a short distance.\n4. Snap: hard wrist snap at release. This is what generates the speed.\n5. Follow: blade finishes high, pointing at the target.\n\n**What to watch:** The wrist snap. A weak snap turns the snap shot into a slow wrist shot. The wrist has to crack like a whip at release.\n\n**If they're struggling:** Stay with the wrist shot for now. Add the snap shot when the wrist shot is solid.\n\n**If they've got it:** Add movement. Take the snap shot off a one-stride approach. Or off a pass.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Hockey pucks (6-pack) →](/go/hockey-puck/) — regulation pucks for drills and scrimmage.\n\n[Youth hockey stick →](/go/hockey-stick-youth/) — Franklin Ripper, flex rated for young players.\n\n[Full hockey gear guide →](/what-to-buy/hockey/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
