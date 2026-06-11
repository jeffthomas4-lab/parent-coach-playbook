globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>USTA’s orange ball is sized right for 8-10 year olds. Lower bounce, slower speed. The bounce feed gives the kid a predictable ball to hit. They can focus on the swing without worrying about timing.</p>\n<p><strong>What you need:</strong> Orange tennis balls (USTA Stage 2), youth racquet (23-25 inches), 60-foot court (orange ball court).</p>\n<p><strong>Setup:</strong> Kid on the baseline. Coach across the net in the service box with a basket of balls.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Turn, Drop, Lift, Follow.</li>\n<li>Coach bounces the ball gently into the kid’s strike zone.</li>\n<li>Kid steps forward, turns shoulders, drops the racquet, lifts through the ball.</li>\n<li>Ball clears the net into the open court.</li>\n<li>Do 10 forehands. Reset between each.</li>\n</ol>\n<p><strong>What to watch:</strong> Contact point. The ball should be hit in front of the body, not beside or behind. Step into the ball.</p>\n<p><strong>If they’re struggling:</strong> Slower bounces. Or use a red ball (foam) with even less bounce.</p>\n<p><strong>If they’ve got it:</strong> Move to a green ball (Stage 1, full court). Or hit 5 in a row to a target zone.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/tennis-balls-orange/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Orange tennis balls (12-pack) →</a> — slower-bounce balls for learning groundstrokes.</p>\n<p><a href=\"/go/tennis-net/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Portable tennis net →</a> — Boulder foldable net, adjusts to regulation height.</p>\n<p><a href=\"/what-to-buy/tennis/\">Full tennis gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Forehand from Bounce Feed","summary":"Hit forehands from a coach's underhand bounce feed. 12 minutes. Ages 8-10.","sport":"tennis","ages":["8-10"],"fundamental":"forehand","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Coach feeding an orange tennis ball with a bounce, child stepping forward and hitting a forehand over the net.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Orange-ball forehand drill with USTA stage cited; clean."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/tennis-forehand-from-bounce-feed.md";
				const url = undefined;
				function rawContent() {
					return "\nUSTA's orange ball is sized right for 8-10 year olds. Lower bounce, slower speed. The bounce feed gives the kid a predictable ball to hit. They can focus on the swing without worrying about timing.\n\n**What you need:** Orange tennis balls (USTA Stage 2), youth racquet (23-25 inches), 60-foot court (orange ball court).\n\n**Setup:** Kid on the baseline. Coach across the net in the service box with a basket of balls.\n\n**How to run it:**\n\n1. Cue: Turn, Drop, Lift, Follow.\n2. Coach bounces the ball gently into the kid's strike zone.\n3. Kid steps forward, turns shoulders, drops the racquet, lifts through the ball.\n4. Ball clears the net into the open court.\n5. Do 10 forehands. Reset between each.\n\n**What to watch:** Contact point. The ball should be hit in front of the body, not beside or behind. Step into the ball.\n\n**If they're struggling:** Slower bounces. Or use a red ball (foam) with even less bounce.\n\n**If they've got it:** Move to a green ball (Stage 1, full court). Or hit 5 in a row to a target zone.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Orange tennis balls (12-pack) →](/go/tennis-balls-orange/) — slower-bounce balls for learning groundstrokes.\n\n[Portable tennis net →](/go/tennis-net/) — Boulder foldable net, adjusts to regulation height.\n\n[Full tennis gear guide →](/what-to-buy/tennis/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
