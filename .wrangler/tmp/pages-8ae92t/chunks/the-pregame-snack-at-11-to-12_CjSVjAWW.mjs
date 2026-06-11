globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>An hour before game time: water and banana. Or water and a bagel. Or water and a protein bar. That’s it.</p>\n<p>Not a full breakfast. Not a PB&#x26;J sandwich. Not a smoothie bowl. Not whatever our dietary theory is for this week.</p>\n<p>At 11-12, their stomach is still working on digestion. They don’t need a lot. They need hydration and something that won’t sit heavy in their gut. A banana is perfect. It’s carbs, it’s small, it’s done processing in thirty minutes.</p>\n<p>We have them drink water starting the night before, not just on game day. Game-day hydration is too late. By the time they’re thirsty, they’re already down on fluids.</p>\n<p>We don’t send them out on an empty stomach, but we also don’t send them out stuffed. The sweet spot is “snack” not “meal.”</p>\n<p>Same goes for drinks: water is the answer. A little sports drink if it’s hot out. Not soda. Not juice. Not a big cup of chocolate milk right before the game.</p>\n<p>Our kid will perform the same whether they ate a banana or a bagel. The difference is how their stomach feels. We keep it simple and they’ll forget about food and just play.</p>\n<p>We ask them the night before: “What sounds good to you an hour before game time?” We let them choose between three options. Then we stick with what they pick. Consistency matters more than perfection.</p>";

				const frontmatter = {"title":"The Pregame Snack at 11-12","dek":"Water and a banana. Hydration and carbs. Not a meal.","seoDescription":"An hour before game time: water and banana. Or water and a bagel. Or water and a protein bar. That's it.","topic":"game-day","format":"note","phase":"drive-there","sport":"multi-sport","age":"11-12","publishedAt":"2026-04-14T00:00:00.000Z","featured":false};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/articles/the-pregame-snack-at-11-to-12.md";
				const url = undefined;
				function rawContent() {
					return "\nAn hour before game time: water and banana. Or water and a bagel. Or water and a protein bar. That's it.\n\nNot a full breakfast. Not a PB&J sandwich. Not a smoothie bowl. Not whatever our dietary theory is for this week.\n\nAt 11-12, their stomach is still working on digestion. They don't need a lot. They need hydration and something that won't sit heavy in their gut. A banana is perfect. It's carbs, it's small, it's done processing in thirty minutes.\n\nWe have them drink water starting the night before, not just on game day. Game-day hydration is too late. By the time they're thirsty, they're already down on fluids.\n\nWe don't send them out on an empty stomach, but we also don't send them out stuffed. The sweet spot is \"snack\" not \"meal.\"\n\nSame goes for drinks: water is the answer. A little sports drink if it's hot out. Not soda. Not juice. Not a big cup of chocolate milk right before the game.\n\nOur kid will perform the same whether they ate a banana or a bagel. The difference is how their stomach feels. We keep it simple and they'll forget about food and just play.\n\nWe ask them the night before: \"What sounds good to you an hour before game time?\" We let them choose between three options. Then we stick with what they pick. Consistency matters more than perfection.\n";
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
