globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Kicks chain together in real sparring. Single kicks are practice. Sequences are sparring.</p>\n<p><strong>Equipment needed:</strong> A Thai pad or kick shield. A partner to hold.</p>\n<p><strong>Setup:</strong> Student in fighting stance, partner holds the pad at chest height to one side.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li><strong>Kick 1:</strong> Front-leg push kick to the pad.</li>\n<li><strong>Kick 2:</strong> Rear-leg round kick to the same height.</li>\n<li><strong>Kick 3:</strong> Front-leg side kick.</li>\n<li><strong>Kick 4:</strong> Rear-leg back kick (chambered, then extended).</li>\n<li>Reset stance. Ten sequences each leg.</li>\n</ol>\n<p><strong>What to look for:</strong> Each kick chambers (knee comes up) before extending. No swinging straight legs. Hands stay up the whole time.</p>\n<p><strong>Variation:</strong> Partner moves the pad between kicks. Forces the student to adjust angle, not just power.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/resistance-bands-set/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Resistance band set →</a> — for flexibility, mobility, and conditioning work.</p>\n<p><a href=\"/what-to-buy/martial-arts/\">Full martial arts gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Kicking Pad Sequence","summary":"Four kicks in sequence on a held pad. Ten reps each side. Ages 8-12.","sport":"martial-arts","age":"8-10","ages":["8-10","11-12"],"focus":"fundamentals","layer":"skills","fundamental":"stance","progression":"build","illustrationBrief":"A young student kicking a held Thai pad with the instep, leg chambered before extension.","publishedAt":"2026-05-12T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":6,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-12T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Generated as part of the per-sport content baseline. Voice may need a Jeff pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/martial-arts-kicking-pad-sequence.md";
				const url = undefined;
				function rawContent() {
					return "\nKicks chain together in real sparring. Single kicks are practice. Sequences are sparring.\n\n**Equipment needed:** A Thai pad or kick shield. A partner to hold.\n\n**Setup:** Student in fighting stance, partner holds the pad at chest height to one side.\n\n**How to run it:**\n\n1. **Kick 1:** Front-leg push kick to the pad.\n2. **Kick 2:** Rear-leg round kick to the same height.\n3. **Kick 3:** Front-leg side kick.\n4. **Kick 4:** Rear-leg back kick (chambered, then extended).\n5. Reset stance. Ten sequences each leg.\n\n**What to look for:** Each kick chambers (knee comes up) before extending. No swinging straight legs. Hands stay up the whole time.\n\n**Variation:** Partner moves the pad between kicks. Forces the student to adjust angle, not just power.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Resistance band set →](/go/resistance-bands-set/) — for flexibility, mobility, and conditioning work.\n\n[Full martial arts gear guide →](/what-to-buy/martial-arts/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
