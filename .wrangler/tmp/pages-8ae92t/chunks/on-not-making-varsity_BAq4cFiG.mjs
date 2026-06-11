globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A kid did not make varsity last week. Eighth grade. He’d been on the JV roster all of seventh and most parents said he was a lock. His mom called from the parking lot.</p>\n<p>Here’s what worked, because she handled it about as well as a person can.</p>\n<p>She didn’t make it about the coach. She didn’t say the coach made the wrong call. She didn’t text the coach. She didn’t start the parking-lot conversation that becomes the group-chat conversation that becomes the email-the-AD conversation. She knew where the line was.</p>\n<p>She didn’t say <em>we’ll show them next year.</em> That sentence makes the next twelve months a revenge tour and removes any chance of joy.</p>\n<p>She didn’t pretend it didn’t matter. She didn’t say <em>it’s just a sport.</em> It is a sport, and it does matter, and pretending otherwise is the fastest way to lose a kid’s trust.</p>\n<p>What she said when he got in the car: <em>That sucks. I’m sorry. I love watching you play.</em></p>\n<p>Then she drove home with the radio on. She didn’t bring it up at dinner. She didn’t bring it up Sunday. On Monday morning at breakfast he said <em>I think I want to keep playing JV and try out for varsity again next year.</em> She said <em>okay.</em> That was the whole conversation.</p>\n<p>Three sentences. Sixteen words. The whole job.</p>";

				const frontmatter = {"title":"On *not making* varsity","seoDescription":"A kid did not make varsity last week. Eighth grade. He'd been on the JV roster all of seventh and most parents said he was a lock.","format":"note","issue":7,"phase":"drive-home","sport":"multi-sport","age":"13-14","seasonPhase":"pre-season","publishedAt":"2026-04-09T00:00:00.000Z","hero":"/illustrations/on-not-making-varsity.webp","heroAlt":"A teenager on front porch in mid-afternoon, headphones in, scrolling on phone. Backpack dropped beside them, framing pulled back with warm light."};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/articles/on-not-making-varsity.md";
				const url = undefined;
				function rawContent() {
					return "\nA kid did not make varsity last week. Eighth grade. He'd been on the JV roster all of seventh and most parents said he was a lock. His mom called from the parking lot.\n\nHere's what worked, because she handled it about as well as a person can.\n\nShe didn't make it about the coach. She didn't say the coach made the wrong call. She didn't text the coach. She didn't start the parking-lot conversation that becomes the group-chat conversation that becomes the email-the-AD conversation. She knew where the line was.\n\nShe didn't say *we'll show them next year.* That sentence makes the next twelve months a revenge tour and removes any chance of joy.\n\nShe didn't pretend it didn't matter. She didn't say *it's just a sport.* It is a sport, and it does matter, and pretending otherwise is the fastest way to lose a kid's trust.\n\nWhat she said when he got in the car: *That sucks. I'm sorry. I love watching you play.*\n\nThen she drove home with the radio on. She didn't bring it up at dinner. She didn't bring it up Sunday. On Monday morning at breakfast he said *I think I want to keep playing JV and try out for varsity again next year.* She said *okay.* That was the whole conversation.\n\nThree sentences. Sixteen words. The whole job.\n";
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
