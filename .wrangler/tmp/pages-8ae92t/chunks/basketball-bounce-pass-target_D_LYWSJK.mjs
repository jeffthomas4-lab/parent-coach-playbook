globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The bounce pass goes on the ground. It’s slower than a chest pass but harder to intercept. This drill teaches the angle. The ball bounces at a point between you and your partner.</p>\n<p><strong>What you need:</strong> 8-foot basket. Youth ball. Two kids per pair. Flat court.</p>\n<p><strong>Setup:</strong> Partners stand facing each other 10 feet apart.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Start with the ball at chest level. You’re going to bounce it to your partner.</li>\n<li>Aim for a spot on the ground halfway between you and them. That’s your target.</li>\n<li>Push the ball down and forward so it bounces at that spot and comes up at chest height to your partner.</li>\n<li>Partner catches it and bounces it back to you.</li>\n<li>Do 12 bounce passes back and forth. Rest. Do 2 rounds.</li>\n</ol>\n<p><strong>What to watch:</strong> Is the ball bouncing at the halfway point or does it bounce too close or too far? The bounce point controls where the catch happens.</p>\n<p><strong>If they’re struggling:</strong> Move closer to 8 feet. Use a bigger, softer ball. Aim for a line on the court instead of calculating the midpoint.</p>\n<p><strong>If they’ve got it:</strong> Move back to 12 feet. Add a quick catch-and-pass. Make it a rapid fire series without stops between passes.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Bounce Pass Target","summary":"Pass by bouncing the ball to a partner. 7 minutes. Ages 5-7.","sport":"basketball","ages":["5-7"],"fundamental":"passing","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Two young children with a basketball bouncing between them on the ground, one child bouncing it toward the other.","editorial":{"qualityGrade":8,"originalityGrade":6,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Halfway-bounce-point cue is the right teaching detail for ages 5-7."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-bounce-pass-target.md";
				const url = undefined;
				function rawContent() {
					return "\nThe bounce pass goes on the ground. It's slower than a chest pass but harder to intercept. This drill teaches the angle. The ball bounces at a point between you and your partner.\n\n**What you need:** 8-foot basket. Youth ball. Two kids per pair. Flat court.\n\n**Setup:** Partners stand facing each other 10 feet apart.\n\n**How to run it:**\n\n1. Start with the ball at chest level. You're going to bounce it to your partner.\n2. Aim for a spot on the ground halfway between you and them. That's your target.\n3. Push the ball down and forward so it bounces at that spot and comes up at chest height to your partner.\n4. Partner catches it and bounces it back to you.\n5. Do 12 bounce passes back and forth. Rest. Do 2 rounds.\n\n**What to watch:** Is the ball bouncing at the halfway point or does it bounce too close or too far? The bounce point controls where the catch happens.\n\n**If they're struggling:** Move closer to 8 feet. Use a bigger, softer ball. Aim for a line on the court instead of calculating the midpoint.\n\n**If they've got it:** Move back to 12 feet. Add a quick catch-and-pass. Make it a rapid fire series without stops between passes.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
