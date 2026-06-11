globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Mirroring teaches the defender to react to the attacker’s movement instead of guessing. If the attacker moves left, the defender moves left. Simple copy-cat.</p>\n<p><strong>What you need:</strong> 1 soccer ball, 2 kids, 20 feet of space.</p>\n<p><strong>Setup:</strong> Attacker has the ball. Defender is 5 feet away, facing the attacker directly.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Attacker dribbles left using Touch, Look, Push, Go. Small touches to the left.</li>\n<li>Defender mirrors the movement, stepping left at the same pace.</li>\n<li>Attacker dribbles right. Defender mirrors right.</li>\n<li>Attacker pushes the ball forward. Defender doesn’t tackle, just stays between them and goal.</li>\n<li>30 seconds of continuous mirroring, then switch roles.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the defender keep facing the attacker? Or turn their hips away?</p>\n<p><strong>If they’re struggling:</strong> Slow the attacker’s movement. Let the defender react without rushing.</p>\n<p><strong>If they’ve got it:</strong> Attacker moves faster. Defender has to work to keep up.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size3/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 3 soccer ball →</a> — right size for ages 5–7.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Mirror the Attacker","summary":"Defender mirrors attacker's movement, staying directly between them and the goal. 8 minutes. Ages 5-7.","sport":"soccer","ages":["5-7"],"fundamental":"defending","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Defender copying the attacker's sideways movement, keeping their body facing them.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Age-appropriate intro defending drill. Soccer vocab correct."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-mirror-the-attacker.md";
				const url = undefined;
				function rawContent() {
					return "\nMirroring teaches the defender to react to the attacker's movement instead of guessing. If the attacker moves left, the defender moves left. Simple copy-cat.\n\n**What you need:** 1 soccer ball, 2 kids, 20 feet of space.\n\n**Setup:** Attacker has the ball. Defender is 5 feet away, facing the attacker directly.\n\n**How to run it:**\n\n1. Attacker dribbles left using Touch, Look, Push, Go. Small touches to the left.\n2. Defender mirrors the movement, stepping left at the same pace.\n3. Attacker dribbles right. Defender mirrors right.\n4. Attacker pushes the ball forward. Defender doesn't tackle, just stays between them and goal.\n5. 30 seconds of continuous mirroring, then switch roles.\n\n**What to watch:** Does the defender keep facing the attacker? Or turn their hips away?\n\n**If they're struggling:** Slow the attacker's movement. Let the defender react without rushing.\n\n**If they've got it:** Attacker moves faster. Defender has to work to keep up.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 3 soccer ball →](/go/soccer-ball-size3/) — right size for ages 5–7.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
