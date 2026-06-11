globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Travel tryouts mean your kid is competing against 40 other kids they don’t know. The coach is picking 12 to 14. Your kid knows the math.</p>\n<p>This is the first time they feel what real selection actually is.</p>\n<p>Before tryouts, your job is to lower the emotional stakes without lying. “A lot of good kids are going to try out. Coaches are looking for specific things. You might make it, you might not. Either way, you’re going to play. If not here, somewhere else. Our job is to see what you can learn from the tryout, not to fix whether you made it.”</p>\n<p>Don’t say “you’re definitely going to make it.” Don’t say “the coach will see how good you are.” Both of those things might not be true. Your kid will remember you said them.</p>\n<p>The coach is looking at: Can this kid play up? Does this kid work hard in a bigger pond? Does this kid stay composed when things are tougher? Technical skill matters, but at 11-12, growth potential matters more.</p>\n<p>After tryouts, same response regardless of outcome: “Tell me what you noticed about the way they played. What was different from your team?” Make them analyze instead of emotionalize. It teaches them to extract information from competition.</p>\n<p>If they don’t make it, they learn that trying hard isn’t enough sometimes. That’s real. That’s also how kids learn to actually improve, not just assume they’re fine.</p>\n<p>If they do make it, they learn that the next level expects something different. Either way, they’re growing.</p>";

				const frontmatter = {"title":"The Travel-Team Tryout at 11-12","dek":"This is the first time it gets real. Here's what changes.","seoDescription":"Travel tryouts mean your kid is competing against 40 other kids they don't know. The coach is picking 12 to 14. Your kid knows the math.","topic":"tryouts","format":"note","phase":"drive-there","sport":"multi-sport","age":"11-12","publishedAt":"2026-03-03T00:00:00.000Z","featured":false,"editorial":{"claudeReviewedAt":"2026-05-16T00:00:00.000Z"}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/articles/the-travel-team-tryout-at-11-to-12.md";
				const url = undefined;
				function rawContent() {
					return "\nTravel tryouts mean your kid is competing against 40 other kids they don't know. The coach is picking 12 to 14. Your kid knows the math.\n\nThis is the first time they feel what real selection actually is.\n\nBefore tryouts, your job is to lower the emotional stakes without lying. \"A lot of good kids are going to try out. Coaches are looking for specific things. You might make it, you might not. Either way, you're going to play. If not here, somewhere else. Our job is to see what you can learn from the tryout, not to fix whether you made it.\"\n\nDon't say \"you're definitely going to make it.\" Don't say \"the coach will see how good you are.\" Both of those things might not be true. Your kid will remember you said them.\n\nThe coach is looking at: Can this kid play up? Does this kid work hard in a bigger pond? Does this kid stay composed when things are tougher? Technical skill matters, but at 11-12, growth potential matters more.\n\nAfter tryouts, same response regardless of outcome: \"Tell me what you noticed about the way they played. What was different from your team?\" Make them analyze instead of emotionalize. It teaches them to extract information from competition.\n\nIf they don't make it, they learn that trying hard isn't enough sometimes. That's real. That's also how kids learn to actually improve, not just assume they're fine.\n\nIf they do make it, they learn that the next level expects something different. Either way, they're growing.\n";
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
