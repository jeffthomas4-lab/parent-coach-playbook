globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Before a kid uses a glove, they need to feel that a rolling ball is something they can stop. The glove gets in the way of that lesson. Skip it for now.</p>\n<p><strong>What you need:</strong> 5 softballs (11”), a patch of grass.</p>\n<p><strong>Setup:</strong> Kneel about 6 feet from your kid. They stand facing you, feet apart, hands out in front with palms up.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Roll a slow ground ball straight at their feet.</li>\n<li>They reach down with both hands and stop the ball, then toss it back to you.</li>\n<li>Roll the next one as soon as the ball is back in your hand. Don’t stop to coach.</li>\n<li>After 10 rolls, ask them to take one step back. Do 10 more.</li>\n<li>Last round: switch. They roll, you field. Let them see what it looks like done right.</li>\n</ol>\n<p><strong>What to watch:</strong> Are they using both hands? At this age, lots of kids stab with one hand. Two hands is the only thing you’re teaching today.</p>\n<p><strong>If they’re struggling:</strong> Move closer. Roll slower. Use a softer ball.</p>\n<p><strong>If they’ve got it:</strong> Move back to 10 feet. Roll a little harder. Aim slightly to one side so they have to step before they reach.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/softball-glove-11in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth softball glove →</a> — 11-inch fielder’s glove for new players.</p>\n<p><a href=\"/what-to-buy/softball/\">Full softball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Bare Hand Rolls","summary":"Stop and pick up a moving ball with two hands. 8 minutes. T-ball and ages 5-7.","sport":"softball","ages":["t-ball","5-7"],"fundamental":"catching","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Adult kneeling 6 feet from a child, rolling a softball on grass. Child's hands are out, palms up, ready to receive.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Smart pre-glove drill for the youngest. Changed soft baseballs to softballs."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/softball-bare-hand-rolls.md";
				const url = undefined;
				function rawContent() {
					return "\nBefore a kid uses a glove, they need to feel that a rolling ball is something they can stop. The glove gets in the way of that lesson. Skip it for now.\n\n**What you need:** 5 softballs (11\"), a patch of grass.\n\n**Setup:** Kneel about 6 feet from your kid. They stand facing you, feet apart, hands out in front with palms up.\n\n**How to run it:**\n\n1. Roll a slow ground ball straight at their feet.\n2. They reach down with both hands and stop the ball, then toss it back to you.\n3. Roll the next one as soon as the ball is back in your hand. Don't stop to coach.\n4. After 10 rolls, ask them to take one step back. Do 10 more.\n5. Last round: switch. They roll, you field. Let them see what it looks like done right.\n\n**What to watch:** Are they using both hands? At this age, lots of kids stab with one hand. Two hands is the only thing you're teaching today.\n\n**If they're struggling:** Move closer. Roll slower. Use a softer ball.\n\n**If they've got it:** Move back to 10 feet. Roll a little harder. Aim slightly to one side so they have to step before they reach.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth softball glove →](/go/softball-glove-11in/) — 11-inch fielder's glove for new players.\n\n[Full softball gear guide →](/what-to-buy/softball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
