globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>X is the spot directly behind the goal. Attackers drive from X and shoot from the wings. This is one of the most common lacrosse plays. The drill builds the footwork and the shot together.</p>\n<p><strong>What you need:</strong> Lacrosse stick, 5 balls, lacrosse goal, optional defender.</p>\n<p><strong>Setup:</strong> Player at X (5 yards behind the goal). Goal in front.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Pull, Step, Snap, Follow.</li>\n<li>Player drives from X toward the right wing. Cradle while running.</li>\n<li>As they reach the wing (5 yards from the goal line), they pull the stick back and shoot.</li>\n<li>Aim for the far side of the goal (top left for a right-handed shot from the right wing).</li>\n<li>Do 4 reps from the right wing, 4 from the left.</li>\n</ol>\n<p><strong>What to watch:</strong> Body position at the shot. The shoulders should turn toward the goal at release. If the shoulders are still toward the wing, the shot pulls wide.</p>\n<p><strong>If they’re struggling:</strong> Drop the drive. Stationary shot from the wing.</p>\n<p><strong>If they’ve got it:</strong> Add a defender from the goal line forcing the drive wide.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/lacrosse-ball/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Lacrosse balls (6-pack) →</a> — NOCSAE-stamped practice balls.</p>\n<p><a href=\"/go/lacrosse-starter-kit-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">STX Stallion complete stick →</a> — beginner stick for first-season players.</p>\n<p><a href=\"/what-to-buy/lacrosse-girls/\">Full lacrosse (girls) gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Shot from X","summary":"Drive from behind the goal and shoot. 12 minutes. Ages 11-12.","sport":"lacrosse-girls","ages":["11-12"],"fundamental":"shooting","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player driving from behind the goal (the X position), wrapping around the side to shoot at the open net.","editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"X behind the goal is shared lacrosse terminology and reads correctly here. Note: faceoff X is boys'-specific, but X-behind-goal applies to both."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/lacrosse-girls-shot-from-x.md";
				const url = undefined;
				function rawContent() {
					return "\nX is the spot directly behind the goal. Attackers drive from X and shoot from the wings. This is one of the most common lacrosse plays. The drill builds the footwork and the shot together.\n\n**What you need:** Lacrosse stick, 5 balls, lacrosse goal, optional defender.\n\n**Setup:** Player at X (5 yards behind the goal). Goal in front.\n\n**How to run it:**\n\n1. Cue: Pull, Step, Snap, Follow.\n2. Player drives from X toward the right wing. Cradle while running.\n3. As they reach the wing (5 yards from the goal line), they pull the stick back and shoot.\n4. Aim for the far side of the goal (top left for a right-handed shot from the right wing).\n5. Do 4 reps from the right wing, 4 from the left.\n\n**What to watch:** Body position at the shot. The shoulders should turn toward the goal at release. If the shoulders are still toward the wing, the shot pulls wide.\n\n**If they're struggling:** Drop the drive. Stationary shot from the wing.\n\n**If they've got it:** Add a defender from the goal line forcing the drive wide.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Lacrosse balls (6-pack) →](/go/lacrosse-ball/) — NOCSAE-stamped practice balls.\n\n[STX Stallion complete stick →](/go/lacrosse-starter-kit-youth/) — beginner stick for first-season players.\n\n[Full lacrosse (girls) gear guide →](/what-to-buy/lacrosse-girls/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
