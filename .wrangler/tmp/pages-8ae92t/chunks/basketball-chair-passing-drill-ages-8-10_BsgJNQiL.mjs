globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>This drill teaches spacing and passing without the complexity of defense. Kids learn to find open teammates and pass on time.</p>\n<p><strong>Equipment needed:</strong> Four chairs, one basketball, 5-6 kids.</p>\n<p><strong>Setup:</strong> Arrange four chairs in a square, about 10 feet apart. One kid is the passer in the middle. Four kids stand next to a chair.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Passer throws the ball to the kid at chair 1. That kid passes back.</li>\n<li>Passer immediately throws to the kid at chair 2. That kid passes back.</li>\n<li>Continue around all four chairs, alternating.</li>\n<li>After one full rotation, a kid from the circle goes to the middle and the passer goes to a chair.</li>\n<li>Do this for 20 minutes, rotating all kids through the passer position.</li>\n</ol>\n<p><strong>What to look for:</strong> Passing accuracy and quick hands. The passer should be making a new pass the moment they receive one back.</p>\n<p><strong>If they’re struggling:</strong> Move the chairs closer (6 feet apart). Slow the rotation so the passer has time to set their feet between passes.</p>\n<p><strong>If they’ve got it:</strong> Add a defender in the middle who tries to deflect passes. Or have the chair kids cut to a new chair after each pass to add movement.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Chair Passing Drill","summary":"Pass around chairs to work spacing and cutting. 20 minutes. Ages 8-10.","sport":"basketball","ages":["8-10"],"focus":"fundamentals","layer":"foundations","fundamental":"passing","progression":"intro","illustrationBrief":"Four children positioned around chairs spaced 10 feet apart, passing a basketball while moving to cuts around the chairs.","publishedAt":"2026-02-05T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Body was truncated mid-Variation; completed with struggle/got-it tiers."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-chair-passing-drill-ages-8-10.md";
				const url = undefined;
				function rawContent() {
					return "\nThis drill teaches spacing and passing without the complexity of defense. Kids learn to find open teammates and pass on time.\n\n**Equipment needed:** Four chairs, one basketball, 5-6 kids.\n\n**Setup:** Arrange four chairs in a square, about 10 feet apart. One kid is the passer in the middle. Four kids stand next to a chair.\n\n**How to run it:**\n\n1. Passer throws the ball to the kid at chair 1. That kid passes back.\n2. Passer immediately throws to the kid at chair 2. That kid passes back.\n3. Continue around all four chairs, alternating.\n4. After one full rotation, a kid from the circle goes to the middle and the passer goes to a chair.\n5. Do this for 20 minutes, rotating all kids through the passer position.\n\n**What to look for:** Passing accuracy and quick hands. The passer should be making a new pass the moment they receive one back.\n\n**If they're struggling:** Move the chairs closer (6 feet apart). Slow the rotation so the passer has time to set their feet between passes.\n\n**If they've got it:** Add a defender in the middle who tries to deflect passes. Or have the chair kids cut to a new chair after each pass to add movement.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
