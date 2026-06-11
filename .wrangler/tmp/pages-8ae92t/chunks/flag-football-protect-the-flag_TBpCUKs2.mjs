globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The kid running the ball has two jobs: hold the ball and protect the flag. If they drop the ball or get the flag pulled, the play is over. This drill teaches the basic body position.</p>\n<p><strong>What you need:</strong> Flag belts and flags. A foam football. A 20x20 yard area.</p>\n<p><strong>Setup:</strong> Runner with the ball at one end. Two defenders 10 yards away. Goal line at the back of the box.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Runner sprints toward the goal line carrying the ball.</li>\n<li>Two defenders try to pull the flag.</li>\n<li>Runner uses cuts and changes of direction (no stiff arm at this age) to avoid the pulls.</li>\n<li>Reset. Run 5 reps with the runner switching roles.</li>\n<li>Last round: runner has to use both hands on the ball. Tighter ball security.</li>\n</ol>\n<p><strong>What to watch:</strong> The ball position. The ball should be tucked tight against the chest and rib cage. A loose ball is a dropped ball.</p>\n<p><strong>If they’re struggling:</strong> Drop to one defender. Or shorten the box.</p>\n<p><strong>If they’ve got it:</strong> Add a third defender. Or add a cone gauntlet they have to weave through.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/flag-football-belt-set/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Flag football belt set →</a> — 14-player set for organized flag practice.</p>\n<p><a href=\"/go/agility-cones/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Agility cones →</a> — for route trees, end zones, and field setup.</p>\n<p><a href=\"/what-to-buy/flag-football/\">Full flag football gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Protect the Flag","summary":"Run with the ball without letting flags get pulled. 8 minutes. Ages 5-7.","sport":"flag-football","ages":["5-7"],"fundamental":"ball-carrying","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A young child running with a foam football tucked under one arm, the other arm bent slightly to shield the flag on that hip.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Ball-security and flag-protection basics for ages 5-7."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/flag-football-protect-the-flag.md";
				const url = undefined;
				function rawContent() {
					return "\nThe kid running the ball has two jobs: hold the ball and protect the flag. If they drop the ball or get the flag pulled, the play is over. This drill teaches the basic body position.\n\n**What you need:** Flag belts and flags. A foam football. A 20x20 yard area.\n\n**Setup:** Runner with the ball at one end. Two defenders 10 yards away. Goal line at the back of the box.\n\n**How to run it:**\n\n1. Runner sprints toward the goal line carrying the ball.\n2. Two defenders try to pull the flag.\n3. Runner uses cuts and changes of direction (no stiff arm at this age) to avoid the pulls.\n4. Reset. Run 5 reps with the runner switching roles.\n5. Last round: runner has to use both hands on the ball. Tighter ball security.\n\n**What to watch:** The ball position. The ball should be tucked tight against the chest and rib cage. A loose ball is a dropped ball.\n\n**If they're struggling:** Drop to one defender. Or shorten the box.\n\n**If they've got it:** Add a third defender. Or add a cone gauntlet they have to weave through.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Flag football belt set →](/go/flag-football-belt-set/) — 14-player set for organized flag practice.\n\n[Agility cones →](/go/agility-cones/) — for route trees, end zones, and field setup.\n\n[Full flag football gear guide →](/what-to-buy/flag-football/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
