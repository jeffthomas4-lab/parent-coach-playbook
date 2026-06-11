globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Footwork is more important than punches at every belt level. The box drills the basics.</p>\n<p><strong>Equipment needed:</strong> Four cones in a 5-foot square.</p>\n<p><strong>Setup:</strong> Student starts at one corner in fighting stance.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Move forward to the next corner. Lead foot first, back foot follows.</li>\n<li>Side-step to the next corner. Don’t cross feet.</li>\n<li>Move backward to the next corner. Back foot first.</li>\n<li>Side-step back to start.</li>\n<li>Repeat four laps.</li>\n</ol>\n<p><strong>What to look for:</strong> Hands stay up. Feet stay shoulder-width. The stance should look the same at every corner.</p>\n<p><strong>Variation:</strong> Add a strike at each corner — jab at corner one, cross at corner two, hook at corner three, kick at corner four. Combines mobility with attack.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/resistance-bands-set/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Resistance band set →</a> — for flexibility, mobility, and conditioning work.</p>\n<p><a href=\"/what-to-buy/martial-arts/\">Full martial arts gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Footwork Box","summary":"Move around a square of four cones. Forward, side, back, side. Ages 8-14.","sport":"martial-arts","age":"8-10","ages":["8-10","11-12","13-14"],"focus":"fundamentals","layer":"foundations","fundamental":"footwork","progression":"intro","illustrationBrief":"A young student moving in a square pattern around four cones in fighting stance.","publishedAt":"2026-05-12T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":6,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-12T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Generated as part of the per-sport content baseline. Voice may need a Jeff pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/martial-arts-footwork-box.md";
				const url = undefined;
				function rawContent() {
					return "\nFootwork is more important than punches at every belt level. The box drills the basics.\n\n**Equipment needed:** Four cones in a 5-foot square.\n\n**Setup:** Student starts at one corner in fighting stance.\n\n**How to run it:**\n\n1. Move forward to the next corner. Lead foot first, back foot follows.\n2. Side-step to the next corner. Don't cross feet.\n3. Move backward to the next corner. Back foot first.\n4. Side-step back to start.\n5. Repeat four laps.\n\n**What to look for:** Hands stay up. Feet stay shoulder-width. The stance should look the same at every corner.\n\n**Variation:** Add a strike at each corner — jab at corner one, cross at corner two, hook at corner three, kick at corner four. Combines mobility with attack.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Resistance band set →](/go/resistance-bands-set/) — for flexibility, mobility, and conditioning work.\n\n[Full martial arts gear guide →](/what-to-buy/martial-arts/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
