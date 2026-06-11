globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The first time a kid uses a glove to field a ball, they need to feel where the glove goes (low, on the ground) and what the body does (drop down to meet it). Flat ground means no bounces, no surprises. Just rolls.</p>\n<p><strong>What you need:</strong> A <a href=\"/go/baseball-glove-9in-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">glove</a>, 5 tennis balls or soft baseballs, a flat patch of grass.</p>\n<p><strong>Setup:</strong> Stand 10 feet from the kid. They face you with the glove on, ready position.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Drop, Show, Funnel, Send. Today the focus is Drop and Show.</li>\n<li>Roll a slow ball on flat grass straight at them.</li>\n<li>They drop into a low fielding position, show the glove on the ground in front, and let the ball roll into the glove.</li>\n<li>After the catch, they stand up and toss the ball back. No throw mechanics today.</li>\n<li>Do 10 rolls. Each time, check Drop (low) and Show (glove flat on the ground).</li>\n</ol>\n<p><strong>What to watch:</strong> Is the glove on the ground or in the air? Glove must touch grass. If it’s hovering, the ball will roll under.</p>\n<p><strong>If they’re struggling:</strong> Get closer. Slower rolls. Use a bigger ball.</p>\n<p><strong>If they’ve got it:</strong> Roll slightly to one side or the other. Now the</p>";

				const frontmatter = {"title":"Flat Ground Rollers","summary":"First exposure to fielding a moving ball with a glove. 8 minutes. T-ball and ages 5-7.","sport":"baseball","ages":["t-ball","5-7"],"fundamental":"fielding","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Adult rolling a tennis ball on flat grass to a young child crouched in fielding position with a glove low to the ground.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-flat-ground-rollers.md";
				const url = undefined;
				function rawContent() {
					return "\nThe first time a kid uses a glove to field a ball, they need to feel where the glove goes (low, on the ground) and what the body does (drop down to meet it). Flat ground means no bounces, no surprises. Just rolls.\n\n**What you need:** A [glove](/go/baseball-glove-9in-youth/), 5 tennis balls or soft baseballs, a flat patch of grass.\n\n**Setup:** Stand 10 feet from the kid. They face you with the glove on, ready position.\n\n**How to run it:**\n\n1. Cue: Drop, Show, Funnel, Send. Today the focus is Drop and Show.\n2. Roll a slow ball on flat grass straight at them.\n3. They drop into a low fielding position, show the glove on the ground in front, and let the ball roll into the glove.\n4. After the catch, they stand up and toss the ball back. No throw mechanics today.\n5. Do 10 rolls. Each time, check Drop (low) and Show (glove flat on the ground).\n\n**What to watch:** Is the glove on the ground or in the air? Glove must touch grass. If it's hovering, the ball will roll under.\n\n**If they're struggling:** Get closer. Slower rolls. Use a bigger ball.\n\n**If they've got it:** Roll slightly to one side or the other. Now the";
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
