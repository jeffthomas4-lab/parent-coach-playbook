globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A stationary scoop is just the start. Real games have rolling ground balls and the scooper is sprinting. This drill puts the kid in motion. Body has to drop low without losing speed.</p>\n<p><strong>What you need:</strong> Stick, balls, open grass, 20-yard area.</p>\n<p><strong>Setup:</strong> Player at one end of the area. Coach at the other end with a pile of balls.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Coach rolls a ball toward the player.</li>\n<li>Player sprints forward toward the ball.</li>\n<li>As they approach, drop the body low. Stick head goes under the ball.</li>\n<li>Scoop and continue running. Cradle the ball.</li>\n<li>Do 6 reps. Mix the angles of the rolled balls.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the kid slow down to scoop? Slowing means a defender catches up in a game. The scoop has to come out of the run.</p>\n<p><strong>If they’re struggling:</strong> Slower rolls. Or pre-stop the player and let them scoop without running.</p>\n<p><strong>If they’ve got it:</strong> Add a defender chasing. Or two players competing for the same ground ball.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/lacrosse-ball/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Lacrosse balls (6-pack) →</a> — NOCSAE-stamped practice balls.</p>\n<p><a href=\"/go/lacrosse-starter-kit-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">STX Stallion complete stick →</a> — shaft and head combo for new players.</p>\n<p><a href=\"/what-to-buy/lacrosse-boys/\">Full lacrosse (boys) gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Scoop on the Run","summary":"Pick up a ground ball while sprinting forward. 12 minutes. Ages 8-10 and 11-12.","sport":"lacrosse-boys","ages":["8-10","11-12"],"fundamental":"ground-balls","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player sprinting forward, dropping low to scoop a rolling ball without breaking stride, then continuing to run.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean scoop-on-the-run progression."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/lacrosse-boys-scoop-on-the-run.md";
				const url = undefined;
				function rawContent() {
					return "\nA stationary scoop is just the start. Real games have rolling ground balls and the scooper is sprinting. This drill puts the kid in motion. Body has to drop low without losing speed.\n\n**What you need:** Stick, balls, open grass, 20-yard area.\n\n**Setup:** Player at one end of the area. Coach at the other end with a pile of balls.\n\n**How to run it:**\n\n1. Coach rolls a ball toward the player.\n2. Player sprints forward toward the ball.\n3. As they approach, drop the body low. Stick head goes under the ball.\n4. Scoop and continue running. Cradle the ball.\n5. Do 6 reps. Mix the angles of the rolled balls.\n\n**What to watch:** Does the kid slow down to scoop? Slowing means a defender catches up in a game. The scoop has to come out of the run.\n\n**If they're struggling:** Slower rolls. Or pre-stop the player and let them scoop without running.\n\n**If they've got it:** Add a defender chasing. Or two players competing for the same ground ball.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Lacrosse balls (6-pack) →](/go/lacrosse-ball/) — NOCSAE-stamped practice balls.\n\n[STX Stallion complete stick →](/go/lacrosse-starter-kit-youth/) — shaft and head combo for new players.\n\n[Full lacrosse (boys) gear guide →](/what-to-buy/lacrosse-boys/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
