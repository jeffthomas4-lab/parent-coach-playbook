globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A receiver who slows down to catch the ball gets caught from behind. The catch happens at full speed. Hands out, see the ball into the hands, tuck, keep running.</p>\n<p><strong>What you need:</strong> A foam football, cones, two kids (or kid + parent thrower).</p>\n<p><strong>Setup:</strong> Receiver at the line of scrimmage. Cone 5 yards out and 5 yards to the side as the route target. Thrower 5 yards behind the line.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: See, Reach, Squeeze, Tuck.</li>\n<li>Receiver sprints to the cone, plants, and breaks toward the sideline.</li>\n<li>Thrower throws to the spot the receiver is running to (lead the receiver).</li>\n<li>Receiver catches without slowing down. Eyes on the ball into the hands. Tuck immediately.</li>\n<li>Do 6 reps each direction.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the receiver slow down to catch? Slowing kills the play. The catch has to come out of the run.</p>\n<p><strong>If they’re struggling:</strong> Slower throws. Or pre-throw before the receiver runs (so the ball is in the air at the right time without timing pressure).</p>\n<p><strong>If they’ve got it:</strong> Add a defender 2 yards behind. Receiver has to outrun and catch.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/flag-football-belt-set/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Flag football belt set →</a> — 14-player set for organized flag practice.</p>\n<p><a href=\"/go/agility-cones/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Agility cones →</a> — for route trees, end zones, and field setup.</p>\n<p><a href=\"/what-to-buy/flag-football/\">Full flag football gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Catch on the Run","summary":"Run a route, catch the ball without breaking stride. 12 minutes. Ages 8-10.","sport":"flag-football","ages":["8-10"],"fundamental":"catching","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Receiver running a 5-yard out route, hands extended catching the ball at full speed without slowing down.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Catch-on-the-run with route timing. Clean."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/flag-football-catch-on-the-run.md";
				const url = undefined;
				function rawContent() {
					return "\nA receiver who slows down to catch the ball gets caught from behind. The catch happens at full speed. Hands out, see the ball into the hands, tuck, keep running.\n\n**What you need:** A foam football, cones, two kids (or kid + parent thrower).\n\n**Setup:** Receiver at the line of scrimmage. Cone 5 yards out and 5 yards to the side as the route target. Thrower 5 yards behind the line.\n\n**How to run it:**\n\n1. Cue: See, Reach, Squeeze, Tuck.\n2. Receiver sprints to the cone, plants, and breaks toward the sideline.\n3. Thrower throws to the spot the receiver is running to (lead the receiver).\n4. Receiver catches without slowing down. Eyes on the ball into the hands. Tuck immediately.\n5. Do 6 reps each direction.\n\n**What to watch:** Does the receiver slow down to catch? Slowing kills the play. The catch has to come out of the run.\n\n**If they're struggling:** Slower throws. Or pre-throw before the receiver runs (so the ball is in the air at the right time without timing pressure).\n\n**If they've got it:** Add a defender 2 yards behind. Receiver has to outrun and catch.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Flag football belt set →](/go/flag-football-belt-set/) — 14-player set for organized flag practice.\n\n[Agility cones →](/go/agility-cones/) — for route trees, end zones, and field setup.\n\n[Full flag football gear guide →](/what-to-buy/flag-football/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
