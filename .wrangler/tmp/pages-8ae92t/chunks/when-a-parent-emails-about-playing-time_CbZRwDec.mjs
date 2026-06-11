globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>This email comes in during week two. “My kid isn’t getting much playing time. What can we do to help him improve?”</p>\n<p>Don’t ignore it. Don’t get defensive. This parent isn’t accusing you. They’re asking what their role is.</p>\n<p>Write back the same day: “Good question. Here’s what I see. [Name two specific things: footwork, decision-making, effort in practice, communication on the field. Pick real gaps, not character flaws.] If your kid works on these at home, I’ll notice in practice. Playing time follows effort. For his age, effort means going hard every rep, showing up ready to work, and staying in position.”</p>\n<p>Then: “You can help by having him throw/kick/hit in the driveway for 15 minutes three times a week. No pressure, just work. Let me know if you have questions.”</p>\n<p>This works because you’re not promising anything. You’re being specific. You’re giving the parent a real job. You’re showing that playing time is earned, not given.</p>\n<p>Some parents won’t like the answer. Some kids won’t do the work. That’s okay. You’ve drawn a clear line. The parent now knows what it takes. That’s all they were asking for.</p>\n<p>Never say “everyone plays” or “we rotate all the kids equally” unless that’s actually true. Kids know when they’re not playing. Parents know too. Honesty builds trust faster than false promises ever will.</p>";

				const frontmatter = {"title":"The 8-10 Ages: When a Parent Emails About Playing Time","dek":"They're asking a fair question. Here's the answer structure that works.","seoDescription":"This email comes in during week two. \"My kid isn't getting much playing time. What can we do to help him improve?\"","topic":"communication","format":"note","phase":"drive-home","sport":"multi-sport","age":"8-10","publishedAt":"2026-01-27T00:00:00.000Z","featured":false,"editorial":{"claudeReviewedAt":"2026-03-22T00:00:00.000Z"}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/articles/when-a-parent-emails-about-playing-time.md";
				const url = undefined;
				function rawContent() {
					return "\nThis email comes in during week two. \"My kid isn't getting much playing time. What can we do to help him improve?\"\n\nDon't ignore it. Don't get defensive. This parent isn't accusing you. They're asking what their role is.\n\nWrite back the same day: \"Good question. Here's what I see. [Name two specific things: footwork, decision-making, effort in practice, communication on the field. Pick real gaps, not character flaws.] If your kid works on these at home, I'll notice in practice. Playing time follows effort. For his age, effort means going hard every rep, showing up ready to work, and staying in position.\"\n\nThen: \"You can help by having him throw/kick/hit in the driveway for 15 minutes three times a week. No pressure, just work. Let me know if you have questions.\"\n\nThis works because you're not promising anything. You're being specific. You're giving the parent a real job. You're showing that playing time is earned, not given.\n\nSome parents won't like the answer. Some kids won't do the work. That's okay. You've drawn a clear line. The parent now knows what it takes. That's all they were asking for.\n\nNever say \"everyone plays\" or \"we rotate all the kids equally\" unless that's actually true. Kids know when they're not playing. Parents know too. Honesty builds trust faster than false promises ever will.\n";
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
