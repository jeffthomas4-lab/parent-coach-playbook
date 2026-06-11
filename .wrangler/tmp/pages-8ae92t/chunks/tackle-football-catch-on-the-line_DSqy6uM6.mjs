globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The first catching drill teaches kids to see the ball and catch it with their hands, not their body. Cue: See, Reach, Squeeze, Tuck. This drill focuses on catches at chest height, hands ready.</p>\n<p><strong>What you need:</strong> One football. Open grass. No equipment needed.</p>\n<p><strong>Setup:</strong> Stand 10 feet away from the kid. Both face each other.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Teach See, Reach, Squeeze, Tuck. Today we focus on See and Reach.</li>\n<li>See: Eyes on the ball the whole way.</li>\n<li>Reach: Hands come out to meet the ball, away from the body. Thumbs together for a catch at chest height.</li>\n<li>Squeeze: Once the ball is in the hands, squeeze it.</li>\n<li>Tuck: Bring it in tight.</li>\n<li>Toss the ball gently to them at chest height. Do 10 catches.</li>\n</ol>\n<p><strong>What to watch:</strong> Are the hands out and ready or are they waiting for the ball to come to them? Hands out and reaching is right.</p>\n<p><strong>If they’re struggling:</strong> Toss it softer. Throw it so it’s easy to catch. Get them feeling success first.</p>\n<p><strong>If they’ve got it:</strong> Move back to 15 feet. Throw it a little harder. Still chest height.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/football-rubber-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber football →</a> — Wilson youth rubber ball for rec and practice.</p>\n<p><a href=\"/what-to-buy/football/\">Full football gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Catch on the Line","summary":"Catch a short pass at chest height. 8 minutes. Ages 8-10.","sport":"football","ages":["8-10"],"fundamental":"catching","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A young receiver with hands ready, catching a football at chest height with thumbs together.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Beginner catch drill, hands-not-body focus. No contact."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/tackle-football-catch-on-the-line.md";
				const url = undefined;
				function rawContent() {
					return "\nThe first catching drill teaches kids to see the ball and catch it with their hands, not their body. Cue: See, Reach, Squeeze, Tuck. This drill focuses on catches at chest height, hands ready.\n\n**What you need:** One football. Open grass. No equipment needed.\n\n**Setup:** Stand 10 feet away from the kid. Both face each other.\n\n**How to run it:**\n\n1. Teach See, Reach, Squeeze, Tuck. Today we focus on See and Reach.\n2. See: Eyes on the ball the whole way.\n3. Reach: Hands come out to meet the ball, away from the body. Thumbs together for a catch at chest height.\n4. Squeeze: Once the ball is in the hands, squeeze it.\n5. Tuck: Bring it in tight.\n6. Toss the ball gently to them at chest height. Do 10 catches.\n\n**What to watch:** Are the hands out and ready or are they waiting for the ball to come to them? Hands out and reaching is right.\n\n**If they're struggling:** Toss it softer. Throw it so it's easy to catch. Get them feeling success first.\n\n**If they've got it:** Move back to 15 feet. Throw it a little harder. Still chest height.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber football →](/go/football-rubber-youth/) — Wilson youth rubber ball for rec and practice.\n\n[Full football gear guide →](/what-to-buy/football/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
