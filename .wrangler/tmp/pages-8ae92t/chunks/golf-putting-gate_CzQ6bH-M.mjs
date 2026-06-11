globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Path matters more than speed at five feet. The gate forces a straight stroke.</p>\n<p><strong>Equipment needed:</strong> A putter, six golf balls, two tees, a putting green or carpet.</p>\n<p><strong>Setup:</strong> Place two tees a putter-head-width apart, six inches in front of the ball, aimed at a hole or target.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Putt the ball through the gate without clipping either tee.</li>\n<li>Five putts from five feet. Then five putts from ten feet.</li>\n<li>Track how many cleared the gate.</li>\n</ol>\n<p><strong>What to look for:</strong> A miss to the left or right of the gate tells you the path is off, not the speed. The ball that clips the right tee means the face is open at impact.</p>\n<p><strong>Variation:</strong> Narrow the gate to half a putter-head-width once the kid clears the standard width consistently. Reveals fine path errors.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/agility-cones/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Agility cones →</a> — useful for alignment and target drills.</p>\n<p><a href=\"/what-to-buy/golf/\">Full golf gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Putting Gate","summary":"Roll the ball through a gate of two tees. Five feet, then ten. Ages 8-14.","sport":"golf","age":"8-10","ages":["8-10","11-12","13-14"],"focus":"fundamentals","layer":"skills","fundamental":"situational","progression":"build","illustrationBrief":"A young golfer on a putting green with two tees placed close together as a gate just in front of the ball.","publishedAt":"2026-05-12T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":6,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-12T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Generated as part of the per-sport content baseline. Voice may need a Jeff pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/golf-putting-gate.md";
				const url = undefined;
				function rawContent() {
					return "\nPath matters more than speed at five feet. The gate forces a straight stroke.\n\n**Equipment needed:** A putter, six golf balls, two tees, a putting green or carpet.\n\n**Setup:** Place two tees a putter-head-width apart, six inches in front of the ball, aimed at a hole or target.\n\n**How to run it:**\n\n1. Putt the ball through the gate without clipping either tee.\n2. Five putts from five feet. Then five putts from ten feet.\n3. Track how many cleared the gate.\n\n**What to look for:** A miss to the left or right of the gate tells you the path is off, not the speed. The ball that clips the right tee means the face is open at impact.\n\n**Variation:** Narrow the gate to half a putter-head-width once the kid clears the standard width consistently. Reveals fine path errors.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Agility cones →](/go/agility-cones/) — useful for alignment and target drills.\n\n[Full golf gear guide →](/what-to-buy/golf/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
