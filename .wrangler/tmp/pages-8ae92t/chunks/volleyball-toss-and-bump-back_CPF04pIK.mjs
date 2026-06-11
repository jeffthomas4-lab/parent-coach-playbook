globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The first real bump rep is from a controlled toss. The coach throws to a predictable spot. The kid forms the platform and bumps the ball back. No movement, no surprise. Just feel the ball on the platform.</p>\n<p><strong>What you need:</strong> A <a href=\"/go/volleyball-volley-lite/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">volleyball</a>, two players (kid + coach).</p>\n<p><strong>Setup:</strong> Coach stands 12 feet from the kid with a ball.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Ready, Platform, Angle, Push.</li>\n<li>Coach tosses the ball underhand to chest height.</li>\n<li>Kid forms the platform, angles toward the coach, pushes with the legs.</li>\n<li>Ball bumps back to the coach’s chest.</li>\n<li>Do 10 reps.</li>\n</ol>\n<p><strong>What to watch:</strong> Where does the ball hit on the arms? It should hit the meat of the forearms, not the wrists or elbows. Forearm contact only.</p>\n<p><strong>If they’re struggling:</strong> Slower tosses. Bigger ball (volleyball trainer or beach ball).</p>\n<p><strong>If they’ve got it:</strong> Toss slightly off-center so they have to step before bumping. Or</p>";

				const frontmatter = {"title":"Toss and Bump Back","summary":"Coach tosses, kid bumps the ball back. 10 minutes. Ages 8-10.","sport":"volleyball","ages":["8-10"],"fundamental":"passing","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Coach standing 12 feet from a player, gently tossing a volleyball underhand, the player bumping it straight back with a flat platform.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"First-rep bump drill. Forearm-meat contact point is correct."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/volleyball-toss-and-bump-back.md";
				const url = undefined;
				function rawContent() {
					return "\nThe first real bump rep is from a controlled toss. The coach throws to a predictable spot. The kid forms the platform and bumps the ball back. No movement, no surprise. Just feel the ball on the platform.\n\n**What you need:** A [volleyball](/go/volleyball-volley-lite/), two players (kid + coach).\n\n**Setup:** Coach stands 12 feet from the kid with a ball.\n\n**How to run it:**\n\n1. Cue: Ready, Platform, Angle, Push.\n2. Coach tosses the ball underhand to chest height.\n3. Kid forms the platform, angles toward the coach, pushes with the legs.\n4. Ball bumps back to the coach's chest.\n5. Do 10 reps.\n\n**What to watch:** Where does the ball hit on the arms? It should hit the meat of the forearms, not the wrists or elbows. Forearm contact only.\n\n**If they're struggling:** Slower tosses. Bigger ball (volleyball trainer or beach ball).\n\n**If they've got it:** Toss slightly off-center so they have to step before bumping. Or";
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
