globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Dribbling starts with confidence and touch. This game forces ball control because getting tagged means you’re out. Kids learn to protect the ball while moving fast.</p>\n<p><strong>Equipment needed:</strong> One <a href=\"/go/soccer-ball-size3/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">soccer ball</a> per child (or one per three kids in rotation), a defined space about 30 by 30 yards.</p>\n<p><strong>Setup:</strong> Mark a square with <a href=\"/go/soccer-cones-12pk/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">cones</a>. All kids enter with a ball at their feet except two kids who are the “sharks.”</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Sharks are taggers. They have no ball.</li>\n<li>Minnows (everyone else) must keep their ball within the square while dribbling.</li>\n<li>If a shark tags a minnow, they swap. The minnow becomes a shark.</li>\n<li>Minnows can’t stand still. They have to keep moving with the ball.</li>\n<li>Play for five minutes. Rotate so most kids get a turn as a minnow. Repeat for 15 minutes total.</li>\n</ol>\n<p><strong>What to look for:</strong> Ball control under pressure. Kids who are dribbling with their eyes up will see the shark coming. Kids who only look at the ball will get tagged.</p>\n<p><strong>Variation:</strong> For younger kids (5-6), start with one shark. For older</p>";

				const frontmatter = {"title":"Sharks and Minnows","summary":"Tag game with the ball at their feet. 15 minutes. Ages 5-7.","sport":"soccer","ages":["5-7"],"focus":"fundamentals","layer":"foundations","fundamental":"warm-up","progression":"intro","illustrationBrief":"One defender chases multiple attackers","publishedAt":"2026-01-03T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Classic drill, well-paced explanation, age variation good."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-sharks-and-minnows-ages-5-7.md";
				const url = undefined;
				function rawContent() {
					return "\nDribbling starts with confidence and touch. This game forces ball control because getting tagged means you're out. Kids learn to protect the ball while moving fast.\n\n**Equipment needed:** One [soccer ball](/go/soccer-ball-size3/) per child (or one per three kids in rotation), a defined space about 30 by 30 yards.\n\n**Setup:** Mark a square with [cones](/go/soccer-cones-12pk/). All kids enter with a ball at their feet except two kids who are the \"sharks.\"\n\n**How to run it:**\n\n1. Sharks are taggers. They have no ball.\n2. Minnows (everyone else) must keep their ball within the square while dribbling.\n3. If a shark tags a minnow, they swap. The minnow becomes a shark.\n4. Minnows can't stand still. They have to keep moving with the ball.\n5. Play for five minutes. Rotate so most kids get a turn as a minnow. Repeat for 15 minutes total.\n\n**What to look for:** Ball control under pressure. Kids who are dribbling with their eyes up will see the shark coming. Kids who only look at the ball will get tagged.\n\n**Variation:** For younger kids (5-6), start with one shark. For older ";
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
