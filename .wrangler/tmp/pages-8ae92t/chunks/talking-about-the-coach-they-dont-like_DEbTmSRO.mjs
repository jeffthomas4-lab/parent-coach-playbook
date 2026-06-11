globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Our 15-year-old came home frustrated. “Coach yelled at me.” “Coach doesn’t like me.” “Coach is unfair.” Our instinct was to either defend the coach or take our kid’s side.</p>\n<p>We did neither.</p>\n<h2 id=\"what-we-said-instead\">What we said instead</h2>\n<p>“That sounds frustrating. Tell me what happened.” We listened. We didn’t interrupt. When they were done, we asked: “What do you think the coach was trying to communicate?” We made them translate emotion back to information. Sometimes they realized the coach wasn’t yelling, they were being direct. Sometimes they saw the point.</p>\n<p>Then: “Coach is the coach. You don’t have to like them to learn from them. But you have to respect the position. What can you do differently tomorrow?” We put them in charge of the next move.</p>\n<h2 id=\"why-this-matters-at-this-age\">Why this matters at this age</h2>\n<p>At this age, kids are figuring out that not every authority figure will deliver feedback the way they want it. That’s actually the education they need right now. Most of their life will involve people they don’t naturally click with. Learning to take information from them anyway is a real skill.</p>\n<h2 id=\"where-we-draw-the-line\">Where we draw the line</h2>\n<p>If the coach is genuinely crossing a line, that’s different. Verbally abusive. Playing obvious favorites. Showing disrespect to our kid specifically. That’s a one-on-one conversation with the coach. But frustration because a coach was hard on them or didn’t play them as much as they wanted. That’s part of the sport.</p>\n<p>We help our kid understand the difference.</p>";

				const frontmatter = {"title":"Talking to Your Kid About the Coach They Don't Like","dek":"They're not wrong to be frustrated. Here's how to help them work with it anyway.","seoDescription":"Our 15-year-old came home frustrated. \"Coach yelled at me.\" \"Coach doesn't like me.\" \"Coach is unfair.\" Our instinct was to either defend the coach or take our...","topic":"communication","format":"note","phase":"drive-home","sport":"multi-sport","age":"15-plus","publishedAt":"2026-02-10T00:00:00.000Z","featured":false,"editorial":{"claudeReviewedAt":"2026-04-14T00:00:00.000Z"}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/articles/talking-about-the-coach-they-dont-like.md";
				const url = undefined;
				function rawContent() {
					return "\nOur 15-year-old came home frustrated. \"Coach yelled at me.\" \"Coach doesn't like me.\" \"Coach is unfair.\" Our instinct was to either defend the coach or take our kid's side.\n\nWe did neither.\n\n## What we said instead\n\n\"That sounds frustrating. Tell me what happened.\" We listened. We didn't interrupt. When they were done, we asked: \"What do you think the coach was trying to communicate?\" We made them translate emotion back to information. Sometimes they realized the coach wasn't yelling, they were being direct. Sometimes they saw the point.\n\nThen: \"Coach is the coach. You don't have to like them to learn from them. But you have to respect the position. What can you do differently tomorrow?\" We put them in charge of the next move.\n\n## Why this matters at this age\n\nAt this age, kids are figuring out that not every authority figure will deliver feedback the way they want it. That's actually the education they need right now. Most of their life will involve people they don't naturally click with. Learning to take information from them anyway is a real skill.\n\n## Where we draw the line\n\nIf the coach is genuinely crossing a line, that's different. Verbally abusive. Playing obvious favorites. Showing disrespect to our kid specifically. That's a one-on-one conversation with the coach. But frustration because a coach was hard on them or didn't play them as much as they wanted. That's part of the sport.\n\nWe help our kid understand the difference.\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"what-we-said-instead","text":"What we said instead"},{"depth":2,"slug":"why-this-matters-at-this-age","text":"Why this matters at this age"},{"depth":2,"slug":"where-we-draw-the-line","text":"Where we draw the line"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
