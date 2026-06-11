globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Our kid’s best friend played on the same team last year. This year they split to different teams. Our kid was upset. They wanted to switch. They were sad at practice.</p>\n<p>Our instinct was to make a call. Instead, we sat with the hard moment.</p>\n<h2 id=\"what-we-said\">What we said</h2>\n<p>“I know you miss them. That’s real. You’re going to be okay. You’re going to make new friends on this team. And you’ll still see them outside of practice.”</p>\n<p>We helped them find what was good about the situation. “This team has different players. You’re going to meet people you wouldn’t have met otherwise. That’s actually good.”</p>\n<p>We arranged hangouts outside of team stuff. “Can they come to dinner Friday?” Not as a replacement for the team, but as a way to keep the friendship separate from sports. When friendship and team split, friendship usually wins out. We gave them a way to have both.</p>\n<h2 id=\"why-this-matters\">Why this matters</h2>\n<p>At 11-12, this is actually a good problem to have. They’re learning that people they love don’t have to be on all their teams. They’re learning to build different friendships in different places. That’s a real life skill.</p>\n<p>Some kids go through a hard transition and come out stronger. Some kids stay attached to the old team and never bond with the new one. Our job is to help them look forward, not backward.</p>\n<h2 id=\"the-patience-part\">The patience part</h2>\n<p>By the end of the season, they’ll have built a place on the new team. The friendship will still be there. They’ll be happier than if we’d just switched them back.</p>";

				const frontmatter = {"title":"The 11-12 Best Friend on a Different Team","dek":"You can't fix this by moving them. You can help them build resilience around it.","seoDescription":"Our kid's best friend played on the same team last year. This year they split to different teams. Our kid was upset. They wanted to switch.","topic":"the-hard-stuff","format":"note","phase":"drive-home","sport":"multi-sport","age":"11-12","publishedAt":"2026-03-06T00:00:00.000Z","featured":false,"editorial":{"claudeReviewedAt":"2026-05-20T00:00:00.000Z"}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/articles/the-11-to-12-best-friend-on-a-different-team.md";
				const url = undefined;
				function rawContent() {
					return "\nOur kid's best friend played on the same team last year. This year they split to different teams. Our kid was upset. They wanted to switch. They were sad at practice.\n\nOur instinct was to make a call. Instead, we sat with the hard moment.\n\n## What we said\n\n\"I know you miss them. That's real. You're going to be okay. You're going to make new friends on this team. And you'll still see them outside of practice.\"\n\nWe helped them find what was good about the situation. \"This team has different players. You're going to meet people you wouldn't have met otherwise. That's actually good.\"\n\nWe arranged hangouts outside of team stuff. \"Can they come to dinner Friday?\" Not as a replacement for the team, but as a way to keep the friendship separate from sports. When friendship and team split, friendship usually wins out. We gave them a way to have both.\n\n## Why this matters\n\nAt 11-12, this is actually a good problem to have. They're learning that people they love don't have to be on all their teams. They're learning to build different friendships in different places. That's a real life skill.\n\nSome kids go through a hard transition and come out stronger. Some kids stay attached to the old team and never bond with the new one. Our job is to help them look forward, not backward.\n\n## The patience part\n\nBy the end of the season, they'll have built a place on the new team. The friendship will still be there. They'll be happier than if we'd just switched them back.\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"what-we-said","text":"What we said"},{"depth":2,"slug":"why-this-matters","text":"Why this matters"},{"depth":2,"slug":"the-patience-part","text":"The patience part"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
