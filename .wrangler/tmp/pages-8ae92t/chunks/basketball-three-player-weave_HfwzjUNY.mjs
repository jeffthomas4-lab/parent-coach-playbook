globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The three-player weave is the foundation for motion offense. Three kids move together, passing and cutting. It teaches timing and movement off the ball.</p>\n<p><strong>What you need:</strong> Basketball. Three kids per group. Full court or half-court.</p>\n<p><strong>Setup:</strong> Three kids start at the baseline. Player A has the ball. Players B and C are on either side.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>A passes to B and cuts behind B.</li>\n<li>B passes to C and cuts behind C.</li>\n<li>C passes to A and cuts behind A.</li>\n<li>Continue the pattern all the way to the other baseline.</li>\n<li>Do 2 full-court runs. Rest. Switch who starts with the ball.</li>\n</ol>\n<p><strong>What to watch:</strong> Are they cutting behind the person they just passed to? That’s the weave. If they’re just standing and watching, remind them: you pass, then you cut.</p>\n<p><strong>If they’re struggling:</strong> Slow the pace. Walk instead of jog. Do half-court only. Simplify to A passes to B, B passes to C, C passes back to A.</p>\n<p><strong>If they’ve got it:</strong> Add a finish. When they get to the other end, the last person shoots. Game-like finish builds rhythm.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Three Player Weave","summary":"Three players pass while moving down the court in a weaving pattern. 10 minutes. Ages 8-10.","sport":"basketball","ages":["8-10"],"fundamental":"passing","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Three young players moving down the court, passing and cutting around each other in a weaving pattern.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Classic weave pattern correctly described, sport language clean."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-three-player-weave.md";
				const url = undefined;
				function rawContent() {
					return "\nThe three-player weave is the foundation for motion offense. Three kids move together, passing and cutting. It teaches timing and movement off the ball.\n\n**What you need:** Basketball. Three kids per group. Full court or half-court.\n\n**Setup:** Three kids start at the baseline. Player A has the ball. Players B and C are on either side.\n\n**How to run it:**\n\n1. A passes to B and cuts behind B.\n2. B passes to C and cuts behind C.\n3. C passes to A and cuts behind A.\n4. Continue the pattern all the way to the other baseline.\n5. Do 2 full-court runs. Rest. Switch who starts with the ball.\n\n**What to watch:** Are they cutting behind the person they just passed to? That's the weave. If they're just standing and watching, remind them: you pass, then you cut.\n\n**If they're struggling:** Slow the pace. Walk instead of jog. Do half-court only. Simplify to A passes to B, B passes to C, C passes back to A.\n\n**If they've got it:** Add a finish. When they get to the other end, the last person shoots. Game-like finish builds rhythm.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
