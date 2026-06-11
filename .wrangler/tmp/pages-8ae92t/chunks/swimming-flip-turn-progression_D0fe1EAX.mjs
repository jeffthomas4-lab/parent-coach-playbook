globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A flip turn is faster than touching and turning. The swimmer somersaults forward, plants feet on the wall, pushes off underwater. Hard to learn. Once mastered, every length is faster and the kid swims like a real competitive swimmer.</p>\n<p><strong>What you need:</strong> A pool with a flat wall.</p>\n<p><strong>Setup:</strong> Swimmer 10 feet from the wall.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Practice a forward roll in the middle of the pool first. Tuck head and knees. Roll over.</li>\n<li>Once comfortable, swim toward the wall. At 4 feet from the wall, tuck and roll.</li>\n<li>Feet plant on the wall. Push off in streamline (arms overhead, body rotated to the front).</li>\n<li>Glide for 5 yards underwater, then surface and continue swimming.</li>\n<li>Do 6 turns. Each one a little better.</li>\n</ol>\n<p><strong>What to watch:</strong> Foot plant. The feet have to land on the wall flat (not toes only or heels only). Flat plant gives the strongest push.</p>\n<p><strong>If they’re struggling:</strong> Skip the wall. Just practice forward rolls in the middle of the pool.</p>\n<p><strong>If they’ve got it:</strong> Time the turn. From 4 feet before the wall to fully extended push off should be under 2 seconds.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/swim-goggles-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth swim goggles →</a> — Speedo Hydrospex, no-fog, fits ages 6–14.</p>\n<p><a href=\"/what-to-buy/swimming/\">Full swimming gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Flip Turn Progression","summary":"Build the freestyle flip turn at the wall. 15 minutes. Ages 11-12.","sport":"swimming","ages":["11-12"],"fundamental":"turns","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Swimmer approaching the wall, ducking the head and tucking into a forward roll, feet planting on the wall, then pushing off in streamline.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":true,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Flip turn at the wall; sensitive flag for head-near-wall injury risk."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/swimming-flip-turn-progression.md";
				const url = undefined;
				function rawContent() {
					return "\nA flip turn is faster than touching and turning. The swimmer somersaults forward, plants feet on the wall, pushes off underwater. Hard to learn. Once mastered, every length is faster and the kid swims like a real competitive swimmer.\n\n**What you need:** A pool with a flat wall.\n\n**Setup:** Swimmer 10 feet from the wall.\n\n**How to run it:**\n\n1. Practice a forward roll in the middle of the pool first. Tuck head and knees. Roll over.\n2. Once comfortable, swim toward the wall. At 4 feet from the wall, tuck and roll.\n3. Feet plant on the wall. Push off in streamline (arms overhead, body rotated to the front).\n4. Glide for 5 yards underwater, then surface and continue swimming.\n5. Do 6 turns. Each one a little better.\n\n**What to watch:** Foot plant. The feet have to land on the wall flat (not toes only or heels only). Flat plant gives the strongest push.\n\n**If they're struggling:** Skip the wall. Just practice forward rolls in the middle of the pool.\n\n**If they've got it:** Time the turn. From 4 feet before the wall to fully extended push off should be under 2 seconds.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth swim goggles →](/go/swim-goggles-youth/) — Speedo Hydrospex, no-fog, fits ages 6–14.\n\n[Full swimming gear guide →](/what-to-buy/swimming/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
