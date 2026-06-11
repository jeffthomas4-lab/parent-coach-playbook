globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Most young kids have no idea what the score is or how many outs there are. They play in a fog. Two minutes between innings asking simple questions builds awareness. Awareness is the start of game IQ.</p>\n<p><strong>What you need:</strong> Nothing. Between every half-inning of a game or scrimmage, gather the team.</p>\n<p><strong>Setup:</strong> Quick huddle in the dugout or just outside.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Ask: “What’s the score?” Wait for an answer.</li>\n<li>Ask: “How many outs?”</li>\n<li>Ask: “Where are the runners?” (When applicable.)</li>\n<li>Ask: “What’s our job this inning?” (Examples: “get three outs,” “score one run.”)</li>\n<li>End with one focus point: “Outfielders, watch for fly balls.” Or “Infielders, get the lead runner.”</li>\n</ol>\n<p><strong>What to watch:</strong> Are the same kids answering every time? If so, call on the quiet ones next inning. The point is everyone tracking the game.</p>\n<p><strong>If they’re struggling:</strong> Just ask one question. “How many outs?” That’s it. Build from there.</p>\n<p><strong>If they’ve got it:</strong> Ask harder questions. “What’s the right play if a ground ball is hit to first?” Or “Where do we throw if there’s a runner on second?”</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"End of Inning Score Check","summary":"Coach quizzes kids on outs, score, and runners between innings. 5 minutes. Ages 5-7 and 8-10.","sport":"baseball","ages":["5-7","8-10"],"fundamental":"situational","progression":"intro","focus":"game-management","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Coach huddled with a group of young players between innings, holding up fingers to show the score and outs, kids paying attention.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-end-of-inning-score-check.md";
				const url = undefined;
				function rawContent() {
					return "\nMost young kids have no idea what the score is or how many outs there are. They play in a fog. Two minutes between innings asking simple questions builds awareness. Awareness is the start of game IQ.\n\n**What you need:** Nothing. Between every half-inning of a game or scrimmage, gather the team.\n\n**Setup:** Quick huddle in the dugout or just outside.\n\n**How to run it:**\n\n1. Ask: \"What's the score?\" Wait for an answer.\n2. Ask: \"How many outs?\"\n3. Ask: \"Where are the runners?\" (When applicable.)\n4. Ask: \"What's our job this inning?\" (Examples: \"get three outs,\" \"score one run.\")\n5. End with one focus point: \"Outfielders, watch for fly balls.\" Or \"Infielders, get the lead runner.\"\n\n**What to watch:** Are the same kids answering every time? If so, call on the quiet ones next inning. The point is everyone tracking the game.\n\n**If they're struggling:** Just ask one question. \"How many outs?\" That's it. Build from there.\n\n**If they've got it:** Ask harder questions. \"What's the right play if a ground ball is hit to first?\" Or \"Where do we throw if there's a runner on second?\"\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
