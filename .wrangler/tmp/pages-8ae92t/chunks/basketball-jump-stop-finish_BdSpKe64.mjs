globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The jump stop is when you land on both feet at the same time. It’s more balanced than the step-step. From the jump stop, you can shoot, pass, or go up strong.</p>\n<p><strong>What you need:</strong> Basketball. 8-foot basket. Flat court or half-court.</p>\n<p><strong>Setup:</strong> Kid starts on the wing about 15 feet from the basket.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Dribble hard toward the basket.</li>\n<li>At about 8 feet from the basket, pick up the dribble (stop bouncing).</li>\n<li>Jump and land on both feet at the same time. This is the jump stop. Both feet land together.</li>\n<li>From the jump stop, go up for a layup or floater.</li>\n<li>Do 5 reps from the right side, 5 from the left. Rest. Do 2 rounds.</li>\n</ol>\n<p><strong>What to watch:</strong> Do both feet land at the same time or does one arrive first? Both feet must land together for the jump stop to be correct.</p>\n<p><strong>If they’re struggling:</strong> Let them walk the approach instead of dribble. Move closer to 5 feet from the basket. Reduce to 3 reps per side.</p>\n<p><strong>If they’ve got it:</strong> Add a defender. The jump stop gets them balance to shoot over pressure.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Jump Stop Finish","summary":"Jump stop with both feet then finish around the basket. 10 minutes. Ages 8-10, 11-12.","sport":"basketball","ages":["8-10","11-12"],"fundamental":"finishing","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A young player dribbling, jumping and landing on both feet at the same time near the basket, then finishing with a layup or floater.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Both-feet-together cue is clear and useful."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-jump-stop-finish.md";
				const url = undefined;
				function rawContent() {
					return "\nThe jump stop is when you land on both feet at the same time. It's more balanced than the step-step. From the jump stop, you can shoot, pass, or go up strong.\n\n**What you need:** Basketball. 8-foot basket. Flat court or half-court.\n\n**Setup:** Kid starts on the wing about 15 feet from the basket.\n\n**How to run it:**\n\n1. Dribble hard toward the basket.\n2. At about 8 feet from the basket, pick up the dribble (stop bouncing).\n3. Jump and land on both feet at the same time. This is the jump stop. Both feet land together.\n4. From the jump stop, go up for a layup or floater.\n5. Do 5 reps from the right side, 5 from the left. Rest. Do 2 rounds.\n\n**What to watch:** Do both feet land at the same time or does one arrive first? Both feet must land together for the jump stop to be correct.\n\n**If they're struggling:** Let them walk the approach instead of dribble. Move closer to 5 feet from the basket. Reduce to 3 reps per side.\n\n**If they've got it:** Add a defender. The jump stop gets them balance to shoot over pressure.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
