globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A hard catch bounces the ball out. A soft catch absorbs it. The stick has to give a little when the ball arrives, like catching an egg. This drill teaches the give.</p>\n<p><strong>What you need:</strong> Two sticks, ball, two players.</p>\n<p><strong>Setup:</strong> Two players 12 feet apart.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Coach (or partner) tosses the ball to the player’s stick.</li>\n<li>As the ball arrives, the stick gives back 6 inches (the give).</li>\n<li>Ball stays in the head.</li>\n<li>Player cradles once and tosses back.</li>\n<li>Do 15 catches. Mix high and low passes.</li>\n</ol>\n<p><strong>What to watch:</strong> The give. If the stick stays still on contact, the ball bounces off. The stick has to move with the ball for a moment.</p>\n<p><strong>If they’re struggling:</strong> Slow tosses. Larger softer ball.</p>\n<p><strong>If they’ve got it:</strong> Move further apart. Or vary the height (high, low, side passes).</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/lacrosse-ball/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Lacrosse balls (6-pack) →</a> — NOCSAE-stamped practice balls.</p>\n<p><a href=\"/go/lacrosse-starter-kit-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">STX Stallion complete stick →</a> — shaft and head combo for new players.</p>\n<p><a href=\"/what-to-buy/lacrosse-boys/\">Full lacrosse (boys) gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Catch with Soft Hands","summary":"Receive a pass without the ball bouncing out. 10 minutes. Ages 8-10.","sport":"lacrosse-boys","ages":["8-10"],"fundamental":"catching","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player receiving a pass with the lacrosse stick head, the stick giving slightly back as the ball arrives so it doesn't bounce out.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Soft-hands catch fundamentals for ages 8-10."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/lacrosse-boys-catch-with-soft-hands.md";
				const url = undefined;
				function rawContent() {
					return "\nA hard catch bounces the ball out. A soft catch absorbs it. The stick has to give a little when the ball arrives, like catching an egg. This drill teaches the give.\n\n**What you need:** Two sticks, ball, two players.\n\n**Setup:** Two players 12 feet apart.\n\n**How to run it:**\n\n1. Coach (or partner) tosses the ball to the player's stick.\n2. As the ball arrives, the stick gives back 6 inches (the give).\n3. Ball stays in the head.\n4. Player cradles once and tosses back.\n5. Do 15 catches. Mix high and low passes.\n\n**What to watch:** The give. If the stick stays still on contact, the ball bounces off. The stick has to move with the ball for a moment.\n\n**If they're struggling:** Slow tosses. Larger softer ball.\n\n**If they've got it:** Move further apart. Or vary the height (high, low, side passes).\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Lacrosse balls (6-pack) →](/go/lacrosse-ball/) — NOCSAE-stamped practice balls.\n\n[STX Stallion complete stick →](/go/lacrosse-starter-kit-youth/) — shaft and head combo for new players.\n\n[Full lacrosse (boys) gear guide →](/what-to-buy/lacrosse-boys/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
