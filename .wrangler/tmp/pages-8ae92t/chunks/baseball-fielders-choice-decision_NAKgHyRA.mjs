globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A fielder’s choice is when the defense gets the lead runner instead of the batter. With a runner on first and a ground ball, the right play might be the force at second instead of the throw to first. The decision happens in half a second. This drill builds it.</p>\n<p><strong>What you need:</strong> A full infield, a runner on first, a coach with a bat.</p>\n<p><strong>Setup:</strong> Runner on first. Standard infield. Coach at home.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Coach hits a ground ball to short, second, or third.</li>\n<li>Runner on first breaks for second.</li>\n<li>Fielder catches and decides:\n<ul>\n<li>Force at second is faster than the throw to first: go to second.</li>\n<li>Force at first is the only sure out: go to first.</li>\n</ul>\n</li>\n<li>Do 8 reps. Mix where the ball is hit.</li>\n<li>Talk through each: was the right base chosen?</li>\n</ol>\n<p><strong>What to watch:</strong> Are they always going to first? Defaulting to first means giving the runner second every time. Sometimes second is the right play. The lead runner matters in late innings.</p>\n<p><strong>If they’re struggling:</strong> Simplify. Tell them before each rep which base to throw to. Build the throw before the decision.</p>\n<p><strong>If they’ve got it:</strong> Add a double play attempt. Throw to second, then second baseman throws to first. Two outs.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/go/baseball-bat-28in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">28-inch youth bat →</a> — drop-10 USA-stamped bat for ages 8–10.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Fielder's Choice Decision","summary":"Field a grounder with a runner already on base and pick the right out. 12 minutes. Ages 11-12.","sport":"baseball","ages":["11-12"],"fundamental":"situational","progression":"refine","focus":"situational","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Infielder fielding a grounder while looking up at a runner advancing from first to second, deciding which base to throw to.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-fielders-choice-decision.md";
				const url = undefined;
				function rawContent() {
					return "\nA fielder's choice is when the defense gets the lead runner instead of the batter. With a runner on first and a ground ball, the right play might be the force at second instead of the throw to first. The decision happens in half a second. This drill builds it.\n\n**What you need:** A full infield, a runner on first, a coach with a bat.\n\n**Setup:** Runner on first. Standard infield. Coach at home.\n\n**How to run it:**\n\n1. Coach hits a ground ball to short, second, or third.\n2. Runner on first breaks for second.\n3. Fielder catches and decides:\n   - Force at second is faster than the throw to first: go to second.\n   - Force at first is the only sure out: go to first.\n4. Do 8 reps. Mix where the ball is hit.\n5. Talk through each: was the right base chosen?\n\n**What to watch:** Are they always going to first? Defaulting to first means giving the runner second every time. Sometimes second is the right play. The lead runner matters in late innings.\n\n**If they're struggling:** Simplify. Tell them before each rep which base to throw to. Build the throw before the decision.\n\n**If they've got it:** Add a double play attempt. Throw to second, then second baseman throws to first. Two outs.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[28-inch youth bat →](/go/baseball-bat-28in/) — drop-10 USA-stamped bat for ages 8–10.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
