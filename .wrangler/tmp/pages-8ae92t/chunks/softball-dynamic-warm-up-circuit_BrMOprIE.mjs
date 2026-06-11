globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A dynamic warm-up gets the whole body moving. Leg swings, lunges, arm circles, and light jogging prepare muscles for the demands of softball.</p>\n<p><strong>What you need:</strong> Open field, no equipment, 10+ kids.</p>\n<p><strong>Setup:</strong> Kids in two lines facing each other, 15 feet apart.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Jog from one line to the other (30 feet). No sprinting.</li>\n<li>Arm circles: 10 forward, 10 backward. Both arms at once.</li>\n<li>Leg swings: 10 forward/backward each leg, 10 side-to-side each leg.</li>\n<li>Walking lunges: 10 lunges across the field.</li>\n<li>Carioca (side shuffle): 10 steps right, 10 steps left, walking backward.</li>\n<li>Butt kicks: 20 fast steps bringing heels to glutes.</li>\n<li>High knees: 20 fast steps bringing knees to chest.</li>\n<li>Final jog: one lap around the field at easy pace.</li>\n</ol>\n<p><strong>What to watch:</strong> Are movements smooth or stiff? Stiffness means they need more reps. Are kids jogging or standing? Keep moving.</p>\n<p><strong>If they’re struggling:</strong> Cut the reps in half. Do 5 of each. Focus on good form, not quantity.</p>\n<p><strong>If they’ve got it:</strong> Add more reps. Do 15 of each. Add a sprint finish after the circuit to get the heart rate up.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/softball-glove-11in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth softball glove →</a> — 11-inch fielder’s glove for new players.</p>\n<p><a href=\"/what-to-buy/softball/\">Full softball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Dynamic Warm-Up Circuit","summary":"Full-body warm-up before practice or games. 10 minutes. Ages 5-7, 8-10, and 11-12.","sport":"softball","ages":["5-7","8-10","11-12"],"fundamental":"warm-up","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Group of kids doing leg swings, lunges, arm circles, and jogging in a line across the field.","editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Generic warm-up; fine for the use."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/softball-dynamic-warm-up-circuit.md";
				const url = undefined;
				function rawContent() {
					return "\nA dynamic warm-up gets the whole body moving. Leg swings, lunges, arm circles, and light jogging prepare muscles for the demands of softball.\n\n**What you need:** Open field, no equipment, 10+ kids.\n\n**Setup:** Kids in two lines facing each other, 15 feet apart.\n\n**How to run it:**\n\n1. Jog from one line to the other (30 feet). No sprinting.\n2. Arm circles: 10 forward, 10 backward. Both arms at once.\n3. Leg swings: 10 forward/backward each leg, 10 side-to-side each leg.\n4. Walking lunges: 10 lunges across the field.\n5. Carioca (side shuffle): 10 steps right, 10 steps left, walking backward.\n6. Butt kicks: 20 fast steps bringing heels to glutes.\n7. High knees: 20 fast steps bringing knees to chest.\n8. Final jog: one lap around the field at easy pace.\n\n**What to watch:** Are movements smooth or stiff? Stiffness means they need more reps. Are kids jogging or standing? Keep moving.\n\n**If they're struggling:** Cut the reps in half. Do 5 of each. Focus on good form, not quantity.\n\n**If they've got it:** Add more reps. Do 15 of each. Add a sprint finish after the circuit to get the heart rate up.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth softball glove →](/go/softball-glove-11in/) — 11-inch fielder's glove for new players.\n\n[Full softball gear guide →](/what-to-buy/softball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
