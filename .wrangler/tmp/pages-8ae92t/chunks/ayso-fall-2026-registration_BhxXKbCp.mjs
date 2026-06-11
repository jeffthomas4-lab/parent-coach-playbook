globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "";

				const frontmatter = {"headline":"AYSO fall 2026 registration is open in most regions — deadlines start in July","summary":"American Youth Soccer Organization fall season registration opened in most regions in late May. Many regions hit capacity before the deadline, and regions in the Pacific Northwest historically fill the U8 and U10 age brackets fastest. If your kid is playing fall rec soccer, check your regional AYSO site now. Waitlists open after the primary registration closes but placement is not guaranteed.","category":"registration","sport":"soccer","sourceUrl":"https://www.ayso.org","sourceLabel":"AYSO","publishedAt":"2026-06-04T00:00:00.000Z","draft":false};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/news/ayso-fall-2026-registration.md";
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
