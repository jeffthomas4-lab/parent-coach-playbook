globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Defense in lacrosse starts with stick position. The stick goes in the attacker’s passing lane. The body stays between the attacker and the goal. Most kids try to swing the stick at the ball. That’s a foul. Smart defenders stay positioned.</p>\n<p><strong>What you need:</strong> Sticks, full gear, two players.</p>\n<p><strong>Setup:</strong> Attacker with the ball in the cradle. Defender 5 feet away.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Attacker walks toward the goal at half speed.</li>\n<li>Defender backpedals, stick held in front of the body, head of the stick at the attacker’s chest level.</li>\n<li>Defender shuffles laterally to mirror the attacker.</li>\n<li>No swinging at the ball. Just stick position.</li>\n<li>Continue for 30 seconds. Reset. 4 rounds.</li>\n</ol>\n<p><strong>What to watch:</strong> Where the defender’s stick is. If it’s at the attacker’s hip or knee, it’s not in the passing lane. Stick at chest level is the position.</p>\n<p><strong>If they’re struggling:</strong> Slower attacker. Drop the cradle and just have the attacker walk forward with the stick.</p>\n<p><strong>If they’ve got it:</strong> Allow stick-checks (poke checks only, not slap checks at this age).</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/lacrosse-ball/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Lacrosse balls (6-pack) →</a> — NOCSAE-stamped practice balls.</p>\n<p><a href=\"/go/lacrosse-starter-kit-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">STX Stallion complete stick →</a> — beginner stick for first-season players.</p>\n<p><a href=\"/what-to-buy/lacrosse-girls/\">Full lacrosse (girls) gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Stick Position Defense","summary":"Defender keeps the stick between the attacker and the goal. 10 minutes. Ages 8-10 and 11-12.","sport":"lacrosse-girls","ages":["8-10","11-12"],"fundamental":"defending","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Defender shadowing an attacker, with the stick held in front of the body in the attacker's passing lane, eyes on the attacker's chest.","editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Defense by stick position; no body contact described."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/lacrosse-girls-stick-position-defense.md";
				const url = undefined;
				function rawContent() {
					return "\nDefense in lacrosse starts with stick position. The stick goes in the attacker's passing lane. The body stays between the attacker and the goal. Most kids try to swing the stick at the ball. That's a foul. Smart defenders stay positioned.\n\n**What you need:** Sticks, full gear, two players.\n\n**Setup:** Attacker with the ball in the cradle. Defender 5 feet away.\n\n**How to run it:**\n\n1. Attacker walks toward the goal at half speed.\n2. Defender backpedals, stick held in front of the body, head of the stick at the attacker's chest level.\n3. Defender shuffles laterally to mirror the attacker.\n4. No swinging at the ball. Just stick position.\n5. Continue for 30 seconds. Reset. 4 rounds.\n\n**What to watch:** Where the defender's stick is. If it's at the attacker's hip or knee, it's not in the passing lane. Stick at chest level is the position.\n\n**If they're struggling:** Slower attacker. Drop the cradle and just have the attacker walk forward with the stick.\n\n**If they've got it:** Allow stick-checks (poke checks only, not slap checks at this age).\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Lacrosse balls (6-pack) →](/go/lacrosse-ball/) — NOCSAE-stamped practice balls.\n\n[STX Stallion complete stick →](/go/lacrosse-starter-kit-youth/) — beginner stick for first-season players.\n\n[Full lacrosse (girls) gear guide →](/what-to-buy/lacrosse-girls/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
