globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Most families pile the gear bag in the garage after the last game and don’t open it again until two weeks before the next season. By then half of it has gone moldy, the cleats won’t fit, and the helmet pads have collapsed.</p>\n<p>Take an hour now. Five steps.</p>\n<p><strong>Wash everything that touches skin.</strong> Jerseys, sliders, sock liners, mouthguards. Air-dry, don’t tumble. Mouthguards in a vinegar-water bath for ten minutes, rinsed, dried, returned to a vented case.</p>\n<p><strong>Air out the bag itself.</strong> Empty it completely. Spray the inside with a disinfectant and leave it open in the sun for an afternoon. The smell that comes out of a closed bag in October started in May.</p>\n<p><strong>Inventory and try on cleats and shoes.</strong> Anything snug now will be unwearable in fall. Pass it down or donate. Anything still good gets a stick of newspaper inside to absorb moisture and goes in the bag.</p>\n<p><strong>Inspect protective gear.</strong> Helmets, pads, shin guards, masks. Check for cracks, foam compression, broken straps. Anything questionable is replaced now, not in the parking lot before week one.</p>\n<p><strong>Make a “next season needs” list.</strong> What you noticed all year that the kid outgrew or wore through. Tape it to the bag. When summer sales hit, you have a list and a budget.</p>\n<p>The total time investment is about an hour. The cost of skipping it is a week of October scrambling and one or two duplicated purchases.</p>";

				const frontmatter = {"title":"The end-of-season equipment cleanup","dek":"An hour now saves $200 in fall replacement gear. The five-step audit before everything gets stuffed in a closet for four months.","seoDescription":"Most families pile the gear bag in the garage after the last game and don't open it again until two weeks before the next season.","topic":"equipment","format":"note","phase":"drive-home","sport":"multi-sport","age":"all-ages","publishedAt":"2026-05-13T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":8,"originalityGrade":8,"voiceGrade":9,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"affiliateDisclosurePresent":false,"claudeReviewedAt":"2026-05-24T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Logistics with real money attached. Reads cleanly."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/articles/end-of-season-equipment-cleanup.md";
				const url = undefined;
				function rawContent() {
					return "\nMost families pile the gear bag in the garage after the last game and don't open it again until two weeks before the next season. By then half of it has gone moldy, the cleats won't fit, and the helmet pads have collapsed.\n\nTake an hour now. Five steps.\n\n**Wash everything that touches skin.** Jerseys, sliders, sock liners, mouthguards. Air-dry, don't tumble. Mouthguards in a vinegar-water bath for ten minutes, rinsed, dried, returned to a vented case.\n\n**Air out the bag itself.** Empty it completely. Spray the inside with a disinfectant and leave it open in the sun for an afternoon. The smell that comes out of a closed bag in October started in May.\n\n**Inventory and try on cleats and shoes.** Anything snug now will be unwearable in fall. Pass it down or donate. Anything still good gets a stick of newspaper inside to absorb moisture and goes in the bag.\n\n**Inspect protective gear.** Helmets, pads, shin guards, masks. Check for cracks, foam compression, broken straps. Anything questionable is replaced now, not in the parking lot before week one.\n\n**Make a \"next season needs\" list.** What you noticed all year that the kid outgrew or wore through. Tape it to the bag. When summer sales hit, you have a list and a budget.\n\nThe total time investment is about an hour. The cost of skipping it is a week of October scrambling and one or two duplicated purchases.\n";
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
