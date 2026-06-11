globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>In flag football the stiff arm is legal as long as it’s open palm and not in the face. Used right, it keeps the defender’s hand off the flag. Most kids forget they have a free arm. Teach them to use it.</p>\n<p><strong>What you need:</strong> A foam football, flag belts, two players.</p>\n<p><strong>Setup:</strong> Runner with ball, defender 5 yards away. Open grass.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Runner sprints forward.</li>\n<li>As defender approaches, runner extends the OFF arm (the one without the ball) with open palm.</li>\n<li>Stiff arm pushes the defender’s shoulder or arm to keep distance. Not the face. Not the chest.</li>\n<li>Runner keeps moving past the defender, ball still tucked tight.</li>\n<li>Do 6 reps. Switch sides.</li>\n</ol>\n<p><strong>What to watch:</strong> Open palm, not a fist. Closed fists are illegal contact and unsportsmanlike. Open hand only.</p>\n<p><strong>If they’re struggling:</strong> Walk through the move at half speed. Practice the arm motion without the run.</p>\n<p><strong>If they’ve got it:</strong> Add a juke. Stiff arm to one side, then juke the other way.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/flag-football-belt-set/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Flag football belt set →</a> — 14-player set for organized flag practice.</p>\n<p><a href=\"/what-to-buy/flag-football/\">Full flag football gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Stiff Arm Reach","summary":"Use the off arm to keep a defender from pulling the flag. 10 minutes. Ages 11-12.","sport":"flag-football","ages":["11-12"],"fundamental":"ball-carrying","progression":"refine","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Runner with ball tucked in one arm, the other arm extended straight out with palm pushing the defender's shoulder, flag still on the runner's hip.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Cites stiff-arm-on-flag-puller restriction implicitly via open-palm rule. Per league rules vary, may want explicit cite later."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/flag-football-stiff-arm-vs-defender.md";
				const url = undefined;
				function rawContent() {
					return "\nIn flag football the stiff arm is legal as long as it's open palm and not in the face. Used right, it keeps the defender's hand off the flag. Most kids forget they have a free arm. Teach them to use it.\n\n**What you need:** A foam football, flag belts, two players.\n\n**Setup:** Runner with ball, defender 5 yards away. Open grass.\n\n**How to run it:**\n\n1. Runner sprints forward.\n2. As defender approaches, runner extends the OFF arm (the one without the ball) with open palm.\n3. Stiff arm pushes the defender's shoulder or arm to keep distance. Not the face. Not the chest.\n4. Runner keeps moving past the defender, ball still tucked tight.\n5. Do 6 reps. Switch sides.\n\n**What to watch:** Open palm, not a fist. Closed fists are illegal contact and unsportsmanlike. Open hand only.\n\n**If they're struggling:** Walk through the move at half speed. Practice the arm motion without the run.\n\n**If they've got it:** Add a juke. Stiff arm to one side, then juke the other way.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Flag football belt set →](/go/flag-football-belt-set/) — 14-player set for organized flag practice.\n\n[Full flag football gear guide →](/what-to-buy/flag-football/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
