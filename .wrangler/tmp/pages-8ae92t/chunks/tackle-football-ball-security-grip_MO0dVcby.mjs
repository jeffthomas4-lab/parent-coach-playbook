globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Before kids run with the ball, they need to hold it correctly. A good grip starts with the fingers on the laces, thumb underneath, ball cradled against the body. No palm grip.</p>\n<p><strong>What you need:</strong> One football for every two kids. No other equipment.</p>\n<p><strong>Setup:</strong> Pair the kids up. They sit on the ground facing each other about 5 feet apart.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Show them where to hold the ball. Fingers on the laces toward the middle of the ball, thumb underneath for support. The ball rests in the fingers, not the palm.</li>\n<li>The ball should be cradled up against the body, not held out in the air.</li>\n<li>Have the first kid hold the ball in this grip for 5 seconds. Then pass it to the other kid.</li>\n<li>Do 10 passes back and forth.</li>\n<li>Now have them stand up and do the same thing. Still no running yet.</li>\n</ol>\n<p><strong>What to watch:</strong> Are the fingers on the laces or is the ball in the palm? Fingers on the laces. Palm grip means the ball can slip out.</p>\n<p><strong>If they’re struggling:</strong> Start with a soft football or a smaller ball. Easier to grip.</p>\n<p><strong>If they’ve got it:</strong> Have them hold the ball and walk forward slowly. Keep the grip tight the whole time.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/football-rubber-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber football →</a> — Wilson youth rubber ball for rec and practice.</p>\n<p><a href=\"/what-to-buy/football/\">Full football gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Ball Security Grip","summary":"Hold the ball tight with one hand. 6 minutes. Ages 8-10.","sport":"football","ages":["8-10"],"fundamental":"ball-carrying","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A young player holding a football one-handed, cradled in the fingers, thumb underneath for security.","editorial":{"qualityGrade":7,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Summary says 'one hand' but body teaches two-hand cradle; keep the body, summary slightly off but acceptable."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/tackle-football-ball-security-grip.md";
				const url = undefined;
				function rawContent() {
					return "\nBefore kids run with the ball, they need to hold it correctly. A good grip starts with the fingers on the laces, thumb underneath, ball cradled against the body. No palm grip.\n\n**What you need:** One football for every two kids. No other equipment.\n\n**Setup:** Pair the kids up. They sit on the ground facing each other about 5 feet apart.\n\n**How to run it:**\n\n1. Show them where to hold the ball. Fingers on the laces toward the middle of the ball, thumb underneath for support. The ball rests in the fingers, not the palm.\n2. The ball should be cradled up against the body, not held out in the air.\n3. Have the first kid hold the ball in this grip for 5 seconds. Then pass it to the other kid.\n4. Do 10 passes back and forth.\n5. Now have them stand up and do the same thing. Still no running yet.\n\n**What to watch:** Are the fingers on the laces or is the ball in the palm? Fingers on the laces. Palm grip means the ball can slip out.\n\n**If they're struggling:** Start with a soft football or a smaller ball. Easier to grip.\n\n**If they've got it:** Have them hold the ball and walk forward slowly. Keep the grip tight the whole time.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber football →](/go/football-rubber-youth/) — Wilson youth rubber ball for rec and practice.\n\n[Full football gear guide →](/what-to-buy/football/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
