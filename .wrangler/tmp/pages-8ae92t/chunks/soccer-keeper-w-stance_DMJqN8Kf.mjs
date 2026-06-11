globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>This drill is for kids who want to play goalkeeper. Not every kid will use these. The W stance is the foundation. Hands up, feet wide, ready to move. It’s the shape they start from on every shot.</p>\n<p><strong>What you need:</strong> A goal. A soccer ball. Open space in front.</p>\n<p><strong>Setup:</strong> Goalkeeper stands in the goal, about 3 feet from the goal line.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Goalkeeper stands with feet shoulder-width apart.</li>\n<li>Hands are up at waist height, palms facing the ball, forming a W shape with the arms.</li>\n<li>Knees are soft, ready to move.</li>\n<li>You or another player shoots from 12 feet away, gently.</li>\n<li>Goalkeeper reacts by blocking or catching the shot.</li>\n<li>Do 10 shots. Rest. Repeat.</li>\n</ol>\n<p><strong>What to watch:</strong> Are the hands up and ready? Or down at their side?</p>\n<p><strong>If they’re struggling:</strong> Start with no shots, just the stance. Have them hold it for 30 seconds at a time.</p>\n<p><strong>If they’ve got it:</strong> Move closer and shoot with more pace. The keeper has to react faster.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size4/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 4 soccer ball →</a> — right size for ages 8–12.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Keeper W Stance","summary":"Goalkeeper learns the ready position with hands up and legs set. 8 minutes. Ages 8-10.","sport":"soccer","ages":["8-10"],"fundamental":"goalkeeping","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Young goalkeeper in a wide stance with hands positioned at waist height in a W shape, ready to react.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Foundational ready-stance drill. Soccer vocab correct."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-keeper-w-stance.md";
				const url = undefined;
				function rawContent() {
					return "\nThis drill is for kids who want to play goalkeeper. Not every kid will use these. The W stance is the foundation. Hands up, feet wide, ready to move. It's the shape they start from on every shot.\n\n**What you need:** A goal. A soccer ball. Open space in front.\n\n**Setup:** Goalkeeper stands in the goal, about 3 feet from the goal line.\n\n**How to run it:**\n\n1. Goalkeeper stands with feet shoulder-width apart.\n2. Hands are up at waist height, palms facing the ball, forming a W shape with the arms.\n3. Knees are soft, ready to move.\n4. You or another player shoots from 12 feet away, gently.\n5. Goalkeeper reacts by blocking or catching the shot.\n6. Do 10 shots. Rest. Repeat.\n\n**What to watch:** Are the hands up and ready? Or down at their side?\n\n**If they're struggling:** Start with no shots, just the stance. Have them hold it for 30 seconds at a time.\n\n**If they've got it:** Move closer and shoot with more pace. The keeper has to react faster.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 4 soccer ball →](/go/soccer-ball-size4/) — right size for ages 8–12.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
