globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Rebounding takes hands. Tip drill builds the strength to control a ball above the rim, the timing to reach it at the peak, and the fingers to direct it where you want. This is conditioning and skill in one drill.</p>\n<p><strong>What you need:</strong> A hoop, a basketball, one player.</p>\n<p><strong>Setup:</strong> Player stands directly under the rim with the ball.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Player tosses the ball off the backboard above the square.</li>\n<li>They jump and tip it back against the backboard with one hand.</li>\n<li>Tip again. And again. Continuous tipping for 30 seconds.</li>\n<li>After 30 seconds, rest 30. Switch hands.</li>\n<li>Do 4 rounds: 30 seconds right hand, 30 rest, 30 left hand, 30 rest.</li>\n</ol>\n<p><strong>What to watch:</strong> Are they reaching at the peak of the jump? Tipping on the way down means they didn’t time the jump right. The tip happens at the top.</p>\n<p><strong>If they’re struggling:</strong> Cut to 15 seconds per round. Or drop the second hand and only do dominant.</p>\n<p><strong>If they’ve got it:</strong> Add a finish: after 30 seconds of tipping, last tip goes through the net. Or do it on a lower hoop and tip with two hands above the rim.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Tip Drill","summary":"Tip the ball off the backboard until the coach's whistle. 8 minutes. Ages 11-12.","sport":"basketball","ages":["11-12"],"fundamental":"rebounding","progression":"refine","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player jumping repeatedly to tip a basketball against the backboard with one hand, arm extended, in a continuous motion.","editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Lead sentence runs a triplet (strength/timing/fingers) — could trim. Otherwise solid."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-tip-drill.md";
				const url = undefined;
				function rawContent() {
					return "\nRebounding takes hands. Tip drill builds the strength to control a ball above the rim, the timing to reach it at the peak, and the fingers to direct it where you want. This is conditioning and skill in one drill.\n\n**What you need:** A hoop, a basketball, one player.\n\n**Setup:** Player stands directly under the rim with the ball.\n\n**How to run it:**\n\n1. Player tosses the ball off the backboard above the square.\n2. They jump and tip it back against the backboard with one hand.\n3. Tip again. And again. Continuous tipping for 30 seconds.\n4. After 30 seconds, rest 30. Switch hands.\n5. Do 4 rounds: 30 seconds right hand, 30 rest, 30 left hand, 30 rest.\n\n**What to watch:** Are they reaching at the peak of the jump? Tipping on the way down means they didn't time the jump right. The tip happens at the top.\n\n**If they're struggling:** Cut to 15 seconds per round. Or drop the second hand and only do dominant.\n\n**If they've got it:** Add a finish: after 30 seconds of tipping, last tip goes through the net. Or do it on a lower hoop and tip with two hands above the rim.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
