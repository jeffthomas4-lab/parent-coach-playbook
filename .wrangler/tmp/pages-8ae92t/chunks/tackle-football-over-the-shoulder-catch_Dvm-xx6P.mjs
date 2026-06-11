globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A deep ball requires the receiver to run forward, look back over their shoulder, and catch the ball behind their head. This is a different catching position from chest-high catches.</p>\n<p><strong>What you need:</strong> One football. Open field. 20 yards of space.</p>\n<p><strong>Setup:</strong> Stand at one end of the field. Line the receivers up 10 yards away facing away from you.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>The receiver runs forward at half speed.</li>\n<li>They turn their head to look back over their shoulder. Eyes on the ball.</li>\n<li>When they see the throw, they reach up with both hands. Thumbs together for a high catch.</li>\n<li>They catch the ball and tuck it.</li>\n<li>Start with easy throws. Do 5 reps.</li>\n</ol>\n<p><strong>What to watch:</strong> Are they looking back early or late? They should look back when they hear you release the ball. Eyes up through the chest on the incoming ball.</p>\n<p><strong>If they’re struggling:</strong> Have them jog slower or even walk. It’s easier to catch when you’re not running full speed.</p>\n<p><strong>If they’ve got it:</strong> Throw it deeper and make them run harder. Or put a defender behind them trying to knock it out.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/football-rubber-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber football →</a> — Wilson youth rubber ball for rec and practice.</p>\n<p><a href=\"/what-to-buy/football/\">Full football gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Over the Shoulder Catch","summary":"Catch a deep ball thrown over your shoulder. 12 minutes. Ages 11-12.","sport":"football","ages":["11-12"],"fundamental":"catching","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A receiver running forward, looking back over their shoulder to track a deep ball with both hands ready.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Deep-ball tracking and catch mechanics. No contact."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/tackle-football-over-the-shoulder-catch.md";
				const url = undefined;
				function rawContent() {
					return "\nA deep ball requires the receiver to run forward, look back over their shoulder, and catch the ball behind their head. This is a different catching position from chest-high catches.\n\n**What you need:** One football. Open field. 20 yards of space.\n\n**Setup:** Stand at one end of the field. Line the receivers up 10 yards away facing away from you.\n\n**How to run it:**\n\n1. The receiver runs forward at half speed.\n2. They turn their head to look back over their shoulder. Eyes on the ball.\n3. When they see the throw, they reach up with both hands. Thumbs together for a high catch.\n4. They catch the ball and tuck it.\n5. Start with easy throws. Do 5 reps.\n\n**What to watch:** Are they looking back early or late? They should look back when they hear you release the ball. Eyes up through the chest on the incoming ball.\n\n**If they're struggling:** Have them jog slower or even walk. It's easier to catch when you're not running full speed.\n\n**If they've got it:** Throw it deeper and make them run harder. Or put a defender behind them trying to knock it out.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber football →](/go/football-rubber-youth/) — Wilson youth rubber ball for rec and practice.\n\n[Full football gear guide →](/what-to-buy/football/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
