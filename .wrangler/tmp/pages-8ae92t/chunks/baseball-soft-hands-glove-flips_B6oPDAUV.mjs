globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Kids who slap at the ball with the glove make it bounce out. Soft hands means the glove gives a little when the ball lands, like an egg landing in your palm. The opposite is “hard hands” where the glove stays stiff and the ball pops away.</p>\n<p><strong>What you need:</strong> A glove and 5 tennis balls.</p>\n<p><strong>Setup:</strong> Stand 4 feet from the kid. They face you with the glove open at chest height.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Eyes, Hands, Squeeze, Pull. Today the focus is Pull.</li>\n<li>Drop a ball into their glove from 1 foot above. Don’t throw. Just drop.</li>\n<li>They squeeze when the ball lands and pull the glove softly into the chest.</li>\n<li>Do 5 drops. Then take a step back and toss the ball gently from 6 feet.</li>\n<li>Last 5: regular tosses from 8 feet. Same soft pull.</li>\n</ol>\n<p><strong>What to watch:</strong> What happens after the ball lands. If the glove stays out front and stiff, the ball bounces away. If the glove pulls in toward the chest, the ball is secure.</p>\n<p><strong>If they’re struggling:</strong> Use a marshmallow or a soft sponge ball. Even softer landings.</p>\n<p><strong>If they’ve got it:</strong> Throw a little harder. Or throw slightly off-center so they have to reach and still pull soft.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Soft Hands","summary":"Catch the ball without snapping the glove shut too hard. 10 minutes. T-ball and ages 5-7.","sport":"baseball","ages":["t-ball","5-7"],"fundamental":"catching","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Adult holding a tennis ball in front of a child whose glove is open and steady, ready to receive without flinching.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":9,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-soft-hands-glove-flips.md";
				const url = undefined;
				function rawContent() {
					return "\nKids who slap at the ball with the glove make it bounce out. Soft hands means the glove gives a little when the ball lands, like an egg landing in your palm. The opposite is \"hard hands\" where the glove stays stiff and the ball pops away.\n\n**What you need:** A glove and 5 tennis balls.\n\n**Setup:** Stand 4 feet from the kid. They face you with the glove open at chest height.\n\n**How to run it:**\n\n1. Cue: Eyes, Hands, Squeeze, Pull. Today the focus is Pull.\n2. Drop a ball into their glove from 1 foot above. Don't throw. Just drop.\n3. They squeeze when the ball lands and pull the glove softly into the chest.\n4. Do 5 drops. Then take a step back and toss the ball gently from 6 feet.\n5. Last 5: regular tosses from 8 feet. Same soft pull.\n\n**What to watch:** What happens after the ball lands. If the glove stays out front and stiff, the ball bounces away. If the glove pulls in toward the chest, the ball is secure.\n\n**If they're struggling:** Use a marshmallow or a soft sponge ball. Even softer landings.\n\n**If they've got it:** Throw a little harder. Or throw slightly off-center so they have to reach and still pull soft.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
