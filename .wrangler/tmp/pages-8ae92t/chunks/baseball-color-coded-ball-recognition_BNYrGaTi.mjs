globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Hitting is half eyes. A batter who picks up the ball early hits better than one who picks it up late. This drill forces them to see the ball clearly enough to call something about it before they swing.</p>\n<p><strong>What you need:</strong> 10 baseballs marked with three colors of tape (red, blue, yellow). A bat. A coach to pitch from 30 feet.</p>\n<p><strong>Setup:</strong> Coach throws from behind a screen at 30 feet. Batter at home plate.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Set, Load, Step, Swing. Add: see the color.</li>\n<li>Coach throws a pitch. Before the batter swings, they have to call out the color.</li>\n<li>If they call right and swing, count the swing. If they call wrong, no swing counted.</li>\n<li>Do 10 pitches. Goal: 7 correct color calls.</li>\n<li>Last 5: now they swing only at red and blue. Yellow is a take.</li>\n</ol>\n<p><strong>What to watch:</strong> Are they calling colors before the ball gets to them? If they’re calling at the moment of contact, they’re seeing the ball too late. The call should be 2-3 feet before the plate.</p>\n<p><strong>If they’re struggling:</strong> Use bigger, brighter color marks. Slow down the pitch.</p>\n<p><strong>If they’ve got it:</strong> Add a fourth color. Or shrink the color marks so they have to look harder.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/go/baseball-bat-28in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">28-inch youth bat →</a> — drop-10 USA-stamped bat for ages 8–10.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Color-Coded Ball Recognition","summary":"Pitches are different colors. Hitter calls the color before the swing. 12 minutes. Ages 8-10 and 11-12.","sport":"baseball","ages":["8-10","11-12"],"fundamental":"hitting","progression":"refine","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Three baseballs marked with different colored stripes (red, blue, yellow) being thrown one at a time, batter calling out the color mid-flight.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-color-coded-ball-recognition.md";
				const url = undefined;
				function rawContent() {
					return "\nHitting is half eyes. A batter who picks up the ball early hits better than one who picks it up late. This drill forces them to see the ball clearly enough to call something about it before they swing.\n\n**What you need:** 10 baseballs marked with three colors of tape (red, blue, yellow). A bat. A coach to pitch from 30 feet.\n\n**Setup:** Coach throws from behind a screen at 30 feet. Batter at home plate.\n\n**How to run it:**\n\n1. Cue: Set, Load, Step, Swing. Add: see the color.\n2. Coach throws a pitch. Before the batter swings, they have to call out the color.\n3. If they call right and swing, count the swing. If they call wrong, no swing counted.\n4. Do 10 pitches. Goal: 7 correct color calls.\n5. Last 5: now they swing only at red and blue. Yellow is a take.\n\n**What to watch:** Are they calling colors before the ball gets to them? If they're calling at the moment of contact, they're seeing the ball too late. The call should be 2-3 feet before the plate.\n\n**If they're struggling:** Use bigger, brighter color marks. Slow down the pitch.\n\n**If they've got it:** Add a fourth color. Or shrink the color marks so they have to look harder.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[28-inch youth bat →](/go/baseball-bat-28in/) — drop-10 USA-stamped bat for ages 8–10.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
