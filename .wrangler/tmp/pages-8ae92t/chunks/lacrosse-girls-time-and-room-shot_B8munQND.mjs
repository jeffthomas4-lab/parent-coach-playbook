globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Time and room means the shooter has space and time. No defender. Big windup, full power, accurate aim. This is the highest-velocity shot in lacrosse. Worth practicing because in real games, time-and-room shots come from a teammate’s pass that gets the defender out of position.</p>\n<p><strong>What you need:</strong> Stick, balls, goal, optional goalie.</p>\n<p><strong>Setup:</strong> Player at the top of the box (15 yards from the goal). Open lane to the goal.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Pull, Step, Snap, Follow.</li>\n<li>Coach passes the ball to the shooter.</li>\n<li>Shooter catches, takes one cradle, then loads the shot.</li>\n<li>Pull the stick all the way back, step into the throw, full snap.</li>\n<li>Aim for a corner. Do 8 shots, alternating corners.</li>\n</ol>\n<p><strong>What to watch:</strong> The wind-up. A short wind-up means a soft shot. The full pull-back generates the velocity.</p>\n<p><strong>If they’re struggling:</strong> Move closer (10 yards). Use a smaller goal or larger targets.</p>\n<p><strong>If they’ve got it:</strong> Add a goalie. Aim for top corners only (where goalies struggle).</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/lacrosse-ball/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Lacrosse balls (6-pack) →</a> — NOCSAE-stamped practice balls.</p>\n<p><a href=\"/go/lacrosse-starter-kit-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">STX Stallion complete stick →</a> — beginner stick for first-season players.</p>\n<p><a href=\"/what-to-buy/lacrosse-girls/\">Full lacrosse (girls) gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Time and Room Shot","summary":"Open shot from outside with no defender. 10 minutes. Ages 11-12.","sport":"lacrosse-girls","ages":["11-12"],"fundamental":"shooting","progression":"refine","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player at the top of the box with no defender pressuring, taking a full overhand shot at the goal with maximum power.","editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Time-and-room shot mechanics; clean."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/lacrosse-girls-time-and-room-shot.md";
				const url = undefined;
				function rawContent() {
					return "\nTime and room means the shooter has space and time. No defender. Big windup, full power, accurate aim. This is the highest-velocity shot in lacrosse. Worth practicing because in real games, time-and-room shots come from a teammate's pass that gets the defender out of position.\n\n**What you need:** Stick, balls, goal, optional goalie.\n\n**Setup:** Player at the top of the box (15 yards from the goal). Open lane to the goal.\n\n**How to run it:**\n\n1. Cue: Pull, Step, Snap, Follow.\n2. Coach passes the ball to the shooter.\n3. Shooter catches, takes one cradle, then loads the shot.\n4. Pull the stick all the way back, step into the throw, full snap.\n5. Aim for a corner. Do 8 shots, alternating corners.\n\n**What to watch:** The wind-up. A short wind-up means a soft shot. The full pull-back generates the velocity.\n\n**If they're struggling:** Move closer (10 yards). Use a smaller goal or larger targets.\n\n**If they've got it:** Add a goalie. Aim for top corners only (where goalies struggle).\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Lacrosse balls (6-pack) →](/go/lacrosse-ball/) — NOCSAE-stamped practice balls.\n\n[STX Stallion complete stick →](/go/lacrosse-starter-kit-youth/) — beginner stick for first-season players.\n\n[Full lacrosse (girls) gear guide →](/what-to-buy/lacrosse-girls/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
