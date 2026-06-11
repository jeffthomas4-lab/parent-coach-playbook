globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The top hand drives the bat through contact. A weak top hand means the bat slows down at the ball and the kid pushes it instead of hitting it. This drill makes the top hand do the work the bottom hand was carrying.</p>\n<p><strong>What you need:</strong> A short, light bat or a one-arm training bat, a tee, 10 plastic or safety-core baseballs, a fence.</p>\n<p><strong>Setup:</strong> Tee at belt height in line with the front hip. Kid in batting stance.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Set, Load, Step, Swing.</li>\n<li>They hold the bat with the top hand only. Bottom hand on the back hip.</li>\n<li>Swing through the ball. The arm will feel weak. That’s the point.</li>\n<li>Do 10 swings. The wrist has to roll through after contact for the bat to finish.</li>\n<li>Last 5: focus on the wrist roll. After contact, the top palm should turn from face-up to face-down.</li>\n</ol>\n<p><strong>What to watch:</strong> The wrist roll. If the wrist stays flat after contact, the swing dies at the ball. The wrist has to flip through.</p>\n<p><strong>If they’re struggling:</strong> Use the lightest possible bat. Even a wiffle ball bat works for this drill.</p>\n<p><strong>If they’ve got it:</strong> Move to soft toss with the top hand only. Or use a slightly heavier bat for resistance.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/go/baseball-trainer/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Batting trainer →</a> — tee and trainer setup for solo swings.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Top Hand Tee","summary":"Hit off the tee with only the top hand on the bat. 10 minutes. Ages 8-10 and 11-12.","sport":"baseball","ages":["8-10","11-12"],"fundamental":"hitting","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A child holding a small bat with only the top hand, swinging through a ball on a tee with the bottom hand on the back hip.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-top-hand-tee.md";
				const url = undefined;
				function rawContent() {
					return "\nThe top hand drives the bat through contact. A weak top hand means the bat slows down at the ball and the kid pushes it instead of hitting it. This drill makes the top hand do the work the bottom hand was carrying.\n\n**What you need:** A short, light bat or a one-arm training bat, a tee, 10 plastic or safety-core baseballs, a fence.\n\n**Setup:** Tee at belt height in line with the front hip. Kid in batting stance.\n\n**How to run it:**\n\n1. Cue: Set, Load, Step, Swing.\n2. They hold the bat with the top hand only. Bottom hand on the back hip.\n3. Swing through the ball. The arm will feel weak. That's the point.\n4. Do 10 swings. The wrist has to roll through after contact for the bat to finish.\n5. Last 5: focus on the wrist roll. After contact, the top palm should turn from face-up to face-down.\n\n**What to watch:** The wrist roll. If the wrist stays flat after contact, the swing dies at the ball. The wrist has to flip through.\n\n**If they're struggling:** Use the lightest possible bat. Even a wiffle ball bat works for this drill.\n\n**If they've got it:** Move to soft toss with the top hand only. Or use a slightly heavier bat for resistance.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[Batting trainer →](/go/baseball-trainer/) — tee and trainer setup for solo swings.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
