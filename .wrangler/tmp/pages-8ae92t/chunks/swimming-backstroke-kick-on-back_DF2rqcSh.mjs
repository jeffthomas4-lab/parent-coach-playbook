globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The backstroke kick is the freestyle kick upside down. Same flutter, same straight legs, just on the back. This drill builds the float position and the kick at the same time.</p>\n<p><strong>What you need:</strong> A pool, shallow end.</p>\n<p><strong>Setup:</strong> Kid floating on their back in the shallow end, arms either at sides or extended overhead.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Float on the back. Eyes look up at the ceiling. Hips up, head back.</li>\n<li>Flutter kick from the hips. Toes pointed. Small, fast kicks.</li>\n<li>Arms either at sides (easier) or in streamline overhead (harder).</li>\n<li>Kick a length (25 feet).</li>\n<li>Rest. Do 4 trips.</li>\n</ol>\n<p><strong>What to watch:</strong> Body position. If the hips drop, the kid is sitting in the water. Hips up, body horizontal.</p>\n<p><strong>If they’re struggling:</strong> Hold the wall and just kick. Or use a kickboard on the chest.</p>\n<p><strong>If they’ve got it:</strong> Streamline arms overhead. Or count kicks per length to develop rhythm.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/swim-goggles-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth swim goggles →</a> — Speedo Hydrospex, no-fog, fits ages 6–14.</p>\n<p><a href=\"/what-to-buy/swimming/\">Full swimming gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Backstroke Kick on Back","summary":"Kick on the back with arms streamlined or at the sides. 10 minutes. Ages 5-7 and 8-10.","sport":"swimming","ages":["5-7","8-10"],"fundamental":"backstroke","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Young swimmer floating on their back with arms at the sides or extended overhead, flutter kicking from the hips, looking up at the ceiling.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Backstroke kick on back; clear hip-up cue."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/swimming-backstroke-kick-on-back.md";
				const url = undefined;
				function rawContent() {
					return "\nThe backstroke kick is the freestyle kick upside down. Same flutter, same straight legs, just on the back. This drill builds the float position and the kick at the same time.\n\n**What you need:** A pool, shallow end.\n\n**Setup:** Kid floating on their back in the shallow end, arms either at sides or extended overhead.\n\n**How to run it:**\n\n1. Float on the back. Eyes look up at the ceiling. Hips up, head back.\n2. Flutter kick from the hips. Toes pointed. Small, fast kicks.\n3. Arms either at sides (easier) or in streamline overhead (harder).\n4. Kick a length (25 feet).\n5. Rest. Do 4 trips.\n\n**What to watch:** Body position. If the hips drop, the kid is sitting in the water. Hips up, body horizontal.\n\n**If they're struggling:** Hold the wall and just kick. Or use a kickboard on the chest.\n\n**If they've got it:** Streamline arms overhead. Or count kicks per length to develop rhythm.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth swim goggles →](/go/swim-goggles-youth/) — Speedo Hydrospex, no-fog, fits ages 6–14.\n\n[Full swimming gear guide →](/what-to-buy/swimming/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
