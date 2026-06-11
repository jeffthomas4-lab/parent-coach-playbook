globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Slow ground balls die before they reach a stationary fielder. The fielder has to run forward, meet the ball, and throw on the run. Kids who wait for the ball get beat by the runner every time.</p>\n<p><strong>What you need:</strong> A glove, 8 baseballs, a flat field, a target (parent with a glove or a fence).</p>\n<p><strong>Setup:</strong> Kid stands 20 feet from you. Target 30 feet behind them.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Drop, Show, Funnel, Send. On a charge, all four happen while moving forward.</li>\n<li>Roll a slow ground ball that won’t reach them if they wait.</li>\n<li>They charge forward, drop into fielding position at the ball, funnel it up, and throw to the target.</li>\n<li>Do 5 reps slow.</li>\n<li>Last 5: roll faster but still in front of them. They charge whatever is rolling.</li>\n</ol>\n<p><strong>What to watch:</strong> Are they slowing down before the catch? Most kids decelerate too early. Charge through the ball, then field. The body should still be moving forward at the moment of catch.</p>\n<p><strong>If they’re struggling:</strong> Drop the throw. Just have them charge and field cleanly.</p>\n<p><strong>If they’ve got it:</strong> Add a runner from home plate. The fielder has to charge, catch, throw, and beat the runner to first.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Charge the Ball","summary":"Field a slow grounder by running forward to it. 12 minutes. Ages 8-10 and 11-12.","sport":"baseball","ages":["8-10","11-12"],"fundamental":"fielding","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A child running forward toward a slowly rolling baseball, dropping into fielding position at the last moment.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-charge-the-ball.md";
				const url = undefined;
				function rawContent() {
					return "\nSlow ground balls die before they reach a stationary fielder. The fielder has to run forward, meet the ball, and throw on the run. Kids who wait for the ball get beat by the runner every time.\n\n**What you need:** A glove, 8 baseballs, a flat field, a target (parent with a glove or a fence).\n\n**Setup:** Kid stands 20 feet from you. Target 30 feet behind them.\n\n**How to run it:**\n\n1. Cue: Drop, Show, Funnel, Send. On a charge, all four happen while moving forward.\n2. Roll a slow ground ball that won't reach them if they wait.\n3. They charge forward, drop into fielding position at the ball, funnel it up, and throw to the target.\n4. Do 5 reps slow.\n5. Last 5: roll faster but still in front of them. They charge whatever is rolling.\n\n**What to watch:** Are they slowing down before the catch? Most kids decelerate too early. Charge through the ball, then field. The body should still be moving forward at the moment of catch.\n\n**If they're struggling:** Drop the throw. Just have them charge and field cleanly.\n\n**If they've got it:** Add a runner from home plate. The fielder has to charge, catch, throw, and beat the runner to first.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
