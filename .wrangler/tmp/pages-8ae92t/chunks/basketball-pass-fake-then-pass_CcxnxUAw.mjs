globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A pass fake makes a defender move the wrong way. This opens up the real pass. This drill teaches the separation between the fake and the real pass.</p>\n<p><strong>What you need:</strong> Basketball. One ball, two kids per pair. Open space.</p>\n<p><strong>Setup:</strong> Partners stand 15 feet apart facing each other.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Player A holds the ball. Player B stands facing them passively (no defense yet).</li>\n<li>A fakes a chest pass to the right by starting the motion then stopping.</li>\n<li>A immediately chest passes to the left.</li>\n<li>B catches and returns it.</li>\n<li>Do 10 passes with fakes. Rest. Switch roles. Do 10 more.</li>\n</ol>\n<p><strong>What to watch:</strong> Do they fully commit to the fake or does it look half-hearted? The fake must look real so the defender (or in this case, the partner’s eyes) follows it.</p>\n<p><strong>If they’re struggling:</strong> Use bigger, slower fakes. Have B close their eyes on the fake so A doesn’t have to sell it as hard.</p>\n<p><strong>If they’ve got it:</strong> Add a passive defender. B plays soft defense. A must use the fake to create space for the pass.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Pass Fake Then Pass","summary":"Fake a pass one direction then pass another. 8 minutes. Ages 8-10.","sport":"basketball","ages":["8-10"],"fundamental":"passing","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A young player holding a basketball, making a passing motion one way while keeping the ball, then turning to pass the other direction.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Sell-the-fake cue lands."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-pass-fake-then-pass.md";
				const url = undefined;
				function rawContent() {
					return "\nA pass fake makes a defender move the wrong way. This opens up the real pass. This drill teaches the separation between the fake and the real pass.\n\n**What you need:** Basketball. One ball, two kids per pair. Open space.\n\n**Setup:** Partners stand 15 feet apart facing each other.\n\n**How to run it:**\n\n1. Player A holds the ball. Player B stands facing them passively (no defense yet).\n2. A fakes a chest pass to the right by starting the motion then stopping.\n3. A immediately chest passes to the left.\n4. B catches and returns it.\n5. Do 10 passes with fakes. Rest. Switch roles. Do 10 more.\n\n**What to watch:** Do they fully commit to the fake or does it look half-hearted? The fake must look real so the defender (or in this case, the partner's eyes) follows it.\n\n**If they're struggling:** Use bigger, slower fakes. Have B close their eyes on the fake so A doesn't have to sell it as hard.\n\n**If they've got it:** Add a passive defender. B plays soft defense. A must use the fake to create space for the pass.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
