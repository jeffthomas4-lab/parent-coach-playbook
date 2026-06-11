globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Passing is dead if the passer just stands there. This teaches kids that the passer moves after releasing the ball, finding space to receive it again.</p>\n<p><strong>What you need:</strong> 1 soccer ball, 2 kids (or you and a kid).</p>\n<p><strong>Setup:</strong> Partners 15 feet apart on grass.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Using the Plant, Open, Strike, Follow cue: Plant the non-kick foot beside the ball pointing at the target, open the hips toward them, strike with the inside of the foot ankle locked, follow through.</li>\n<li>Player A passes to Player B using the correct cue.</li>\n<li>Immediately after passing, Player A runs to a new spot 3 feet to the left or right.</li>\n<li>Player B receives the ball using See, Cushion, Settle, Move: see it coming early, soft surface to absorb, settle it into space, move to the next receiver.</li>\n<li>Player B then passes back to the new position.</li>\n<li>10 passes each direction.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the passer move immediately or wait? Moving immediately opens up space.</p>\n<p><strong>If they’re struggling:</strong> Keep distance at 15 feet. Make it slower paced.</p>\n<p><strong>If they’ve got it:</strong> Increase distance to 20 feet. Passer must move and call for the ball.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size4/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 4 soccer ball →</a> — right size for ages 8–12.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Pass and Move","summary":"Pass the ball, then move to a new spot to receive it back. 10 minutes. Ages 8-10.","sport":"soccer","ages":["8-10"],"fundamental":"passing","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player A passes to Player B, then moves to a new position while Player B controls the ball.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Solid passing-with-movement drill. Soccer vocab correct."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-pass-and-move.md";
				const url = undefined;
				function rawContent() {
					return "\nPassing is dead if the passer just stands there. This teaches kids that the passer moves after releasing the ball, finding space to receive it again.\n\n**What you need:** 1 soccer ball, 2 kids (or you and a kid).\n\n**Setup:** Partners 15 feet apart on grass.\n\n**How to run it:**\n\n1. Using the Plant, Open, Strike, Follow cue: Plant the non-kick foot beside the ball pointing at the target, open the hips toward them, strike with the inside of the foot ankle locked, follow through.\n2. Player A passes to Player B using the correct cue.\n3. Immediately after passing, Player A runs to a new spot 3 feet to the left or right.\n4. Player B receives the ball using See, Cushion, Settle, Move: see it coming early, soft surface to absorb, settle it into space, move to the next receiver.\n5. Player B then passes back to the new position.\n6. 10 passes each direction.\n\n**What to watch:** Does the passer move immediately or wait? Moving immediately opens up space.\n\n**If they're struggling:** Keep distance at 15 feet. Make it slower paced.\n\n**If they've got it:** Increase distance to 20 feet. Passer must move and call for the ball.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 4 soccer ball →](/go/soccer-ball-size4/) — right size for ages 8–12.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
