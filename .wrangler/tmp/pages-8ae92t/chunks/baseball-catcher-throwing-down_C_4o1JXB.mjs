globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>When a runner steals second, the catcher has about 3 seconds total. The catch, the stand-up, the throw, all in one motion. This is the hardest defensive play a youth catcher will ever make. Worth practicing slowly.</p>\n<p><strong>What you need:</strong> <a href=\"/go/baseball-catchers-gear-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Catcher’s gear</a>, a <a href=\"/go/baseball-catchers-mitt-32in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">catcher’s mitt</a>, 6 baseballs, a second player at second base, a pitcher (or a coach) to throw the pitch.</p>\n<p><strong>Setup:</strong> Catcher behind home plate in full gear. Second baseman at the bag. Pitcher at 46 feet from home.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Turn, Shuffle, Point, Fire. The catcher’s version is “Catch, Stand, Step, Fire.”</li>\n<li>Pitcher throws a strike to the catcher.</li>\n<li>Catcher catches, stands up by pushing off the back foot, takes a small step toward second, and throws.</li>\n<li>Time it from the catch to when the second baseman receives. Goal: under 3 seconds. Tell the catcher their time.</li>\n<li>Do 6 throws. Reset between each.</li>\n</ol>\n<p><strong>What to watch:</strong> The throwing motion. Many catchers throw flat-footed because they think speed comes from skipping the step. The step adds power and accuracy. Step every time.</p>\n<p><strong>If they’re struggling:</strong> Drop the pitch. Hand the ball to the catcher in stance. They stand up and throw.</p>\n<p><strong>If they’ve got it:</strong> Add a runner stealin</p>";

				const frontmatter = {"title":"Catcher Throw to Second","summary":"Catcher receives the pitch and throws to second base. 15 minutes. Ages 11-12.","sport":"baseball","ages":["11-12"],"fundamental":"catching","progression":"refine","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Catcher in full gear catching a pitch and standing up in one motion to throw across the diamond toward second base.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-catcher-throwing-down.md";
				const url = undefined;
				function rawContent() {
					return "\nWhen a runner steals second, the catcher has about 3 seconds total. The catch, the stand-up, the throw, all in one motion. This is the hardest defensive play a youth catcher will ever make. Worth practicing slowly.\n\n**What you need:** [Catcher's gear](/go/baseball-catchers-gear-youth/), a [catcher's mitt](/go/baseball-catchers-mitt-32in/), 6 baseballs, a second player at second base, a pitcher (or a coach) to throw the pitch.\n\n**Setup:** Catcher behind home plate in full gear. Second baseman at the bag. Pitcher at 46 feet from home.\n\n**How to run it:**\n\n1. Cue: Turn, Shuffle, Point, Fire. The catcher's version is \"Catch, Stand, Step, Fire.\"\n2. Pitcher throws a strike to the catcher.\n3. Catcher catches, stands up by pushing off the back foot, takes a small step toward second, and throws.\n4. Time it from the catch to when the second baseman receives. Goal: under 3 seconds. Tell the catcher their time.\n5. Do 6 throws. Reset between each.\n\n**What to watch:** The throwing motion. Many catchers throw flat-footed because they think speed comes from skipping the step. The step adds power and accuracy. Step every time.\n\n**If they're struggling:** Drop the pitch. Hand the ball to the catcher in stance. They stand up and throw.\n\n**If they've got it:** Add a runner stealin";
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
