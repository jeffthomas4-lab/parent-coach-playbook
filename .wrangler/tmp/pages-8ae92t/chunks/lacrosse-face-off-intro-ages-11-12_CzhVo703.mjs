globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Face-offs are 50-50 plays. This drill teaches young players the mechanics and builds confidence in winning ground balls at the center.</p>\n<p><strong>Equipment needed:</strong> 4 cones, 1 ball, 8 sticks.</p>\n<p><strong>Setup:</strong> Place one cone at the center. Two players line up at the center, one on each side, in face-off position. A coach or player stands to the side with the ball.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Two face-off players get in position: sticks horizontal, knees bent, eyes forward, ready to move.</li>\n<li>Coach places the ball between their sticks and calls “Go.”</li>\n<li>Both players try to control the ball and win it back to their side. No illegal stick contact (hacking). Ground ball battles only.</li>\n<li>Do 10 reps per pair, alternating sides (player A on left, then on right).</li>\n</ol>\n<p><strong>What to look for:</strong></p>\n<p>Each player should be low and balanced. If they’re standing up or leaning, they can’t react fast. The first move should be explosive, not cautious. The player with the best first step often wins the ball. Both players should fight for the ground ball after the initial contact. If one player is getting beaten every rep, rotation might be the issue.</p>\n<p><strong>Variation:</strong> Add trailing players. Two more players stand 5 yards behind each face-off player. Once the ball is won, the trailing player can help secure it. This teaches the team component of face-offs.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/lacrosse-ball/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Lacrosse balls →</a> — official 6-pack. The drill burns through balls fast.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Face-Off Intro","summary":"Teach the basic mechanics of a face-off and winning the ground ball. 12 minutes.","sport":"lacrosse","age":"11-12","focus":"fundamentals","publishedAt":"2026-03-10T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":7,"originalityGrade":7,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Generic lacrosse tag, but face-off is a boys'-only term (girls' use 'draw'). Should be retagged lacrosse-boys. Affiliate disclosure present."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/lacrosse-face-off-intro-ages-11-12.md";
				const url = undefined;
				function rawContent() {
					return "\nFace-offs are 50-50 plays. This drill teaches young players the mechanics and builds confidence in winning ground balls at the center.\n\n**Equipment needed:** 4 cones, 1 ball, 8 sticks.\n\n**Setup:** Place one cone at the center. Two players line up at the center, one on each side, in face-off position. A coach or player stands to the side with the ball.\n\n**How to run it:**\n\n1. Two face-off players get in position: sticks horizontal, knees bent, eyes forward, ready to move.\n2. Coach places the ball between their sticks and calls \"Go.\"\n3. Both players try to control the ball and win it back to their side. No illegal stick contact (hacking). Ground ball battles only.\n4. Do 10 reps per pair, alternating sides (player A on left, then on right).\n\n**What to look for:**\n\nEach player should be low and balanced. If they're standing up or leaning, they can't react fast. The first move should be explosive, not cautious. The player with the best first step often wins the ball. Both players should fight for the ground ball after the initial contact. If one player is getting beaten every rep, rotation might be the issue.\n\n**Variation:** Add trailing players. Two more players stand 5 yards behind each face-off player. Once the ball is won, the trailing player can help secure it. This teaches the team component of face-offs.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Lacrosse balls →](/go/lacrosse-ball/) — official 6-pack. The drill burns through balls fast.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
