globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "";

				const frontmatter = {"headline":"Pop Warner and most youth football programs now require NOCSAE 2024 certified helmets","summary":"Pop Warner and most youth football leagues now enforce the updated NOCSAE ND002 standard. Helmets with an ND002-13m20 sticker inside the shell will not pass inspection. If your kid's helmet was bought before 2023, check the sticker. Riddell, Schutt, and Xenith have recertified youth models at $80 to $140.","category":"equipment","sport":"football","sourceUrl":"https://nocsae.org","sourceLabel":"NOCSAE","publishedAt":"2026-06-08T00:00:00.000Z","draft":false};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/news/nocsae-helmet-standard-football-2026.md";
				const url = undefined;
				function rawContent() {
					return "";
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
