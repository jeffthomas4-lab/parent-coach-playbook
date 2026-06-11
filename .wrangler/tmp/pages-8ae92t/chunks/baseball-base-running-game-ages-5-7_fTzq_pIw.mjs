globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Base runners who understand spacing and angles beat runners who are confused about where to go. This drill turns that into a game so kids remember it.</p>\n<p><strong>Equipment needed:</strong> Four <a href=\"/go/agility-cones/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">cones</a>, two <a href=\"/go/baseball-bases-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">bases</a> (or bags), a stopwatch or timer on your phone.</p>\n<p><strong>Setup:</strong> Set up a diamond at 45 feet per side using cones at home and first base. Mark “halfway” between home and first with a cone at the 22-foot line. You stand at first base.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Line the kids up at home plate in pairs.</li>\n<li>The first pair races to first base: one runs the baseline (the chalk line), one runs a wider angle around it.</li>\n<li>Call out who wins each rep. The runner on the baseline will almost always win. Now they see it.</li>\n<li>Next rep: they switch which runner takes which path.</li>\n<li>Do 4 rounds so each kid runs the baseline twice and the angle twice. They’ll feel the difference in their legs.</li>\n</ol>\n<p><strong>What to look for:</strong> The straight line beats the curve. Some kids will still try to run the wide angle because they think base running means “running to the side.” It doesn’t.</p>\n<p><strong>If they’re struggling:</strong> Move the start line closer to first. The race is shorter so they finish before they get tired.</p>\n<p><strong>If they’ve got it:</strong> Add a second leg. After they touch first, they round and head for second. Now they have to think about the angle int</p>";

				const frontmatter = {"title":"Base Running Game","summary":"Teach base running angles and spacing with a relay race. 12 minutes. Ages 5-7.","sport":"baseball","ages":["5-7"],"focus":"fundamentals","layer":"foundations","fundamental":"base-running","progression":"intro","illustrationBrief":"Two young children racing from home plate to first base, one running straight along the baseline while the other takes a wider arc around it.","publishedAt":"2026-01-12T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":7,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"File ended mid-sentence at 'Variation:'. Replaced with standard 'If they're struggling / If they've got it' progressions."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-base-running-game-ages-5-7.md";
				const url = undefined;
				function rawContent() {
					return "\nBase runners who understand spacing and angles beat runners who are confused about where to go. This drill turns that into a game so kids remember it.\n\n**Equipment needed:** Four [cones](/go/agility-cones/), two [bases](/go/baseball-bases-rubber/) (or bags), a stopwatch or timer on your phone.\n\n**Setup:** Set up a diamond at 45 feet per side using cones at home and first base. Mark \"halfway\" between home and first with a cone at the 22-foot line. You stand at first base.\n\n**How to run it:**\n\n1. Line the kids up at home plate in pairs.\n2. The first pair races to first base: one runs the baseline (the chalk line), one runs a wider angle around it.\n3. Call out who wins each rep. The runner on the baseline will almost always win. Now they see it.\n4. Next rep: they switch which runner takes which path.\n5. Do 4 rounds so each kid runs the baseline twice and the angle twice. They'll feel the difference in their legs.\n\n**What to look for:** The straight line beats the curve. Some kids will still try to run the wide angle because they think base running means \"running to the side.\" It doesn't.\n\n**If they're struggling:** Move the start line closer to first. The race is shorter so they finish before they get tired.\n\n**If they've got it:** Add a second leg. After they touch first, they round and head for second. Now they have to think about the angle int";
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
