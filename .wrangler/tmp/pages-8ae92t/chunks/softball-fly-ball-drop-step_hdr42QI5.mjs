globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Fly balls require a different footwork pattern than grounders. The drop step gets the fielder moving backward efficiently so they can track the ball.</p>\n<p><strong>What you need:</strong> 15 softballs (12”), a partner 20 feet away, open space to run.</p>\n<p><strong>Setup:</strong> Fielder and partner stand 20 feet apart with space to move backward.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Partner throws a high fly ball that the fielder must track and move back to catch.</li>\n<li>Fielder uses the drop step: first step back is with the foot nearest the ball’s direction.</li>\n<li>They Eyes on the ball the whole time. Both Hands reach. Catch overhead.</li>\n<li>Do 5 fly balls straight ahead. Rest.</li>\n<li>Do 5 to the left. Do 5 to the right. Emphasize that the drop step is always toward the ball.</li>\n</ol>\n<p><strong>What to watch:</strong> Do they turn their body sideways and run? Or drop-step and keep their eyes on the ball? Eyes first, feet follow.</p>\n<p><strong>If they’re struggling:</strong> Start 12 feet away. Throw shorter fly balls that don’t require much running.</p>\n<p><strong>If they’ve got it:</strong> Throw deeper fly balls 10 to 15 feet back. Mix fly balls with grounders so they stay sharp.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/softball-glove-11in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth softball glove →</a> — 11-inch fielder’s glove for new players.</p>\n<p><a href=\"/what-to-buy/softball/\">Full softball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Fly Ball Drop Step","summary":"Back up and catch a fly ball overhead. 12 minutes. Ages 8-10 and 11-12.","sport":"softball","ages":["8-10","11-12"],"fundamental":"fielding","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player dropping back and running, watching a fly ball above them, glove raised overhead.","editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Drop-step fundamentals; sport language clean. Changed soft baseballs to softballs."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/softball-fly-ball-drop-step.md";
				const url = undefined;
				function rawContent() {
					return "\nFly balls require a different footwork pattern than grounders. The drop step gets the fielder moving backward efficiently so they can track the ball.\n\n**What you need:** 15 softballs (12\"), a partner 20 feet away, open space to run.\n\n**Setup:** Fielder and partner stand 20 feet apart with space to move backward.\n\n**How to run it:**\n\n1. Partner throws a high fly ball that the fielder must track and move back to catch.\n2. Fielder uses the drop step: first step back is with the foot nearest the ball's direction.\n3. They Eyes on the ball the whole time. Both Hands reach. Catch overhead.\n4. Do 5 fly balls straight ahead. Rest.\n5. Do 5 to the left. Do 5 to the right. Emphasize that the drop step is always toward the ball.\n\n**What to watch:** Do they turn their body sideways and run? Or drop-step and keep their eyes on the ball? Eyes first, feet follow.\n\n**If they're struggling:** Start 12 feet away. Throw shorter fly balls that don't require much running.\n\n**If they've got it:** Throw deeper fly balls 10 to 15 feet back. Mix fly balls with grounders so they stay sharp.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth softball glove →](/go/softball-glove-11in/) — 11-inch fielder's glove for new players.\n\n[Full softball gear guide →](/what-to-buy/softball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
