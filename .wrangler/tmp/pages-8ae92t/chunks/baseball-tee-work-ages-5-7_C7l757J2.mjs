globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The tee is where batting starts. Kids this age need to build the habit of seeing the ball, setting their feet, and following through. This drill is about repetition and a single technical point: contact in front of the plate.</p>\n<p><strong>Equipment needed:</strong> One T-ball tee, 15 plastic or safety-core <a href=\"/go/baseball-balls-teeball/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">baseballs</a>, a bucket, one <a href=\"/go/baseball-bat-teeball/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">bat</a> appropriate for the age.</p>\n<p><strong>Setup:</strong> Place the tee at home plate in your yard or field. Space yourself 20 feet away with the bucket of balls. A fence or net behind the tee catches balls and keeps the drill contained.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Place the first ball on the tee at the child’s belt height.</li>\n<li>Have them address the plate from the opposite side of where you’re standing (so they’re not swinging toward you).</li>\n<li>Remind them: “Step and swing.” That’s it. Not “keep your elbow up” or “watch the ball through contact.” One cue per round.</li>\n<li>After the swing, they retrieve the ball and place it back on the tee for the next rep. That’s their job.</li>\n<li>Do 15 reps. Most will make contact on reps 5-8 onward.</li>\n</ol>\n<p><strong>What to look for:</strong> Solid contact and a full follow-through. Kids this age who start making contact will want to keep going. Let them. The ball coming off the bat is their best teacher.</p>\n<p><strong>Variation:</strong> For younger kids (5-6) who struggle with hand-eye, lower the tee to knee height. Closer to the ground is easier to track. Move it ba</p>";

				const frontmatter = {"title":"Tee Work: The Foundation","summary":"Get solid contact with a stationary tee in 15 minutes. Ages 5-7.","sport":"baseball","ages":["5-7"],"focus":"fundamentals","layer":"foundations","fundamental":"hitting","progression":"intro","illustrationBrief":"A young child standing at a T-ball tee with bat in hand, positioned to make contact with the ball at belt height.","publishedAt":"2026-01-05T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":7,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Body was truncated mid-sentence; completed the variation paragraph."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-tee-work-ages-5-7.md";
				const url = undefined;
				function rawContent() {
					return "\nThe tee is where batting starts. Kids this age need to build the habit of seeing the ball, setting their feet, and following through. This drill is about repetition and a single technical point: contact in front of the plate.\n\n**Equipment needed:** One T-ball tee, 15 plastic or safety-core [baseballs](/go/baseball-balls-teeball/), a bucket, one [bat](/go/baseball-bat-teeball/) appropriate for the age.\n\n**Setup:** Place the tee at home plate in your yard or field. Space yourself 20 feet away with the bucket of balls. A fence or net behind the tee catches balls and keeps the drill contained.\n\n**How to run it:**\n\n1. Place the first ball on the tee at the child's belt height.\n2. Have them address the plate from the opposite side of where you're standing (so they're not swinging toward you).\n3. Remind them: \"Step and swing.\" That's it. Not \"keep your elbow up\" or \"watch the ball through contact.\" One cue per round.\n4. After the swing, they retrieve the ball and place it back on the tee for the next rep. That's their job.\n5. Do 15 reps. Most will make contact on reps 5-8 onward.\n\n**What to look for:** Solid contact and a full follow-through. Kids this age who start making contact will want to keep going. Let them. The ball coming off the bat is their best teacher.\n\n**Variation:** For younger kids (5-6) who struggle with hand-eye, lower the tee to knee height. Closer to the ground is easier to track. Move it ba";
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
