globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Your kid packed their bag four times tonight. Pinnies, right shoes, <a href=\"/go/multi-sport-water-bottle/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">water bottle</a> that doesn’t leak, spare hair ties from earlier losses. You watch them line them up, pull them out, put them back.</p>\n<p>They’re trying to make the A team. You pretend to have an opinion about what goes in the bag, because you think it helps to have someone in the room.</p>\n<p>Don’t talk about tryouts the night before tryouts.</p>\n<p>Two seasons in, you learned this. The night before, you asked how they were feeling. They fell apart. Not because of tryouts. Because the question put a magnifying glass on the thing they were already thinking about.</p>\n<p>Now you just sit in their room. You fold the towel that came out of the dryer. You ask if they want you to braid their hair in the morning. You don’t ask how they’re feeling.</p>\n<p>When they’re ready, they’ll tell you. Or they won’t. Both are fine.</p>\n<p>The night before tryouts is for presence. Not pep talks. Presence. You sitting on the bed, being a person who is on their side, not asking anything of them.</p>\n<p>If your kid is trying out for something tomorrow, here’s what works. Pack the bag together. Make a normal dinner. Do something dumb after dinner. Watch an episode you’ve already seen. Go to bed at the normal time.</p>\n<p>Don’t ask how they’re feeling. Don’t tell them you believe in them. They know.</p>\n<p>Just be in the same room.</p>";

				const frontmatter = {"title":"The night before *tryouts*","seoDescription":"Your kid packed their bag four times tonight. Pinnies, right shoes, water bottle that doesn't leak, spare hair ties from earlier losses.","format":"note","issue":4,"phase":"drive-there","sport":"multi-sport","age":"11-12","seasonPhase":"pre-season","publishedAt":"2026-03-19T00:00:00.000Z","hero":"/illustrations/night-before-tryouts.webp","heroAlt":"A kid's bedroom at night. Cleats, glove, and folded jersey laid out on a chair. Soft lamp light and muted rose tones, parent silhouette in doorway."};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/articles/night-before-tryouts.md";
				const url = undefined;
				function rawContent() {
					return "\nYour kid packed their bag four times tonight. Pinnies, right shoes, [water bottle](/go/multi-sport-water-bottle/) that doesn't leak, spare hair ties from earlier losses. You watch them line them up, pull them out, put them back.\n\nThey're trying to make the A team. You pretend to have an opinion about what goes in the bag, because you think it helps to have someone in the room.\n\nDon't talk about tryouts the night before tryouts.\n\nTwo seasons in, you learned this. The night before, you asked how they were feeling. They fell apart. Not because of tryouts. Because the question put a magnifying glass on the thing they were already thinking about.\n\nNow you just sit in their room. You fold the towel that came out of the dryer. You ask if they want you to braid their hair in the morning. You don't ask how they're feeling.\n\nWhen they're ready, they'll tell you. Or they won't. Both are fine.\n\nThe night before tryouts is for presence. Not pep talks. Presence. You sitting on the bed, being a person who is on their side, not asking anything of them.\n\nIf your kid is trying out for something tomorrow, here's what works. Pack the bag together. Make a normal dinner. Do something dumb after dinner. Watch an episode you've already seen. Go to bed at the normal time.\n\nDon't ask how they're feeling. Don't tell them you believe in them. They know.\n\nJust be in the same room.\n";
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
