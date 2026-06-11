globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "";

				const frontmatter = {"headline":"Summer heat protocols: what most state associations require before a coach can pull kids off the field","summary":"Most state associations follow Korey Stringer Institute thresholds: activity stops at 104°F heat index, mandatory 30-minute rest breaks between 95°F and 104°F. Youth rec leagues often adopt the same standards but aren't required to. If your program has no written heat policy posted, ask the coordinator before July.","category":"safety","sourceUrl":"https://ksi.uconn.edu","sourceLabel":"Korey Stringer Institute","publishedAt":"2026-06-10T00:00:00.000Z","draft":false};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/news/heat-index-protocols-summer-2026.md";
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
