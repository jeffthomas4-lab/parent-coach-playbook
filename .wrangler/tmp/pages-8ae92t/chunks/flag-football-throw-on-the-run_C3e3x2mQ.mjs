globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>In flag football the rusher gets to the QB fast. Throwing flat-footed isn’t always an option. Throwing on the move, with the body squared to the receiver, keeps the offense alive when the pocket breaks down.</p>\n<p><strong>What you need:</strong> A football. Cones marking pocket and receiver routes. Two players.</p>\n<p><strong>Setup:</strong> QB at the line of scrimmage. Receiver 10 yards downfield to the right. Cone 5 yards behind the QB marking the rusher’s path.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>QB takes the snap (from coach or directly from cone).</li>\n<li>QB runs to the right (rolls out of the pocket).</li>\n<li>Receiver runs a 5-yard out route to the right.</li>\n<li>QB squares the body toward the receiver, plants the front foot, throws on the move.</li>\n<li>Do 6 reps right, 6 left.</li>\n</ol>\n<p><strong>What to watch:</strong> Body position at release. If the QB’s body is still facing forward (perpendicular to the throw), the pass will sail. The hips and shoulders have to turn toward the target.</p>\n<p><strong>If they’re struggling:</strong> Drop the run. QB jogs out and stops to throw.</p>\n<p><strong>If they’ve got it:</strong> Add a rusher who chases the QB after a 3-second count. Now there’s real pressure.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/flag-football-belt-set/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Flag football belt set →</a> — 14-player set for organized flag practice.</p>\n<p><a href=\"/go/agility-cones/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Agility cones →</a> — for route trees, end zones, and field setup.</p>\n<p><a href=\"/what-to-buy/flag-football/\">Full flag football gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Throw on the Run","summary":"Quarterback escapes the pocket and throws while moving. 12 minutes. Ages 11-12.","sport":"flag-football","ages":["11-12"],"fundamental":"throwing","progression":"refine","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Quarterback moving to the right, body squared toward a downfield receiver, ball held back ready to throw, feet still set under the body.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Rolling-pocket QB drill. Squared-shoulders cue is the keeper."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/flag-football-throw-on-the-run.md";
				const url = undefined;
				function rawContent() {
					return "\nIn flag football the rusher gets to the QB fast. Throwing flat-footed isn't always an option. Throwing on the move, with the body squared to the receiver, keeps the offense alive when the pocket breaks down.\n\n**What you need:** A football. Cones marking pocket and receiver routes. Two players.\n\n**Setup:** QB at the line of scrimmage. Receiver 10 yards downfield to the right. Cone 5 yards behind the QB marking the rusher's path.\n\n**How to run it:**\n\n1. QB takes the snap (from coach or directly from cone).\n2. QB runs to the right (rolls out of the pocket).\n3. Receiver runs a 5-yard out route to the right.\n4. QB squares the body toward the receiver, plants the front foot, throws on the move.\n5. Do 6 reps right, 6 left.\n\n**What to watch:** Body position at release. If the QB's body is still facing forward (perpendicular to the throw), the pass will sail. The hips and shoulders have to turn toward the target.\n\n**If they're struggling:** Drop the run. QB jogs out and stops to throw.\n\n**If they've got it:** Add a rusher who chases the QB after a 3-second count. Now there's real pressure.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Flag football belt set →](/go/flag-football-belt-set/) — 14-player set for organized flag practice.\n\n[Agility cones →](/go/agility-cones/) — for route trees, end zones, and field setup.\n\n[Full flag football gear guide →](/what-to-buy/flag-football/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
