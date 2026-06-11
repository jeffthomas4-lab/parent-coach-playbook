globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The first tennis swing should look right before a ball is involved. Shadow swinging builds the path. Turn, drop, lift, follow. No ball, no pressure. Just the motion.</p>\n<p><strong>What you need:</strong> A youth tennis racquet (19, 21, or 23 inches depending on age). Open space.</p>\n<p><strong>Setup:</strong> Kid in athletic stance with the racquet ready.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Turn, Drop, Lift, Follow.</li>\n<li>Turn: shoulders rotate, racquet goes back beside the body.</li>\n<li>Drop: racquet head drops below the imaginary ball.</li>\n<li>Lift: swing forward and up, contacting an imaginary ball at waist height.</li>\n<li>Follow: racquet finishes over the opposite shoulder.</li>\n</ol>\n<p><strong>What to watch:</strong> The follow-through. A swing that stops at contact has no power. The racquet has to finish over the shoulder.</p>\n<p><strong>If they’re struggling:</strong> Walk through each step slowly. Coach calls each cue word.</p>\n<p><strong>If they’ve got it:</strong> Add a balloon or beach ball. They hit the balloon with the same motion.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/tennis-balls-orange/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Orange tennis balls (12-pack) →</a> — slower-bounce balls for learning groundstrokes.</p>\n<p><a href=\"/go/tennis-racquet-junior/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Junior tennis racquet →</a> — HEAD Speed, pre-strung for beginners.</p>\n<p><a href=\"/what-to-buy/tennis/\">Full tennis gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Shadow Forehand","summary":"Practice the forehand swing without a ball. 8 minutes. Ages 5-7.","sport":"tennis","ages":["5-7"],"fundamental":"forehand","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A young child holding a kid-sized tennis racquet, taking the racquet back, stepping forward with the opposite foot, and swinging through to a finish over the shoulder.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Shadow forehand for 5-7 with proper racquet sizing."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/tennis-shadow-forehand-no-ball.md";
				const url = undefined;
				function rawContent() {
					return "\nThe first tennis swing should look right before a ball is involved. Shadow swinging builds the path. Turn, drop, lift, follow. No ball, no pressure. Just the motion.\n\n**What you need:** A youth tennis racquet (19, 21, or 23 inches depending on age). Open space.\n\n**Setup:** Kid in athletic stance with the racquet ready.\n\n**How to run it:**\n\n1. Cue: Turn, Drop, Lift, Follow.\n2. Turn: shoulders rotate, racquet goes back beside the body.\n3. Drop: racquet head drops below the imaginary ball.\n4. Lift: swing forward and up, contacting an imaginary ball at waist height.\n5. Follow: racquet finishes over the opposite shoulder.\n\n**What to watch:** The follow-through. A swing that stops at contact has no power. The racquet has to finish over the shoulder.\n\n**If they're struggling:** Walk through each step slowly. Coach calls each cue word.\n\n**If they've got it:** Add a balloon or beach ball. They hit the balloon with the same motion.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Orange tennis balls (12-pack) →](/go/tennis-balls-orange/) — slower-bounce balls for learning groundstrokes.\n\n[Junior tennis racquet →](/go/tennis-racquet-junior/) — HEAD Speed, pre-strung for beginners.\n\n[Full tennis gear guide →](/what-to-buy/tennis/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
