globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A double play starts with the shortstop making the first out at second base. The feed has to be catchable and on time so the second baseman can make the relay throw to first.</p>\n<p><strong>Equipment needed:</strong> 12 baseballs, two bases, one infield.</p>\n<p><strong>Setup:</strong> Set up at 60 feet per side. Shortstop is at short, second baseman at second, first baseman at first. You’re rolling ground balls.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Roll a grounder to the shortstop.</li>\n<li>They field it and run to second base (or near it), calling the second baseman into position.</li>\n<li>The shortstop feeds the ball to the second baseman (from the side, not front-on).</li>\n<li>The second baseman catches, steps on second, and throws to first.</li>\n<li>Do 12 reps. Rotate kids through all three positions.</li>\n</ol>\n<p><strong>What to look for:</strong> Feed accuracy and timing. A bad feed that’s too high, too low, or behind the second baseman kills the double play. Also watch the second baseman’s footwork around the bag. They should hit the bag on the inside of the baseline so they can throw to first without getting h</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Double Play Feeds","summary":"Shortstop and second baseman practice the feed from short to second. 20 minutes. Ages 11-12.","sport":"baseball","ages":["11-12"],"focus":"situational","layer":"skills","fundamental":"throwing","progression":"build","illustrationBrief":"Shortstop at short position fielding a grounder and flipping to second baseman standing at second base, with first baseman ready at first.","publishedAt":"2026-03-16T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-double-play-feeds-ages-11-12.md";
				const url = undefined;
				function rawContent() {
					return "\nA double play starts with the shortstop making the first out at second base. The feed has to be catchable and on time so the second baseman can make the relay throw to first.\n\n**Equipment needed:** 12 baseballs, two bases, one infield.\n\n**Setup:** Set up at 60 feet per side. Shortstop is at short, second baseman at second, first baseman at first. You're rolling ground balls.\n\n**How to run it:**\n\n1. Roll a grounder to the shortstop.\n2. They field it and run to second base (or near it), calling the second baseman into position.\n3. The shortstop feeds the ball to the second baseman (from the side, not front-on).\n4. The second baseman catches, steps on second, and throws to first.\n5. Do 12 reps. Rotate kids through all three positions.\n\n**What to look for:** Feed accuracy and timing. A bad feed that's too high, too low, or behind the second baseman kills the double play. Also watch the second baseman's footwork around the bag. They should hit the bag on the inside of the baseline so they can throw to first without getting h\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
