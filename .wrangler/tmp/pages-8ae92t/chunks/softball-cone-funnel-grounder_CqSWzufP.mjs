globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The funnel teaches the kid where the ball goes after they catch it. Two cones form a path from the glove to a basket. It’s the Funnel part of the Drop, Show, Funnel, Send cue.</p>\n<p><strong>What you need:</strong> 2 cones, a bucket or basket, 10 softballs (11”), grass.</p>\n<p><strong>Setup:</strong> Place two cones 3 feet apart forming a V-shape with a bucket behind them. Kid stands 10 feet in front of the V.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Drop, Show, Funnel, Send.</li>\n<li>Roll a slow ball straight at them.</li>\n<li>They Drop (low), Show (glove), catch it, then Funnel the ball by moving it out of the glove and into the bucket through the V.</li>\n<li>Do 10 rolls. After each, they walk the ball back to you.</li>\n<li>On the final round, emphasize the hand movement through the funnel. No dropping the ball.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the ball move smoothly from the glove through the cones? Or does it drop out and roll away?</p>\n<p><strong>If they’re struggling:</strong> Move the cones wider apart. Move closer to 8 feet.</p>\n<p><strong>If they’ve got it:</strong> Narrow the cones to 2 feet apart. Roll from the side so they have to move their feet and still funnel.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/softball-glove-11in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth softball glove →</a> — 11-inch fielder’s glove for new players.</p>\n<p><a href=\"/go/agility-cones/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Agility cones →</a> — for setup, base paths, and field drills.</p>\n<p><a href=\"/what-to-buy/softball/\">Full softball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Cone Funnel Grounder","summary":"Field ground balls into a funnel. 10 minutes. T-ball and ages 5-7.","sport":"softball","ages":["t-ball","5-7"],"fundamental":"fielding","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Young child fielding a grounder and moving the ball through two cones set up in a funnel shape toward a basket.","editorial":{"qualityGrade":7,"originalityGrade":7,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Cone funnel teaches transfer; clean. Changed soft baseballs to softballs."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/softball-cone-funnel-grounder.md";
				const url = undefined;
				function rawContent() {
					return "\nThe funnel teaches the kid where the ball goes after they catch it. Two cones form a path from the glove to a basket. It's the Funnel part of the Drop, Show, Funnel, Send cue.\n\n**What you need:** 2 cones, a bucket or basket, 10 softballs (11\"), grass.\n\n**Setup:** Place two cones 3 feet apart forming a V-shape with a bucket behind them. Kid stands 10 feet in front of the V.\n\n**How to run it:**\n\n1. Cue: Drop, Show, Funnel, Send.\n2. Roll a slow ball straight at them.\n3. They Drop (low), Show (glove), catch it, then Funnel the ball by moving it out of the glove and into the bucket through the V.\n4. Do 10 rolls. After each, they walk the ball back to you.\n5. On the final round, emphasize the hand movement through the funnel. No dropping the ball.\n\n**What to watch:** Does the ball move smoothly from the glove through the cones? Or does it drop out and roll away?\n\n**If they're struggling:** Move the cones wider apart. Move closer to 8 feet.\n\n**If they've got it:** Narrow the cones to 2 feet apart. Roll from the side so they have to move their feet and still funnel.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth softball glove →](/go/softball-glove-11in/) — 11-inch fielder's glove for new players.\n\n[Agility cones →](/go/agility-cones/) — for setup, base paths, and field drills.\n\n[Full softball gear guide →](/what-to-buy/softball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
