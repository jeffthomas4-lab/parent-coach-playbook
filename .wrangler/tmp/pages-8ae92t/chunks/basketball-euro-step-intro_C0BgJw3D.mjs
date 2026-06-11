globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The Euro step is an advanced dribble move. The player plants one foot, steps the other way, then finishes. It’s deceptive and hard to defend.</p>\n<p><strong>What you need:</strong> Basketball. Half-court. Open paint area.</p>\n<p><strong>Setup:</strong> Kid starts on the wing about 15 feet from the basket.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Dribble toward the basket.</li>\n<li>At the free throw line, plant your right foot hard.</li>\n<li>Step left with your left foot (big step away from the baseline).</li>\n<li>Immediately step right with your right foot (cutting back toward the basket).</li>\n<li>Finish with a layup. The defender is left behind.</li>\n<li>Do 5 Euro steps going right. Then 5 going left. Rest. Do 2 rounds.</li>\n</ol>\n<p><strong>What to watch:</strong> Do they commit to each step or is it one flowing motion? Each step must be deliberate. Plant hard, then step hard.</p>\n<p><strong>If they’re struggling:</strong> Slow the approach. Walk the footwork. Do the steps without the ball first, then add the ball and approach.</p>\n<p><strong>If they’ve got it:</strong> Add a defender. The defender tries to stay in front. The Euro step should leave them behind.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Euro Step Intro","summary":"Plant and step side to side to avoid a defender. 10 minutes. Ages 11-12.","sport":"basketball","ages":["11-12"],"fundamental":"finishing","progression":"refine","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A young player driving to the basket, stepping left then right (or right then left) to avoid a defender and finish.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Walk-the-footwork-first cue is the right teach for an advanced finish."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-euro-step-intro.md";
				const url = undefined;
				function rawContent() {
					return "\nThe Euro step is an advanced dribble move. The player plants one foot, steps the other way, then finishes. It's deceptive and hard to defend.\n\n**What you need:** Basketball. Half-court. Open paint area.\n\n**Setup:** Kid starts on the wing about 15 feet from the basket.\n\n**How to run it:**\n\n1. Dribble toward the basket.\n2. At the free throw line, plant your right foot hard.\n3. Step left with your left foot (big step away from the baseline).\n4. Immediately step right with your right foot (cutting back toward the basket).\n5. Finish with a layup. The defender is left behind.\n6. Do 5 Euro steps going right. Then 5 going left. Rest. Do 2 rounds.\n\n**What to watch:** Do they commit to each step or is it one flowing motion? Each step must be deliberate. Plant hard, then step hard.\n\n**If they're struggling:** Slow the approach. Walk the footwork. Do the steps without the ball first, then add the ball and approach.\n\n**If they've got it:** Add a defender. The defender tries to stay in front. The Euro step should leave them behind.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
