globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A defender chasing in a straight line never catches a faster runner. The right play is an angle. Cut off the path the runner is going to take. This is geometry, not speed.</p>\n<p><strong>What you need:</strong> Flag belts and flags. Open grass with cones.</p>\n<p><strong>Setup:</strong> Runner stands 10 yards from a sideline. Defender stands 15 yards behind the runner and 5 yards toward the middle of the field.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Coach yells “go.” Runner sprints down the sideline.</li>\n<li>Defender takes a diagonal angle toward where the runner is going to be, not where the runner is.</li>\n<li>Defender meets the runner at the cutoff point and pulls the flag.</li>\n<li>Do 6 reps. Switch sides each round.</li>\n<li>Last 2 reps: vary the runner’s path. Runner can cut to the middle. Defender has to read.</li>\n</ol>\n<p><strong>What to watch:</strong> The defender’s first step. If the first step is straight ahead, they’re chasing. If the first step is diagonal toward the runner’s future spot, they’re pursuing.</p>\n<p><strong>If they’re struggling:</strong> Drop the speed. Walking pace until the angle clicks.</p>\n<p><strong>If they’ve got it:</strong> Add a second defender taking the opposite angle. The runner has to read both pursuits.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/flag-football-belt-set/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Flag football belt set →</a> — 14-player set for organized flag practice.</p>\n<p><a href=\"/go/agility-cones/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Agility cones →</a> — for route trees, end zones, and field setup.</p>\n<p><a href=\"/what-to-buy/flag-football/\">Full flag football gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Angle Pursuit Pull","summary":"Take the right angle to cut off a runner and pull the flag. 12 minutes. Ages 8-10 and 11-12.","sport":"flag-football","ages":["8-10","11-12"],"fundamental":"flag-pulling","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Top-down view of a runner heading down the sideline and a defender taking a diagonal angle to cut them off, lines showing the convergence point.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Pursuit-angle teaching is solid. Clean flag-pull language."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/flag-football-angle-pursuit-pull.md";
				const url = undefined;
				function rawContent() {
					return "\nA defender chasing in a straight line never catches a faster runner. The right play is an angle. Cut off the path the runner is going to take. This is geometry, not speed.\n\n**What you need:** Flag belts and flags. Open grass with cones.\n\n**Setup:** Runner stands 10 yards from a sideline. Defender stands 15 yards behind the runner and 5 yards toward the middle of the field.\n\n**How to run it:**\n\n1. Coach yells \"go.\" Runner sprints down the sideline.\n2. Defender takes a diagonal angle toward where the runner is going to be, not where the runner is.\n3. Defender meets the runner at the cutoff point and pulls the flag.\n4. Do 6 reps. Switch sides each round.\n5. Last 2 reps: vary the runner's path. Runner can cut to the middle. Defender has to read.\n\n**What to watch:** The defender's first step. If the first step is straight ahead, they're chasing. If the first step is diagonal toward the runner's future spot, they're pursuing.\n\n**If they're struggling:** Drop the speed. Walking pace until the angle clicks.\n\n**If they've got it:** Add a second defender taking the opposite angle. The runner has to read both pursuits.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Flag football belt set →](/go/flag-football-belt-set/) — 14-player set for organized flag practice.\n\n[Agility cones →](/go/agility-cones/) — for route trees, end zones, and field setup.\n\n[Full flag football gear guide →](/what-to-buy/flag-football/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
