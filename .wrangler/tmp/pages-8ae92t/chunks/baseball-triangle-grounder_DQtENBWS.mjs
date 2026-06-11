globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Good fielders all have the same body shape. Feet wider than the shoulders. Glove out front, low. The shape forms a triangle (feet apart, glove forward) and the ball comes in through the open side. Same shape every time means same catch every time.</p>\n<p><strong>What you need:</strong> A glove, 10 baseballs or tennis balls, flat grass.</p>\n<p><strong>Setup:</strong> Stand 15 feet from the kid. They face you.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Drop, Show, Funnel, Send.</li>\n<li>Show the body shape: feet wider than shoulders, butt down, chest forward, glove on the ground out in front.</li>\n<li>Have them hold the position for 5 seconds. Check the shape. Reset.</li>\n<li>Now roll 5 grounders right at them. Each rep, they drop into the shape, field, and toss back.</li>\n<li>Last 5: roll slightly off-center. They step into position then drop into the shape.</li>\n</ol>\n<p><strong>What to watch:</strong> Are the feet outside the shoulders? Many kids field with feet too narrow. Wide stance is what holds the body steady.</p>\n<p><strong>If they’re struggling:</strong> Have them hold the body shape without a ball for 30 seconds. Make it about getting the position right first.</p>\n<p><strong>If they’ve got it:</strong> Roll harder and to either side. They have to get to the spot before they drop into the shape.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Triangle Grounder","summary":"Build the body shape that makes fielding repeatable. 12 minutes. Ages 5-7 and 8-10.","sport":"baseball","ages":["5-7","8-10"],"fundamental":"fielding","progression":"build","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Side view of a child in fielding position with feet wider than the shoulders and the glove out front, forming a triangle between feet and glove.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-triangle-grounder.md";
				const url = undefined;
				function rawContent() {
					return "\nGood fielders all have the same body shape. Feet wider than the shoulders. Glove out front, low. The shape forms a triangle (feet apart, glove forward) and the ball comes in through the open side. Same shape every time means same catch every time.\n\n**What you need:** A glove, 10 baseballs or tennis balls, flat grass.\n\n**Setup:** Stand 15 feet from the kid. They face you.\n\n**How to run it:**\n\n1. Cue: Drop, Show, Funnel, Send.\n2. Show the body shape: feet wider than shoulders, butt down, chest forward, glove on the ground out in front.\n3. Have them hold the position for 5 seconds. Check the shape. Reset.\n4. Now roll 5 grounders right at them. Each rep, they drop into the shape, field, and toss back.\n5. Last 5: roll slightly off-center. They step into position then drop into the shape.\n\n**What to watch:** Are the feet outside the shoulders? Many kids field with feet too narrow. Wide stance is what holds the body steady.\n\n**If they're struggling:** Have them hold the body shape without a ball for 30 seconds. Make it about getting the position right first.\n\n**If they've got it:** Roll harder and to either side. They have to get to the spot before they drop into the shape.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
