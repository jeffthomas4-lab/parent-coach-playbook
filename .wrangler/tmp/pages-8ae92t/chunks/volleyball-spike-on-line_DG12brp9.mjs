globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A line shot is a spike that travels straight down the sideline. It catches the defense out of position. Best hitters aim the spike. This drill teaches the line shot specifically.</p>\n<p><strong>What you need:</strong> A volleyball, a net, a setter, target cones in the back corners.</p>\n<p><strong>Setup:</strong> Hitter at left front. Setter at center. Target cone in the back left corner of the opposite court (the line zone).</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Approach, Plant, Reach, Snap.</li>\n<li>Setter sets the ball.</li>\n<li>Hitter approaches and spikes, aiming for the target cone in the back left corner.</li>\n<li>The shot has to travel straight down the line, not crossbody.</li>\n<li>Do 8 reps. Track makes vs. misses.</li>\n</ol>\n<p><strong>What to watch:</strong> Hand position at contact. To hit a line shot, the hand has to come down on the BACK side of the ball, pushing it toward the line. Crossbody contact sends it crosscourt.</p>\n<p><strong>If they’re struggling:</strong> Lower the net. Use a tossed ball. Bigger target.</p>\n<p><strong>If they’ve got it:</strong> Alternate line shots and crosscourt shots. Hitter has to call the shot before the spike.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/volleyball-volley-lite/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Volley Lite training ball →</a> — lightweight ball for beginners learning to pass.</p>\n<p><a href=\"/go/volleyball-net/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Portable volleyball net →</a> — 32-ft set with adjustable steel poles.</p>\n<p><a href=\"/what-to-buy/volleyball/\">Full volleyball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Spike on the Line","summary":"Spike to specific zones, hitting the line shot. 12 minutes. Ages 11-12.","sport":"volleyball","ages":["11-12"],"fundamental":"spiking","progression":"refine","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Hitter at the left front spiking the ball straight down the sideline, ball arcing into the back left corner of the court.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Removed a not-just-X-but-Y phrasing. Hand position teaching point is the keeper."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/volleyball-spike-on-line.md";
				const url = undefined;
				function rawContent() {
					return "\nA line shot is a spike that travels straight down the sideline. It catches the defense out of position. Best hitters aim the spike. This drill teaches the line shot specifically.\n\n**What you need:** A volleyball, a net, a setter, target cones in the back corners.\n\n**Setup:** Hitter at left front. Setter at center. Target cone in the back left corner of the opposite court (the line zone).\n\n**How to run it:**\n\n1. Cue: Approach, Plant, Reach, Snap.\n2. Setter sets the ball.\n3. Hitter approaches and spikes, aiming for the target cone in the back left corner.\n4. The shot has to travel straight down the line, not crossbody.\n5. Do 8 reps. Track makes vs. misses.\n\n**What to watch:** Hand position at contact. To hit a line shot, the hand has to come down on the BACK side of the ball, pushing it toward the line. Crossbody contact sends it crosscourt.\n\n**If they're struggling:** Lower the net. Use a tossed ball. Bigger target.\n\n**If they've got it:** Alternate line shots and crosscourt shots. Hitter has to call the shot before the spike.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Volley Lite training ball →](/go/volleyball-volley-lite/) — lightweight ball for beginners learning to pass.\n\n[Portable volleyball net →](/go/volleyball-net/) — 32-ft set with adjustable steel poles.\n\n[Full volleyball gear guide →](/what-to-buy/volleyball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
