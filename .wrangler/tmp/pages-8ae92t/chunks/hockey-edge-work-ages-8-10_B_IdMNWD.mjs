globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Edge work separates good skaters from okay ones. Young players at this age can learn to use edges intentionally instead of just shuffling.</p>\n<p><strong>Equipment needed:</strong> 8 cones, no puck.</p>\n<p><strong>Setup:</strong> Create a circle with cones about 15 yards in diameter. Skaters line up outside the circle.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Skater skates around the circle using only their outside edges (right edge on the right side, left edge on the left side). This feels like leaning into the turn.</li>\n<li>Complete one lap, then switch: use only inside edges (right edge on the left side, left edge on the right side). This is harder and slower.</li>\n<li>Do 2 laps each direction at controlled speed, then repeat at game speed.</li>\n<li>Rest.</li>\n</ol>\n<p><strong>What to look for:</strong></p>\n<p>Outside edges should feel smooth and fast. If a skater is rough or bouncy, they’re fighting the edge. Inside edges are harder because the skater has to lean more. If a skater falls or loses balance on inside edges, they’re not ready for this yet. Don’t push it. The skater should feel like they’re carving the turn, not shuffling around it.</p>\n<p><strong>Variation:</strong> Add a puck. Skater carries it around the circle while staying on edges. Or shrink the circle to 10 yards to force tighter edges.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/hockey-puck/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Hockey pucks (6-pack) →</a> — regulation pucks for drills and scrimmage.</p>\n<p><a href=\"/go/agility-cones/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Agility cones →</a> — for stickhandling courses and skating drills.</p>\n<p><a href=\"/what-to-buy/hockey/\">Full hockey gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Edge Work","summary":"Teach skaters to use inside and outside edges for turning and acceleration. 12 minutes.","sport":"hockey","ages":["8-10"],"focus":"fundamentals","layer":"foundations","fundamental":"skating","progression":"build","illustrationBrief":"A young skater turning at cone markers using inside and outside edges, changing direction quickly and maintaining speed.","publishedAt":"2026-02-23T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Variation block was truncated. Completed it."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/hockey-edge-work-ages-8-10.md";
				const url = undefined;
				function rawContent() {
					return "\nEdge work separates good skaters from okay ones. Young players at this age can learn to use edges intentionally instead of just shuffling.\n\n**Equipment needed:** 8 cones, no puck.\n\n**Setup:** Create a circle with cones about 15 yards in diameter. Skaters line up outside the circle.\n\n**How to run it:**\n\n1. Skater skates around the circle using only their outside edges (right edge on the right side, left edge on the left side). This feels like leaning into the turn.\n2. Complete one lap, then switch: use only inside edges (right edge on the left side, left edge on the right side). This is harder and slower.\n3. Do 2 laps each direction at controlled speed, then repeat at game speed.\n4. Rest.\n\n**What to look for:**\n\nOutside edges should feel smooth and fast. If a skater is rough or bouncy, they're fighting the edge. Inside edges are harder because the skater has to lean more. If a skater falls or loses balance on inside edges, they're not ready for this yet. Don't push it. The skater should feel like they're carving the turn, not shuffling around it.\n\n**Variation:** Add a puck. Skater carries it around the circle while staying on edges. Or shrink the circle to 10 yards to force tighter edges.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Hockey pucks (6-pack) →](/go/hockey-puck/) — regulation pucks for drills and scrimmage.\n\n[Agility cones →](/go/agility-cones/) — for stickhandling courses and skating drills.\n\n[Full hockey gear guide →](/what-to-buy/hockey/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
