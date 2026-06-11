globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Most kids’ rooms accumulate eight to twelve trophies, medals, and certificates per year. Within three years, the shelf cannot hold them. Within five, the kid doesn’t remember what most of them were for.</p>\n<p>A small system that works.</p>\n<p><strong>One trophy per year goes on the shelf.</strong> Pick the one with the most meaning to the kid. Not the biggest one. The one they want. Sometimes it’s the participation trophy from a season they loved. Sometimes it’s a small medal from a tournament where they finally figured something out. Their pick.</p>\n<p><strong>The rest go in a memory box.</strong> A clear plastic bin in the closet, labeled by year. The kid can look at them whenever they want. They are not lost. They are not on the shelf.</p>\n<p><strong>Some trophies get repurposed for craft.</strong> The ones with detachable plates can be unscrewed and the plate kept. The plastic-figure-on-a-pedestal can be donated to youth-sports programs that recycle them. (Most local trophy shops have a recycling program.)</p>\n<p><strong>Medals get a hanger.</strong> A simple hook or a piece of pegboard in the kid’s room. Medals are space-efficient and look meaningful.</p>\n<p><strong>Certificates get a binder.</strong> Plastic sleeve, dated, in chronological order. The binder ends up being a more valuable record than the trophies themselves. The kid will flip through it years later.</p>\n<p>The point is not to discard the kid’s accomplishments. The point is to make room for the next ones, and to give them control over what they keep visible. Letting them choose teaches a small but real lesson about what they actually value.</p>\n<p>The shelf with one trophy per year says more than the shelf with twelve.</p>";

				const frontmatter = {"title":"What to do with the trophies","dek":"Eight participation trophies in nine months. The shelf is full. The kid doesn't care about half of them. A simple system.","seoDescription":"Most kids' rooms accumulate eight to twelve trophies, medals, and certificates per year. Within three years, the shelf cannot hold them.","topic":"season-ops","format":"note","phase":"drive-home","sport":"multi-sport","age":"5-7","publishedAt":"2026-05-13T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":7,"originalityGrade":8,"voiceGrade":9,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"affiliateDisclosurePresent":false,"claudeReviewedAt":"2026-03-31T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Light, useful logistics piece."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/articles/what-to-do-with-the-trophies.md";
				const url = undefined;
				function rawContent() {
					return "\nMost kids' rooms accumulate eight to twelve trophies, medals, and certificates per year. Within three years, the shelf cannot hold them. Within five, the kid doesn't remember what most of them were for.\n\nA small system that works.\n\n**One trophy per year goes on the shelf.** Pick the one with the most meaning to the kid. Not the biggest one. The one they want. Sometimes it's the participation trophy from a season they loved. Sometimes it's a small medal from a tournament where they finally figured something out. Their pick.\n\n**The rest go in a memory box.** A clear plastic bin in the closet, labeled by year. The kid can look at them whenever they want. They are not lost. They are not on the shelf.\n\n**Some trophies get repurposed for craft.** The ones with detachable plates can be unscrewed and the plate kept. The plastic-figure-on-a-pedestal can be donated to youth-sports programs that recycle them. (Most local trophy shops have a recycling program.)\n\n**Medals get a hanger.** A simple hook or a piece of pegboard in the kid's room. Medals are space-efficient and look meaningful.\n\n**Certificates get a binder.** Plastic sleeve, dated, in chronological order. The binder ends up being a more valuable record than the trophies themselves. The kid will flip through it years later.\n\nThe point is not to discard the kid's accomplishments. The point is to make room for the next ones, and to give them control over what they keep visible. Letting them choose teaches a small but real lesson about what they actually value.\n\nThe shelf with one trophy per year says more than the shelf with twelve.\n";
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
