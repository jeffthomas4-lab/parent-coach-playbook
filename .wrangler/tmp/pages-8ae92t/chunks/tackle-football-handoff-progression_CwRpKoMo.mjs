globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A clean handoff needs timing and trust. The QB places the ball into the running back’s hands. The running back keeps their eyes forward, not looking back at the QB.</p>\n<p><strong>What you need:</strong> One football. Open grass or field.</p>\n<p><strong>Setup:</strong> Pair the kids. One is the QB, one is the running back. Line them up at a starting point.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>The QB holds the ball in front of their body. The RB runs beside them or slightly ahead.</li>\n<li>The QB places the ball into the RB’s hands. The RB doesn’t reach back or turn around. Eyes forward.</li>\n<li>Once the RB has the ball, they keep running.</li>\n<li>Start walking through it slowly. Do 5 reps.</li>\n<li>Then do it jogging. Do 5 reps. Finally, do it at a controlled sprint. Do 5 reps.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the RB look back at the QB or keep their eyes forward? Eyes forward the whole time. They trust the QB to put it in their hands.</p>\n<p><strong>If they’re struggling:</strong> Have them stand still first. QB hands off to RB while stationary. Get the grip and placement right first.</p>\n<p><strong>If they’ve got it:</strong> Add a defender approaching from the side. The QB has to get the ball off before the defender arrives.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/football-rubber-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber football →</a> — Wilson youth rubber ball for rec and practice.</p>\n<p><a href=\"/what-to-buy/football/\">Full football gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Handoff Progression","summary":"Exchange the ball smoothly between QB and running back. 10 minutes. Ages 8-10.","sport":"football","ages":["8-10"],"fundamental":"ball-carrying","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A QB placing the ball into the hands of a running back, both moving downhill together.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Walk-through-to-sprint progression for QB-RB exchange. No contact."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/tackle-football-handoff-progression.md";
				const url = undefined;
				function rawContent() {
					return "\nA clean handoff needs timing and trust. The QB places the ball into the running back's hands. The running back keeps their eyes forward, not looking back at the QB.\n\n**What you need:** One football. Open grass or field.\n\n**Setup:** Pair the kids. One is the QB, one is the running back. Line them up at a starting point.\n\n**How to run it:**\n\n1. The QB holds the ball in front of their body. The RB runs beside them or slightly ahead.\n2. The QB places the ball into the RB's hands. The RB doesn't reach back or turn around. Eyes forward.\n3. Once the RB has the ball, they keep running.\n4. Start walking through it slowly. Do 5 reps.\n5. Then do it jogging. Do 5 reps. Finally, do it at a controlled sprint. Do 5 reps.\n\n**What to watch:** Does the RB look back at the QB or keep their eyes forward? Eyes forward the whole time. They trust the QB to put it in their hands.\n\n**If they're struggling:** Have them stand still first. QB hands off to RB while stationary. Get the grip and placement right first.\n\n**If they've got it:** Add a defender approaching from the side. The QB has to get the ball off before the defender arrives.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber football →](/go/football-rubber-youth/) — Wilson youth rubber ball for rec and practice.\n\n[Full football gear guide →](/what-to-buy/football/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
