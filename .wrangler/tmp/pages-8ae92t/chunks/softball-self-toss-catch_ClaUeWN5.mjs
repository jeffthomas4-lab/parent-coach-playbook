globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Self-toss removes the pressure of catching a throw from someone else. The kid controls the height and pace. This builds the habit of watching the ball all the way into the glove.</p>\n<p><strong>What you need:</strong> 5 softballs (11”), a glove, open grass.</p>\n<p><strong>Setup:</strong> Kid stands alone in a clear area with a glove on.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>They toss the ball underhand 3 feet in the air.</li>\n<li>Eyes stay on the ball the whole time. Catch it with both hands around the glove.</li>\n<li>Do 10 tosses and catches. After each catch, reset and go again.</li>\n<li>On round two, toss slightly higher (4 feet).</li>\n<li>On round three, toss to the side a little (2 feet to the left or right). They step and catch.</li>\n</ol>\n<p><strong>What to watch:</strong> Are the eyes following the ball or looking away? Eye movement off the ball is why kids miss.</p>\n<p><strong>If they’re struggling:</strong> Lower the toss to 2 feet. Use a bigger, softer ball.</p>\n<p><strong>If they’ve got it:</strong> Toss higher (5 feet). Move side to side. Toss behind them and have them turn and catch.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/softball-glove-11in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth softball glove →</a> — 11-inch fielder’s glove for new players.</p>\n<p><a href=\"/what-to-buy/softball/\">Full softball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Self Toss Catch","summary":"Catch a ball you toss to yourself. 8 minutes. T-ball and ages 5-7.","sport":"softball","ages":["t-ball","5-7"],"fundamental":"catching","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Child tossing a softball underhand into the air and catching it with a glove, eyes on the ball.","editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean intro catching drill; fixed soft baseballs to softballs."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/softball-self-toss-catch.md";
				const url = undefined;
				function rawContent() {
					return "\nSelf-toss removes the pressure of catching a throw from someone else. The kid controls the height and pace. This builds the habit of watching the ball all the way into the glove.\n\n**What you need:** 5 softballs (11\"), a glove, open grass.\n\n**Setup:** Kid stands alone in a clear area with a glove on.\n\n**How to run it:**\n\n1. They toss the ball underhand 3 feet in the air.\n2. Eyes stay on the ball the whole time. Catch it with both hands around the glove.\n3. Do 10 tosses and catches. After each catch, reset and go again.\n4. On round two, toss slightly higher (4 feet).\n5. On round three, toss to the side a little (2 feet to the left or right). They step and catch.\n\n**What to watch:** Are the eyes following the ball or looking away? Eye movement off the ball is why kids miss.\n\n**If they're struggling:** Lower the toss to 2 feet. Use a bigger, softer ball.\n\n**If they've got it:** Toss higher (5 feet). Move side to side. Toss behind them and have them turn and catch.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth softball glove →](/go/softball-glove-11in/) — 11-inch fielder's glove for new players.\n\n[Full softball gear guide →](/what-to-buy/softball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
