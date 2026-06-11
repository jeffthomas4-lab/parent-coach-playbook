globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The bent-leg slide is the safest slide for youth. One leg bends underneath the body, the other extends to the base. Hands stay up so they’re not stepped on.</p>\n<p><strong>What you need:</strong> A base, a mat or padding, 10 kids.</p>\n<p><strong>Setup:</strong> Base with mat or padding. Kids in a line at home.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Start on grass without the base. Teach the motion first.</li>\n<li>Run, then drop to one knee (back leg bent). Front leg extends toward the base.</li>\n<li>Hands come up to chest level. Head stays up.</li>\n<li>Do 5 practice slides on grass with no base. Focus on the motion.</li>\n<li>Now add the base and mat. Do 5 more slides, aiming the extended leg at the base.</li>\n</ol>\n<p><strong>What to watch:</strong> Do the hands stay up or go down? Up is safer. Does the back leg bend or both legs extend? Back leg bent is the correct form.</p>\n<p><strong>If they’re struggling:</strong> Do just the drop and extend on grass with no base. Practice the position first.</p>\n<p><strong>If they’ve got it:</strong> Add a fielder with the ball. Runner slides and the fielder practices the tag.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/softball-glove-11in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth softball glove →</a> — 11-inch fielder’s glove for new players.</p>\n<p><a href=\"/what-to-buy/softball/\">Full softball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Bent Leg Slide","summary":"Slide into bases safely with the bent-leg technique. 12 minutes. Ages 11-12.","sport":"softball","ages":["11-12"],"fundamental":"base-running","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player sliding into a base with one leg bent underneath and the other extended, arms up for balance.","editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":true,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Sliding flagged sensitive (contact/injury). Cues are correct."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/softball-bent-leg-slide.md";
				const url = undefined;
				function rawContent() {
					return "\nThe bent-leg slide is the safest slide for youth. One leg bends underneath the body, the other extends to the base. Hands stay up so they're not stepped on.\n\n**What you need:** A base, a mat or padding, 10 kids.\n\n**Setup:** Base with mat or padding. Kids in a line at home.\n\n**How to run it:**\n\n1. Start on grass without the base. Teach the motion first.\n2. Run, then drop to one knee (back leg bent). Front leg extends toward the base.\n3. Hands come up to chest level. Head stays up.\n4. Do 5 practice slides on grass with no base. Focus on the motion.\n5. Now add the base and mat. Do 5 more slides, aiming the extended leg at the base.\n\n**What to watch:** Do the hands stay up or go down? Up is safer. Does the back leg bend or both legs extend? Back leg bent is the correct form.\n\n**If they're struggling:** Do just the drop and extend on grass with no base. Practice the position first.\n\n**If they've got it:** Add a fielder with the ball. Runner slides and the fielder practices the tag.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth softball glove →](/go/softball-glove-11in/) — 11-inch fielder's glove for new players.\n\n[Full softball gear guide →](/what-to-buy/softball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
