globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Most breaststrokers rush the glide. The result is a slow stroke. The right move is a long glide where the body shoots forward through the water with no work. This drill teaches the kid to wait for the glide.</p>\n<p><strong>What you need:</strong> A pool.</p>\n<p><strong>Setup:</strong> Swimmer at one end.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>One pull, one kick, one glide. Repeat.</li>\n<li>The glide phase: hands together overhead, body in streamline, no movement. Hold for 2 seconds.</li>\n<li>After 2 seconds, start the next pull.</li>\n<li>Do 4 lengths with rest.</li>\n<li>Count cycles per length. Fewer cycles means longer glides.</li>\n</ol>\n<p><strong>What to watch:</strong> The glide hold. If the swimmer immediately starts the next pull, the glide is too short. Hold for the full 2 seconds.</p>\n<p><strong>If they’re struggling:</strong> Use a kickboard for the glide phase. Build the timing first.</p>\n<p><strong>If they’ve got it:</strong> Goal: 4 strokes per 25 feet. Or 6 strokes per 50 feet.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/swim-goggles-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth swim goggles →</a> — Speedo Hydrospex, no-fog, fits ages 6–14.</p>\n<p><a href=\"/what-to-buy/swimming/\">Full swimming gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Breaststroke Pull and Glide","summary":"Long glide phase between breaststroke pulls. 12 minutes. Ages 11-12.","sport":"swimming","ages":["11-12"],"fundamental":"breaststroke","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Swimmer in streamline glide position after a pull, body fully extended, hands together overhead, kick completed.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Glide-emphasis drill with 2-second hold."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/swimming-breaststroke-pull-glide.md";
				const url = undefined;
				function rawContent() {
					return "\nMost breaststrokers rush the glide. The result is a slow stroke. The right move is a long glide where the body shoots forward through the water with no work. This drill teaches the kid to wait for the glide.\n\n**What you need:** A pool.\n\n**Setup:** Swimmer at one end.\n\n**How to run it:**\n\n1. One pull, one kick, one glide. Repeat.\n2. The glide phase: hands together overhead, body in streamline, no movement. Hold for 2 seconds.\n3. After 2 seconds, start the next pull.\n4. Do 4 lengths with rest.\n5. Count cycles per length. Fewer cycles means longer glides.\n\n**What to watch:** The glide hold. If the swimmer immediately starts the next pull, the glide is too short. Hold for the full 2 seconds.\n\n**If they're struggling:** Use a kickboard for the glide phase. Build the timing first.\n\n**If they've got it:** Goal: 4 strokes per 25 feet. Or 6 strokes per 50 feet.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth swim goggles →](/go/swim-goggles-youth/) — Speedo Hydrospex, no-fog, fits ages 6–14.\n\n[Full swimming gear guide →](/what-to-buy/swimming/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
