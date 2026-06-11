globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Hard hands drop balls. Soft hands catch them.</p>\n<p><strong>Equipment needed:</strong> A football, one player, one tosser.</p>\n<p><strong>Setup:</strong> Player stands ten feet from the tosser, hands up at chest height in a diamond shape (thumbs together for high balls, pinkies together for low).</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li><strong>Phase 1 — Stationary.</strong> Five throws right at the chest. Hands form the diamond, ball lands in the pocket, fingers wrap last.</li>\n<li><strong>Phase 2 — On the run.</strong> Player jogs across, tosser leads them by a step. Hands meet the ball out front.</li>\n<li><strong>Phase 3 — Over the shoulder.</strong> Player runs away, tosser throws a soft arc. Player catches over the shoulder without breaking stride.</li>\n</ol>\n<p><strong>What to look for:</strong> Fingertips touch the ball first, then the palms. If you hear a slap, hands are too stiff.</p>\n<p><strong>Variation:</strong> Use a wet football. Forces a tighter grip and harder concentration. Saved for ages 11+.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/football-rubber-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber football →</a> — Wilson youth rubber ball for rec and practice.</p>\n<p><a href=\"/what-to-buy/football-7v7/\">Full football 7v7 gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Soft-Hands Catch Progression","summary":"Three progressions for receivers to absorb the ball instead of trapping it. Ages 8-12.","sport":"football-7v7","age":"8-10","ages":["8-10","11-12"],"focus":"fundamentals","layer":"foundations","fundamental":"catching","progression":"intro","illustrationBrief":"A youth receiver catching a football with hands forming a diamond shape, eyes locked on the ball.","publishedAt":"2026-05-12T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":6,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-12T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Generated as part of the per-sport content baseline. Voice may need a Jeff pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/football-7v7-soft-hands-catch-progression.md";
				const url = undefined;
				function rawContent() {
					return "\nHard hands drop balls. Soft hands catch them.\n\n**Equipment needed:** A football, one player, one tosser.\n\n**Setup:** Player stands ten feet from the tosser, hands up at chest height in a diamond shape (thumbs together for high balls, pinkies together for low).\n\n**How to run it:**\n\n1. **Phase 1 — Stationary.** Five throws right at the chest. Hands form the diamond, ball lands in the pocket, fingers wrap last.\n2. **Phase 2 — On the run.** Player jogs across, tosser leads them by a step. Hands meet the ball out front.\n3. **Phase 3 — Over the shoulder.** Player runs away, tosser throws a soft arc. Player catches over the shoulder without breaking stride.\n\n**What to look for:** Fingertips touch the ball first, then the palms. If you hear a slap, hands are too stiff.\n\n**Variation:** Use a wet football. Forces a tighter grip and harder concentration. Saved for ages 11+.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber football →](/go/football-rubber-youth/) — Wilson youth rubber ball for rec and practice.\n\n[Full football 7v7 gear guide →](/what-to-buy/football-7v7/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
