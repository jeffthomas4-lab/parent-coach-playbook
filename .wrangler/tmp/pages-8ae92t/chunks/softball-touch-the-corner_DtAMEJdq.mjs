globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The shortest distance between two points is a straight line. Kids curve around first. The cue is Eyes, Drive, Touch, Brake: they run at the inside corner of the bag.</p>\n<p><strong>What you need:</strong> Home plate and first base (regulation 60 feet), 10 kids in a line.</p>\n<p><strong>Setup:</strong> Kids at home plate. First base at 60 feet with a clear approach lane.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Eyes, Drive, Touch, Brake.</li>\n<li>Coach points to the inside corner of first base and says “touch the corner, not the side.”</li>\n<li>Kid sprints from home, aiming for the inside corner of the bag.</li>\n<li>They Touch the corner with their foot and Drive through.</li>\n<li>Do 5 reps. Walk back to home. Emphasize the corner angle.</li>\n</ol>\n<p><strong>What to watch:</strong> Do they run straight from home to first? Or do they curve? Straight line with a slight inside angle is fastest.</p>\n<p><strong>If they’re struggling:</strong> Place a cone at the inside corner. Have them run to the cone, not the base. This helps them visualize the path.</p>\n<p><strong>If they’ve got it:</strong> Add a fielder with the ball at first. Kid runs hard and touches. Fielder practices tagging.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/softball-glove-11in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth softball glove →</a> — 11-inch fielder’s glove for new players.</p>\n<p><a href=\"/go/agility-cones/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Agility cones →</a> — for setup, base paths, and field drills.</p>\n<p><a href=\"/what-to-buy/softball/\">Full softball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Touch the Corner","summary":"Run the shortest path to first base. 10 minutes. T-ball and ages 5-7.","sport":"softball","ages":["t-ball","5-7"],"fundamental":"base-running","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Runner at home plate running at an angle toward the inside corner of first base.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Inside-corner base-running cue is sharp."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/softball-touch-the-corner.md";
				const url = undefined;
				function rawContent() {
					return "\nThe shortest distance between two points is a straight line. Kids curve around first. The cue is Eyes, Drive, Touch, Brake: they run at the inside corner of the bag.\n\n**What you need:** Home plate and first base (regulation 60 feet), 10 kids in a line.\n\n**Setup:** Kids at home plate. First base at 60 feet with a clear approach lane.\n\n**How to run it:**\n\n1. Cue: Eyes, Drive, Touch, Brake.\n2. Coach points to the inside corner of first base and says \"touch the corner, not the side.\"\n3. Kid sprints from home, aiming for the inside corner of the bag.\n4. They Touch the corner with their foot and Drive through.\n5. Do 5 reps. Walk back to home. Emphasize the corner angle.\n\n**What to watch:** Do they run straight from home to first? Or do they curve? Straight line with a slight inside angle is fastest.\n\n**If they're struggling:** Place a cone at the inside corner. Have them run to the cone, not the base. This helps them visualize the path.\n\n**If they've got it:** Add a fielder with the ball at first. Kid runs hard and touches. Fielder practices tagging.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth softball glove →](/go/softball-glove-11in/) — 11-inch fielder's glove for new players.\n\n[Agility cones →](/go/agility-cones/) — for setup, base paths, and field drills.\n\n[Full softball gear guide →](/what-to-buy/softball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
