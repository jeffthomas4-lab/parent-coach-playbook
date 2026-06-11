globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Five-year-olds have no sense of where their feet are. This drill teaches them that the ball stays close and moves when they tap it. Nothing fancy. Just tap and follow.</p>\n<p><strong>What you need:</strong> 1 soccer ball per child. Open space, no cones yet.</p>\n<p><strong>Setup:</strong> Each child has a ball. Stand 20 feet away so you can see them all.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Kids tap the ball with the inside of their foot and walk after it.</li>\n<li>One tap, then a step. Tap, step. Tap, step.</li>\n<li>No running. Walking pace only. This builds touch.</li>\n<li>After 20 taps, they stop. Rest 30 seconds.</li>\n<li>Go again for another round.</li>\n</ol>\n<p><strong>What to watch:</strong> Are they tapping with the inside of the foot or kicking at it? Inside of the foot is softer and gives them control. If they’re kicking, show them where the inside of the foot is.</p>\n<p><strong>If they’re struggling:</strong> Stand right next to them and tap with them. Match their rhythm.</p>\n<p><strong>If they’ve got it:</strong> Add direction. “Tap it toward the tree.” Give them a target 15 feet away and have them tap it there.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size3/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 3 soccer ball →</a> — right size for ages 5–7.</p>\n<p><a href=\"/go/soccer-cones-12pk/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Disc cones (50-pack) →</a> — flat cones for gates, grids, and boundary markers.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Tap and Run","summary":"First dribbling touches with a focus on feel. 6 minutes. Ages 5-7.","sport":"soccer","ages":["5-7"],"fundamental":"dribbling","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Young child with feet next to a soccer ball, tapping it with the inside of their foot, eyes down on the ball.","editorial":{"qualityGrade":7,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Walking pace rule is a strong cue for 5-7s."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-tap-and-run.md";
				const url = undefined;
				function rawContent() {
					return "\nFive-year-olds have no sense of where their feet are. This drill teaches them that the ball stays close and moves when they tap it. Nothing fancy. Just tap and follow.\n\n**What you need:** 1 soccer ball per child. Open space, no cones yet.\n\n**Setup:** Each child has a ball. Stand 20 feet away so you can see them all.\n\n**How to run it:**\n\n1. Kids tap the ball with the inside of their foot and walk after it.\n2. One tap, then a step. Tap, step. Tap, step.\n3. No running. Walking pace only. This builds touch.\n4. After 20 taps, they stop. Rest 30 seconds.\n5. Go again for another round.\n\n**What to watch:** Are they tapping with the inside of the foot or kicking at it? Inside of the foot is softer and gives them control. If they're kicking, show them where the inside of the foot is.\n\n**If they're struggling:** Stand right next to them and tap with them. Match their rhythm.\n\n**If they've got it:** Add direction. \"Tap it toward the tree.\" Give them a target 15 feet away and have them tap it there.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 3 soccer ball →](/go/soccer-ball-size3/) — right size for ages 5–7.\n\n[Disc cones (50-pack) →](/go/soccer-cones-12pk/) — flat cones for gates, grids, and boundary markers.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
