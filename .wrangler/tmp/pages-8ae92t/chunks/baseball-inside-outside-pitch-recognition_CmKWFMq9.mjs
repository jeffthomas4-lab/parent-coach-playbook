globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Inside pitches get pulled. Outside pitches go to the opposite field. A hitter who knows where the pitch is going before it gets there can plan the swing. This drill builds that recognition.</p>\n<p><strong>What you need:</strong> A bat, 15 baseballs, a coach to pitch, a strike zone marker (a chalk line on a fence works).</p>\n<p><strong>Setup:</strong> Coach pitches from 30 feet behind a screen. Strike zone marked behind the batter on a fence or net.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Coach throws pitches alternating inside (batter’s side of the plate) and outside (far side).</li>\n<li>Before swinging, batter calls “in” or “out” as the ball crosses.</li>\n<li>Inside pitch: batter pulls it. Outside pitch: batter hits opposite field.</li>\n<li>Do 10 pitches.</li>\n<li>Last 5: random mix. Batter has to call AND react in the right direction.</li>\n</ol>\n<p><strong>What to watch:</strong> Where the ball goes. Inside pitches should go to the pull side of the field. Outside pitches should go to the opposite side. If everything goes one direction, the kid isn’t reading the pitch location.</p>\n<p><strong>If they’re struggling:</strong> Drop the call. Just have them try to hit each pitch in the direction it should go.</p>\n<p><strong>If they’ve got it:</strong> Add pitches at different speeds and heights. Same recognition, more variables.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/go/baseball-bat-28in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">28-inch youth bat →</a> — drop-10 USA-stamped bat for ages 8–10.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Inside Outside Pitch Recognition","summary":"Pitches alternate inside and outside. Hitter calls and reacts. 12 minutes. Ages 11-12.","sport":"baseball","ages":["11-12"],"fundamental":"hitting","progression":"refine","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Two strike zone diagrams showing an inside pitch on the batter's side of the plate and an outside pitch on the far side, with arrows pointing where each ball should be hit.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-inside-outside-pitch-recognition.md";
				const url = undefined;
				function rawContent() {
					return "\nInside pitches get pulled. Outside pitches go to the opposite field. A hitter who knows where the pitch is going before it gets there can plan the swing. This drill builds that recognition.\n\n**What you need:** A bat, 15 baseballs, a coach to pitch, a strike zone marker (a chalk line on a fence works).\n\n**Setup:** Coach pitches from 30 feet behind a screen. Strike zone marked behind the batter on a fence or net.\n\n**How to run it:**\n\n1. Coach throws pitches alternating inside (batter's side of the plate) and outside (far side).\n2. Before swinging, batter calls \"in\" or \"out\" as the ball crosses.\n3. Inside pitch: batter pulls it. Outside pitch: batter hits opposite field.\n4. Do 10 pitches.\n5. Last 5: random mix. Batter has to call AND react in the right direction.\n\n**What to watch:** Where the ball goes. Inside pitches should go to the pull side of the field. Outside pitches should go to the opposite side. If everything goes one direction, the kid isn't reading the pitch location.\n\n**If they're struggling:** Drop the call. Just have them try to hit each pitch in the direction it should go.\n\n**If they've got it:** Add pitches at different speeds and heights. Same recognition, more variables.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[28-inch youth bat →](/go/baseball-bat-28in/) — drop-10 USA-stamped bat for ages 8–10.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
