globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The Mikan drill is the foundation for finishing. George Mikan invented it. The player bounces layups back and forth under the basket. Left hand, right hand, left hand, right hand.</p>\n<p><strong>What you need:</strong> 8-foot basket. Youth ball (5-7) or regular ball (8-10). Flat court under the basket.</p>\n<p><strong>Setup:</strong> Kid stands under the basket on the right side of the backboard.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Plant, Up, Lay, Land. Plant inside foot (left foot). Drive up. Lay the ball off the backboard. Land soft.</li>\n<li>Bounce layup on the right side with the right hand.</li>\n<li>Immediately move to the left side and bounce a layup with the left hand.</li>\n<li>Keep alternating. Do 10 total (5 each side). Rest.</li>\n<li>Do 2 rounds.</li>\n</ol>\n<p><strong>What to watch:</strong> Are they using the backboard or throwing it away from the basket? The backboard is the target. The ball should tap the glass and fall.</p>\n<p><strong>If they’re struggling:</strong> Move slower. Do just 5 total layups instead of 10. Use a lower hoop.</p>\n<p><strong>If they’ve got it:</strong> Speed it up. Do 20 layups total. Time them and track personal best.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Mikan Progression","summary":"Bounce layups side to side around the basket. 10 minutes. Ages 5-7, 8-10.","sport":"basketball","ages":["5-7","8-10"],"fundamental":"finishing","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A young player at the basket, making a layup on the left side, then immediately moving to the right side.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Names George Mikan; backboard-as-target is correct."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-mikan-progression.md";
				const url = undefined;
				function rawContent() {
					return "\nThe Mikan drill is the foundation for finishing. George Mikan invented it. The player bounces layups back and forth under the basket. Left hand, right hand, left hand, right hand.\n\n**What you need:** 8-foot basket. Youth ball (5-7) or regular ball (8-10). Flat court under the basket.\n\n**Setup:** Kid stands under the basket on the right side of the backboard.\n\n**How to run it:**\n\n1. Cue: Plant, Up, Lay, Land. Plant inside foot (left foot). Drive up. Lay the ball off the backboard. Land soft.\n2. Bounce layup on the right side with the right hand.\n3. Immediately move to the left side and bounce a layup with the left hand.\n4. Keep alternating. Do 10 total (5 each side). Rest.\n5. Do 2 rounds.\n\n**What to watch:** Are they using the backboard or throwing it away from the basket? The backboard is the target. The ball should tap the glass and fall.\n\n**If they're struggling:** Move slower. Do just 5 total layups instead of 10. Use a lower hoop.\n\n**If they've got it:** Speed it up. Do 20 layups total. Time them and track personal best.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
