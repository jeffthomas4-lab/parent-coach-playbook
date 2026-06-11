globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The set starts with the hand shape. Both hands above the forehead, fingers spread, forming a diamond or “window” through which the player looks at the ball. Without the right shape, the set is a slap.</p>\n<p><strong>What you need:</strong> Open space. No ball.</p>\n<p><strong>Setup:</strong> Kid stands in athletic stance.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Window, Soft, Push, Target.</li>\n<li>Window: hands above the forehead, palms facing up, fingers spread, thumbs and index fingers form a diamond. Look through the window at an imaginary ball.</li>\n<li>Hold the window for 10 seconds. Coach checks: hands above forehead, fingers spread, no thumbs touching.</li>\n<li>Reset. Do 8 reps holding the position.</li>\n<li>Last 3 reps: pretend to set an invisible ball. Push the hands forward and up.</li>\n</ol>\n<p><strong>What to watch:</strong> Hand position. Hands at the chest is wrong. Hands above the forehead is right.</p>\n<p><strong>If they’re struggling:</strong> Have them touch their own forehead with their thumbs first, then move hands up an inch above. That’s the spot.</p>\n<p><strong>If they’ve got it:</strong> Add a balloon. They set the balloon up in the air using the window position.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/volleyball-volley-lite/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Volley Lite training ball →</a> — lightweight ball for beginners learning to pass.</p>\n<p><a href=\"/what-to-buy/volleyball/\">Full volleyball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Window Shape Overhead","summary":"Build the overhead set hand position with no ball. 8 minutes. Ages 8-10.","sport":"volleyball","ages":["8-10"],"fundamental":"setting","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player with both hands held above the forehead, fingers spread to form a diamond or window shape framing the face.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Pre-ball window shape. Forehead-touch trick is a sharp teaching aid."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/volleyball-window-shape-overhead.md";
				const url = undefined;
				function rawContent() {
					return "\nThe set starts with the hand shape. Both hands above the forehead, fingers spread, forming a diamond or \"window\" through which the player looks at the ball. Without the right shape, the set is a slap.\n\n**What you need:** Open space. No ball.\n\n**Setup:** Kid stands in athletic stance.\n\n**How to run it:**\n\n1. Cue: Window, Soft, Push, Target.\n2. Window: hands above the forehead, palms facing up, fingers spread, thumbs and index fingers form a diamond. Look through the window at an imaginary ball.\n3. Hold the window for 10 seconds. Coach checks: hands above forehead, fingers spread, no thumbs touching.\n4. Reset. Do 8 reps holding the position.\n5. Last 3 reps: pretend to set an invisible ball. Push the hands forward and up.\n\n**What to watch:** Hand position. Hands at the chest is wrong. Hands above the forehead is right.\n\n**If they're struggling:** Have them touch their own forehead with their thumbs first, then move hands up an inch above. That's the spot.\n\n**If they've got it:** Add a balloon. They set the balloon up in the air using the window position.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Volley Lite training ball →](/go/volleyball-volley-lite/) — lightweight ball for beginners learning to pass.\n\n[Full volleyball gear guide →](/what-to-buy/volleyball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
