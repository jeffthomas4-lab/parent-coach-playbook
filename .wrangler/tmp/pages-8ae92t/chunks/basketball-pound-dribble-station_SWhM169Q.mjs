globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A kid can’t dribble down the court until they can control a ball bouncing in place. This drill is just that. Low ball, low stance, eyes wherever they want right now.</p>\n<p><strong>What you need:</strong> 8-foot basket. Youth ball. One ball per kid. Flat court.</p>\n<p><strong>Setup:</strong> Each kid stands in their own space about 3 feet from a wall or baseline.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Show them: low stance, knees bent, ball in front of you waist-high.</li>\n<li>Push the ball down hard. Don’t slap it. Let it bounce back up to your chest.</li>\n<li>They pound 20 times. Count out loud. Then rest.</li>\n<li>Do 3 rounds of 20.</li>\n<li>Second round, they go down deeper into their legs and push harder.</li>\n</ol>\n<p><strong>What to watch:</strong> Are they using one hand to control the bounce, or two? One hand only. The other hand is for balance.</p>\n<p><strong>If they’re struggling:</strong> Use a softer ball. Have them bounce standing against the wall for support. Do 10 bounces instead of 20.</p>\n<p><strong>If they’ve got it:</strong> Have them close their eyes for 5 bounces. Then open. This trains feel instead of sight.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Pound Dribble Station","summary":"Bounce the ball hard in one spot. 5 minutes. Ages 5-7.","sport":"basketball","ages":["5-7"],"fundamental":"dribbling","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A young child bouncing a basketball hard on the ground with both feet planted, ball returning to chest height.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Foundation drill for U7; eyes-closed variation is a nice touch."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-pound-dribble-station.md";
				const url = undefined;
				function rawContent() {
					return "\nA kid can't dribble down the court until they can control a ball bouncing in place. This drill is just that. Low ball, low stance, eyes wherever they want right now.\n\n**What you need:** 8-foot basket. Youth ball. One ball per kid. Flat court.\n\n**Setup:** Each kid stands in their own space about 3 feet from a wall or baseline.\n\n**How to run it:**\n\n1. Show them: low stance, knees bent, ball in front of you waist-high.\n2. Push the ball down hard. Don't slap it. Let it bounce back up to your chest.\n3. They pound 20 times. Count out loud. Then rest.\n4. Do 3 rounds of 20.\n5. Second round, they go down deeper into their legs and push harder.\n\n**What to watch:** Are they using one hand to control the bounce, or two? One hand only. The other hand is for balance.\n\n**If they're struggling:** Use a softer ball. Have them bounce standing against the wall for support. Do 10 bounces instead of 20.\n\n**If they've got it:** Have them close their eyes for 5 bounces. Then open. This trains feel instead of sight.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
