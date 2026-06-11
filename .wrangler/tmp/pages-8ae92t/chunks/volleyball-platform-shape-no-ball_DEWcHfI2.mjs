globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The forearm pass (the bump) starts with a platform. Arms straight, hands together, flat surface from elbow to wrist. If the platform isn’t right, no pass works. This drill builds the shape before the ball is even involved.</p>\n<p><strong>What you need:</strong> Open space. No ball.</p>\n<p><strong>Setup:</strong> Kid stands in athletic stance: feet shoulder-width, knees bent.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Ready, Platform, Angle, Push.</li>\n<li>Ready: athletic stance, arms relaxed by the sides.</li>\n<li>Platform: arms straight, palms together, thumbs aligned, hands clasped softly. Platform extends from elbows to wrists.</li>\n<li>Coach checks the platform: arms straight, no bend, palms facing up.</li>\n<li>Hold the platform for 10 seconds. Reset. Do 8 reps.</li>\n</ol>\n<p><strong>What to watch:</strong> Bent elbows. Most kids will bend their elbows when forming the platform. Straight arms only.</p>\n<p><strong>If they’re struggling:</strong> Have them lock the elbows by pressing the arms together. Or use a balloon to bump and feel the platform shape.</p>\n<p><strong>If they’ve got it:</strong> Add a balloon or beach ball. They form the platform and bump the ball softly.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/volleyball-volley-lite/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Volley Lite training ball →</a> — lightweight ball for beginners learning to pass.</p>\n<p><a href=\"/what-to-buy/volleyball/\">Full volleyball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Platform Shape, No Ball","summary":"Build the forearm pass platform without a ball first. 8 minutes. Ages 5-7 and 8-10.","sport":"volleyball","ages":["5-7","8-10"],"fundamental":"passing","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A young player standing in athletic stance with arms straight out in front, hands together with thumbs aligned, forming a flat platform from elbows to wrists.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Pre-ball platform shape. Balloon progression is a good young-age fallback."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/volleyball-platform-shape-no-ball.md";
				const url = undefined;
				function rawContent() {
					return "\nThe forearm pass (the bump) starts with a platform. Arms straight, hands together, flat surface from elbow to wrist. If the platform isn't right, no pass works. This drill builds the shape before the ball is even involved.\n\n**What you need:** Open space. No ball.\n\n**Setup:** Kid stands in athletic stance: feet shoulder-width, knees bent.\n\n**How to run it:**\n\n1. Cue: Ready, Platform, Angle, Push.\n2. Ready: athletic stance, arms relaxed by the sides.\n3. Platform: arms straight, palms together, thumbs aligned, hands clasped softly. Platform extends from elbows to wrists.\n4. Coach checks the platform: arms straight, no bend, palms facing up.\n5. Hold the platform for 10 seconds. Reset. Do 8 reps.\n\n**What to watch:** Bent elbows. Most kids will bend their elbows when forming the platform. Straight arms only.\n\n**If they're struggling:** Have them lock the elbows by pressing the arms together. Or use a balloon to bump and feel the platform shape.\n\n**If they've got it:** Add a balloon or beach ball. They form the platform and bump the ball softly.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Volley Lite training ball →](/go/volleyball-volley-lite/) — lightweight ball for beginners learning to pass.\n\n[Full volleyball gear guide →](/what-to-buy/volleyball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
