globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Fast feet and soft touch go together. This drill trains both feet to control the ball and builds the rhythm that good dribblers have. Inside, outside, inside, outside. Rapid-fire.</p>\n<p><strong>What you need:</strong> 1 ball per child. A flat 10x10 foot area per child.</p>\n<p><strong>Setup:</strong> Each child stands with a ball in their own small space.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Child touches the ball with the inside of their right foot. Ball moves right.</li>\n<li>Next touch: outside of the right foot. Ball goes left.</li>\n<li>Next touch: inside of the left foot. Ball goes left.</li>\n<li>Next touch: outside of the left foot. Ball goes right.</li>\n<li>Keep alternating for 45 seconds non-stop. The ball stays in a tight circle around them.</li>\n</ol>\n<p><strong>What to watch:</strong> Are the touches quick and light? Or slow and heavy? Quick and light means they have touch. Heavy means they’re pushing.</p>\n<p><strong>If they’re struggling:</strong> Slow it down. Do 5 touches per side instead of continuous.</p>\n<p><strong>If they’ve got it:</strong> Speed it up. Count touches in 30 seconds and try to beat the count next round.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size4/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 4 soccer ball →</a> — right size for ages 8–12.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Inside Outside Touch","summary":"Quick alternating touches using the inside and outside of both feet. 8 minutes. Ages 8-10, 11-12.","sport":"soccer","ages":["8-10","11-12"],"fundamental":"dribbling","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Feet of a player rapidly alternating touches on the ball using the inside and outside of the foot in quick succession.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean dribbling drill. Soccer vocab correct."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-inside-outside-touch.md";
				const url = undefined;
				function rawContent() {
					return "\nFast feet and soft touch go together. This drill trains both feet to control the ball and builds the rhythm that good dribblers have. Inside, outside, inside, outside. Rapid-fire.\n\n**What you need:** 1 ball per child. A flat 10x10 foot area per child.\n\n**Setup:** Each child stands with a ball in their own small space.\n\n**How to run it:**\n\n1. Child touches the ball with the inside of their right foot. Ball moves right.\n2. Next touch: outside of the right foot. Ball goes left.\n3. Next touch: inside of the left foot. Ball goes left.\n4. Next touch: outside of the left foot. Ball goes right.\n5. Keep alternating for 45 seconds non-stop. The ball stays in a tight circle around them.\n\n**What to watch:** Are the touches quick and light? Or slow and heavy? Quick and light means they have touch. Heavy means they're pushing.\n\n**If they're struggling:** Slow it down. Do 5 touches per side instead of continuous.\n\n**If they've got it:** Speed it up. Count touches in 30 seconds and try to beat the count next round.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 4 soccer ball →](/go/soccer-ball-size4/) — right size for ages 8–12.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
