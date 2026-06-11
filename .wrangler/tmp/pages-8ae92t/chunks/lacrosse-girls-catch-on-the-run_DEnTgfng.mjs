globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A receiver who slows down to catch the ball gets caught. The catch has to happen at full speed. Stick high, hands soft, eyes on the ball.</p>\n<p><strong>What you need:</strong> Two sticks, ball, two players, 30-yard area.</p>\n<p><strong>Setup:</strong> Receiver at one end. Passer 20 yards away.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Receiver sprints forward with stick held high.</li>\n<li>Passer leads the pass to where the receiver is going.</li>\n<li>Receiver catches without breaking stride. Stick gives back as the ball arrives.</li>\n<li>Continue running for 5 yards after the catch.</li>\n<li>Do 6 reps. Switch sides.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the receiver slow down? Slowing kills the play in a real game. Catch and continue.</p>\n<p><strong>If they’re struggling:</strong> Slower receiver pace. Larger ball.</p>\n<p><strong>If they’ve got it:</strong> Add a defender chasing. Or pass to the off-stick side (forces a switch of hands).</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/lacrosse-ball/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Lacrosse balls (6-pack) →</a> — NOCSAE-stamped practice balls.</p>\n<p><a href=\"/go/lacrosse-starter-kit-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">STX Stallion complete stick →</a> — beginner stick for first-season players.</p>\n<p><a href=\"/what-to-buy/lacrosse-girls/\">Full lacrosse (girls) gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Catch on the Run","summary":"Catch a pass while sprinting forward. 12 minutes. Ages 8-10 and 11-12.","sport":"lacrosse-girls","ages":["8-10","11-12"],"fundamental":"catching","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player sprinting forward with the stick held high, catching a pass mid-stride without slowing down.","editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean girls' vocabulary; no contact issues."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/lacrosse-girls-catch-on-the-run.md";
				const url = undefined;
				function rawContent() {
					return "\nA receiver who slows down to catch the ball gets caught. The catch has to happen at full speed. Stick high, hands soft, eyes on the ball.\n\n**What you need:** Two sticks, ball, two players, 30-yard area.\n\n**Setup:** Receiver at one end. Passer 20 yards away.\n\n**How to run it:**\n\n1. Receiver sprints forward with stick held high.\n2. Passer leads the pass to where the receiver is going.\n3. Receiver catches without breaking stride. Stick gives back as the ball arrives.\n4. Continue running for 5 yards after the catch.\n5. Do 6 reps. Switch sides.\n\n**What to watch:** Does the receiver slow down? Slowing kills the play in a real game. Catch and continue.\n\n**If they're struggling:** Slower receiver pace. Larger ball.\n\n**If they've got it:** Add a defender chasing. Or pass to the off-stick side (forces a switch of hands).\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Lacrosse balls (6-pack) →](/go/lacrosse-ball/) — NOCSAE-stamped practice balls.\n\n[STX Stallion complete stick →](/go/lacrosse-starter-kit-youth/) — beginner stick for first-season players.\n\n[Full lacrosse (girls) gear guide →](/what-to-buy/lacrosse-girls/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
