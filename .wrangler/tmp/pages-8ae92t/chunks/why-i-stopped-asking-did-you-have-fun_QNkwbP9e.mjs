globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>I asked kids this question for years. <em>Did you have fun?</em> After every game. After every practice. After the school play. The kids always said yes. Even when they didn’t.</p>\n<p>The question is a trap. <em>Did you have fun</em> is also <em>please tell me this was worth it.</em> Tell me the time and the money and the alarm at six on a Saturday were worth it. Tell me I’m okay as a sports parent.</p>\n<p>Kids feel that weight immediately.</p>\n<p>I ask three things instead. I rotate them.</p>\n<p><em>What was the part you were nervous about going in?</em></p>\n<p><em>Was there a moment that felt good?</em></p>\n<p><em>Did anyone make you laugh?</em></p>\n<p>The first acknowledges something hard, which there always was. The second lets them pick a small thing, which is what kids actually have. The third tells me about the kid who made them laugh.</p>\n<p>Kids answer all three. They never answered <em>did you have fun</em> with anything but yes.</p>\n<p>The other problem: <em>did you have fun</em> puts the responsibility for the day’s emotional grade on the kid. Whether the day was good becomes their job. They don’t want that job. They want to come home.</p>\n<p>So I dropped the question.</p>";

				const frontmatter = {"title":"Why we stopped asking *\"did you have fun?\"*","seoDescription":"I asked kids this question for years. Did you have fun? After every game. After every practice. After the school play. The kids always said yes.","format":"note","issue":5,"phase":"drive-home","sport":"multi-sport","age":"8-10","seasonPhase":"mid","publishedAt":"2026-03-05T00:00:00.000Z","editorial":{"claudeReviewedAt":"2026-05-19T00:00:00.000Z"}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/articles/why-i-stopped-asking-did-you-have-fun.md";
				const url = undefined;
				function rawContent() {
					return "\nI asked kids this question for years. *Did you have fun?* After every game. After every practice. After the school play. The kids always said yes. Even when they didn't.\n\nThe question is a trap. *Did you have fun* is also *please tell me this was worth it.* Tell me the time and the money and the alarm at six on a Saturday were worth it. Tell me I'm okay as a sports parent.\n\nKids feel that weight immediately.\n\nI ask three things instead. I rotate them.\n\n*What was the part you were nervous about going in?*\n\n*Was there a moment that felt good?*\n\n*Did anyone make you laugh?*\n\nThe first acknowledges something hard, which there always was. The second lets them pick a small thing, which is what kids actually have. The third tells me about the kid who made them laugh.\n\nKids answer all three. They never answered *did you have fun* with anything but yes.\n\nThe other problem: *did you have fun* puts the responsibility for the day's emotional grade on the kid. Whether the day was good becomes their job. They don't want that job. They want to come home.\n\nSo I dropped the question.\n";
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
