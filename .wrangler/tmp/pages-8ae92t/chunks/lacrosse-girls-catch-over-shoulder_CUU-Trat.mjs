globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The over-the-shoulder catch is the lacrosse equivalent of a deep ball. The pass is long, the receiver is running away from the passer. The stick reaches back, the eyes look back, the catch happens at full sprint. High difficulty, high reward.</p>\n<p><strong>What you need:</strong> Two sticks, ball, two players, 40-yard area.</p>\n<p><strong>Setup:</strong> Receiver at one end. Passer 30 yards away.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Receiver sprints away from the passer.</li>\n<li>Passer throws a long pass that lands slightly behind the receiver.</li>\n<li>Receiver looks back over the shoulder while running, reaches the stick back.</li>\n<li>Catches the ball with the stick head behind the body.</li>\n<li>Continues running, brings the ball forward, cradles. Do 4 reps each side.</li>\n</ol>\n<p><strong>What to watch:</strong> The head turn. The receiver has to look back over the shoulder, not turn the body around. Body keeps running forward, head looks back.</p>\n<p><strong>If they’re struggling:</strong> Shorter passes. Or lead the pass less so the receiver doesn’t have to reach.</p>\n<p><strong>If they’ve got it:</strong> Add a defender chasing. The catch has to happen with someone on the back.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/lacrosse-ball/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Lacrosse balls (6-pack) →</a> — NOCSAE-stamped practice balls.</p>\n<p><a href=\"/go/lacrosse-starter-kit-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">STX Stallion complete stick →</a> — beginner stick for first-season players.</p>\n<p><a href=\"/what-to-buy/lacrosse-girls/\">Full lacrosse (girls) gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Catch Over the Shoulder","summary":"Catch a long pass thrown behind the receiver. 10 minutes. Ages 11-12.","sport":"lacrosse-girls","ages":["11-12"],"fundamental":"catching","progression":"refine","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Receiver running forward with the stick reaching back over the shoulder, catching a long pass that's slightly behind them.","editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Football analogy ('deep ball') is fine as a reader cue; no body contact described."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/lacrosse-girls-catch-over-shoulder.md";
				const url = undefined;
				function rawContent() {
					return "\nThe over-the-shoulder catch is the lacrosse equivalent of a deep ball. The pass is long, the receiver is running away from the passer. The stick reaches back, the eyes look back, the catch happens at full sprint. High difficulty, high reward.\n\n**What you need:** Two sticks, ball, two players, 40-yard area.\n\n**Setup:** Receiver at one end. Passer 30 yards away.\n\n**How to run it:**\n\n1. Receiver sprints away from the passer.\n2. Passer throws a long pass that lands slightly behind the receiver.\n3. Receiver looks back over the shoulder while running, reaches the stick back.\n4. Catches the ball with the stick head behind the body.\n5. Continues running, brings the ball forward, cradles. Do 4 reps each side.\n\n**What to watch:** The head turn. The receiver has to look back over the shoulder, not turn the body around. Body keeps running forward, head looks back.\n\n**If they're struggling:** Shorter passes. Or lead the pass less so the receiver doesn't have to reach.\n\n**If they've got it:** Add a defender chasing. The catch has to happen with someone on the back.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Lacrosse balls (6-pack) →](/go/lacrosse-ball/) — NOCSAE-stamped practice balls.\n\n[STX Stallion complete stick →](/go/lacrosse-starter-kit-youth/) — beginner stick for first-season players.\n\n[Full lacrosse (girls) gear guide →](/what-to-buy/lacrosse-girls/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
