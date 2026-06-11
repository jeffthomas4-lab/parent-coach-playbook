globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The mohawk is the move that turns a forward skater into a backward skater in one step. Hips open. Feet point opposite directions for a beat. Then the skater is going backward without losing speed. Defensemen use this to track an offensive player who turned upice.</p>\n<p><strong>What you need:</strong> Full gear, ice rink.</p>\n<p><strong>Setup:</strong> Skater at one blue line. Open lane.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Skater starts forward skating slowly toward center ice.</li>\n<li>At center, opens the back hip and pivots the back foot 180 degrees. Feet are now heel-to-heel for a beat.</li>\n<li>Continues motion now skating backward.</li>\n<li>Backward skate to the other blue line.</li>\n<li>Skate forward back. Do the mohawk again on the other side. 4 reps each direction.</li>\n</ol>\n<p><strong>What to watch:</strong> The hip rotation. If the hips don’t open fully, the feet tangle. The hip leads, the foot follows.</p>\n<p><strong>If they’re struggling:</strong> Walk through the footwork on the ice without speed. Just open the hip and turn the foot.</p>\n<p><strong>If they’ve got it:</strong> Combine with a stop. Mohawk turn into a hockey stop, then explode forward.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/hockey-puck/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Hockey pucks (6-pack) →</a> — regulation pucks for drills and scrimmage.</p>\n<p><a href=\"/what-to-buy/hockey/\">Full hockey gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Mohawk Turn","summary":"Open the hips to turn from forward to backward without crossing feet. 12 minutes. Ages 11-12.","sport":"hockey","ages":["11-12"],"fundamental":"skating","progression":"refine","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Skater with feet pointing in opposite directions (like a heel-to-heel position), pivoting from forward skating to backward skating in one motion.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Hip-leads-the-foot cue is the right diagnostic for tangling feet."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/hockey-mohawk-turn.md";
				const url = undefined;
				function rawContent() {
					return "\nThe mohawk is the move that turns a forward skater into a backward skater in one step. Hips open. Feet point opposite directions for a beat. Then the skater is going backward without losing speed. Defensemen use this to track an offensive player who turned upice.\n\n**What you need:** Full gear, ice rink.\n\n**Setup:** Skater at one blue line. Open lane.\n\n**How to run it:**\n\n1. Skater starts forward skating slowly toward center ice.\n2. At center, opens the back hip and pivots the back foot 180 degrees. Feet are now heel-to-heel for a beat.\n3. Continues motion now skating backward.\n4. Backward skate to the other blue line.\n5. Skate forward back. Do the mohawk again on the other side. 4 reps each direction.\n\n**What to watch:** The hip rotation. If the hips don't open fully, the feet tangle. The hip leads, the foot follows.\n\n**If they're struggling:** Walk through the footwork on the ice without speed. Just open the hip and turn the foot.\n\n**If they've got it:** Combine with a stop. Mohawk turn into a hockey stop, then explode forward.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Hockey pucks (6-pack) →](/go/hockey-puck/) — regulation pucks for drills and scrimmage.\n\n[Full hockey gear guide →](/what-to-buy/hockey/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
