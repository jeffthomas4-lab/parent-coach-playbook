globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Most rebounds at this age go to the kid who jumps highest. That stops working at 11. Boxing out beats jumping when both kids know what they’re doing. Teach it now and they’ll have the habit.</p>\n<p><strong>What you need:</strong> A hoop, a basketball, two players.</p>\n<p><strong>Setup:</strong> Coach stands at the free throw line with the ball. One player is the shooter (the coach’s stand-in for now). One player is the defender, one is the offensive rebounder.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Coach shoots a missed shot off the rim.</li>\n<li>Defender turns toward the offensive player, gets low, butt back, arms wide. Body between the offensive player and the rim.</li>\n<li>Defender holds the box-out for two seconds before going for the ball.</li>\n<li>Reset. Switch roles.</li>\n<li>Do 6 reps each side.</li>\n</ol>\n<p><strong>What to watch:</strong> Are the arms wide and the butt low? A standing-up box-out gives the offensive player a path around. Low and wide is the seal.</p>\n<p><strong>If they’re struggling:</strong> Skip the rebound. Just practice the seal position and hold for 3 seconds.</p>\n<p><strong>If they’ve got it:</strong> Add a second offensive player. The defender has to choose which side to seal.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Box Out Stance","summary":"Get the body between the rim and the opponent. 10 minutes. Ages 8-10.","sport":"basketball","ages":["8-10"],"fundamental":"rebounding","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Two players near the rim, one with arms wide and butt low, sealing the other from the basket as the ball comes off the rim.","editorial":{"qualityGrade":9,"originalityGrade":8,"voiceGrade":9,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Lead has temperature: 'jumping stops working at 11.' Strong opener."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-box-out-stance.md";
				const url = undefined;
				function rawContent() {
					return "\nMost rebounds at this age go to the kid who jumps highest. That stops working at 11. Boxing out beats jumping when both kids know what they're doing. Teach it now and they'll have the habit.\n\n**What you need:** A hoop, a basketball, two players.\n\n**Setup:** Coach stands at the free throw line with the ball. One player is the shooter (the coach's stand-in for now). One player is the defender, one is the offensive rebounder.\n\n**How to run it:**\n\n1. Coach shoots a missed shot off the rim.\n2. Defender turns toward the offensive player, gets low, butt back, arms wide. Body between the offensive player and the rim.\n3. Defender holds the box-out for two seconds before going for the ball.\n4. Reset. Switch roles.\n5. Do 6 reps each side.\n\n**What to watch:** Are the arms wide and the butt low? A standing-up box-out gives the offensive player a path around. Low and wide is the seal.\n\n**If they're struggling:** Skip the rebound. Just practice the seal position and hold for 3 seconds.\n\n**If they've got it:** Add a second offensive player. The defender has to choose which side to seal.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
