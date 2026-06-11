globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The deep ball is the highest-value play in flag football. The receiver runs a straight line and the ball comes down 25 yards downfield. Catching while running and looking back is the hardest receiver skill at this age.</p>\n<p><strong>What you need:</strong> A football, cones marking 25 yards, a thrower with a strong arm.</p>\n<p><strong>Setup:</strong> Receiver at the line. Goal post or cone 25 yards downfield. Thrower 5 yards behind the line.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: See, Reach, Squeeze, Tuck.</li>\n<li>Receiver sprints toward the cone at full speed.</li>\n<li>At 15 yards, receiver looks back over the inside shoulder.</li>\n<li>Thrower releases the ball when the receiver hits 10 yards. Ball arrives at 22-25 yards.</li>\n<li>Receiver catches over the shoulder, tucks, finishes by sprinting through the goal line.</li>\n</ol>\n<p><strong>What to watch:</strong> Do they slow down to track the ball? Most kids slow down. Stay full speed and let the ball come down to the spot.</p>\n<p><strong>If they’re struggling:</strong> Shorter route (15 yards). Or have the thrower lob a softer pass.</p>\n<p><strong>If they’ve got it:</strong> Add a defender. The receiver has to fight through coverage and still catch.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/flag-football-belt-set/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Flag football belt set →</a> — 14-player set for organized flag practice.</p>\n<p><a href=\"/go/agility-cones/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Agility cones →</a> — for route trees, end zones, and field setup.</p>\n<p><a href=\"/what-to-buy/flag-football/\">Full flag football gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Deep Ball Catch","summary":"Run a deep route and catch a long pass. 15 minutes. Ages 11-12.","sport":"flag-football","ages":["11-12"],"fundamental":"catching","progression":"refine","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Receiver sprinting downfield with the ball arcing overhead, looking back over the shoulder, hands reaching up to catch.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Over-the-shoulder catch teaching. No tackle language."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/flag-football-deep-ball-catch.md";
				const url = undefined;
				function rawContent() {
					return "\nThe deep ball is the highest-value play in flag football. The receiver runs a straight line and the ball comes down 25 yards downfield. Catching while running and looking back is the hardest receiver skill at this age.\n\n**What you need:** A football, cones marking 25 yards, a thrower with a strong arm.\n\n**Setup:** Receiver at the line. Goal post or cone 25 yards downfield. Thrower 5 yards behind the line.\n\n**How to run it:**\n\n1. Cue: See, Reach, Squeeze, Tuck.\n2. Receiver sprints toward the cone at full speed.\n3. At 15 yards, receiver looks back over the inside shoulder.\n4. Thrower releases the ball when the receiver hits 10 yards. Ball arrives at 22-25 yards.\n5. Receiver catches over the shoulder, tucks, finishes by sprinting through the goal line.\n\n**What to watch:** Do they slow down to track the ball? Most kids slow down. Stay full speed and let the ball come down to the spot.\n\n**If they're struggling:** Shorter route (15 yards). Or have the thrower lob a softer pass.\n\n**If they've got it:** Add a defender. The receiver has to fight through coverage and still catch.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Flag football belt set →](/go/flag-football-belt-set/) — 14-player set for organized flag practice.\n\n[Agility cones →](/go/agility-cones/) — for route trees, end zones, and field setup.\n\n[Full flag football gear guide →](/what-to-buy/flag-football/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
