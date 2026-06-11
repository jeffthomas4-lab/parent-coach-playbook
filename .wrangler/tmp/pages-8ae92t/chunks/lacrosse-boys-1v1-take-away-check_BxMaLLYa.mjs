globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A poke check is the legal way to take the ball from an attacker. Stick goes out, head taps the attacker’s stick, ball pops loose. This is the move that creates turnovers. Practice it under control before allowing it in games.</p>\n<p><strong>What you need:</strong> Sticks, ball, full gear, two players.</p>\n<p><strong>Setup:</strong> Attacker with the ball. Defender 5 feet away. Open ground.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Attacker dodges and cradles forward.</li>\n<li>Defender stays in front, mirrors, watches the stick.</li>\n<li>When the attacker exposes the stick (head out from the body), defender extends the stick and pokes the head with the bottom of the stick.</li>\n<li>Ball comes loose. Whoever scoops first wins.</li>\n<li>Do 6 reps. Switch roles.</li>\n</ol>\n<p><strong>What to watch:</strong> The check. Poke check (straight extension) is legal. Slap check (a hit motion) is not legal at this age. Straight stick out, poke, retract.</p>\n<p><strong>If they’re struggling:</strong> Slow the attacker. Or drop the contact and just practice the stick extension.</p>\n<p><strong>If they’ve got it:</strong> Add a goal. The drill becomes a 1v1 where the defender tries to strip and the attacker tries to score.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/lacrosse-ball/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Lacrosse balls (6-pack) →</a> — NOCSAE-stamped practice balls.</p>\n<p><a href=\"/go/lacrosse-starter-kit-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">STX Stallion complete stick →</a> — shaft and head combo for new players.</p>\n<p><a href=\"/what-to-buy/lacrosse-boys/\">Full lacrosse (boys) gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"1v1 Take Away Check","summary":"Defender uses a stick check to dislodge the ball. 12 minutes. Ages 11-12.","sport":"lacrosse-boys","ages":["11-12"],"fundamental":"defending","progression":"refine","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Defender extending the stick to poke-check the head of the attacker's stick, ball coming loose from the cradle.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Fixed sport-vocab slip: 'dribbles' changed to 'cradles' in step 1."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/lacrosse-boys-1v1-take-away-check.md";
				const url = undefined;
				function rawContent() {
					return "\nA poke check is the legal way to take the ball from an attacker. Stick goes out, head taps the attacker's stick, ball pops loose. This is the move that creates turnovers. Practice it under control before allowing it in games.\n\n**What you need:** Sticks, ball, full gear, two players.\n\n**Setup:** Attacker with the ball. Defender 5 feet away. Open ground.\n\n**How to run it:**\n\n1. Attacker dodges and cradles forward.\n2. Defender stays in front, mirrors, watches the stick.\n3. When the attacker exposes the stick (head out from the body), defender extends the stick and pokes the head with the bottom of the stick.\n4. Ball comes loose. Whoever scoops first wins.\n5. Do 6 reps. Switch roles.\n\n**What to watch:** The check. Poke check (straight extension) is legal. Slap check (a hit motion) is not legal at this age. Straight stick out, poke, retract.\n\n**If they're struggling:** Slow the attacker. Or drop the contact and just practice the stick extension.\n\n**If they've got it:** Add a goal. The drill becomes a 1v1 where the defender tries to strip and the attacker tries to score.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Lacrosse balls (6-pack) →](/go/lacrosse-ball/) — NOCSAE-stamped practice balls.\n\n[STX Stallion complete stick →](/go/lacrosse-starter-kit-youth/) — shaft and head combo for new players.\n\n[Full lacrosse (boys) gear guide →](/what-to-buy/lacrosse-boys/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
