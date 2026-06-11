globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A pop-up is the only ball where the rule is: yell. Two players running for the same ball collide, and the ball drops between them. The kid who calls it loud and early gets the ball and avoids the bump. Calling is the skill.</p>\n<p><strong>What you need:</strong> A glove, 5 tennis balls, a tennis racquet (or a bat for older kids), open grass.</p>\n<p><strong>Setup:</strong> Kid stands 30 feet away. You hit straight pop-ups.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Find, Track, Camp, Catch.</li>\n<li>Hit a pop-up 25 feet up. As soon as the kid sees it, they have to yell “I got it” three times before they catch it.</li>\n<li>The catch is two-handed above the head.</li>\n<li>Do 5 pops with the call.</li>\n<li>Last 5: hit slightly to one side or the other. They have to move, call, and catch.</li>\n</ol>\n<p><strong>What to watch:</strong> Are they calling loud enough? In a real game, the call has to beat the other fielder’s call. Loud and clear, three times.</p>\n<p><strong>If they’re struggling:</strong> Lower the pop. Use a tennis racquet for softer hits. Drop the call until they can catch consistently.</p>\n<p><strong>If they’ve got it:</strong> Add a second player. Hit a pop between them. The first one to call gets the ball, the other backs off.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/go/baseball-bat-28in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">28-inch youth bat →</a> — drop-10 USA-stamped bat for ages 8–10.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Pop-Up Call It","summary":"Catch a high pop-up and call for it loud. 10 minutes. Ages 5-7 and 8-10.","sport":"baseball","ages":["5-7","8-10"],"fundamental":"fielding","progression":"build","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A child looking straight up at a pop-up coming down with both hands raised above the head and the mouth open mid-shout 'I got it.'","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":9,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-popup-call-it.md";
				const url = undefined;
				function rawContent() {
					return "\nA pop-up is the only ball where the rule is: yell. Two players running for the same ball collide, and the ball drops between them. The kid who calls it loud and early gets the ball and avoids the bump. Calling is the skill.\n\n**What you need:** A glove, 5 tennis balls, a tennis racquet (or a bat for older kids), open grass.\n\n**Setup:** Kid stands 30 feet away. You hit straight pop-ups.\n\n**How to run it:**\n\n1. Cue: Find, Track, Camp, Catch.\n2. Hit a pop-up 25 feet up. As soon as the kid sees it, they have to yell \"I got it\" three times before they catch it.\n3. The catch is two-handed above the head.\n4. Do 5 pops with the call.\n5. Last 5: hit slightly to one side or the other. They have to move, call, and catch.\n\n**What to watch:** Are they calling loud enough? In a real game, the call has to beat the other fielder's call. Loud and clear, three times.\n\n**If they're struggling:** Lower the pop. Use a tennis racquet for softer hits. Drop the call until they can catch consistently.\n\n**If they've got it:** Add a second player. Hit a pop between them. The first one to call gets the ball, the other backs off.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[28-inch youth bat →](/go/baseball-bat-28in/) — drop-10 USA-stamped bat for ages 8–10.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
