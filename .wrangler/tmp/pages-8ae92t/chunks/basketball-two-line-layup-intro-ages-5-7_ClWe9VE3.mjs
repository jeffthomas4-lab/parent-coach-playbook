globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Layups are the easiest bucket in basketball. This drill teaches the approach, the footsteps, and the finish from both sides.</p>\n<p><strong>Equipment needed:</strong> One hoop, 12-15 basketballs, two buckets, a basket of balls near the hoop.</p>\n<p><strong>Setup:</strong> Two lines of kids facing the hoop. Line 1 is on the right side, Line 2 is on the left side. Both about 15 feet away.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>First kid in Line 1 dribbles toward the hoop from the right, shoots a layup, and goes to the back of Line 2.</li>\n<li>First kid in Line 2 dribbles toward the hoop from the left, shoots a layup, and goes to the back of Line 1.</li>\n<li>Alternate. Do 20 total reps (10 per side).</li>\n</ol>\n<p><strong>What to look for:</strong> Footwork on the approach. A layup has two steps before the shot. First step is longer, second step is a launch off the inside foot, then lay the ball off the backboard with the outside hand. Soft touch matters more than power at this age.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Two-Line Layup Intro","summary":"Two lines shooting layups alternating sides. 20 minutes. Ages 5-7.","sport":"basketball","ages":["5-7"],"focus":"fundamentals","layer":"foundations","fundamental":"finishing","progression":"intro","illustrationBrief":"Two lines of children in a gym, each taking turns approaching the basket from the baseline and shooting a layup from one side.","publishedAt":"2026-01-20T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Completed truncated body with two voice-matched lines on launch step and ball off the backboard. Sport language clean."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-two-line-layup-intro-ages-5-7.md";
				const url = undefined;
				function rawContent() {
					return "\nLayups are the easiest bucket in basketball. This drill teaches the approach, the footsteps, and the finish from both sides.\n\n**Equipment needed:** One hoop, 12-15 basketballs, two buckets, a basket of balls near the hoop.\n\n**Setup:** Two lines of kids facing the hoop. Line 1 is on the right side, Line 2 is on the left side. Both about 15 feet away.\n\n**How to run it:**\n\n1. First kid in Line 1 dribbles toward the hoop from the right, shoots a layup, and goes to the back of Line 2.\n2. First kid in Line 2 dribbles toward the hoop from the left, shoots a layup, and goes to the back of Line 1.\n3. Alternate. Do 20 total reps (10 per side).\n\n**What to look for:** Footwork on the approach. A layup has two steps before the shot. First step is longer, second step is a launch off the inside foot, then lay the ball off the backboard with the outside hand. Soft touch matters more than power at this age.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
