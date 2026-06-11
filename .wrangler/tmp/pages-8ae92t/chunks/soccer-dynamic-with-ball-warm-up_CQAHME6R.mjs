globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A good warm-up gets the body moving and the mind focused. This drill combines movement with ball contact. Kids dribble, stretch, and prepare for the session ahead. All ages do this together.</p>\n<p><strong>What you need:</strong> 1 ball per child. Open space. 20x20 feet per child.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Each child dribbles forward 20 feet using Touch, Look, Push, Go. Small touches, eyes up, push, accelerate.</li>\n<li>At the end, they do 5 knee hugs while holding the ball.</li>\n<li>Dribble backward 20 feet with back touches.</li>\n<li>Do 5 quad stretches with the ball.</li>\n<li>Dribble sideways left 15 feet.</li>\n<li>Do 5 lateral lunges.</li>\n<li>Dribble sideways right 15 feet.</li>\n<li>Repeat the full sequence once.</li>\n</ol>\n<p><strong>What to watch:</strong> Are they moving with purpose or just jogging? Purpose means they’re engaged.</p>\n<p><strong>If they’re struggling:</strong> Reduce distances. Slower pace.</p>\n<p><strong>If they’ve got it:</strong> Increase distances. Add a turn or acceleration burst in each direction.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size3/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 3 soccer ball →</a> — right size for ages 5–7.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Dynamic With Ball Warm-Up","summary":"Moving ball touches to warm up the body and build rhythm. 8 minutes. All ages 5-7, 8-10, 11-12.","sport":"soccer","ages":["5-7","8-10","11-12"],"fundamental":"warm-up","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player moving forward while tapping the ball, combining dribbling movements with dynamic stretching.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-dynamic-with-ball-warm-up.md";
				const url = undefined;
				function rawContent() {
					return "\nA good warm-up gets the body moving and the mind focused. This drill combines movement with ball contact. Kids dribble, stretch, and prepare for the session ahead. All ages do this together.\n\n**What you need:** 1 ball per child. Open space. 20x20 feet per child.\n\n**How to run it:**\n\n1. Each child dribbles forward 20 feet using Touch, Look, Push, Go. Small touches, eyes up, push, accelerate.\n2. At the end, they do 5 knee hugs while holding the ball.\n3. Dribble backward 20 feet with back touches.\n4. Do 5 quad stretches with the ball.\n5. Dribble sideways left 15 feet.\n6. Do 5 lateral lunges.\n7. Dribble sideways right 15 feet.\n8. Repeat the full sequence once.\n\n**What to watch:** Are they moving with purpose or just jogging? Purpose means they're engaged.\n\n**If they're struggling:** Reduce distances. Slower pace.\n\n**If they've got it:** Increase distances. Add a turn or acceleration burst in each direction.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 3 soccer ball →](/go/soccer-ball-size3/) — right size for ages 5–7.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
