globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Laces shots are powerful but harder to control. Kids start with inside foot shots, then progress to laces. This drill walks them up the progression so they learn when and how to use power.</p>\n<p><strong>What you need:</strong> 1 soccer ball per child. A goal or net. 15 feet of space.</p>\n<p><strong>Setup:</strong> Goal is 15 feet away. Child has the ball.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>First 3 shots: inside of the foot. Plant, Lock, Strike, Finish with the inside surface. Accuracy focus.</li>\n<li>Next 3 shots: outside of the foot. Same cue, but using the outside edge. Medium power.</li>\n<li>Final 4 shots: laces. Plant, Lock, Strike, Finish with the laces. Full power.</li>\n<li>Count how many go in at each stage.</li>\n</ol>\n<p><strong>What to watch:</strong> As they progress, does accuracy drop? Power and control are different skills.</p>\n<p><strong>If they’re struggling:</strong> Move closer to 12 feet. Work on the inside foot for longer.</p>\n<p><strong>If they’ve got it:</strong> Move back to 18 feet. Challenge them to use laces from distance.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size4/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 4 soccer ball →</a> — right size for ages 8–12.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Laces Shot Progression","summary":"Build up to shooting with the laces for power. 10 minutes. Ages 8-10.","sport":"soccer","ages":["8-10"],"fundamental":"shooting","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Child's foot striking the ball with the laces, toe pointed down, generating power.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Good progression-style shooting drill. Soccer vocab correct."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-laces-shot-progression.md";
				const url = undefined;
				function rawContent() {
					return "\nLaces shots are powerful but harder to control. Kids start with inside foot shots, then progress to laces. This drill walks them up the progression so they learn when and how to use power.\n\n**What you need:** 1 soccer ball per child. A goal or net. 15 feet of space.\n\n**Setup:** Goal is 15 feet away. Child has the ball.\n\n**How to run it:**\n\n1. First 3 shots: inside of the foot. Plant, Lock, Strike, Finish with the inside surface. Accuracy focus.\n2. Next 3 shots: outside of the foot. Same cue, but using the outside edge. Medium power.\n3. Final 4 shots: laces. Plant, Lock, Strike, Finish with the laces. Full power.\n4. Count how many go in at each stage.\n\n**What to watch:** As they progress, does accuracy drop? Power and control are different skills.\n\n**If they're struggling:** Move closer to 12 feet. Work on the inside foot for longer.\n\n**If they've got it:** Move back to 18 feet. Challenge them to use laces from distance.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 4 soccer ball →](/go/soccer-ball-size4/) — right size for ages 8–12.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
