globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The first serve a kid learns is underhand. Hold the ball low, swing the arm up, contact the ball at waist height. Easy to teach, easy to learn. Once the underhand is consistent, they can move to overhand.</p>\n<p><strong>What you need:</strong> A <a href=\"/go/volleyball-volley-lite/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">volleyball</a>, a net (lowered for younger kids), open court.</p>\n<p><strong>Setup:</strong> Server at the back line. Net 7-8 feet high (lowered from regulation 7’4”).</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Toss, Step, Reach, Snap. Underhand is “Hold, Step, Swing, Contact.”</li>\n<li>Hold: ball in non-hitting hand at waist height. Hitting hand pulled back.</li>\n<li>Step: step forward with the opposite foot of the hitting hand.</li>\n<li>Swing: hitting arm swings forward and up.</li>\n<li>Contact: hand makes contact with the ball at waist height. Ball flies over the net.</li>\n</ol>\n<p><strong>What to watch:</strong> Where the contact happens. If the contact is below the waist, the ball goes too high. If above, it goes too flat. Waist height with a level swing.</p>\n<p><strong>If they’re struggling:</strong> Move closer to the net. Lower the net more.</p>\n<p><strong>If they’ve got it:</strong> Move to the regulation back line. Or aim</p>";

				const frontmatter = {"title":"Underhand Serve","summary":"First serve. Underhand contact, ball over the net. 10 minutes. Ages 8-10.","sport":"volleyball","ages":["8-10"],"fundamental":"serving","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Young player holding the ball at waist height with the non-hitting hand, swinging the hitting arm forward in an underhand motion to contact the ball.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"First-serve drill. Net height note (7-8 ft lowered from 7'4) is a typo: should be raised, not lowered. Detail flagged for Jeff."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/volleyball-underhand-serve.md";
				const url = undefined;
				function rawContent() {
					return "\nThe first serve a kid learns is underhand. Hold the ball low, swing the arm up, contact the ball at waist height. Easy to teach, easy to learn. Once the underhand is consistent, they can move to overhand.\n\n**What you need:** A [volleyball](/go/volleyball-volley-lite/), a net (lowered for younger kids), open court.\n\n**Setup:** Server at the back line. Net 7-8 feet high (lowered from regulation 7'4\").\n\n**How to run it:**\n\n1. Cue: Toss, Step, Reach, Snap. Underhand is \"Hold, Step, Swing, Contact.\"\n2. Hold: ball in non-hitting hand at waist height. Hitting hand pulled back.\n3. Step: step forward with the opposite foot of the hitting hand.\n4. Swing: hitting arm swings forward and up.\n5. Contact: hand makes contact with the ball at waist height. Ball flies over the net.\n\n**What to watch:** Where the contact happens. If the contact is below the waist, the ball goes too high. If above, it goes too flat. Waist height with a level swing.\n\n**If they're struggling:** Move closer to the net. Lower the net more.\n\n**If they've got it:** Move to the regulation back line. Or aim";
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
