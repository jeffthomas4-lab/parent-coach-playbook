globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The crossover dribble moves the ball from one side of the body to the other in one bounce. It’s the foundation for dribble moves. Start stationary so the focus is only on the bounce pattern, not movement.</p>\n<p><strong>What you need:</strong> Basketball. Flat court. Open space.</p>\n<p><strong>Setup:</strong> Kids spread out 6 feet apart. Stand with feet shoulder-width apart.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Start with the ball in your right hand. Low stance, low ball.</li>\n<li>Dribble down on the right side of your body. As it bounces up, push it across in front of you toward the left side.</li>\n<li>Catch it at the left side with your left hand as it bounces up. Your hands meet at the top of the bounce.</li>\n<li>Do 10 crossovers: right to left, left to right, right to left, and so on.</li>\n<li>Do 3 rounds. Rest 30 seconds between.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the ball bounce in the middle of the crossover or does it pass too far to one side? The crossover bounce should land in the middle. If it drifts, their hand angle is off.</p>\n<p><strong>If they’re struggling:</strong> Slow it down. Dribble on the right 5 times, then switch to left 5 times without crossing. Build up to the crossover.</p>\n<p><strong>If they’ve got it:</strong> Do crossovers while slowly walking forward. Keep the same low ball and smooth hand exchange. No rushing.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Crossover Dribble Stationary","summary":"Bounce the ball across your body while standing still. 7 minutes. Ages 8-10.","sport":"basketball","ages":["8-10"],"fundamental":"dribbling","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A child bouncing a basketball in front of their body, bouncing the ball in front of the left foot then the right foot.","editorial":{"qualityGrade":8,"originalityGrade":6,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Hands-meet-at-top-of-bounce cue is the right teach for ages 8-10."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-crossover-stationary.md";
				const url = undefined;
				function rawContent() {
					return "\nThe crossover dribble moves the ball from one side of the body to the other in one bounce. It's the foundation for dribble moves. Start stationary so the focus is only on the bounce pattern, not movement.\n\n**What you need:** Basketball. Flat court. Open space.\n\n**Setup:** Kids spread out 6 feet apart. Stand with feet shoulder-width apart.\n\n**How to run it:**\n\n1. Start with the ball in your right hand. Low stance, low ball.\n2. Dribble down on the right side of your body. As it bounces up, push it across in front of you toward the left side.\n3. Catch it at the left side with your left hand as it bounces up. Your hands meet at the top of the bounce.\n4. Do 10 crossovers: right to left, left to right, right to left, and so on.\n5. Do 3 rounds. Rest 30 seconds between.\n\n**What to watch:** Does the ball bounce in the middle of the crossover or does it pass too far to one side? The crossover bounce should land in the middle. If it drifts, their hand angle is off.\n\n**If they're struggling:** Slow it down. Dribble on the right 5 times, then switch to left 5 times without crossing. Build up to the crossover.\n\n**If they've got it:** Do crossovers while slowly walking forward. Keep the same low ball and smooth hand exchange. No rushing.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
