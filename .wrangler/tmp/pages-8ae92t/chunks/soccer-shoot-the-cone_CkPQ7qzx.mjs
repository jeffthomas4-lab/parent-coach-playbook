globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Shooting at a cone is more fun than shooting at a goal. Kids get instant feedback. Did they knock it over or miss? The cone doesn’t move. The target is clear.</p>\n<p><strong>What you need:</strong> 1 soccer ball, 1 cone, open space.</p>\n<p><strong>Setup:</strong> Cone stands 15 feet away. Child stands with the ball.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Child prepares to shoot using Plant, Lock, Strike, Finish.</li>\n<li>Child shoots toward the cone. Goal is to knock it over.</li>\n<li>If the ball hits the cone and it falls, success.</li>\n<li>If the ball misses, retrieve and try again.</li>\n<li>Do 10 shots total.</li>\n</ol>\n<p><strong>What to watch:</strong> How many shots actually hit the cone? Accuracy and power are building together.</p>\n<p><strong>If they’re struggling:</strong> Move closer to 10 feet. Use a bigger cone.</p>\n<p><strong>If they’ve got it:</strong> Move back to 20 feet. Use a smaller cone.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size3/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 3 soccer ball →</a> — right size for ages 5–7.</p>\n<p><a href=\"/go/soccer-cones-12pk/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Disc cones (50-pack) →</a> — flat cones for gates, grids, and boundary markers.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Shoot the Cone","summary":"Shoot the ball at a cone from 15 feet and try to knock it over. 8 minutes. Ages 5-7.","sport":"soccer","ages":["5-7"],"fundamental":"shooting","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Young child kicking a ball at a cone standing alone 15 feet away.","editorial":{"qualityGrade":7,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Cone target instead of goal is a great age-appropriate twist."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-shoot-the-cone.md";
				const url = undefined;
				function rawContent() {
					return "\nShooting at a cone is more fun than shooting at a goal. Kids get instant feedback. Did they knock it over or miss? The cone doesn't move. The target is clear.\n\n**What you need:** 1 soccer ball, 1 cone, open space.\n\n**Setup:** Cone stands 15 feet away. Child stands with the ball.\n\n**How to run it:**\n\n1. Child prepares to shoot using Plant, Lock, Strike, Finish.\n2. Child shoots toward the cone. Goal is to knock it over.\n3. If the ball hits the cone and it falls, success.\n4. If the ball misses, retrieve and try again.\n5. Do 10 shots total.\n\n**What to watch:** How many shots actually hit the cone? Accuracy and power are building together.\n\n**If they're struggling:** Move closer to 10 feet. Use a bigger cone.\n\n**If they've got it:** Move back to 20 feet. Use a smaller cone.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 3 soccer ball →](/go/soccer-ball-size3/) — right size for ages 5–7.\n\n[Disc cones (50-pack) →](/go/soccer-cones-12pk/) — flat cones for gates, grids, and boundary markers.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
