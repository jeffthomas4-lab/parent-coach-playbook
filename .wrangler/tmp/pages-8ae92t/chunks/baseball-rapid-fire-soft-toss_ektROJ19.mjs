globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>When swings come fast, the body can’t think. The swing has to be the swing it already is. This drill tests whether the swing pattern holds up under fatigue and pressure. It also burns the swing into muscle memory.</p>\n<p><strong>What you need:</strong> 30 baseballs in a bucket, a bat, a screen, a fence or net.</p>\n<p><strong>Setup:</strong> Coach kneels behind the screen 8 feet to the side of the batter. Bucket of balls.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Set, Load, Step, Swing. The cue runs in the background. No verbal coaching.</li>\n<li>Coach tosses a ball every 3 seconds. Batter swings, resets, next.</li>\n<li>Do 30 swings in 90 seconds. Don’t pause.</li>\n<li>After the round, the batter sits for 2 minutes.</li>\n<li>Second round: 30 more swings.</li>\n</ol>\n<p><strong>What to watch:</strong> Swings 25-30. The swing pattern at the end of the round shows what’s truly automatic. If the swing falls apart at rep 25, the swing wasn’t fully grooved.</p>\n<p><strong>If they’re struggling:</strong> Cut to 20 swings. Or slow the pace to one toss every 5 seconds.</p>\n<p><strong>If they’ve got it:</strong> Add target zones (hit balls into specific areas of the field). Or increase to 40 swings per round.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/go/baseball-bat-28in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">28-inch youth bat →</a> — drop-10 USA-stamped bat for ages 8–10.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Rapid Fire Soft Toss","summary":"30 swings in 90 seconds for swing pattern training. 10 minutes. Ages 11-12.","sport":"baseball","ages":["11-12"],"fundamental":"hitting","progression":"refine","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Coach feeding balls in rapid succession from the side, batter swinging through one ball as the next is already in the air.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-rapid-fire-soft-toss.md";
				const url = undefined;
				function rawContent() {
					return "\nWhen swings come fast, the body can't think. The swing has to be the swing it already is. This drill tests whether the swing pattern holds up under fatigue and pressure. It also burns the swing into muscle memory.\n\n**What you need:** 30 baseballs in a bucket, a bat, a screen, a fence or net.\n\n**Setup:** Coach kneels behind the screen 8 feet to the side of the batter. Bucket of balls.\n\n**How to run it:**\n\n1. Cue: Set, Load, Step, Swing. The cue runs in the background. No verbal coaching.\n2. Coach tosses a ball every 3 seconds. Batter swings, resets, next.\n3. Do 30 swings in 90 seconds. Don't pause.\n4. After the round, the batter sits for 2 minutes.\n5. Second round: 30 more swings.\n\n**What to watch:** Swings 25-30. The swing pattern at the end of the round shows what's truly automatic. If the swing falls apart at rep 25, the swing wasn't fully grooved.\n\n**If they're struggling:** Cut to 20 swings. Or slow the pace to one toss every 5 seconds.\n\n**If they've got it:** Add target zones (hit balls into specific areas of the field). Or increase to 40 swings per round.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[28-inch youth bat →](/go/baseball-bat-28in/) — drop-10 USA-stamped bat for ages 8–10.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
