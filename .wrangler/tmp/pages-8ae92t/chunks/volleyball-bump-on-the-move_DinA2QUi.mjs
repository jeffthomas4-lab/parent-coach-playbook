globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>In a real game, the ball never comes right to the passer. They have to move first, then pass. The legs get there, the arms form the platform after. This drill builds that order: feet first, arms second.</p>\n<p><strong>What you need:</strong> A volleyball, two players (coach + passer), a target (cone or partner).</p>\n<p><strong>Setup:</strong> Passer at center of the court. Coach 15 feet away with the ball.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Ready, Platform, Angle, Push.</li>\n<li>Coach tosses the ball 5 feet to the left or right of the passer.</li>\n<li>Passer shuffles to the spot (no crossing feet), arrives, plants both feet.</li>\n<li>Forms the platform AFTER arriving, not while moving.</li>\n<li>Bumps the ball to the target. Do 10 reps mixing left and right.</li>\n</ol>\n<p><strong>What to watch:</strong> Are they forming the platform while still moving? That kills the pass. Get the feet there, then form the platform.</p>\n<p><strong>If they’re struggling:</strong> Tosses closer to the body. Slower tempo.</p>\n<p><strong>If they’ve got it:</strong> Vary the toss distance and direction. Or add a forward toss (passer moves forward to short ball).</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/volleyball-volley-lite/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Volley Lite training ball →</a> — lightweight ball for beginners learning to pass.</p>\n<p><a href=\"/what-to-buy/volleyball/\">Full volleyball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Bump on the Move","summary":"Move to the ball, then form the platform and pass. 12 minutes. Ages 11-12.","sport":"volleyball","ages":["11-12"],"fundamental":"passing","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player shuffling sideways to track a tossed ball, arriving at the spot, then forming the platform to bump the ball to a target.","editorial":{"qualityGrade":8,"originalityGrade":8,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Feet-first principle articulated well. Solid teaching point."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/volleyball-bump-on-the-move.md";
				const url = undefined;
				function rawContent() {
					return "\nIn a real game, the ball never comes right to the passer. They have to move first, then pass. The legs get there, the arms form the platform after. This drill builds that order: feet first, arms second.\n\n**What you need:** A volleyball, two players (coach + passer), a target (cone or partner).\n\n**Setup:** Passer at center of the court. Coach 15 feet away with the ball.\n\n**How to run it:**\n\n1. Cue: Ready, Platform, Angle, Push.\n2. Coach tosses the ball 5 feet to the left or right of the passer.\n3. Passer shuffles to the spot (no crossing feet), arrives, plants both feet.\n4. Forms the platform AFTER arriving, not while moving.\n5. Bumps the ball to the target. Do 10 reps mixing left and right.\n\n**What to watch:** Are they forming the platform while still moving? That kills the pass. Get the feet there, then form the platform.\n\n**If they're struggling:** Tosses closer to the body. Slower tempo.\n\n**If they've got it:** Vary the toss distance and direction. Or add a forward toss (passer moves forward to short ball).\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Volley Lite training ball →](/go/volleyball-volley-lite/) — lightweight ball for beginners learning to pass.\n\n[Full volleyball gear guide →](/what-to-buy/volleyball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
