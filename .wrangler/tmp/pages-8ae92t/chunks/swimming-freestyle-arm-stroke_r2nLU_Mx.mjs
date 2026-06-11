globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Freestyle arms work in alternating cycles. One arm pulls underwater while the other recovers above water with a high elbow. The pattern creates continuous propulsion. Most kids learn the kick first; this drill adds the arms.</p>\n<p><strong>What you need:</strong> A pool with a shallow or medium-depth lane.</p>\n<p><strong>Setup:</strong> Swimmer in the water, body horizontal.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Swim a length of freestyle (25 feet) at slow pace.</li>\n<li>Focus on the recovering arm: high elbow above the water, hand close to the surface.</li>\n<li>Focus on the pulling arm: enter the water in front of the head, pull straight back to the hip.</li>\n<li>Do 4 lengths with rest between.</li>\n<li>Last length: count strokes per length. Goal is fewer strokes (longer pull).</li>\n</ol>\n<p><strong>What to watch:</strong> Elbow on the recovery. Many kids swing the arm out to the side. The elbow should stay high, hand close to the water.</p>\n<p><strong>If they’re struggling:</strong> Drop the kick and just do arms while standing. Or do arms with a pull buoy between the legs.</p>\n<p><strong>If they’ve got it:</strong> Add bilateral breathing (breathe every 3 strokes, alternating sides).</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/swim-goggles-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth swim goggles →</a> — Speedo Hydrospex, no-fog, fits ages 6–14.</p>\n<p><a href=\"/what-to-buy/swimming/\">Full swimming gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Freestyle Arm Stroke","summary":"Build the over-the-water arm cycle of freestyle. 12 minutes. Ages 8-10.","sport":"swimming","ages":["8-10"],"fundamental":"freestyle","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Swimmer reaching one arm forward in the water while the other arm recovers high above the water, elbow bent.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Freestyle arm stroke with high-elbow cue and lengths counted."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/swimming-freestyle-arm-stroke.md";
				const url = undefined;
				function rawContent() {
					return "\nFreestyle arms work in alternating cycles. One arm pulls underwater while the other recovers above water with a high elbow. The pattern creates continuous propulsion. Most kids learn the kick first; this drill adds the arms.\n\n**What you need:** A pool with a shallow or medium-depth lane.\n\n**Setup:** Swimmer in the water, body horizontal.\n\n**How to run it:**\n\n1. Swim a length of freestyle (25 feet) at slow pace.\n2. Focus on the recovering arm: high elbow above the water, hand close to the surface.\n3. Focus on the pulling arm: enter the water in front of the head, pull straight back to the hip.\n4. Do 4 lengths with rest between.\n5. Last length: count strokes per length. Goal is fewer strokes (longer pull).\n\n**What to watch:** Elbow on the recovery. Many kids swing the arm out to the side. The elbow should stay high, hand close to the water.\n\n**If they're struggling:** Drop the kick and just do arms while standing. Or do arms with a pull buoy between the legs.\n\n**If they've got it:** Add bilateral breathing (breathe every 3 strokes, alternating sides).\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth swim goggles →](/go/swim-goggles-youth/) — Speedo Hydrospex, no-fog, fits ages 6–14.\n\n[Full swimming gear guide →](/what-to-buy/swimming/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
