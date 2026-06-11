globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Two-ball dribbling breaks the habit of looking down at the ball and builds independent hand control. Each hand has its own job. The balls bounce at the same time.</p>\n<p><strong>What you need:</strong> Two basketballs per kid. Flat court. Plenty of space so balls don’t hit anyone.</p>\n<p><strong>Setup:</strong> Kids spread out 6 feet apart. Stand facing a wall so bouncing balls don’t roll away.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Hold one ball in each hand. Low stance. Knees bent.</li>\n<li>Push both balls down at the same time. They bounce back up together.</li>\n<li>Do 20 bounces in rhythm. Count out loud.</li>\n<li>Rest 30 seconds.</li>\n<li>Do 3 rounds of 20 bounces.</li>\n</ol>\n<p><strong>What to watch:</strong> Are the two balls bouncing in sync or is one higher or lower than the other? Same height means same push force. If one ball bounces higher, that side pushed harder.</p>\n<p><strong>If they’re struggling:</strong> Do 10 bounces instead of 20. Stand closer to the wall. Use a softer ball in one hand so it’s easier to match the rhythm.</p>\n<p><strong>If they’ve got it:</strong> Walk forward 5 steps while dribbling two balls. Keep them in sync. Then walk back. This builds hand independence while moving.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Two Ball Dribble","summary":"Dribble two basketballs at once in place. 6 minutes. Ages 8-10.","sport":"basketball","ages":["8-10"],"fundamental":"dribbling","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A child bouncing two basketballs simultaneously, one in each hand, standing with low stance and bent knees.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean two-ball drill, sport language correct."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-two-ball-dribble.md";
				const url = undefined;
				function rawContent() {
					return "\nTwo-ball dribbling breaks the habit of looking down at the ball and builds independent hand control. Each hand has its own job. The balls bounce at the same time.\n\n**What you need:** Two basketballs per kid. Flat court. Plenty of space so balls don't hit anyone.\n\n**Setup:** Kids spread out 6 feet apart. Stand facing a wall so bouncing balls don't roll away.\n\n**How to run it:**\n\n1. Hold one ball in each hand. Low stance. Knees bent.\n2. Push both balls down at the same time. They bounce back up together.\n3. Do 20 bounces in rhythm. Count out loud.\n4. Rest 30 seconds.\n5. Do 3 rounds of 20 bounces.\n\n**What to watch:** Are the two balls bouncing in sync or is one higher or lower than the other? Same height means same push force. If one ball bounces higher, that side pushed harder.\n\n**If they're struggling:** Do 10 bounces instead of 20. Stand closer to the wall. Use a softer ball in one hand so it's easier to match the rhythm.\n\n**If they've got it:** Walk forward 5 steps while dribbling two balls. Keep them in sync. Then walk back. This builds hand independence while moving.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
