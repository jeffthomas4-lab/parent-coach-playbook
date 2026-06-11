globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Catching and throwing improve together. This drill has kids throw farther each round, which teaches them to throw harder and catch with softer hands.</p>\n<p><strong>Equipment needed:</strong> 20 softballs, a bucket, a wide-open space, four to six kids in pairs.</p>\n<p><strong>Setup:</strong> Pair the kids up. Each pair starts 20 feet apart, facing each other.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Round 1: Throw and catch 5 reps at 20 feet.</li>\n<li>Both take one step back (now 25 feet).</li>\n<li>Round 2: Throw and catch 5 reps at 25 feet.</li>\n<li>Both take another step back (now 30 feet).</li>\n<li>Continue until someone misses or reaches 50 feet.</li>\n</ol>\n<p>Once a pair reaches their max distance, they step back in 5 feet and do a final set of 5 clean reps.</p>\n<p><strong>What to look for:</strong> Catch technique at distance. Soft hands that give way with the ball. Kids who reach for the ball with stiff arms will drop passes.</p>\n<p><strong>Variation:</strong> For younger kids (8-9), start at 15 feet. For older kids (10), add a clock: time each rep and work on throwing and catching quickly as well as far.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/softball-glove-11in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth softball glove →</a> — 11-inch fielder’s glove for new players.</p>\n<p><a href=\"/what-to-buy/softball/\">Full softball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Throw and Catch Ladder","summary":"Two kids throw increasing distances and catch cleanly. 20 minutes. Ages 8-10.","sport":"softball","ages":["8-10"],"focus":"fundamentals","layer":"foundations","fundamental":"throwing","progression":"intro","illustrationBrief":"Distance progression for throwing accuracy","publishedAt":"2026-02-17T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Distance-ladder throwing; soft-hands cue is good."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/softball-throw-and-catch-ladder-ages-8-10.md";
				const url = undefined;
				function rawContent() {
					return "\nCatching and throwing improve together. This drill has kids throw farther each round, which teaches them to throw harder and catch with softer hands.\n\n**Equipment needed:** 20 softballs, a bucket, a wide-open space, four to six kids in pairs.\n\n**Setup:** Pair the kids up. Each pair starts 20 feet apart, facing each other.\n\n**How to run it:**\n\n1. Round 1: Throw and catch 5 reps at 20 feet.\n2. Both take one step back (now 25 feet).\n3. Round 2: Throw and catch 5 reps at 25 feet.\n4. Both take another step back (now 30 feet).\n5. Continue until someone misses or reaches 50 feet.\n\nOnce a pair reaches their max distance, they step back in 5 feet and do a final set of 5 clean reps.\n\n**What to look for:** Catch technique at distance. Soft hands that give way with the ball. Kids who reach for the ball with stiff arms will drop passes.\n\n**Variation:** For younger kids (8-9), start at 15 feet. For older kids (10), add a clock: time each rep and work on throwing and catching quickly as well as far.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth softball glove →](/go/softball-glove-11in/) — 11-inch fielder's glove for new players.\n\n[Full softball gear guide →](/what-to-buy/softball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
