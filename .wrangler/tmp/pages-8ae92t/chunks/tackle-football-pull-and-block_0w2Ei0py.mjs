globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Pulling is when an interior lineman leaves the line to go block someone on the edge. This teaches kids how to pull, maintain their pad level, and get to the defender in space.</p>\n<p><strong>What you need:</strong> Four cones. Mark a line of scrimmage and place a cone 5 yards out and 5 yards to the side.</p>\n<p><strong>Setup:</strong> Start one kid at the line. Place a defender at the target cone.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>The blocker gets into a 3-point stance at the line.</li>\n<li>On the snap, they pull laterally. First step is perpendicular to the line, second step is upfield.</li>\n<li>They run toward the defender with low pad level.</li>\n<li>Once they reach the defender, they plant and punch, just like a base block.</li>\n<li>Do 5 reps pulling left, 5 reps pulling right.</li>\n</ol>\n<p><strong>What to watch:</strong> On the first few steps, do they turn upfield too early, or do they pull the line first? Pull the line, then go upfield. Early upfield movement is inefficient.</p>\n<p><strong>If they’re struggling:</strong> Slow it down. Have them walk through the pull first. Three steps lateral, three steps upfield, then plant and punch.</p>\n<p><strong>If they’ve got it:</strong> Add movement to the defender. The defender can shuffle side to side. Now the blocker has to adjust their angle to hit them.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/football-rubber-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber football →</a> — Wilson youth rubber ball for rec and practice.</p>\n<p><a href=\"/go/agility-cones/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Agility cones →</a> — for route trees, blocking lanes, and setup.</p>\n<p><a href=\"/what-to-buy/football/\">Full football gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Pull and Block","summary":"Pull from the line and block a defender on the edge. 12 minutes. Ages 11-12.","sport":"football","ages":["11-12"],"fundamental":"blocking","progression":"refine","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A lineman pulling laterally from the line of scrimmage, running to the edge to block.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":true,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Pulling lineman to live block on edge defender; sensitive flagged for partner contact."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/tackle-football-pull-and-block.md";
				const url = undefined;
				function rawContent() {
					return "\nPulling is when an interior lineman leaves the line to go block someone on the edge. This teaches kids how to pull, maintain their pad level, and get to the defender in space.\n\n**What you need:** Four cones. Mark a line of scrimmage and place a cone 5 yards out and 5 yards to the side.\n\n**Setup:** Start one kid at the line. Place a defender at the target cone.\n\n**How to run it:**\n\n1. The blocker gets into a 3-point stance at the line.\n2. On the snap, they pull laterally. First step is perpendicular to the line, second step is upfield.\n3. They run toward the defender with low pad level.\n4. Once they reach the defender, they plant and punch, just like a base block.\n5. Do 5 reps pulling left, 5 reps pulling right.\n\n**What to watch:** On the first few steps, do they turn upfield too early, or do they pull the line first? Pull the line, then go upfield. Early upfield movement is inefficient.\n\n**If they're struggling:** Slow it down. Have them walk through the pull first. Three steps lateral, three steps upfield, then plant and punch.\n\n**If they've got it:** Add movement to the defender. The defender can shuffle side to side. Now the blocker has to adjust their angle to hit them.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber football →](/go/football-rubber-youth/) — Wilson youth rubber ball for rec and practice.\n\n[Agility cones →](/go/agility-cones/) — for route trees, blocking lanes, and setup.\n\n[Full football gear guide →](/what-to-buy/football/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
