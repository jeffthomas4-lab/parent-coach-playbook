globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The give and go is the first team move kids learn. It’s pass, move, receive. Simple but it teaches timing and off-ball movement. In a real game, this move splits defenses.</p>\n<p><strong>What you need:</strong> 1 soccer ball. 2 kids. 25 feet of space.</p>\n<p><strong>Setup:</strong> Two kids 10 feet apart. Starting line is 15 feet behind them.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Kid with the ball passes to partner using Plant, Open, Strike, Follow.</li>\n<li>Immediately after the pass, the passer sprints forward past the partner.</li>\n<li>Partner receives the ball, sees the run, and passes it to the runner’s feet.</li>\n<li>Runner receives and keeps going 10 more feet.</li>\n<li>Do 5 give and goes, then switch roles.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the passer run immediately or hesitate? Immediate movement is the key.</p>\n<p><strong>If they’re struggling:</strong> Slow the run down. Walk through it first without the ball.</p>\n<p><strong>If they’ve got it:</strong> Add a defender 5 feet behind the ball carrier. Defender tries to intercept the return pass.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size4/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 4 soccer ball →</a> — right size for ages 8–12.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Give and Go with Partner","summary":"Pass, run past partner, receive the return pass. 10 minutes. Ages 8-10.","sport":"soccer","ages":["8-10"],"fundamental":"passing","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player A passing to Player B, then sprinting past them to receive the return pass in space.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Standard give-and-go, clean voice, soccer vocab correct."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-give-and-go-with-partner.md";
				const url = undefined;
				function rawContent() {
					return "\nThe give and go is the first team move kids learn. It's pass, move, receive. Simple but it teaches timing and off-ball movement. In a real game, this move splits defenses.\n\n**What you need:** 1 soccer ball. 2 kids. 25 feet of space.\n\n**Setup:** Two kids 10 feet apart. Starting line is 15 feet behind them.\n\n**How to run it:**\n\n1. Kid with the ball passes to partner using Plant, Open, Strike, Follow.\n2. Immediately after the pass, the passer sprints forward past the partner.\n3. Partner receives the ball, sees the run, and passes it to the runner's feet.\n4. Runner receives and keeps going 10 more feet.\n5. Do 5 give and goes, then switch roles.\n\n**What to watch:** Does the passer run immediately or hesitate? Immediate movement is the key.\n\n**If they're struggling:** Slow the run down. Walk through it first without the ball.\n\n**If they've got it:** Add a defender 5 feet behind the ball carrier. Defender tries to intercept the return pass.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 4 soccer ball →](/go/soccer-ball-size4/) — right size for ages 8–12.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
