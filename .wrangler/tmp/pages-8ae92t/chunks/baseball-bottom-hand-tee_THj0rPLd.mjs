globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The bottom hand controls the bat path. The top hand adds power. If the bottom hand is weak, the swing rolls over and the ball gets pulled into the ground. This drill isolates the bottom hand so it gets stronger and learns the right path.</p>\n<p><strong>What you need:</strong> A short, light bat (some kids use a fungo bat, others use a thinner training bat), a tee, 10 plastic or safety-core baseballs, a fence.</p>\n<p><strong>Setup:</strong> Tee at belt height in line with the front hip. Kid in batting stance.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Set, Load, Step, Swing.</li>\n<li>They hold the bat with the bottom hand only. Top hand goes behind the back.</li>\n<li>Swing through the ball. The bat path will feel slow and weak. That’s normal.</li>\n<li>Do 10 swings. The bat should swing through, not chop down.</li>\n<li>Last 5: add the top hand back lightly, but the bottom hand still does most of the work.</li>\n</ol>\n<p><strong>What to watch:</strong> The bat path. If the bat dips down before contact, the kid is using their wrist. If the bat stays level through contact, the bottom hand is leading correctly.</p>\n<p><strong>If they’re struggling:</strong> Use a lighter bat. Or have them choke up on the handle.</p>\n<p><strong>If they’ve got it:</strong> Switch to soft toss with bottom hand only. Or extend the drill to 15 swings per round.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/go/baseball-trainer/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Batting trainer →</a> — tee and trainer setup for solo swings.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Bottom Hand Tee","summary":"Hit off the tee with only the bottom hand on the bat. 10 minutes. Ages 8-10 and 11-12.","sport":"baseball","ages":["8-10","11-12"],"fundamental":"hitting","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A child holding a small bat with only the bottom hand, swinging through a ball on a tee with the top hand held behind the back.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-bottom-hand-tee.md";
				const url = undefined;
				function rawContent() {
					return "\nThe bottom hand controls the bat path. The top hand adds power. If the bottom hand is weak, the swing rolls over and the ball gets pulled into the ground. This drill isolates the bottom hand so it gets stronger and learns the right path.\n\n**What you need:** A short, light bat (some kids use a fungo bat, others use a thinner training bat), a tee, 10 plastic or safety-core baseballs, a fence.\n\n**Setup:** Tee at belt height in line with the front hip. Kid in batting stance.\n\n**How to run it:**\n\n1. Cue: Set, Load, Step, Swing.\n2. They hold the bat with the bottom hand only. Top hand goes behind the back.\n3. Swing through the ball. The bat path will feel slow and weak. That's normal.\n4. Do 10 swings. The bat should swing through, not chop down.\n5. Last 5: add the top hand back lightly, but the bottom hand still does most of the work.\n\n**What to watch:** The bat path. If the bat dips down before contact, the kid is using their wrist. If the bat stays level through contact, the bottom hand is leading correctly.\n\n**If they're struggling:** Use a lighter bat. Or have them choke up on the handle.\n\n**If they've got it:** Switch to soft toss with bottom hand only. Or extend the drill to 15 swings per round.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[Batting trainer →](/go/baseball-trainer/) — tee and trainer setup for solo swings.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
