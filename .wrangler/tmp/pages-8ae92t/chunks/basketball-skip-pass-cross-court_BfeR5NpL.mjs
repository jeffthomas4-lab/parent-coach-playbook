globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The skip pass goes over a defender to hit a teammate on the opposite wing. It’s a high-level passing skill. This drill teaches the arc and the distance.</p>\n<p><strong>What you need:</strong> Basketball. Three kids per rep. Half-court.</p>\n<p><strong>Setup:</strong> Three kids stand in a triangle. Two on the same baseline (A and B, 15 feet apart), and C on the opposite baseline.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>A has the ball. B stands between A and C passively (no pressure).</li>\n<li>A throws a skip pass high over B’s head to C.</li>\n<li>The ball travels in an arc and lands at C at chest height.</li>\n<li>C returns a skip pass back to A, over B.</li>\n<li>Do 8 skip passes. Rest. Rotate so each kid gets reps as the passer.</li>\n</ol>\n<p><strong>What to watch:</strong> Is the pass going high enough to clear the middle player? And does it arrive at the right height to the receiver? Too high is easier than too low.</p>\n<p><strong>If they’re struggling:</strong> Use a bigger, softer ball. Reduce the distance. Have B move further away so the pass is easier.</p>\n<p><strong>If they’ve got it:</strong> Add a defender who plays soft pressure on B. The skip passer must time the pass and throw it before the defender can cut it off.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Skip Pass Cross Court","summary":"Pass over one person to reach another player cross-court. 9 minutes. Ages 11-12.","sport":"basketball","ages":["11-12"],"fundamental":"passing","progression":"refine","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A player passing over a defender to reach a teammate on the opposite side of the court.","editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Skip pass drill, sport language correct. Triangle setup is clear."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-skip-pass-cross-court.md";
				const url = undefined;
				function rawContent() {
					return "\nThe skip pass goes over a defender to hit a teammate on the opposite wing. It's a high-level passing skill. This drill teaches the arc and the distance.\n\n**What you need:** Basketball. Three kids per rep. Half-court.\n\n**Setup:** Three kids stand in a triangle. Two on the same baseline (A and B, 15 feet apart), and C on the opposite baseline.\n\n**How to run it:**\n\n1. A has the ball. B stands between A and C passively (no pressure).\n2. A throws a skip pass high over B's head to C.\n3. The ball travels in an arc and lands at C at chest height.\n4. C returns a skip pass back to A, over B.\n5. Do 8 skip passes. Rest. Rotate so each kid gets reps as the passer.\n\n**What to watch:** Is the pass going high enough to clear the middle player? And does it arrive at the right height to the receiver? Too high is easier than too low.\n\n**If they're struggling:** Use a bigger, softer ball. Reduce the distance. Have B move further away so the pass is easier.\n\n**If they've got it:** Add a defender who plays soft pressure on B. The skip passer must time the pass and throw it before the defender can cut it off.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
