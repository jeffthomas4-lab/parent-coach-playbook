globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The bow-in isn’t ceremony. It’s the switch from playground to dojo. Sixty seconds of focus before anything else.</p>\n<p><strong>Equipment needed:</strong> The mat.</p>\n<p><strong>Setup:</strong> Students line up in rows by belt rank.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Instructor bows to the students. Students bow back.</li>\n<li>Everyone closes their eyes for ten seconds. Quiet breathing.</li>\n<li>Open eyes. Instructor names one focus for the day in one sentence.</li>\n<li>Students repeat it back together.</li>\n<li>Begin class.</li>\n</ol>\n<p><strong>What to look for:</strong> Stillness during the eye-closed part. Younger kids will fidget — that’s fine the first month, less fine the second. Focus is trainable.</p>\n<p><strong>Variation:</strong> Have one student lead the bow-in once a month. Builds leadership and shows them what the instructor sees.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/resistance-bands-set/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Resistance band set →</a> — for flexibility, mobility, and conditioning work.</p>\n<p><a href=\"/what-to-buy/martial-arts/\">Full martial arts gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Bow-In Routine","summary":"Start every class with a 60-second bow-in. Builds focus. Ages 5-10.","sport":"martial-arts","age":"5-7","ages":["5-7","8-10"],"focus":"culture","layer":"foundations","fundamental":"warm-up","progression":"intro","illustrationBrief":"A row of young students bowing in unison at the start of a martial arts class.","publishedAt":"2026-05-12T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":6,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-12T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Generated as part of the per-sport content baseline. Voice may need a Jeff pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/martial-arts-bow-in-routine.md";
				const url = undefined;
				function rawContent() {
					return "\nThe bow-in isn't ceremony. It's the switch from playground to dojo. Sixty seconds of focus before anything else.\n\n**Equipment needed:** The mat.\n\n**Setup:** Students line up in rows by belt rank.\n\n**How to run it:**\n\n1. Instructor bows to the students. Students bow back.\n2. Everyone closes their eyes for ten seconds. Quiet breathing.\n3. Open eyes. Instructor names one focus for the day in one sentence.\n4. Students repeat it back together.\n5. Begin class.\n\n**What to look for:** Stillness during the eye-closed part. Younger kids will fidget — that's fine the first month, less fine the second. Focus is trainable.\n\n**Variation:** Have one student lead the bow-in once a month. Builds leadership and shows them what the instructor sees.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Resistance band set →](/go/resistance-bands-set/) — for flexibility, mobility, and conditioning work.\n\n[Full martial arts gear guide →](/what-to-buy/martial-arts/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
