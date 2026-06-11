globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Most kids have only swung at tee balls and soft tosses. The first time they see a real overhand pitch, they freeze. Overhand BP at a short distance bridges the gap. Same swing, real ball flight.</p>\n<p><strong>What you need:</strong> 20 baseballs, a bat, a protective screen, a backstop or fence.</p>\n<p><strong>Setup:</strong> Coach 30 feet from the batter behind a screen. Batter at home plate.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Set, Load, Step, Swing.</li>\n<li>Coach throws overhand at half-speed strikes. Goal: throw 10 hittable pitches in a row.</li>\n<li>Batter swings at every pitch in the strike zone.</li>\n<li>After 10 swings, take 30 seconds. Then 10 more.</li>\n<li>Last 5 swings: throw at slightly faster speed but still in the zone.</li>\n</ol>\n<p><strong>What to watch:</strong> Are they pulling out of the swing because the ball is moving? That’s the sign that the speed is too much. Slow down or move further away.</p>\n<p><strong>If they’re struggling:</strong> Move the coach further back to 40 feet. Slower throws.</p>\n<p><strong>If they’ve got it:</strong> Add some balls (intentionally outside the zone). Batter has to take pitches that are not strikes.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/go/baseball-trainer/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Batting trainer →</a> — tee and trainer setup for solo swings.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Overhand Batting Practice","summary":"Coach throws overhand from a short distance for live hitting reps. 20 minutes. Ages 8-10 and 11-12.","sport":"baseball","ages":["8-10","11-12"],"fundamental":"hitting","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Coach throwing overhand from behind a protective screen 30 feet away, batter swinging at a pitched ball mid-flight.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-overhand-batting-practice.md";
				const url = undefined;
				function rawContent() {
					return "\nMost kids have only swung at tee balls and soft tosses. The first time they see a real overhand pitch, they freeze. Overhand BP at a short distance bridges the gap. Same swing, real ball flight.\n\n**What you need:** 20 baseballs, a bat, a protective screen, a backstop or fence.\n\n**Setup:** Coach 30 feet from the batter behind a screen. Batter at home plate.\n\n**How to run it:**\n\n1. Cue: Set, Load, Step, Swing.\n2. Coach throws overhand at half-speed strikes. Goal: throw 10 hittable pitches in a row.\n3. Batter swings at every pitch in the strike zone.\n4. After 10 swings, take 30 seconds. Then 10 more.\n5. Last 5 swings: throw at slightly faster speed but still in the zone.\n\n**What to watch:** Are they pulling out of the swing because the ball is moving? That's the sign that the speed is too much. Slow down or move further away.\n\n**If they're struggling:** Move the coach further back to 40 feet. Slower throws.\n\n**If they've got it:** Add some balls (intentionally outside the zone). Batter has to take pitches that are not strikes.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[Batting trainer →](/go/baseball-trainer/) — tee and trainer setup for solo swings.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
