globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>In a real game, runners are moving. The slow catch-think-throw player gets beat. Quick release is the skill where the catch and the throw are one motion. This is what middle infielders practice every day.</p>\n<p><strong>What you need:</strong> 8 baseballs, a glove, a partner with a glove, a stopwatch on a phone.</p>\n<p><strong>Setup:</strong> 25 feet apart on flat ground. Pile of balls next to you, the coach.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Turn, Shuffle, Point, Fire. Today the cue is the same but everything happens fast.</li>\n<li>You toss a slow easy throw to the kid. They catch and throw back as fast as they can. Time the catch-to-release with your phone.</li>\n<li>Goal: under 2 seconds catch to release. Tell them their time after each throw.</li>\n<li>Do 10 throws. Most kids start at 3-4 seconds and drop to 2 by the end.</li>\n<li>Last 5: throw it slightly to one side or the other so they have to catch and reset their feet quickly before the throw.</li>\n</ol>\n<p><strong>What to watch:</strong> The hand exchange. The throwing hand should meet the glove right when the ball arrives. If the throwing hand has to travel to the glove after the catch, that’s wasted time.</p>\n<p><strong>If they’re struggling:</strong> Drop the timer. Just focus on getting the throwing hand to the glove during the catch, not after.</p>\n<p><strong>If they’ve got it:</strong> Cut the goal to 1.5 seconds. Or add a target on the wall behind you. They have to be quick AND accurate.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Quick Release","summary":"Catch the ball and throw it again in under two seconds. 12 minutes. Ages 8-10 and 11-12.","sport":"baseball","ages":["8-10","11-12"],"fundamental":"throwing","progression":"refine","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A child receiving a thrown ball with the glove already turning toward the throwing hand for a quick exchange.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-quick-release-catch-throw.md";
				const url = undefined;
				function rawContent() {
					return "\nIn a real game, runners are moving. The slow catch-think-throw player gets beat. Quick release is the skill where the catch and the throw are one motion. This is what middle infielders practice every day.\n\n**What you need:** 8 baseballs, a glove, a partner with a glove, a stopwatch on a phone.\n\n**Setup:** 25 feet apart on flat ground. Pile of balls next to you, the coach.\n\n**How to run it:**\n\n1. Cue: Turn, Shuffle, Point, Fire. Today the cue is the same but everything happens fast.\n2. You toss a slow easy throw to the kid. They catch and throw back as fast as they can. Time the catch-to-release with your phone.\n3. Goal: under 2 seconds catch to release. Tell them their time after each throw.\n4. Do 10 throws. Most kids start at 3-4 seconds and drop to 2 by the end.\n5. Last 5: throw it slightly to one side or the other so they have to catch and reset their feet quickly before the throw.\n\n**What to watch:** The hand exchange. The throwing hand should meet the glove right when the ball arrives. If the throwing hand has to travel to the glove after the catch, that's wasted time.\n\n**If they're struggling:** Drop the timer. Just focus on getting the throwing hand to the glove during the catch, not after.\n\n**If they've got it:** Cut the goal to 1.5 seconds. Or add a target on the wall behind you. They have to be quick AND accurate.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
