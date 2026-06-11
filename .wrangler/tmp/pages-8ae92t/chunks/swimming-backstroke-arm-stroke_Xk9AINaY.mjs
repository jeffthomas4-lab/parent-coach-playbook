globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Backstroke arms alternate, like freestyle but on the back. One arm reaches behind the head and enters the water pinky-first. The other arm pulls along the body underwater. The body rotates side to side as the arms work.</p>\n<p><strong>What you need:</strong> A pool, lane lines.</p>\n<p><strong>Setup:</strong> Swimmer on back at one end of the pool.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Float on back, kicking gently.</li>\n<li>Reach right arm overhead and into the water pinky-first, behind the head.</li>\n<li>As the right arm pulls underwater, the left arm recovers above the water (straight up and back).</li>\n<li>Continue the alternating motion across the pool.</li>\n<li>Do 4 lengths.</li>\n</ol>\n<p><strong>What to watch:</strong> Arm entry. Pinky-first entry is correct. Thumb-first is wrong (it makes the arm splash and lose power).</p>\n<p><strong>If they’re struggling:</strong> Drop the kick. Just do arms while standing in shallow water.</p>\n<p><strong>If they’ve got it:</strong> Count strokes per length. Goal: fewer strokes (longer pulls).</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/swim-goggles-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth swim goggles →</a> — Speedo Hydrospex, no-fog, fits ages 6–14.</p>\n<p><a href=\"/what-to-buy/swimming/\">Full swimming gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Backstroke Arm Stroke","summary":"Build the alternating arm cycle of backstroke. 12 minutes. Ages 8-10 and 11-12.","sport":"swimming","ages":["8-10","11-12"],"fundamental":"backstroke","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Swimmer on their back with one arm reaching backward into the water, the other arm completing a pull underwater, body rotating with each stroke.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Backstroke arm cycle with pinky-first cue; uses 'length' correctly."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/swimming-backstroke-arm-stroke.md";
				const url = undefined;
				function rawContent() {
					return "\nBackstroke arms alternate, like freestyle but on the back. One arm reaches behind the head and enters the water pinky-first. The other arm pulls along the body underwater. The body rotates side to side as the arms work.\n\n**What you need:** A pool, lane lines.\n\n**Setup:** Swimmer on back at one end of the pool.\n\n**How to run it:**\n\n1. Float on back, kicking gently.\n2. Reach right arm overhead and into the water pinky-first, behind the head.\n3. As the right arm pulls underwater, the left arm recovers above the water (straight up and back).\n4. Continue the alternating motion across the pool.\n5. Do 4 lengths.\n\n**What to watch:** Arm entry. Pinky-first entry is correct. Thumb-first is wrong (it makes the arm splash and lose power).\n\n**If they're struggling:** Drop the kick. Just do arms while standing in shallow water.\n\n**If they've got it:** Count strokes per length. Goal: fewer strokes (longer pulls).\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth swim goggles →](/go/swim-goggles-youth/) — Speedo Hydrospex, no-fog, fits ages 6–14.\n\n[Full swimming gear guide →](/what-to-buy/swimming/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
