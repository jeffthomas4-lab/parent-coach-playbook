globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Buying used gear saves money. Some used gear is smart. Some is a mistake. Three rules separate the two.</p>\n<p><strong>The insole rule</strong>\nInsoles are personal. Don’t buy used insoles. Not from your cousin. Not from a yard sale. Your kid’s foot is his. His arch is his. His pressure points are his. A used insole is shaped to someone else.</p>\n<p>Buy used shoes. Replace the insoles. New ones are cheap. Problem solved. This applies to soccer, baseball, basketball, everything. New insoles, every time.</p>\n<p><strong>The helmet rule</strong>\nHelmets expire. Not technically. Functionally. The foam deteriorates. After three years, even if it looks fine, the protection is gone.</p>\n<p>Used helmets under two years old: check the shell for cracks. None? Buy it. Used helmets three years or older: pass. The risk is not worth the savings.</p>\n<p>Football helmets, lacrosse helmets, hockey helmets: all the same rule. Skateboard helmets: same rule. The foam you can’t see is dying.</p>\n<p><strong>The bat rule</strong>\nBats don’t expire unless they break. A ten-year-old bat that hasn’t been hit works fine. Buy used bats without hesitation. Check for dents or cracks. None? It’s good.</p>\n<p>Bats are made of wood or composite. Both last. Neither expires. Ignore the year. Go on condition.</p>\n<p><strong>What else is fine used</strong>\nGloves. Spikes. Cleats. Shin guards. Shoulder pads. Football pants. Any piece of protection that hasn’t deteriorated gets a second life. Check the seams. Check for damage. If it’s clean and intact, buy it.</p>\n<p><strong>What to always buy new</strong>\nMouthguards. Socks. Undergarments. Anything that goes on skin. The cost is low. The hygiene is real. Buy new.</p>\n<p>Used gear is smart. Used gear rules are the difference between saving money and making a mistake. Know the three rules. Use them.</p>";

				const frontmatter = {"title":"Used Gear: The Insole Rule, The Helmet Rule, The Bat Rule","dek":"What's safe to buy secondhand. What's not.","seoDescription":"Buying used gear saves money. Some used gear is smart. Some is a mistake. Three rules separate the two.","topic":"equipment","format":"note","phase":"drive-there","sport":"multi-sport","age":"all-ages","publishedAt":"2026-03-08T00:00:00.000Z","featured":false,"editorial":{"claudeReviewedAt":"2026-05-24T00:00:00.000Z"}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/articles/used-gear-rules.md";
				const url = undefined;
				function rawContent() {
					return "\nBuying used gear saves money. Some used gear is smart. Some is a mistake. Three rules separate the two.\n\n**The insole rule**\nInsoles are personal. Don't buy used insoles. Not from your cousin. Not from a yard sale. Your kid's foot is his. His arch is his. His pressure points are his. A used insole is shaped to someone else.\n\nBuy used shoes. Replace the insoles. New ones are cheap. Problem solved. This applies to soccer, baseball, basketball, everything. New insoles, every time.\n\n**The helmet rule**\nHelmets expire. Not technically. Functionally. The foam deteriorates. After three years, even if it looks fine, the protection is gone.\n\nUsed helmets under two years old: check the shell for cracks. None? Buy it. Used helmets three years or older: pass. The risk is not worth the savings.\n\nFootball helmets, lacrosse helmets, hockey helmets: all the same rule. Skateboard helmets: same rule. The foam you can't see is dying.\n\n**The bat rule**\nBats don't expire unless they break. A ten-year-old bat that hasn't been hit works fine. Buy used bats without hesitation. Check for dents or cracks. None? It's good.\n\nBats are made of wood or composite. Both last. Neither expires. Ignore the year. Go on condition.\n\n**What else is fine used**\nGloves. Spikes. Cleats. Shin guards. Shoulder pads. Football pants. Any piece of protection that hasn't deteriorated gets a second life. Check the seams. Check for damage. If it's clean and intact, buy it.\n\n**What to always buy new**\nMouthguards. Socks. Undergarments. Anything that goes on skin. The cost is low. The hygiene is real. Buy new.\n\nUsed gear is smart. Used gear rules are the difference between saving money and making a mistake. Know the three rules. Use them.\n";
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
