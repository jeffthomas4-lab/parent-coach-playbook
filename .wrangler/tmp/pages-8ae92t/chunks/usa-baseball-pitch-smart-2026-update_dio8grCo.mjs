globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "";

				const frontmatter = {"headline":"USA Baseball tightened pitch count limits for 12U starting this season","summary":"USA Baseball lowered the single-game pitch limit for 12U players from 85 to 75 pitches starting January 2026. Rest day requirements are unchanged. If your 12-year-old pitches in any USA Baseball-affiliated league this spring, the new limit applies. Ask your coordinator if you're unsure whether your program has adopted the 2026 standards.","category":"rule-change","sport":"baseball","sourceUrl":"https://www.usabaseball.com/pitch-smart","sourceLabel":"USA Baseball Pitch Smart","publishedAt":"2026-06-01T00:00:00.000Z","draft":false};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/news/usa-baseball-pitch-smart-2026-update.md";
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
