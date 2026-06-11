globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Running fast starts with the arms. Bent at 90 degrees. Swing forward and back, not across the body. Most kids let their arms flop or cross the chest. Eight minutes of arm swing form fixes the pattern before it becomes a habit.</p>\n<p><strong>What you need:</strong> Open space.</p>\n<p><strong>Setup:</strong> Kid stands in athletic stance, no movement.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Show the position: arms bent at 90 degrees, hands relaxed (not clenched), elbows close to the body.</li>\n<li>Swing the arms forward and back. Hands come from the hip up to chin level on the forward swing.</li>\n<li>Hands stay close to the body. Do NOT cross the chest.</li>\n<li>Do 30 seconds. Rest 15 seconds. Repeat 4 rounds.</li>\n<li>Last round: faster swings, like a sprint pace.</li>\n</ol>\n<p><strong>What to watch:</strong> Cross-body swing. If the hand crosses to the other side of the chest, the arm motion is wasting energy. Forward and back only.</p>\n<p><strong>If they’re struggling:</strong> Slow the tempo. Or have them watch in a mirror.</p>\n<p><strong>If they’ve got it:</strong> Add running. Apply the arm form while jogging in place, then while running forward.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/xc-trainers-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth running trainers →</a> — everyday training shoe for track and XC.</p>\n<p><a href=\"/what-to-buy/track-field/\">Full track field gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Arm Swing Form","summary":"Build the running arm swing without running. 8 minutes. Ages 8-10.","sport":"track-field","ages":["8-10"],"fundamental":"running-form","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Young runner standing in place with arms bent at 90 degrees, swinging the arms forward and back along the body's center line.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Arm-swing form drill with clear cross-body fix."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/track-arm-swing-form.md";
				const url = undefined;
				function rawContent() {
					return "\nRunning fast starts with the arms. Bent at 90 degrees. Swing forward and back, not across the body. Most kids let their arms flop or cross the chest. Eight minutes of arm swing form fixes the pattern before it becomes a habit.\n\n**What you need:** Open space.\n\n**Setup:** Kid stands in athletic stance, no movement.\n\n**How to run it:**\n\n1. Show the position: arms bent at 90 degrees, hands relaxed (not clenched), elbows close to the body.\n2. Swing the arms forward and back. Hands come from the hip up to chin level on the forward swing.\n3. Hands stay close to the body. Do NOT cross the chest.\n4. Do 30 seconds. Rest 15 seconds. Repeat 4 rounds.\n5. Last round: faster swings, like a sprint pace.\n\n**What to watch:** Cross-body swing. If the hand crosses to the other side of the chest, the arm motion is wasting energy. Forward and back only.\n\n**If they're struggling:** Slow the tempo. Or have them watch in a mirror.\n\n**If they've got it:** Add running. Apply the arm form while jogging in place, then while running forward.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth running trainers →](/go/xc-trainers-youth/) — everyday training shoe for track and XC.\n\n[Full track field gear guide →](/what-to-buy/track-field/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
