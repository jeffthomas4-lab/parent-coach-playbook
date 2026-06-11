globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The wall is the perfect setting partner. It returns every set to the same spot. The kid can practice the hand shape, the push, and the target hundreds of times in a session.</p>\n<p><strong>What you need:</strong> A volleyball, a flat wall, a tape mark on the wall as the target.</p>\n<p><strong>Setup:</strong> Kid stands 5 feet from the wall. Tape target at 10 feet high (a shoe-length mark).</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Window, Soft, Push, Target.</li>\n<li>Set the ball at the target on the wall.</li>\n<li>Catch the rebound. Reset. Set again.</li>\n<li>Goal: 10 sets in a row hitting the target.</li>\n<li>After 10, set continuously (no catching). Goal: 5 in a row.</li>\n</ol>\n<p><strong>What to watch:</strong> Hand contact. Fingertips, not palms. Listen for the sound: a clean set is quiet. A slap is loud.</p>\n<p><strong>If they’re struggling:</strong> Move closer to 3 feet. Bigger target.</p>\n<p><strong>If they’ve got it:</strong> Move back to 8 feet. Or alternate hands (set, then bump, then set, etc.).</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/volleyball-volley-lite/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Volley Lite training ball →</a> — lightweight ball for beginners learning to pass.</p>\n<p><a href=\"/go/volleyball-shoes-upcourt/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Volleyball shoes →</a> — Asics Upcourt, non-marking gum sole.</p>\n<p><a href=\"/what-to-buy/volleyball/\">Full volleyball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Set Against the Wall","summary":"Set the ball against a wall and catch the rebound. 10 minutes. Ages 8-10 and 11-12.","sport":"volleyball","ages":["8-10","11-12"],"fundamental":"setting","progression":"build","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player setting a volleyball against a brick wall above a marked target line, the ball rebounding back for another set.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Solo setting drill. Quiet-vs-slap audio cue is sharp."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/volleyball-set-against-wall.md";
				const url = undefined;
				function rawContent() {
					return "\nThe wall is the perfect setting partner. It returns every set to the same spot. The kid can practice the hand shape, the push, and the target hundreds of times in a session.\n\n**What you need:** A volleyball, a flat wall, a tape mark on the wall as the target.\n\n**Setup:** Kid stands 5 feet from the wall. Tape target at 10 feet high (a shoe-length mark).\n\n**How to run it:**\n\n1. Cue: Window, Soft, Push, Target.\n2. Set the ball at the target on the wall.\n3. Catch the rebound. Reset. Set again.\n4. Goal: 10 sets in a row hitting the target.\n5. After 10, set continuously (no catching). Goal: 5 in a row.\n\n**What to watch:** Hand contact. Fingertips, not palms. Listen for the sound: a clean set is quiet. A slap is loud.\n\n**If they're struggling:** Move closer to 3 feet. Bigger target.\n\n**If they've got it:** Move back to 8 feet. Or alternate hands (set, then bump, then set, etc.).\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Volley Lite training ball →](/go/volleyball-volley-lite/) — lightweight ball for beginners learning to pass.\n\n[Volleyball shoes →](/go/volleyball-shoes-upcourt/) — Asics Upcourt, non-marking gum sole.\n\n[Full volleyball gear guide →](/what-to-buy/volleyball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
