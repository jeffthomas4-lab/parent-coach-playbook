globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Breaststroke is the most technical stroke. Frog kick. Sweep arm pull. Glide. The kick and arms have to work in alternating rhythm: pull-kick-glide. This drill builds each piece separately, then combines them.</p>\n<p><strong>What you need:</strong> A pool, kickboard, optional pull buoy.</p>\n<p><strong>Setup:</strong> Swimmer in the shallow end.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Kick only with kickboard: frog kick. Legs out wide, then snap together. Glide. Repeat.</li>\n<li>Pull only with pull buoy: arms sweep out wide, then in toward the chest, then forward to streamline. Glide.</li>\n<li>Combine: pull, kick, glide. The pull starts. The kick happens during the glide. Long glide between cycles.</li>\n<li>Do 4 lengths with rest.</li>\n<li>Focus on the glide. A short glide means rushed timing.</li>\n</ol>\n<p><strong>What to watch:</strong> The frog kick. The legs have to come out wide and snap back together (like a frog’s legs). Bicycle kicks don’t generate power.</p>\n<p><strong>If they’re struggling:</strong> Just do the kick on a kickboard. Build the kick before adding arms.</p>\n<p><strong>If they’ve got it:</strong> Time the lengths. Or add a flip turn at the end.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/swim-goggles-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth swim goggles →</a> — Speedo Hydrospex, no-fog, fits ages 6–14.</p>\n<p><a href=\"/what-to-buy/swimming/\">Full swimming gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Breaststroke Kick and Pull","summary":"Build the breaststroke kick and arm pull separately, then combine. 12 minutes. Ages 8-10.","sport":"swimming","ages":["8-10"],"fundamental":"breaststroke","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Swimmer demonstrating the breaststroke frog kick (legs out, in, glide) and the arm pull (sweep out, in, forward).","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Breaststroke separated kick-pull-glide build."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/swimming-breaststroke-kick-pull.md";
				const url = undefined;
				function rawContent() {
					return "\nBreaststroke is the most technical stroke. Frog kick. Sweep arm pull. Glide. The kick and arms have to work in alternating rhythm: pull-kick-glide. This drill builds each piece separately, then combines them.\n\n**What you need:** A pool, kickboard, optional pull buoy.\n\n**Setup:** Swimmer in the shallow end.\n\n**How to run it:**\n\n1. Kick only with kickboard: frog kick. Legs out wide, then snap together. Glide. Repeat.\n2. Pull only with pull buoy: arms sweep out wide, then in toward the chest, then forward to streamline. Glide.\n3. Combine: pull, kick, glide. The pull starts. The kick happens during the glide. Long glide between cycles.\n4. Do 4 lengths with rest.\n5. Focus on the glide. A short glide means rushed timing.\n\n**What to watch:** The frog kick. The legs have to come out wide and snap back together (like a frog's legs). Bicycle kicks don't generate power.\n\n**If they're struggling:** Just do the kick on a kickboard. Build the kick before adding arms.\n\n**If they've got it:** Time the lengths. Or add a flip turn at the end.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth swim goggles →](/go/swim-goggles-youth/) — Speedo Hydrospex, no-fog, fits ages 6–14.\n\n[Full swimming gear guide →](/what-to-buy/swimming/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
