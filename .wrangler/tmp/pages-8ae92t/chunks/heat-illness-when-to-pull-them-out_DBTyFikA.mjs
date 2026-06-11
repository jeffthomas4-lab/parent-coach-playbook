globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>It’s July. The field is 95. Your kid finished the warm-up and looks gray in the face.</p>\n<p>Most parents wait too long because they don’t want to be the parent who pulls their kid out for nothing. Heat illness moves faster than the wait-and-see instinct allows.</p>\n<h2 id=\"the-signs\">The signs</h2>\n<p>Headache, dizziness, nausea, confusion. Skin that looks pale or flushed in a way that’s different from how the kid normally looks after running. Stops sweating. Stumbles. Says they’re fine when they don’t sound fine.</p>\n<p>If you see two of those at once, you don’t ask the coach. You pull the kid out and get them to shade, water, and a cooler surface. The coach will understand. The coach who doesn’t is the coach you have a different problem with.</p>\n<h2 id=\"the-rule\">The rule</h2>\n<p>If you would notice it on an adult and worry, take it seriously on a kid. Kids don’t always have the language. They will say <em>I’m fine</em> on autopilot.</p>\n<p>The CDC and the American Academy of Pediatrics both recommend cooling and hydration as immediate steps. Cool wet towels on the neck and groin. Cold water sips, not gulps. Get into shade or air conditioning.</p>\n<p>If the kid stops sweating, has confusion, or seems out of it, that’s heat stroke and it’s a 911 call. Don’t drive to urgent care. Call.</p>\n<h2 id=\"what-to-do-tomorrow\">What to do tomorrow</h2>\n<p>Kids who had a near-miss should sit out the next session, not go back to practice 24 hours later because the coach said they could. Recovery from heat stress takes longer than parents think.</p>\n<p>Build the heat plan before the season. Water bottle, electrolyte mix, shade, the parent’s plan for when to pull. Most heat illness in youth sports is preventable with the parent who is paying attention.</p>\n<p>The <a href=\"/body/\">body hub</a> covers heat, hydration, and concussion in more detail. Bookmark it.</p>";

				const frontmatter = {"title":"Heat illness: *when to pull them out*","dek":"The signs that a kid is in trouble, the signs that they're tired, and the rule that protects you when it's not clear which is which.","seoDescription":"It's July. The field is 95. Your kid finished the warm-up and looks gray in the face.","topic":"the-hard-stuff","format":"note","phase":"game","sport":"multi-sport","age":"all-ages","publishedAt":"2026-05-13T00:00:00.000Z","featured":false,"draft":false};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/articles/heat-illness-when-to-pull-them-out.md";
				const url = undefined;
				function rawContent() {
					return "\nIt's July. The field is 95. Your kid finished the warm-up and looks gray in the face.\n\nMost parents wait too long because they don't want to be the parent who pulls their kid out for nothing. Heat illness moves faster than the wait-and-see instinct allows.\n\n## The signs\n\nHeadache, dizziness, nausea, confusion. Skin that looks pale or flushed in a way that's different from how the kid normally looks after running. Stops sweating. Stumbles. Says they're fine when they don't sound fine.\n\nIf you see two of those at once, you don't ask the coach. You pull the kid out and get them to shade, water, and a cooler surface. The coach will understand. The coach who doesn't is the coach you have a different problem with.\n\n## The rule\n\nIf you would notice it on an adult and worry, take it seriously on a kid. Kids don't always have the language. They will say _I'm fine_ on autopilot.\n\nThe CDC and the American Academy of Pediatrics both recommend cooling and hydration as immediate steps. Cool wet towels on the neck and groin. Cold water sips, not gulps. Get into shade or air conditioning.\n\nIf the kid stops sweating, has confusion, or seems out of it, that's heat stroke and it's a 911 call. Don't drive to urgent care. Call.\n\n## What to do tomorrow\n\nKids who had a near-miss should sit out the next session, not go back to practice 24 hours later because the coach said they could. Recovery from heat stress takes longer than parents think.\n\nBuild the heat plan before the season. Water bottle, electrolyte mix, shade, the parent's plan for when to pull. Most heat illness in youth sports is preventable with the parent who is paying attention.\n\nThe [body hub](/body/) covers heat, hydration, and concussion in more detail. Bookmark it.\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"the-signs","text":"The signs"},{"depth":2,"slug":"the-rule","text":"The rule"},{"depth":2,"slug":"what-to-do-tomorrow","text":"What to do tomorrow"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
