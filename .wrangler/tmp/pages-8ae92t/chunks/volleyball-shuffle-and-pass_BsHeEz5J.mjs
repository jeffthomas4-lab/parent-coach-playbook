globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Real defense is shuffling between zones, reading the play, getting set, passing. This drill puts all of it together. Conditioning, technique, and reads in one drill.</p>\n<p><strong>What you need:</strong> A volleyball, three cones, two players.</p>\n<p><strong>Setup:</strong> Three cones forming a triangle, 8 feet apart. Coach at the apex with the ball.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Player starts at one cone in athletic stance.</li>\n<li>Coach calls out a cone color. Player shuffles to that cone.</li>\n<li>As they arrive, coach tosses the ball. Player passes back to coach.</li>\n<li>Coach calls another cone. Player shuffles. Tosses. Passes.</li>\n<li>Continue for 60 seconds. Rest. Repeat for 4 rounds.</li>\n</ol>\n<p><strong>What to watch:</strong> Footwork. Are they crossing feet during shuffles? Crossing feet is slow and unstable. Shuffle only.</p>\n<p><strong>If they’re struggling:</strong> Slower calls. Bigger cones (closer together).</p>\n<p><strong>If they’ve got it:</strong> Faster calls. Or add a setter target so the pass has to be accurate, not just back to the coach.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/volleyball-volley-lite/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Volley Lite training ball →</a> — lightweight ball for beginners learning to pass.</p>\n<p><a href=\"/what-to-buy/volleyball/\">Full volleyball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Shuffle and Pass","summary":"Defensive shuffle to a target spot, then pass. 12 minutes. Ages 11-12.","sport":"volleyball","ages":["11-12"],"fundamental":"passing","progression":"refine","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player shuffling rapidly between three cones in a triangle, receiving and bumping a ball at each cone before shuffling to the next.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Conditioning + reads combo. No-cross-feet teaching point is correct."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/volleyball-shuffle-and-pass.md";
				const url = undefined;
				function rawContent() {
					return "\nReal defense is shuffling between zones, reading the play, getting set, passing. This drill puts all of it together. Conditioning, technique, and reads in one drill.\n\n**What you need:** A volleyball, three cones, two players.\n\n**Setup:** Three cones forming a triangle, 8 feet apart. Coach at the apex with the ball.\n\n**How to run it:**\n\n1. Player starts at one cone in athletic stance.\n2. Coach calls out a cone color. Player shuffles to that cone.\n3. As they arrive, coach tosses the ball. Player passes back to coach.\n4. Coach calls another cone. Player shuffles. Tosses. Passes.\n5. Continue for 60 seconds. Rest. Repeat for 4 rounds.\n\n**What to watch:** Footwork. Are they crossing feet during shuffles? Crossing feet is slow and unstable. Shuffle only.\n\n**If they're struggling:** Slower calls. Bigger cones (closer together).\n\n**If they've got it:** Faster calls. Or add a setter target so the pass has to be accurate, not just back to the coach.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Volley Lite training ball →](/go/volleyball-volley-lite/) — lightweight ball for beginners learning to pass.\n\n[Full volleyball gear guide →](/what-to-buy/volleyball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
