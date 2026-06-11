globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Kids throw with their arms because they don’t know the legs are part of the throw. The step toward the target adds power and points the throw where they want it to go. This drill links the foot and the arm.</p>\n<p><strong>What you need:</strong> 6 baseballs, a glove, a partner.</p>\n<p><strong>Setup:</strong> Stand 20 feet apart. Mark a line with a stick or a chalk line where the kid stands.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Walk through the cue: Turn, Shuffle, Point, Fire. Today we focus on Shuffle and Fire.</li>\n<li>Have them stand sideways with the throwing-side foot on the line. Glove-side foot in front.</li>\n<li>Drill 1 (5 reps): they shuffle the back foot toward the front foot, then step the front foot toward you, then throw. Stop after every throw to reset.</li>\n<li>Drill 2 (5 reps): same motion but at full speed. No stop.</li>\n<li>Last 5: they catch your throw and have to do the full motion before they throw back.</li>\n</ol>\n<p><strong>What to watch:</strong> The front foot has to land before the ball leaves the hand. If the throw happens before the foot lands, it’s an arm throw. Foot first, then throw.</p>\n<p><strong>If they’re struggling:</strong> Skip the shuffle. Just have them step with the front foot and throw. Add the shuffle next session.</p>\n<p><strong>If they’ve got it:</strong> Move back to 30 feet. The longer distance forces them to use the legs or the throw won’t get there.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Step and Throw","summary":"Add the front-foot step to the throwing motion. 12 minutes. Ages 5-7 and 8-10.","sport":"baseball","ages":["5-7","8-10"],"fundamental":"throwing","progression":"build","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Sequence of three drawings showing a child turning sideways, stepping forward with the glove-side foot, and releasing a throw.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-step-and-throw.md";
				const url = undefined;
				function rawContent() {
					return "\nKids throw with their arms because they don't know the legs are part of the throw. The step toward the target adds power and points the throw where they want it to go. This drill links the foot and the arm.\n\n**What you need:** 6 baseballs, a glove, a partner.\n\n**Setup:** Stand 20 feet apart. Mark a line with a stick or a chalk line where the kid stands.\n\n**How to run it:**\n\n1. Walk through the cue: Turn, Shuffle, Point, Fire. Today we focus on Shuffle and Fire.\n2. Have them stand sideways with the throwing-side foot on the line. Glove-side foot in front.\n3. Drill 1 (5 reps): they shuffle the back foot toward the front foot, then step the front foot toward you, then throw. Stop after every throw to reset.\n4. Drill 2 (5 reps): same motion but at full speed. No stop.\n5. Last 5: they catch your throw and have to do the full motion before they throw back.\n\n**What to watch:** The front foot has to land before the ball leaves the hand. If the throw happens before the foot lands, it's an arm throw. Foot first, then throw.\n\n**If they're struggling:** Skip the shuffle. Just have them step with the front foot and throw. Add the shuffle next session.\n\n**If they've got it:** Move back to 30 feet. The longer distance forces them to use the legs or the throw won't get there.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
