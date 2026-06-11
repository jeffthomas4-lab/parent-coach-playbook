globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>When a ball is rolling slow and the runner is fast, the glove is too slow. The throwing hand picks up the ball directly and the throw comes out of the run. This is the play third basemen and pitchers make on bunts and dribblers.</p>\n<p><strong>What you need:</strong> A glove (still worn, just not used for the catch), 8 baseballs, a target (parent with a glove or a fence).</p>\n<p><strong>Setup:</strong> Kid stands 30 feet from where the slow roller starts. Target 60 feet behind the kid (at first base distance).</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Drop, Show, Funnel, Send. On a bare-hand pickup, Show is the throwing hand, not the glove.</li>\n<li>Roll a slow ball that won’t make it to the kid.</li>\n<li>They charge forward, drop the glove arm down for balance, and scoop the ball with the bare hand. The throw comes from a low arm slot, sidearm, while moving forward.</li>\n<li>Do 5 reps.</li>\n<li>Last 5: roll the ball slightly to either side. They have to charge and adjust.</li>\n</ol>\n<p><strong>What to watch:</strong> Where the throwing hand grips the ball. If they grab from the top, the throw is awkward. If they scoop from below with the fingers under the ball, the throw comes out clean.</p>\n<p><strong>If they’re struggling:</strong> Drop the throw. Just have them charge and pick up the ball cleanly. Add the throw later.</p>\n<p><strong>If they’ve got it:</strong> Add a runner. The throw has to beat the runner to first.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Slow Roller Bare Hand","summary":"Pick up a slow grounder with the bare hand on the run. 12 minutes. Ages 11-12.","sport":"baseball","ages":["11-12"],"fundamental":"fielding","progression":"refine","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A child running forward and reaching down with the throwing hand to scoop a slowly rolling baseball, glove dropped to the side.","editorial":{"qualityGrade":8,"originalityGrade":8,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-slow-roller-bare-hand.md";
				const url = undefined;
				function rawContent() {
					return "\nWhen a ball is rolling slow and the runner is fast, the glove is too slow. The throwing hand picks up the ball directly and the throw comes out of the run. This is the play third basemen and pitchers make on bunts and dribblers.\n\n**What you need:** A glove (still worn, just not used for the catch), 8 baseballs, a target (parent with a glove or a fence).\n\n**Setup:** Kid stands 30 feet from where the slow roller starts. Target 60 feet behind the kid (at first base distance).\n\n**How to run it:**\n\n1. Cue: Drop, Show, Funnel, Send. On a bare-hand pickup, Show is the throwing hand, not the glove.\n2. Roll a slow ball that won't make it to the kid.\n3. They charge forward, drop the glove arm down for balance, and scoop the ball with the bare hand. The throw comes from a low arm slot, sidearm, while moving forward.\n4. Do 5 reps.\n5. Last 5: roll the ball slightly to either side. They have to charge and adjust.\n\n**What to watch:** Where the throwing hand grips the ball. If they grab from the top, the throw is awkward. If they scoop from below with the fingers under the ball, the throw comes out clean.\n\n**If they're struggling:** Drop the throw. Just have them charge and pick up the ball cleanly. Add the throw later.\n\n**If they've got it:** Add a runner. The throw has to beat the runner to first.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
