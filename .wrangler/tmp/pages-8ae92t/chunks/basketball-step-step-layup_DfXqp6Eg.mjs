globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>This is the entry layup. Two steps from the free throw line, then finish at the basket. No dribble. Just walk, step, step, layup.</p>\n<p><strong>What you need:</strong> 8-foot basket. Youth ball. Flat court.</p>\n<p><strong>Setup:</strong> Kid starts at the free throw line with the ball in their hands.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Plant, Up, Lay, Land. Holding the ball, walk toward the basket.</li>\n<li>Plant your inside foot (closest to the basket). This is step 1.</li>\n<li>Step up with the outside foot. This is step 2.</li>\n<li>Lay the ball off the backboard with the hand on the side you’re approaching from (right side = right hand).</li>\n<li>Do 5 layups from the right side. Then 5 from the left side. Rest. Do 2 rounds.</li>\n</ol>\n<p><strong>What to watch:</strong> Are they planting on the correct foot? Inside foot plants first. If they get it backwards, the footwork is wrong.</p>\n<p><strong>If they’re struggling:</strong> Start closer to the basket (3 feet). Walk through it slowly. Practice the footwork without the ball first.</p>\n<p><strong>If they’ve got it:</strong> Add a dribble approach. Dribble from the free throw line, then do the two-step finish.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Step Step Layup","summary":"Two steps to the basket then lay the ball off the backboard. 8 minutes. Ages 5-7.","sport":"basketball","ages":["5-7"],"fundamental":"finishing","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A young child taking two steps toward the basket, then laying the ball off the backboard.","editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Footwork as written has inside foot plant first, which is the opposite of the conventional outside-foot-plants layup. May want to verify intent for this age group."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-step-step-layup.md";
				const url = undefined;
				function rawContent() {
					return "\nThis is the entry layup. Two steps from the free throw line, then finish at the basket. No dribble. Just walk, step, step, layup.\n\n**What you need:** 8-foot basket. Youth ball. Flat court.\n\n**Setup:** Kid starts at the free throw line with the ball in their hands.\n\n**How to run it:**\n\n1. Cue: Plant, Up, Lay, Land. Holding the ball, walk toward the basket.\n2. Plant your inside foot (closest to the basket). This is step 1.\n3. Step up with the outside foot. This is step 2.\n4. Lay the ball off the backboard with the hand on the side you're approaching from (right side = right hand).\n5. Do 5 layups from the right side. Then 5 from the left side. Rest. Do 2 rounds.\n\n**What to watch:** Are they planting on the correct foot? Inside foot plants first. If they get it backwards, the footwork is wrong.\n\n**If they're struggling:** Start closer to the basket (3 feet). Walk through it slowly. Practice the footwork without the ball first.\n\n**If they've got it:** Add a dribble approach. Dribble from the free throw line, then do the two-step finish.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
