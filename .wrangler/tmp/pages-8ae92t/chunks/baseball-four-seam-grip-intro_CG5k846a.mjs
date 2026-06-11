globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Most kids grip the ball with their palm, which makes throws curve and float. The four-seam grip puts two fingers across the U-shaped seam and the thumb underneath. The ball comes out cleaner and goes where they aim.</p>\n<p><strong>What you need:</strong> 5 baseballs (real ones, not soft) and a partner.</p>\n<p><strong>Setup:</strong> Stand 12 feet apart. Show the kid a ball with the U-shaped seam pointing up at them.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Show the grip: index and middle finger laid across the U-seam at the top of the ball, thumb tucked underneath, ring and pinky off the side.</li>\n<li>Have them try. Check that two fingertips are touching seam, not leather.</li>\n<li>Without throwing, have them set the grip 5 times in a row. Each time you check it.</li>\n<li>Now play catch using the cue: Turn, Shuffle, Point, Fire. They reset the grip on every throw.</li>\n<li>Do 15 throws. On every catch, they have to reset the grip before they throw back.</li>\n</ol>\n<p><strong>What to watch:</strong> Are two fingers across the seam? Or is one finger on the seam and one on leather? Two fingers on seam is the only thing that matters today.</p>\n<p><strong>If they’re struggling:</strong> Use a tennis ball with a black line drawn across it as the seam. The grip is the same, the ball is easier to handle.</p>\n<p><strong>If they’ve got it:</strong> Have them set the grip with the ball hidden in the glove. They can’t look. They have to feel for the seam.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Four-Seam Grip","summary":"Teach the grip that makes the ball fly straight. 8 minutes. Ages 5-7 and 8-10.","sport":"baseball","ages":["5-7","8-10"],"fundamental":"throwing","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Close-up of a child's hand holding a baseball with two fingers across the U-shaped seam, thumb underneath the ball.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-four-seam-grip-intro.md";
				const url = undefined;
				function rawContent() {
					return "\nMost kids grip the ball with their palm, which makes throws curve and float. The four-seam grip puts two fingers across the U-shaped seam and the thumb underneath. The ball comes out cleaner and goes where they aim.\n\n**What you need:** 5 baseballs (real ones, not soft) and a partner.\n\n**Setup:** Stand 12 feet apart. Show the kid a ball with the U-shaped seam pointing up at them.\n\n**How to run it:**\n\n1. Show the grip: index and middle finger laid across the U-seam at the top of the ball, thumb tucked underneath, ring and pinky off the side.\n2. Have them try. Check that two fingertips are touching seam, not leather.\n3. Without throwing, have them set the grip 5 times in a row. Each time you check it.\n4. Now play catch using the cue: Turn, Shuffle, Point, Fire. They reset the grip on every throw.\n5. Do 15 throws. On every catch, they have to reset the grip before they throw back.\n\n**What to watch:** Are two fingers across the seam? Or is one finger on the seam and one on leather? Two fingers on seam is the only thing that matters today.\n\n**If they're struggling:** Use a tennis ball with a black line drawn across it as the seam. The grip is the same, the ball is easier to handle.\n\n**If they've got it:** Have them set the grip with the ball hidden in the glove. They can't look. They have to feel for the seam.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
