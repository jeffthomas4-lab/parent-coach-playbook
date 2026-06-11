globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>We state this in our first team email: group chat is for schedule updates and weather cancellations only. Questions about playing time, team decisions, or coach communication happen one-on-one. Email only. No group air.</p>\n<p>This single rule stops ninety percent of the chaos.</p>\n<p>One parent gets frustrated. Posts in the group. Four other parents respond. Suddenly we’re running a public forum instead of a team. Midnight texts happen because the parent expects an audience. Take the audience away and they reach out differently.</p>\n<p>Email creates a record. We have time to think. The parent has time to cool off. Group chat is emotional and public, which makes everything bigger than it is.</p>\n<h2 id=\"the-rule\">The rule</h2>\n<p>We post it as: “Group chat: schedules and weather. Everything else: one-on-one email with Coach [our name] at [our email].” That’s it. We don’t need to explain why. We do need to enforce it. When someone crosses the line, a private message saying “Let’s take this to email” takes fifteen seconds and resets the boundary.</p>\n<p>Coaches who don’t set this rule end up answering 8 p.m. questions during dinner and texts at 11 p.m. The rule doesn’t make us unfriendly. It makes us available at times when we can actually think.</p>";

				const frontmatter = {"title":"The Group Chat Rule That Ends Midnight Texts","dek":"Schedules and weather only. Everything else goes one-on-one.","seoDescription":"We state this in our first team email: group chat is for schedule updates and weather cancellations only.","topic":"communication","format":"note","phase":"drive-there","sport":"multi-sport","age":"all-ages","publishedAt":"2026-01-13T00:00:00.000Z","featured":false,"editorial":{"claudeReviewedAt":"2026-06-17T00:00:00.000Z"}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/articles/the-group-chat-rule-that-ends-midnight-texts.md";
				const url = undefined;
				function rawContent() {
					return "\nWe state this in our first team email: group chat is for schedule updates and weather cancellations only. Questions about playing time, team decisions, or coach communication happen one-on-one. Email only. No group air.\n\nThis single rule stops ninety percent of the chaos.\n\nOne parent gets frustrated. Posts in the group. Four other parents respond. Suddenly we're running a public forum instead of a team. Midnight texts happen because the parent expects an audience. Take the audience away and they reach out differently.\n\nEmail creates a record. We have time to think. The parent has time to cool off. Group chat is emotional and public, which makes everything bigger than it is.\n\n## The rule\n\nWe post it as: \"Group chat: schedules and weather. Everything else: one-on-one email with Coach [our name] at [our email].\" That's it. We don't need to explain why. We do need to enforce it. When someone crosses the line, a private message saying \"Let's take this to email\" takes fifteen seconds and resets the boundary.\n\nCoaches who don't set this rule end up answering 8 p.m. questions during dinner and texts at 11 p.m. The rule doesn't make us unfriendly. It makes us available at times when we can actually think.\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"the-rule","text":"The rule"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
