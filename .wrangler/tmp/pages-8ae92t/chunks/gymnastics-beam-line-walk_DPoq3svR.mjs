globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Beam is balance plus posture. Build both on the floor before the beam.</p>\n<p><strong>Equipment needed:</strong> Tape or chalk line on the floor (4 inches wide). Or use a low practice beam.</p>\n<p><strong>Setup:</strong> Line down the middle of the floor, about 10 feet long.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Arms in T-position (shoulder-height, out to sides).</li>\n<li>Walk heel-to-toe along the line.</li>\n<li>At the end, turn 180 degrees on one foot. Walk back.</li>\n<li>Two minutes total.</li>\n</ol>\n<p><strong>What to look for:</strong> Eyes look ahead, not down. Shoulders square. Arms steady — no flailing for balance.</p>\n<p><strong>Variation:</strong> Add a half-turn at the midpoint of the line. Builds balance through rotation.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/resistance-bands-set/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Resistance band set →</a> — for conditioning, stretching, and mobility work.</p>\n<p><a href=\"/what-to-buy/gymnastics/\">Full gymnastics gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Beam-Line Walk","summary":"Walk a line on the floor with beam form. Two minutes. Ages 5-10.","sport":"gymnastics","age":"5-7","ages":["5-7","8-10"],"focus":"fundamentals","layer":"foundations","fundamental":"positioning","progression":"intro","illustrationBrief":"A young gymnast walking heel-to-toe along a taped line on the floor, arms out in T-position.","publishedAt":"2026-05-12T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":6,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-12T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Generated as part of the per-sport content baseline. Voice may need a Jeff pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/gymnastics-beam-line-walk.md";
				const url = undefined;
				function rawContent() {
					return "\nBeam is balance plus posture. Build both on the floor before the beam.\n\n**Equipment needed:** Tape or chalk line on the floor (4 inches wide). Or use a low practice beam.\n\n**Setup:** Line down the middle of the floor, about 10 feet long.\n\n**How to run it:**\n\n1. Arms in T-position (shoulder-height, out to sides).\n2. Walk heel-to-toe along the line.\n3. At the end, turn 180 degrees on one foot. Walk back.\n4. Two minutes total.\n\n**What to look for:** Eyes look ahead, not down. Shoulders square. Arms steady — no flailing for balance.\n\n**Variation:** Add a half-turn at the midpoint of the line. Builds balance through rotation.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Resistance band set →](/go/resistance-bands-set/) — for conditioning, stretching, and mobility work.\n\n[Full gymnastics gear guide →](/what-to-buy/gymnastics/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
