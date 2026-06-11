globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A cushioned touch means the ball doesn’t bounce away. Kids need soft feet and soft knees to absorb pass velocity. See, Cushion, Settle, Move starts here.</p>\n<p><strong>What you need:</strong> 1 soccer ball, 2 kids, open space.</p>\n<p><strong>Setup:</strong> Kids 12 feet apart. One has the ball.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Passer gently tosses the ball underhand to the receiver’s chest height.</li>\n<li>Receiver watches it come (See).</li>\n<li>Receiver presents the inside of their foot with a soft knee bend.</li>\n<li>Ball touches the foot. Knee bends to absorb the impact (Cushion).</li>\n<li>Ball drops to the ground near the receiver (Settle).</li>\n<li>Receiver pushes it forward gently (Move).</li>\n<li>Do 6 receives each, then switch roles.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the knee bend on contact? Soft knees mean better cushion.</p>\n<p><strong>If they’re struggling:</strong> Toss from closer distance. Use a softer ball.</p>\n<p><strong>If they’ve got it:</strong> Toss from farther away (15 feet) or with more speed.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size4/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 4 soccer ball →</a> — right size for ages 8–12.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Cushion the Ball","summary":"Receive a thrown ball on the inside of the foot and absorb the impact. 8 minutes. Ages 8-10.","sport":"soccer","ages":["8-10"],"fundamental":"receiving","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player with soft knee bend receiving a ball on the inside of their foot, absorbing the energy.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-cushion-the-ball.md";
				const url = undefined;
				function rawContent() {
					return "\nA cushioned touch means the ball doesn't bounce away. Kids need soft feet and soft knees to absorb pass velocity. See, Cushion, Settle, Move starts here.\n\n**What you need:** 1 soccer ball, 2 kids, open space.\n\n**Setup:** Kids 12 feet apart. One has the ball.\n\n**How to run it:**\n\n1. Passer gently tosses the ball underhand to the receiver's chest height.\n2. Receiver watches it come (See).\n3. Receiver presents the inside of their foot with a soft knee bend.\n4. Ball touches the foot. Knee bends to absorb the impact (Cushion).\n5. Ball drops to the ground near the receiver (Settle).\n6. Receiver pushes it forward gently (Move).\n7. Do 6 receives each, then switch roles.\n\n**What to watch:** Does the knee bend on contact? Soft knees mean better cushion.\n\n**If they're struggling:** Toss from closer distance. Use a softer ball.\n\n**If they've got it:** Toss from farther away (15 feet) or with more speed.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 4 soccer ball →](/go/soccer-ball-size4/) — right size for ages 8–12.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
