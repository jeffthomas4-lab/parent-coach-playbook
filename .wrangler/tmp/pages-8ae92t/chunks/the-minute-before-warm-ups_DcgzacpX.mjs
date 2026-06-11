globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Our kid is standing with the team, about to warm up. This is our last chance to say something. Here’s what works.</p>\n<h2 id=\"at-5-7\">At 5-7</h2>\n<p>“Have fun out there. I’m going to be watching.” That’s it. They don’t need motivation or strategy. They need permission to enjoy the thing.</p>\n<h2 id=\"at-8-10\">At 8-10</h2>\n<p>“Remember the spacing we talked about. Play where you’re supposed to play. Everything else takes care of itself.” One thing. One focus.</p>\n<h2 id=\"at-11-12\">At 11-12</h2>\n<p>“You’ve practiced this. You know what to do. Let’s play.” No new information. Just reminder that they know the answer.</p>\n<h2 id=\"at-13-14\">At 13-14</h2>\n<p>“Stay together. Support each other. That’s what wins.” Team focus, not individual focus.</p>\n<h2 id=\"at-15-plus\">At 15-plus</h2>\n<p>Nothing. They know. A last-minute speech tells them we don’t think they’re ready. They don’t need our words, they need our presence.</p>\n<h2 id=\"what-we-dont-do\">What we don’t do</h2>\n<p>Whatever age, we don’t yell. We don’t get emotional. We don’t tell them what will happen if they lose. We don’t remind them of mistakes from last week.</p>\n<p>We say the thing, we step back, we let them warm up.</p>\n<h2 id=\"the-game-itself\">The game itself</h2>\n<p>Then we take our seat. We don’t coach from the sideline. We don’t second-guess the coach. We don’t stand near our kid trying to send messages. We’re there. We’re calm. We let the team play.</p>\n<p>Our energy in the minute before the game matters more than anything we say.</p>";

				const frontmatter = {"title":"The Minute Before Warm-ups","dek":"One sentence. Your presence matters more than your words.","seoDescription":"Our kid is standing with the team, about to warm up. This is our last chance to say something. Here's what works.","topic":"game-day","format":"note","phase":"drive-home","sport":"multi-sport","age":"all-ages","publishedAt":"2026-04-26T00:00:00.000Z","featured":false};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/articles/the-minute-before-warm-ups.md";
				const url = undefined;
				function rawContent() {
					return "\nOur kid is standing with the team, about to warm up. This is our last chance to say something. Here's what works.\n\n## At 5-7\n\n\"Have fun out there. I'm going to be watching.\" That's it. They don't need motivation or strategy. They need permission to enjoy the thing.\n\n## At 8-10\n\n\"Remember the spacing we talked about. Play where you're supposed to play. Everything else takes care of itself.\" One thing. One focus.\n\n## At 11-12\n\n\"You've practiced this. You know what to do. Let's play.\" No new information. Just reminder that they know the answer.\n\n## At 13-14\n\n\"Stay together. Support each other. That's what wins.\" Team focus, not individual focus.\n\n## At 15-plus\n\nNothing. They know. A last-minute speech tells them we don't think they're ready. They don't need our words, they need our presence.\n\n## What we don't do\n\nWhatever age, we don't yell. We don't get emotional. We don't tell them what will happen if they lose. We don't remind them of mistakes from last week.\n\nWe say the thing, we step back, we let them warm up.\n\n## The game itself\n\nThen we take our seat. We don't coach from the sideline. We don't second-guess the coach. We don't stand near our kid trying to send messages. We're there. We're calm. We let the team play.\n\nOur energy in the minute before the game matters more than anything we say.\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"at-5-7","text":"At 5-7"},{"depth":2,"slug":"at-8-10","text":"At 8-10"},{"depth":2,"slug":"at-11-12","text":"At 11-12"},{"depth":2,"slug":"at-13-14","text":"At 13-14"},{"depth":2,"slug":"at-15-plus","text":"At 15-plus"},{"depth":2,"slug":"what-we-dont-do","text":"What we don’t do"},{"depth":2,"slug":"the-game-itself","text":"The game itself"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
