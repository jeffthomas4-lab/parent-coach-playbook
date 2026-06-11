globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Charging eliminates extra bounces and reduces reaction time for the batter. A fielder who charges is more aggressive and puts pressure on baserunners.</p>\n<p><strong>What you need:</strong> 15 softballs (12”), a partner with a glove, a large field.</p>\n<p><strong>Setup:</strong> Fielder stands 20 feet from a partner. Partner rolls ground balls at them.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Partner rolls a ground ball.</li>\n<li>Fielder sprints forward until the ball is 3 feet away, then Drop into low fielding position.</li>\n<li>They Show the glove, Funnel, and throw to a cutoff 30 feet away.</li>\n<li>Do 10 rolls straight ahead. After each, return to start.</li>\n<li>Do 5 rolls to the left. Do 5 to the right.</li>\n</ol>\n<p><strong>What to watch:</strong> Do they slow down before the drop? Or charge full-speed and lose balance? Slow footsteps on the last three steps, then drop.</p>\n<p><strong>If they’re struggling:</strong> Start 15 feet away. Roll slower. Have them charge without fielding first, just to feel the motion.</p>\n<p><strong>If they’ve got it:</strong> Roll from different angles. Add a runner. Throw the runner out at a base.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/softball-glove-11in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth softball glove →</a> — 11-inch fielder’s glove for new players.</p>\n<p><a href=\"/what-to-buy/softball/\">Full softball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Charge the Ball","summary":"Sprint forward to field the ball. 12 minutes. Ages 8-10 and 11-12.","sport":"softball","ages":["8-10","11-12"],"fundamental":"fielding","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player sprinting forward toward an incoming ground ball, dropping into ready position at the last moment.","editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Solid drill. Changed soft baseballs to softballs."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/softball-charge-the-ball.md";
				const url = undefined;
				function rawContent() {
					return "\nCharging eliminates extra bounces and reduces reaction time for the batter. A fielder who charges is more aggressive and puts pressure on baserunners.\n\n**What you need:** 15 softballs (12\"), a partner with a glove, a large field.\n\n**Setup:** Fielder stands 20 feet from a partner. Partner rolls ground balls at them.\n\n**How to run it:**\n\n1. Partner rolls a ground ball.\n2. Fielder sprints forward until the ball is 3 feet away, then Drop into low fielding position.\n3. They Show the glove, Funnel, and throw to a cutoff 30 feet away.\n4. Do 10 rolls straight ahead. After each, return to start.\n5. Do 5 rolls to the left. Do 5 to the right.\n\n**What to watch:** Do they slow down before the drop? Or charge full-speed and lose balance? Slow footsteps on the last three steps, then drop.\n\n**If they're struggling:** Start 15 feet away. Roll slower. Have them charge without fielding first, just to feel the motion.\n\n**If they've got it:** Roll from different angles. Add a runner. Throw the runner out at a base.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth softball glove →](/go/softball-glove-11in/) — 11-inch fielder's glove for new players.\n\n[Full softball gear guide →](/what-to-buy/softball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
