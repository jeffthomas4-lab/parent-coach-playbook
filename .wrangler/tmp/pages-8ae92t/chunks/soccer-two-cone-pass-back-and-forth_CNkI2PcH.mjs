globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Five-year-olds don’t have the foot strength to pass far. This drill teaches them to push the ball to a target that’s close and visible. Two cones are easy to see and hit.</p>\n<p><strong>What you need:</strong> 1 soccer ball, 2 cones.</p>\n<p><strong>Setup:</strong> Place 2 cones 10 feet apart. Child stands at one cone with the ball.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Child kicks the ball from one cone toward the other using the inside of their foot.</li>\n<li>Ball rolls to the other cone and stops near it.</li>\n<li>They chase after the ball and kick it back.</li>\n<li>10 kicks total. 5 in each direction.</li>\n<li>Rest. Do it again.</li>\n</ol>\n<p><strong>What to watch:</strong> Are they using the inside of their foot or kicking with their toe? Inside of the foot is softer and easier to control.</p>\n<p><strong>If they’re struggling:</strong> Move the cones 5 feet closer. Use a softer ball.</p>\n<p><strong>If they’ve got it:</strong> Move the cones to 12 feet apart. Have them try to make the ball stop right at the cone.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size3/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 3 soccer ball →</a> — right size for ages 5–7.</p>\n<p><a href=\"/go/soccer-cones-12pk/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Disc cones (50-pack) →</a> — flat cones for gates, grids, and boundary markers.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Two Cone Pass Back and Forth","summary":"Pass the ball between two cones from 10 feet away. 6 minutes. Ages 5-7.","sport":"soccer","ages":["5-7"],"fundamental":"passing","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Young child kicking a ball between two cones positioned 10 feet apart.","editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Inside-of-foot vs. toe-poke is the right 5-7 emphasis."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-two-cone-pass-back-and-forth.md";
				const url = undefined;
				function rawContent() {
					return "\nFive-year-olds don't have the foot strength to pass far. This drill teaches them to push the ball to a target that's close and visible. Two cones are easy to see and hit.\n\n**What you need:** 1 soccer ball, 2 cones.\n\n**Setup:** Place 2 cones 10 feet apart. Child stands at one cone with the ball.\n\n**How to run it:**\n\n1. Child kicks the ball from one cone toward the other using the inside of their foot.\n2. Ball rolls to the other cone and stops near it.\n3. They chase after the ball and kick it back.\n4. 10 kicks total. 5 in each direction.\n5. Rest. Do it again.\n\n**What to watch:** Are they using the inside of their foot or kicking with their toe? Inside of the foot is softer and easier to control.\n\n**If they're struggling:** Move the cones 5 feet closer. Use a softer ball.\n\n**If they've got it:** Move the cones to 12 feet apart. Have them try to make the ball stop right at the cone.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 3 soccer ball →](/go/soccer-ball-size3/) — right size for ages 5–7.\n\n[Disc cones (50-pack) →](/go/soccer-cones-12pk/) — flat cones for gates, grids, and boundary markers.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
