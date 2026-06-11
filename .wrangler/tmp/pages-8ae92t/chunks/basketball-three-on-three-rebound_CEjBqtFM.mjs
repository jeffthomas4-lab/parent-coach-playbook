globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Rebounding is a contact sport. Practice without contact doesn’t translate. Three on three at the rim teaches kids to find a body, get low, and fight. This is the drill that produces actual rebounders.</p>\n<p><strong>What you need:</strong> A hoop, a basketball, six players, a coach to shoot.</p>\n<p><strong>Setup:</strong> Three offensive players spread around the perimeter. Three defenders matched up. Coach above the free throw line with the ball.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Coach shoots a missed shot (intentionally short or long off the rim).</li>\n<li>Defenders find their man, turn, get low, box out. Arms wide.</li>\n<li>Offensive players try to break through.</li>\n<li>Whoever gets the rebound starts a fast break or resets.</li>\n<li>Do 8 reps. Rotate offense and defense each round.</li>\n</ol>\n<p><strong>What to watch:</strong> Are the defenders making contact on the box-out? A box-out without contact is a sit-down. Find the body, hit the body with the butt, hold for two counts.</p>\n<p><strong>If they’re struggling:</strong> Drop to two on two. Less chaos. Same fundamentals.</p>\n<p><strong>If they’ve got it:</strong> Score it. Defense gets a point for every rebound, offense gets a point for every offensive board. First to 5.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Three on Three Rebound","summary":"Live rebounding battle on a missed shot. 15 minutes. Ages 11-12.","sport":"basketball","ages":["11-12"],"fundamental":"rebounding","progression":"refine","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Six players grouped near the rim, three boxing out and three trying to break through, ball coming off the front of the rim.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Strong rebounding drill, voice has temperature. Lead has four sentences."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-three-on-three-rebound.md";
				const url = undefined;
				function rawContent() {
					return "\nRebounding is a contact sport. Practice without contact doesn't translate. Three on three at the rim teaches kids to find a body, get low, and fight. This is the drill that produces actual rebounders.\n\n**What you need:** A hoop, a basketball, six players, a coach to shoot.\n\n**Setup:** Three offensive players spread around the perimeter. Three defenders matched up. Coach above the free throw line with the ball.\n\n**How to run it:**\n\n1. Coach shoots a missed shot (intentionally short or long off the rim).\n2. Defenders find their man, turn, get low, box out. Arms wide.\n3. Offensive players try to break through.\n4. Whoever gets the rebound starts a fast break or resets.\n5. Do 8 reps. Rotate offense and defense each round.\n\n**What to watch:** Are the defenders making contact on the box-out? A box-out without contact is a sit-down. Find the body, hit the body with the butt, hold for two counts.\n\n**If they're struggling:** Drop to two on two. Less chaos. Same fundamentals.\n\n**If they've got it:** Score it. Defense gets a point for every rebound, offense gets a point for every offensive board. First to 5.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
