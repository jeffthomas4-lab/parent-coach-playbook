globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The first week off the season is a slow-motion identity adjustment. Kids who built their week around a sport for four months don’t know what to do with themselves. They mope. They pick fights with siblings. They say “I’m bored” 11 times a day.</p>\n<p>The temptation is to fix it. Sign up for a summer league, a clinic, a private trainer, a different sport. Anything to fill the void.</p>\n<p>Wait two weeks before doing any of that.</p>\n<p>The 14-day rule is simple: do nothing about the boredom for 14 days. Don’t add a sport. Don’t sign up for the camp. Don’t enroll in lessons. Let the kid be bored.</p>\n<p>Three things tend to happen.</p>\n<p>By day four they find something to do that has nothing to do with sports. They build something, draw something, get into a video game with a friend, read a series. The space gets filled.</p>\n<p>By day seven they tell you what they actually missed about the season. Sometimes it’s the team. Sometimes it’s the routine. Sometimes it’s a specific person. That information is gold for the next season decision.</p>\n<p>By day eleven they ask, on their own, when the next thing starts. Or they don’t. Either is information.</p>\n<p>The decision you make on day fifteen is much better than the decision you would have made on day three. The fifteenth-day decision is based on what your kid actually wants. The third-day decision is based on your discomfort with their boredom.</p>\n<p>The off-season is when kids find out what they’re like when nobody is keeping score. Don’t take that away in week one because you’re uncomfortable with the silence.</p>";

				const frontmatter = {"title":"The kid who is bored in the off-season","dek":"Boredom in the first off-season week is a feature, not a problem. The 14-day rule before you sign up for another league.","seoDescription":"The first week off the season is a slow-motion identity adjustment. Kids who built their week around a sport for four months don't know what to do with...","topic":"the-hard-stuff","format":"note","phase":"drive-there","sport":"multi-sport","age":"8-10","publishedAt":"2026-05-13T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":8,"originalityGrade":9,"voiceGrade":9,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"affiliateDisclosurePresent":false,"claudeReviewedAt":"2026-04-22T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"The 14-day rule is the genuinely useful frame."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/articles/the-bored-off-season-kid.md";
				const url = undefined;
				function rawContent() {
					return "\nThe first week off the season is a slow-motion identity adjustment. Kids who built their week around a sport for four months don't know what to do with themselves. They mope. They pick fights with siblings. They say \"I'm bored\" 11 times a day.\n\nThe temptation is to fix it. Sign up for a summer league, a clinic, a private trainer, a different sport. Anything to fill the void.\n\nWait two weeks before doing any of that.\n\nThe 14-day rule is simple: do nothing about the boredom for 14 days. Don't add a sport. Don't sign up for the camp. Don't enroll in lessons. Let the kid be bored.\n\nThree things tend to happen.\n\nBy day four they find something to do that has nothing to do with sports. They build something, draw something, get into a video game with a friend, read a series. The space gets filled.\n\nBy day seven they tell you what they actually missed about the season. Sometimes it's the team. Sometimes it's the routine. Sometimes it's a specific person. That information is gold for the next season decision.\n\nBy day eleven they ask, on their own, when the next thing starts. Or they don't. Either is information.\n\nThe decision you make on day fifteen is much better than the decision you would have made on day three. The fifteenth-day decision is based on what your kid actually wants. The third-day decision is based on your discomfort with their boredom.\n\nThe off-season is when kids find out what they're like when nobody is keeping score. Don't take that away in week one because you're uncomfortable with the silence.\n";
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
