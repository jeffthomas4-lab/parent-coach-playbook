globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Most kids breathe to one side only. That creates an uneven stroke. Bilateral breathing (both sides) balances the body and tracks straight. Hard at first, easier with practice. By 11-12, kids can build this habit.</p>\n<p><strong>What you need:</strong> A pool, lane lines.</p>\n<p><strong>Setup:</strong> Swimmer at one end of the pool.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Swim a length of freestyle.</li>\n<li>Breathe every 3 strokes. First breath to the right, next to the left, next to the right, etc.</li>\n<li>Don’t break the stroke pattern. The breath happens during the rotation of the body.</li>\n<li>Do 4 lengths with rest between.</li>\n<li>Last length: count strokes and breaths.</li>\n</ol>\n<p><strong>What to watch:</strong> The non-dominant side breath. Most kids tilt the head too far on the weaker side, which makes them sink. Roll the body with the breath, don’t lift the head.</p>\n<p><strong>If they’re struggling:</strong> Breathe every 2 strokes (only to one side) for one length, then switch sides for the next length. Build to bilateral.</p>\n<p><strong>If they’ve got it:</strong> Every 5 strokes (longer hold between breaths). Or breathe every 3 with a streamline kick on the other side.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/swim-goggles-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth swim goggles →</a> — Speedo Hydrospex, no-fog, fits ages 6–14.</p>\n<p><a href=\"/what-to-buy/swimming/\">Full swimming gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Freestyle Bilateral Breathing","summary":"Breathe to both sides during freestyle swimming. 12 minutes. Ages 11-12.","sport":"swimming","ages":["11-12"],"fundamental":"freestyle","progression":"refine","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Swimmer turning the head to breathe during freestyle, alternating sides every three strokes, body rolling with each breath.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Bilateral breathing every 3 strokes; uses correct vocab."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/swimming-freestyle-bilateral-breathing.md";
				const url = undefined;
				function rawContent() {
					return "\nMost kids breathe to one side only. That creates an uneven stroke. Bilateral breathing (both sides) balances the body and tracks straight. Hard at first, easier with practice. By 11-12, kids can build this habit.\n\n**What you need:** A pool, lane lines.\n\n**Setup:** Swimmer at one end of the pool.\n\n**How to run it:**\n\n1. Swim a length of freestyle.\n2. Breathe every 3 strokes. First breath to the right, next to the left, next to the right, etc.\n3. Don't break the stroke pattern. The breath happens during the rotation of the body.\n4. Do 4 lengths with rest between.\n5. Last length: count strokes and breaths.\n\n**What to watch:** The non-dominant side breath. Most kids tilt the head too far on the weaker side, which makes them sink. Roll the body with the breath, don't lift the head.\n\n**If they're struggling:** Breathe every 2 strokes (only to one side) for one length, then switch sides for the next length. Build to bilateral.\n\n**If they've got it:** Every 5 strokes (longer hold between breaths). Or breathe every 3 with a streamline kick on the other side.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth swim goggles →](/go/swim-goggles-youth/) — Speedo Hydrospex, no-fog, fits ages 6–14.\n\n[Full swimming gear guide →](/what-to-buy/swimming/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
