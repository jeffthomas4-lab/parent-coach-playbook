globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>This drill is for kids who want to play goalkeeper. Air balls require a different technique than ground balls. The keeper catches at chest height, hands behind the ball, and secures it to their body.</p>\n<p><strong>What you need:</strong> A goal. A soccer ball. Open space.</p>\n<p><strong>Setup:</strong> Keeper is in the goal. You stand 12 feet away.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Toss the ball underhand toward the keeper at chest height.</li>\n<li>Keeper watches the ball come (See).</li>\n<li>Keeper positions their hands behind the ball, palms facing the ball.</li>\n<li>Ball arrives. Keeper cushions it to their chest (Cushion).</li>\n<li>Keeper wraps their arms around the ball and holds it secure.</li>\n<li>Do 8 catches.</li>\n</ol>\n<p><strong>What to watch:</strong> Do the hands go behind the ball or miss it? Hands behind means the ball comes into the chest safely.</p>\n<p><strong>If they’re struggling:</strong> Toss from closer (8 feet). Lower the toss height.</p>\n<p><strong>If they’ve got it:</strong> Toss from farther away (15 feet) or higher in the air.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size4/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 4 soccer ball →</a> — right size for ages 8–12.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Keeper Catch at Chest","summary":"Goalkeeper catches a ball at chest height and holds it. 8 minutes. Ages 8-10.","sport":"soccer","ages":["8-10"],"fundamental":"goalkeeping","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Goalkeeper receiving a ball at chest height with hands positioned behind the ball, catching and securing it to the body.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean introductory keeper drill. Soccer vocab correct."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-keeper-catch-at-chest.md";
				const url = undefined;
				function rawContent() {
					return "\nThis drill is for kids who want to play goalkeeper. Air balls require a different technique than ground balls. The keeper catches at chest height, hands behind the ball, and secures it to their body.\n\n**What you need:** A goal. A soccer ball. Open space.\n\n**Setup:** Keeper is in the goal. You stand 12 feet away.\n\n**How to run it:**\n\n1. Toss the ball underhand toward the keeper at chest height.\n2. Keeper watches the ball come (See).\n3. Keeper positions their hands behind the ball, palms facing the ball.\n4. Ball arrives. Keeper cushions it to their chest (Cushion).\n5. Keeper wraps their arms around the ball and holds it secure.\n6. Do 8 catches.\n\n**What to watch:** Do the hands go behind the ball or miss it? Hands behind means the ball comes into the chest safely.\n\n**If they're struggling:** Toss from closer (8 feet). Lower the toss height.\n\n**If they've got it:** Toss from farther away (15 feet) or higher in the air.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 4 soccer ball →](/go/soccer-ball-size4/) — right size for ages 8–12.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
