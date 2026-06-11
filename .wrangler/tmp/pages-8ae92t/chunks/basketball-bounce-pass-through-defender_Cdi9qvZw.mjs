globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>When a defender guards tightly, the bounce pass gets through where air passes can’t. This drill teaches the angle and timing under pressure.</p>\n<p><strong>What you need:</strong> Basketball. Three kids per rep. Half-court.</p>\n<p><strong>Setup:</strong> Three kids stand in a line. A and C are 12 feet apart. B (the defender) stands between them, 5 feet from A.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>A has the ball. B plays soft defense, hands high.</li>\n<li>A bounces a pass from their hip down and through B’s legs or under B’s hands to C.</li>\n<li>The bounce point is low and forward so it passes through the defender’s space.</li>\n<li>C catches and returns with a bounce pass.</li>\n<li>Do 8 bounce passes through the defender. Rest. Rotate roles.</li>\n</ol>\n<p><strong>What to watch:</strong> Is A bouncing it at a point that’s actually between the passer and receiver? Or is it bouncing at B’s feet? The angle and distance determine success.</p>\n<p><strong>If they’re struggling:</strong> Have B play at 25% pressure instead of 50%. Reduce the distance to 10 feet. Use a bigger ball.</p>\n<p><strong>If they’ve got it:</strong> B plays at 75% effort with hands in the passer’s face. Add game-like pressure.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Bounce Pass Through Defender","summary":"Bounce pass around a defender's hands to your teammate. 9 minutes. Ages 11-12.","sport":"basketball","ages":["11-12"],"fundamental":"passing","progression":"refine","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A player bouncing a basketball past an outstretched defender's hands to reach a teammate.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Graduated defender pressure tiers (25/50/75%) make the progression clear."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-bounce-pass-through-defender.md";
				const url = undefined;
				function rawContent() {
					return "\nWhen a defender guards tightly, the bounce pass gets through where air passes can't. This drill teaches the angle and timing under pressure.\n\n**What you need:** Basketball. Three kids per rep. Half-court.\n\n**Setup:** Three kids stand in a line. A and C are 12 feet apart. B (the defender) stands between them, 5 feet from A.\n\n**How to run it:**\n\n1. A has the ball. B plays soft defense, hands high.\n2. A bounces a pass from their hip down and through B's legs or under B's hands to C.\n3. The bounce point is low and forward so it passes through the defender's space.\n4. C catches and returns with a bounce pass.\n5. Do 8 bounce passes through the defender. Rest. Rotate roles.\n\n**What to watch:** Is A bouncing it at a point that's actually between the passer and receiver? Or is it bouncing at B's feet? The angle and distance determine success.\n\n**If they're struggling:** Have B play at 25% pressure instead of 50%. Reduce the distance to 10 feet. Use a bigger ball.\n\n**If they've got it:** B plays at 75% effort with hands in the passer's face. Add game-like pressure.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
