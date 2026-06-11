globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A car kit is not a first-aid kit. It’s the stuff you forgot that you’ll need three times a season. Build it once in March. Check it once in June. It saves you.</p>\n<p><strong>The core list</strong>\nOne roll of <a href=\"/go/multi-sport-athletic-tape/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">athletic tape</a>. Not medical tape. Athletic tape. Two pairs of socks. A spare <a href=\"/go/multi-sport-mouthguard-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">mouthguard</a> (if your sport uses one). One elastic bandage. One small bottle of pain reliever. A hairband or two. A towel.</p>\n<p>That’s it. Throw it in a ziplock bag. Size gallon. Put it in the trunk.</p>\n<p><strong>What not to include</strong>\nDon’t pack extra shoes. Don’t pack a full change of clothes. Don’t pack ice packs or medical supplies. Your trunk is not an athletic training room. This is for the small things.</p>\n<p><strong>What you actually need</strong>\nThe tape for the time they rolled their ankle two hours before a tournament. The socks for when they left theirs at home. The bandage for the time something went wrong and you needed to stabilize something before getting to the trainer.</p>\n<p>One roll of tape solves more problems than anything else in that bag. Keep it fresh.</p>\n<p><strong>The check</strong>\nOnce a season, pull it out. Make sure the tape isn’t dried out. Make sure nothing spilled. Replace what’s gone. That’s all.</p>\n<p><strong>Where to put it</strong>\nNot in the car where it gets hot. In the trunk. Leave it there all season. Don’t borrow from it. When season ends, you’re already set for next year.</p>\n<p><strong>The cost</strong>\nThe whole kit costs less than one emergency stop at a gas station, and you only pay it once.</p>\n<p>This takes fifteen minutes to build. It solves problems you can’t predict. Do it once. Forget about it. Pull it out when you need it.</p>";

				const frontmatter = {"title":"The Car Kit That Stays in the Trunk","dek":"What you need and what you can skip.","seoDescription":"A car kit is not a first-aid kit. It's the stuff you forgot that you'll need three times a season. Build it once in March. Check it once in June. It saves you.","topic":"equipment","format":"note","phase":"drive-there","sport":"multi-sport","age":"all-ages","publishedAt":"2026-03-14T00:00:00.000Z","featured":false,"editorial":{"claudeReviewedAt":"2026-06-24T00:00:00.000Z"}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/articles/car-kit.md";
				const url = undefined;
				function rawContent() {
					return "\nA car kit is not a first-aid kit. It's the stuff you forgot that you'll need three times a season. Build it once in March. Check it once in June. It saves you.\n\n**The core list**\nOne roll of [athletic tape](/go/multi-sport-athletic-tape/). Not medical tape. Athletic tape. Two pairs of socks. A spare [mouthguard](/go/multi-sport-mouthguard-youth/) (if your sport uses one). One elastic bandage. One small bottle of pain reliever. A hairband or two. A towel.\n\nThat's it. Throw it in a ziplock bag. Size gallon. Put it in the trunk.\n\n**What not to include**\nDon't pack extra shoes. Don't pack a full change of clothes. Don't pack ice packs or medical supplies. Your trunk is not an athletic training room. This is for the small things.\n\n**What you actually need**\nThe tape for the time they rolled their ankle two hours before a tournament. The socks for when they left theirs at home. The bandage for the time something went wrong and you needed to stabilize something before getting to the trainer.\n\nOne roll of tape solves more problems than anything else in that bag. Keep it fresh.\n\n**The check**\nOnce a season, pull it out. Make sure the tape isn't dried out. Make sure nothing spilled. Replace what's gone. That's all.\n\n**Where to put it**\nNot in the car where it gets hot. In the trunk. Leave it there all season. Don't borrow from it. When season ends, you're already set for next year.\n\n**The cost**\nThe whole kit costs less than one emergency stop at a gas station, and you only pay it once.\n\nThis takes fifteen minutes to build. It solves problems you can't predict. Do it once. Forget about it. Pull it out when you need it.\n";
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
