globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Goals don’t come from standing still. They come from receiving the ball and finishing quickly. This drill combines passing and shooting. Receive, settle, shoot. Three steps, one motion.</p>\n<p><strong>What you need:</strong> 1 soccer ball, 2 kids, a goal or net, 20 feet of space.</p>\n<p><strong>Setup:</strong> Passer is 20 feet from goal. Receiver is in the middle, 10 feet from goal.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Receiver calls for the ball. Passer passes to receiver using Plant, Open, Strike, Follow.</li>\n<li>Receiver takes one touch to settle the ball (See, Cushion, Settle, Move).</li>\n<li>Receiver shoots immediately using Plant, Lock, Strike, Finish.</li>\n<li>Do 4 repeats, then switch roles.</li>\n</ol>\n<p><strong>What to watch:</strong> Is the settling touch in the right place to shoot? Or does the receiver have to adjust?</p>\n<p><strong>If they’re struggling:</strong> Move the receiver closer to goal (8 feet). Give them a heavier first touch to stabilize.</p>\n<p><strong>If they’ve got it:</strong> Add a defender who closes the receiver after the pass is released. Now it’s under pressure.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size4/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 4 soccer ball →</a> — right size for ages 8–12.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Finishing After Pass","summary":"Receive a pass and shoot immediately in one motion. 10 minutes. Ages 8-10.","sport":"soccer","ages":["8-10"],"fundamental":"shooting","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player receiving a pass, settling the ball with their first touch, and shooting toward goal in quick succession.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-finishing-after-pass.md";
				const url = undefined;
				function rawContent() {
					return "\nGoals don't come from standing still. They come from receiving the ball and finishing quickly. This drill combines passing and shooting. Receive, settle, shoot. Three steps, one motion.\n\n**What you need:** 1 soccer ball, 2 kids, a goal or net, 20 feet of space.\n\n**Setup:** Passer is 20 feet from goal. Receiver is in the middle, 10 feet from goal.\n\n**How to run it:**\n\n1. Receiver calls for the ball. Passer passes to receiver using Plant, Open, Strike, Follow.\n2. Receiver takes one touch to settle the ball (See, Cushion, Settle, Move).\n3. Receiver shoots immediately using Plant, Lock, Strike, Finish.\n4. Do 4 repeats, then switch roles.\n\n**What to watch:** Is the settling touch in the right place to shoot? Or does the receiver have to adjust?\n\n**If they're struggling:** Move the receiver closer to goal (8 feet). Give them a heavier first touch to stabilize.\n\n**If they've got it:** Add a defender who closes the receiver after the pass is released. Now it's under pressure.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 4 soccer ball →](/go/soccer-ball-size4/) — right size for ages 8–12.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
