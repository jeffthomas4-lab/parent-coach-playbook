globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>At this age, defenders can try tackles. The key is timing. A tackle too early gives the attacker space. A tackle too late is beaten. This drill teaches the rhythm of a clean tackle.</p>\n<p><strong>What you need:</strong> 1 soccer ball, 2 kids, a marked area, 20 feet of space.</p>\n<p><strong>Setup:</strong> Attacker dribbles toward the defender from 20 feet away. Defender is set at the end line.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Attacker dribbles forward using Touch, Look, Push, Go.</li>\n<li>Defender waits for the attacker to commit to a direction using Drop, Show, Stay, Win.</li>\n<li>When the attacker’s weight is on their outside foot, the defender steps in and extends their leg.</li>\n<li>Defender contacts the ball and wins it cleanly.</li>\n<li>4 attempts per player, then switch.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the defender wait for the right moment? Or jump in too early?</p>\n<p><strong>If they’re struggling:</strong> Attacker moves slower. Defender has more time to read the moment.</p>\n<p><strong>If they’ve got it:</strong> Attacker attacks at game speed. Defender has to react in real time.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size4/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 4 soccer ball →</a> — right size for ages 8–12.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Step and Tackle","summary":"Defender times a tackle to win the ball on the ground. 10 minutes. Ages 11-12.","sport":"soccer","ages":["11-12"],"fundamental":"defending","progression":"refine","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Defender timing a tackle, extending their leg to contact the ball while staying balanced.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Tackle-timing read on outside foot is a real coaching point."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-step-and-tackle.md";
				const url = undefined;
				function rawContent() {
					return "\nAt this age, defenders can try tackles. The key is timing. A tackle too early gives the attacker space. A tackle too late is beaten. This drill teaches the rhythm of a clean tackle.\n\n**What you need:** 1 soccer ball, 2 kids, a marked area, 20 feet of space.\n\n**Setup:** Attacker dribbles toward the defender from 20 feet away. Defender is set at the end line.\n\n**How to run it:**\n\n1. Attacker dribbles forward using Touch, Look, Push, Go.\n2. Defender waits for the attacker to commit to a direction using Drop, Show, Stay, Win.\n3. When the attacker's weight is on their outside foot, the defender steps in and extends their leg.\n4. Defender contacts the ball and wins it cleanly.\n5. 4 attempts per player, then switch.\n\n**What to watch:** Does the defender wait for the right moment? Or jump in too early?\n\n**If they're struggling:** Attacker moves slower. Defender has more time to read the moment.\n\n**If they've got it:** Attacker attacks at game speed. Defender has to react in real time.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 4 soccer ball →](/go/soccer-ball-size4/) — right size for ages 8–12.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
