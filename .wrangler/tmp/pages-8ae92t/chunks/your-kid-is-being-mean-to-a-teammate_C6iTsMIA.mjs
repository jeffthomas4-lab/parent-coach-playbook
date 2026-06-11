globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The coach tells you. Or another parent tells you. Or you see it yourself: your kid was unkind to a teammate. They made fun of them or excluded them or spoke harshly to them.</p>\n<p>Talk to your kid that day. Not after three days. That day.</p>\n<p>“I heard about what happened with [teammate] at practice. Tell me what happened.” Listen to their side. Don’t defend them immediately.</p>\n<p>Then: “If I got it right, that wasn’t okay. He’s on your team. The way you talked to him wasn’t how we treat people.”</p>\n<p>Then the fix: “You’re going to apologize to him. Not in front of everyone. Just tell him you were being mean and you’re sorry.” Make them say it, not write it.</p>\n<p>If they push back (“He deserved it” or “I was just joking”), say: “I don’t care. You don’t treat people that way. Ever.”</p>\n<p>This matters more than winning. More than moving up in the rotation. More than anything sports will do for them.</p>\n<p>An 8-year-old is learning whether kindness is a choice they make or a feeling they have. If they learn that being kind only when someone hasn’t annoyed them is fine, you’re setting them up to be that person in high school, then in life.</p>\n<p>Make it clear: you’re kind when it’s hard. You apologize when you’re wrong. You build people up even when you’re frustrated.</p>\n<p>The team falls apart when kids are mean to each other. Character falls apart the same way. Fix it now.</p>";

				const frontmatter = {"title":"Your 8-10 Kid Is Being Mean to a Teammate","dek":"This isn't about sports. This is about your kid's character. Handle it now.","seoDescription":"The coach tells you. Or another parent tells you. Or you see it yourself: your kid was unkind to a teammate.","topic":"the-hard-stuff","format":"note","phase":"drive-home","sport":"multi-sport","age":"8-10","publishedAt":"2026-02-05T00:00:00.000Z","featured":false,"editorial":{"claudeReviewedAt":"2026-04-06T00:00:00.000Z"}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/articles/your-kid-is-being-mean-to-a-teammate.md";
				const url = undefined;
				function rawContent() {
					return "\nThe coach tells you. Or another parent tells you. Or you see it yourself: your kid was unkind to a teammate. They made fun of them or excluded them or spoke harshly to them.\n\nTalk to your kid that day. Not after three days. That day.\n\n\"I heard about what happened with [teammate] at practice. Tell me what happened.\" Listen to their side. Don't defend them immediately.\n\nThen: \"If I got it right, that wasn't okay. He's on your team. The way you talked to him wasn't how we treat people.\"\n\nThen the fix: \"You're going to apologize to him. Not in front of everyone. Just tell him you were being mean and you're sorry.\" Make them say it, not write it.\n\nIf they push back (\"He deserved it\" or \"I was just joking\"), say: \"I don't care. You don't treat people that way. Ever.\"\n\nThis matters more than winning. More than moving up in the rotation. More than anything sports will do for them.\n\nAn 8-year-old is learning whether kindness is a choice they make or a feeling they have. If they learn that being kind only when someone hasn't annoyed them is fine, you're setting them up to be that person in high school, then in life.\n\nMake it clear: you're kind when it's hard. You apologize when you're wrong. You build people up even when you're frustrated.\n\nThe team falls apart when kids are mean to each other. Character falls apart the same way. Fix it now.\n";
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
