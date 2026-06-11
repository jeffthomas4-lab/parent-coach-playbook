globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Real lacrosse is sprinting with the ball. The cradle has to hold up at full speed and through cuts. This drill puts the kid in motion and tests whether the cradle works under pressure.</p>\n<p><strong>What you need:</strong> Lacrosse stick, ball, 4 cones, 20-yard area.</p>\n<p><strong>Setup:</strong> Cones in a zigzag pattern, 5 yards apart.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Grip, Roll, Cup, Run. Now the Run is real.</li>\n<li>Kid starts at the first cone with the ball in the stick.</li>\n<li>Sprint to the second cone, cut, sprint to the third.</li>\n<li>Continue through all the cones.</li>\n<li>Do 4 trips. Reset the ball if it drops.</li>\n</ol>\n<p><strong>What to watch:</strong> When the ball drops, what was the trigger? A hard cut? A switching of hands? The drop tells you what part of the cradle needs work.</p>\n<p><strong>If they’re struggling:</strong> Slow to a jog. Fewer cones. Or use a heavier ball.</p>\n<p><strong>If they’ve got it:</strong> Add a defender chasing. Cradle has to hold under pressure.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/lacrosse-ball/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Lacrosse balls (6-pack) →</a> — NOCSAE-stamped practice balls.</p>\n<p><a href=\"/go/lacrosse-starter-kit-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">STX Stallion complete stick →</a> — beginner stick for first-season players.</p>\n<p><a href=\"/what-to-buy/lacrosse-girls/\">Full lacrosse (girls) gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Cradle on the Run","summary":"Sprint while cradling, hold the ball through changes of direction. 12 minutes. Ages 8-10.","sport":"lacrosse-girls","ages":["8-10"],"fundamental":"cradling","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player sprinting through cones while cradling the ball, the stick swinging in rhythm with the running stride.","editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Cradle vocab clean throughout."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/lacrosse-girls-cradle-on-the-run.md";
				const url = undefined;
				function rawContent() {
					return "\nReal lacrosse is sprinting with the ball. The cradle has to hold up at full speed and through cuts. This drill puts the kid in motion and tests whether the cradle works under pressure.\n\n**What you need:** Lacrosse stick, ball, 4 cones, 20-yard area.\n\n**Setup:** Cones in a zigzag pattern, 5 yards apart.\n\n**How to run it:**\n\n1. Cue: Grip, Roll, Cup, Run. Now the Run is real.\n2. Kid starts at the first cone with the ball in the stick.\n3. Sprint to the second cone, cut, sprint to the third.\n4. Continue through all the cones.\n5. Do 4 trips. Reset the ball if it drops.\n\n**What to watch:** When the ball drops, what was the trigger? A hard cut? A switching of hands? The drop tells you what part of the cradle needs work.\n\n**If they're struggling:** Slow to a jog. Fewer cones. Or use a heavier ball.\n\n**If they've got it:** Add a defender chasing. Cradle has to hold under pressure.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Lacrosse balls (6-pack) →](/go/lacrosse-ball/) — NOCSAE-stamped practice balls.\n\n[STX Stallion complete stick →](/go/lacrosse-starter-kit-youth/) — beginner stick for first-season players.\n\n[Full lacrosse (girls) gear guide →](/what-to-buy/lacrosse-girls/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
