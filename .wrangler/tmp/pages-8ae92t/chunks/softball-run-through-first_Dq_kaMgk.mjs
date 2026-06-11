globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Kids stop at first base. That’s the mistake. The cue is Eyes, Drive, Touch, Brake. Run through, not to. This habit saves a tenth of a second.</p>\n<p><strong>What you need:</strong> Three bases or cones set up. Open space. 10 kids or rotation groups.</p>\n<p><strong>Setup:</strong> Kids line up at home plate. First base at 60 feet (regulation).</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Eyes, Drive, Touch, Brake.</li>\n<li>Kid sprints from home toward first. Eyes stay on the bag.</li>\n<li>They Drive their legs all the way through the base.</li>\n<li>They Touch the base with their foot.</li>\n<li>After the touch, they Brake (slow down) in a straight line past the bag.</li>\n<li>Do 5 reps. Walk back to home. No timing, just form.</li>\n</ol>\n<p><strong>What to watch:</strong> Do they slow down as they approach the base? Or run full speed through? Full speed through is the goal.</p>\n<p><strong>If they’re struggling:</strong> Shorten the distance to 40 feet. Have them walk through first first, then jog, then sprint.</p>\n<p><strong>If they’ve got it:</strong> Add a coach at first base who yells “GO” as they’re running. Build the habit of not looking at the coach.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/softball-glove-11in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth softball glove →</a> — 11-inch fielder’s glove for new players.</p>\n<p><a href=\"/go/agility-cones/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Agility cones →</a> — for setup, base paths, and field drills.</p>\n<p><a href=\"/what-to-buy/softball/\">Full softball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Run Through First Base","summary":"Sprint through first, not to first. 10 minutes. T-ball and ages 5-7.","sport":"softball","ages":["t-ball","5-7"],"fundamental":"base-running","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Young runner sprinting through first base in a straight line, not slowing down.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Strong opening, clear cue. Note: 60ft is correct softball base path; the sub-bullet says 60 feet (regulation) which is right."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/softball-run-through-first.md";
				const url = undefined;
				function rawContent() {
					return "\nKids stop at first base. That's the mistake. The cue is Eyes, Drive, Touch, Brake. Run through, not to. This habit saves a tenth of a second.\n\n**What you need:** Three bases or cones set up. Open space. 10 kids or rotation groups.\n\n**Setup:** Kids line up at home plate. First base at 60 feet (regulation).\n\n**How to run it:**\n\n1. Cue: Eyes, Drive, Touch, Brake.\n2. Kid sprints from home toward first. Eyes stay on the bag.\n3. They Drive their legs all the way through the base.\n4. They Touch the base with their foot.\n5. After the touch, they Brake (slow down) in a straight line past the bag.\n6. Do 5 reps. Walk back to home. No timing, just form.\n\n**What to watch:** Do they slow down as they approach the base? Or run full speed through? Full speed through is the goal.\n\n**If they're struggling:** Shorten the distance to 40 feet. Have them walk through first first, then jog, then sprint.\n\n**If they've got it:** Add a coach at first base who yells \"GO\" as they're running. Build the habit of not looking at the coach.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth softball glove →](/go/softball-glove-11in/) — 11-inch fielder's glove for new players.\n\n[Agility cones →](/go/agility-cones/) — for setup, base paths, and field drills.\n\n[Full softball gear guide →](/what-to-buy/softball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
