globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Our 15-year-old said they were bored. The practices were boring. The games were boring. They were thinking about quitting.</p>\n<p>We asked: “What would make it not boring?”</p>\n<h2 id=\"what-their-answer-tells-us\">What their answer tells us</h2>\n<p>If the answer is “I’d need to start” or “I’d need to play more,” they’re not bored by the sport. They’re frustrated. That’s a different conversation. And the answer is still the same: earn it or accept it.</p>\n<p>If the answer is “I don’t like the coach” or “The team has a bad vibe,” that’s worth listening to. Some teams are genuinely bad environments. Some coaches are genuinely not good. If we believe our kid, we help them find something else.</p>\n<p>If the answer is “I don’t know, I’m just over it,” they might actually be done. That’s okay at 15. Not everything is a forever thing. Some kids play through high school. Some play for two years and move on. Both are fine.</p>\n<h2 id=\"the-hard-question-for-us\">The hard question for us</h2>\n<p>Before we let them quit, we ask ourselves if we’re projecting our investment onto their choice. Some parents treat their kid’s sport like it’s their own career. If our kid says they’re bored and we immediately think “but you’re so good” or “but we just paid for fall camp,” we’re making it about us.</p>\n<h2 id=\"whats-actually-true\">What’s actually true</h2>\n<p>Their boredom might be real. It might be a sign they’re ready to try something else or that this team isn’t the fit. Or it might be a sign they’re 15 and everything feels boring right now. That’s normal.</p>\n<p>We talk to the coach. We get their read. We talk to our kid about what would actually make it interesting. Then we make the call together. If they genuinely want to stop, stopping is an option. If they’re just being 15, sometimes pushing through the boring part is the answer.</p>";

				const frontmatter = {"title":"The 15-Plus Kid Who Is Bored","dek":"They're not bored by the sport. They're frustrated by their role. That's different.","seoDescription":"Our 15-year-old said they were bored. The practices were boring. The games were boring. They were thinking about quitting.","topic":"the-hard-stuff","format":"note","phase":"drive-home","sport":"multi-sport","age":"15-plus","publishedAt":"2026-03-20T00:00:00.000Z","featured":false};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/articles/the-15-plus-kid-who-is-bored.md";
				const url = undefined;
				function rawContent() {
					return "\nOur 15-year-old said they were bored. The practices were boring. The games were boring. They were thinking about quitting.\n\nWe asked: \"What would make it not boring?\"\n\n## What their answer tells us\n\nIf the answer is \"I'd need to start\" or \"I'd need to play more,\" they're not bored by the sport. They're frustrated. That's a different conversation. And the answer is still the same: earn it or accept it.\n\nIf the answer is \"I don't like the coach\" or \"The team has a bad vibe,\" that's worth listening to. Some teams are genuinely bad environments. Some coaches are genuinely not good. If we believe our kid, we help them find something else.\n\nIf the answer is \"I don't know, I'm just over it,\" they might actually be done. That's okay at 15. Not everything is a forever thing. Some kids play through high school. Some play for two years and move on. Both are fine.\n\n## The hard question for us\n\nBefore we let them quit, we ask ourselves if we're projecting our investment onto their choice. Some parents treat their kid's sport like it's their own career. If our kid says they're bored and we immediately think \"but you're so good\" or \"but we just paid for fall camp,\" we're making it about us.\n\n## What's actually true\n\nTheir boredom might be real. It might be a sign they're ready to try something else or that this team isn't the fit. Or it might be a sign they're 15 and everything feels boring right now. That's normal.\n\nWe talk to the coach. We get their read. We talk to our kid about what would actually make it interesting. Then we make the call together. If they genuinely want to stop, stopping is an option. If they're just being 15, sometimes pushing through the boring part is the answer.\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"what-their-answer-tells-us","text":"What their answer tells us"},{"depth":2,"slug":"the-hard-question-for-us","text":"The hard question for us"},{"depth":2,"slug":"whats-actually-true","text":"What’s actually true"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
