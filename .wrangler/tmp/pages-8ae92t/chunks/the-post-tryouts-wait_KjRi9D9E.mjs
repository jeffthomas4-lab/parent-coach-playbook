globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The hardest part of tryouts is rarely the tryout. It’s the hours and days after, when nothing is happening and the kid is in their head about it.</p>\n<p>A few things to know about that gap.</p>\n<p><strong>They are replaying every miss.</strong> Not the makes. The miss they did in the third drill, the time they dropped the ball, the moment the coach turned away. Even high-confidence kids do this. It’s the brain’s way of preparing for bad news.</p>\n<p><strong>They will pretend they don’t care.</strong> Some kids talk about tryouts constantly during the wait. Most don’t. The not-talking is usually not indifference. It is protection.</p>\n<p><strong>They will read your body language for clues.</strong> If you’re anxious about the result, they will assume you’ve heard something. If you’re relaxed, they will be a little calmer.</p>\n<p>What to do in the wait.</p>\n<p>Keep the schedule normal. Don’t add extra training “in case.” That signals doubt.</p>\n<p>Don’t recap the tryout. The post-mortem is over. Re-litigating “well, you should have run harder on the third drill” does nothing now.</p>\n<p>Make a small distraction available. A movie, a meal out, an unrelated activity. Not as a bribe. As a way to fill the hours that would otherwise be replay loops.</p>\n<p>Have your reaction ready for either outcome. The “we made it” reaction is easy. The “we didn’t” reaction needs a few hours of advance thought so you don’t fumble the first 90 seconds. (See the <a href=\"/drive-home/the-90-second-rule/\">first 90 seconds rule</a> for that.)</p>\n<p>The wait ends. The call comes. The relationship after the call is what your kid will actually remember.</p>";

				const frontmatter = {"title":"The post-tryouts wait","dek":"What to say (and not say) in the 48 hours between tryouts and the call. The inside of your kid's head while they wait.","seoDescription":"The hardest part of tryouts is rarely the tryout. It's the hours and days after, when nothing is happening and the kid is in their head about it.","topic":"tryouts","format":"note","phase":"drive-home","sport":"multi-sport","age":"11-12","publishedAt":"2026-05-13T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":9,"originalityGrade":9,"voiceGrade":9,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"affiliateDisclosurePresent":false,"claudeReviewedAt":"2026-04-10T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Captures the specific dread of the post-tryouts gap. Genuinely useful for parents."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/articles/the-post-tryouts-wait.md";
				const url = undefined;
				function rawContent() {
					return "\nThe hardest part of tryouts is rarely the tryout. It's the hours and days after, when nothing is happening and the kid is in their head about it.\n\nA few things to know about that gap.\n\n**They are replaying every miss.** Not the makes. The miss they did in the third drill, the time they dropped the ball, the moment the coach turned away. Even high-confidence kids do this. It's the brain's way of preparing for bad news.\n\n**They will pretend they don't care.** Some kids talk about tryouts constantly during the wait. Most don't. The not-talking is usually not indifference. It is protection.\n\n**They will read your body language for clues.** If you're anxious about the result, they will assume you've heard something. If you're relaxed, they will be a little calmer.\n\nWhat to do in the wait.\n\nKeep the schedule normal. Don't add extra training \"in case.\" That signals doubt.\n\nDon't recap the tryout. The post-mortem is over. Re-litigating \"well, you should have run harder on the third drill\" does nothing now.\n\nMake a small distraction available. A movie, a meal out, an unrelated activity. Not as a bribe. As a way to fill the hours that would otherwise be replay loops.\n\nHave your reaction ready for either outcome. The \"we made it\" reaction is easy. The \"we didn't\" reaction needs a few hours of advance thought so you don't fumble the first 90 seconds. (See the [first 90 seconds rule](/drive-home/the-90-second-rule/) for that.)\n\nThe wait ends. The call comes. The relationship after the call is what your kid will actually remember.\n";
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
