globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Pitching starts with one foot on the rubber and ends with a throw. Between is the most important part: the balance position, where the front knee is lifted and the body is balanced over the back leg. If the kid can’t hold the balance, every pitch will be off.</p>\n<p><strong>What you need:</strong> A pitching mound or a flat marker for the rubber. No ball needed for first reps.</p>\n<p><strong>Setup:</strong> Kid stands with the throwing-side foot on the rubber, glove-side foot in front and to the side.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Set, Lift, Stride, Throw. Today the focus is Set and Lift.</li>\n<li>Set: feet together, foot on the rubber, hands together at the chest.</li>\n<li>Lift: the front knee comes up to belt height or higher. Body stays balanced over the back leg. Hold for 3 seconds.</li>\n<li>Reset. Do 10 reps of Set and Lift.</li>\n<li>Last 5: hold the balance for 5 seconds each. The longer the hold, the harder it is.</li>\n</ol>\n<p><strong>What to watch:</strong> Is the kid leaning forward or backward during the Lift? Balance means the body stays straight over the back leg. If they’re falling, they have no platform to throw from.</p>\n<p><strong>If they’re struggling:</strong> Lower the front knee to thigh height. Or hold a wall for balance during the Lift.</p>\n<p><strong>If they’ve got it:</strong> Add the Stride. Lift, then stride out (front foot lands toward home plate). Hold the stride landing for 3 seconds before resetting.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Pitching Stance Balance","summary":"Hold the balance position with the front knee up. 10 minutes. Ages 8-10.","sport":"baseball","ages":["8-10"],"fundamental":"pitching","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Young pitcher on a mound with the front knee lifted high, body balanced over the back leg, glove and ball held together in front of the chest.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":9,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-pitching-stance-balance.md";
				const url = undefined;
				function rawContent() {
					return "\nPitching starts with one foot on the rubber and ends with a throw. Between is the most important part: the balance position, where the front knee is lifted and the body is balanced over the back leg. If the kid can't hold the balance, every pitch will be off.\n\n**What you need:** A pitching mound or a flat marker for the rubber. No ball needed for first reps.\n\n**Setup:** Kid stands with the throwing-side foot on the rubber, glove-side foot in front and to the side.\n\n**How to run it:**\n\n1. Cue: Set, Lift, Stride, Throw. Today the focus is Set and Lift.\n2. Set: feet together, foot on the rubber, hands together at the chest.\n3. Lift: the front knee comes up to belt height or higher. Body stays balanced over the back leg. Hold for 3 seconds.\n4. Reset. Do 10 reps of Set and Lift.\n5. Last 5: hold the balance for 5 seconds each. The longer the hold, the harder it is.\n\n**What to watch:** Is the kid leaning forward or backward during the Lift? Balance means the body stays straight over the back leg. If they're falling, they have no platform to throw from.\n\n**If they're struggling:** Lower the front knee to thigh height. Or hold a wall for balance during the Lift.\n\n**If they've got it:** Add the Stride. Lift, then stride out (front foot lands toward home plate). Hold the stride landing for 3 seconds before resetting.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
