globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Walking and bouncing at the same time is the next step. The ball stays in front. The pace is slow. The eyes stay up. This is a transition drill between pound dribbles and real dribble movement.</p>\n<p><strong>What you need:</strong> 8-foot basket. Youth ball. One per kid. A line on the court (centerline or baseline).</p>\n<p><strong>Setup:</strong> Line up kids single-file on a baseline. Each kid dribbles to the opposite baseline and back.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Low, Push, Eyes, Both.</li>\n<li>Start with the right hand dribbling down the baseline. Walk slow. Keep the ball in front of you.</li>\n<li>Walk back to the starting line with the left hand.</li>\n<li>Walk down with both hands alternating. Ball stays low the whole time.</li>\n<li>Do 2 rounds. Rest 30 seconds between rounds.</li>\n</ol>\n<p><strong>What to watch:</strong> Is the ball bouncing in front of them or to the side? In front. If it drifts to the side, the hand angle is wrong. Adjust the angle of their wrist.</p>\n<p><strong>If they’re struggling:</strong> Shorten the distance. Walk half a baseline (about 20 feet). Use a softer, bigger ball.</p>\n<p><strong>If they’ve got it:</strong> Add a command: when you say “stop,” they plant their feet and stop the ball immediately. Then you point left or right and they dribble that direction.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Walking Dribble Line","summary":"Dribble while walking in a straight line. 8 minutes. Ages 5-7.","sport":"basketball","ages":["5-7"],"fundamental":"dribbling","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A child walking in a straight line on a court, dribbling a basketball in front of their body, eyes forward.","editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Solid intro drill. Lead paragraph runs five sentences and could be tightened."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-walking-dribble-line.md";
				const url = undefined;
				function rawContent() {
					return "\nWalking and bouncing at the same time is the next step. The ball stays in front. The pace is slow. The eyes stay up. This is a transition drill between pound dribbles and real dribble movement.\n\n**What you need:** 8-foot basket. Youth ball. One per kid. A line on the court (centerline or baseline).\n\n**Setup:** Line up kids single-file on a baseline. Each kid dribbles to the opposite baseline and back.\n\n**How to run it:**\n\n1. Cue: Low, Push, Eyes, Both.\n2. Start with the right hand dribbling down the baseline. Walk slow. Keep the ball in front of you.\n3. Walk back to the starting line with the left hand.\n4. Walk down with both hands alternating. Ball stays low the whole time.\n5. Do 2 rounds. Rest 30 seconds between rounds.\n\n**What to watch:** Is the ball bouncing in front of them or to the side? In front. If it drifts to the side, the hand angle is wrong. Adjust the angle of their wrist.\n\n**If they're struggling:** Shorten the distance. Walk half a baseline (about 20 feet). Use a softer, bigger ball.\n\n**If they've got it:** Add a command: when you say \"stop,\" they plant their feet and stop the ball immediately. Then you point left or right and they dribble that direction.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
