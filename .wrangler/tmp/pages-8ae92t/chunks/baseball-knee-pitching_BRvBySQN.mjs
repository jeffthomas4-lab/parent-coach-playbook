globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Pitching mechanics get messy because the legs have to do half the work. On one knee, the legs are out of the picture and the kid has to use the arm and shoulder properly. This is how you teach the upper-body part of the pitch.</p>\n<p><strong>What you need:</strong> A baseball, a glove, a partner with a glove, a flat surface.</p>\n<p><strong>Setup:</strong> Pitcher kneels on the throwing-side knee. Front leg bent in front. Catcher kneels 25 feet away.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Set, Lift, Stride, Throw. From the knee, only Throw applies. The other three stay at age 11+.</li>\n<li>Pitcher comes set with the ball in the glove at the chest.</li>\n<li>They throw a controlled pitch to the catcher. Hand finishes across the body near the opposite knee.</li>\n<li>Do 10 throws.</li>\n<li>Last 5: focus on the follow-through. The throwing hand must end past the front knee.</li>\n</ol>\n<p><strong>What to watch:</strong> The arm slot. The throwing hand should pass over the top of the head, not from the side. If the arm is sidearm, it stays sidearm forever unless we fix it now.</p>\n<p><strong>If they’re struggling:</strong> Move the catcher closer to 15 feet. Slow throws. Form first, distance later.</p>\n<p><strong>If they’ve got it:</strong> Add target zones (chest, knee, low and away). They have to hit the target.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/go/baseball-catchers-gear-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth catcher’s set →</a> — chest protector, helmet, and leg guards.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Knee Pitching","summary":"Throw pitches from one knee to isolate the upper body. 10 minutes. Ages 8-10.","sport":"baseball","ages":["8-10"],"fundamental":"pitching","progression":"build","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Young pitcher kneeling on the throwing-side knee, throwing a baseball overhand with the same arm motion as a regular pitch.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":true,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Pitching mechanics; arm-care adjacent."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-knee-pitching.md";
				const url = undefined;
				function rawContent() {
					return "\nPitching mechanics get messy because the legs have to do half the work. On one knee, the legs are out of the picture and the kid has to use the arm and shoulder properly. This is how you teach the upper-body part of the pitch.\n\n**What you need:** A baseball, a glove, a partner with a glove, a flat surface.\n\n**Setup:** Pitcher kneels on the throwing-side knee. Front leg bent in front. Catcher kneels 25 feet away.\n\n**How to run it:**\n\n1. Cue: Set, Lift, Stride, Throw. From the knee, only Throw applies. The other three stay at age 11+.\n2. Pitcher comes set with the ball in the glove at the chest.\n3. They throw a controlled pitch to the catcher. Hand finishes across the body near the opposite knee.\n4. Do 10 throws.\n5. Last 5: focus on the follow-through. The throwing hand must end past the front knee.\n\n**What to watch:** The arm slot. The throwing hand should pass over the top of the head, not from the side. If the arm is sidearm, it stays sidearm forever unless we fix it now.\n\n**If they're struggling:** Move the catcher closer to 15 feet. Slow throws. Form first, distance later.\n\n**If they've got it:** Add target zones (chest, knee, low and away). They have to hit the target.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[Youth catcher's set →](/go/baseball-catchers-gear-youth/) — chest protector, helmet, and leg guards.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
