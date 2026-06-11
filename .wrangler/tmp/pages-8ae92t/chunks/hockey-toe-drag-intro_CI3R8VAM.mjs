globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The toe drag is the move that beats a defender who lunges at the puck. Reach the puck out, defender goes for it, you drag it back with the toe of the stick and slip past. Pro move. Worth teaching at 11-12 because the kids who learn it become the kids who score.</p>\n<p><strong>What you need:</strong> Stick, puck, ice rink or off-ice space, optional defender or cone.</p>\n<p><strong>Setup:</strong> Skater with the puck. Cone or defender 10 feet ahead.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Skater approaches the cone with the puck on the forehand side.</li>\n<li>As they reach the cone, they extend the stick out as if pushing the puck forward.</li>\n<li>Pull the puck back with the toe of the blade and across the body to the backhand.</li>\n<li>Continue past the cone with the puck on the backhand side.</li>\n<li>Do 6 reps each direction.</li>\n</ol>\n<p><strong>What to watch:</strong> The drag. The toe of the stick has to make contact with the puck. If the toe misses, the puck stays where it was extended.</p>\n<p><strong>If they’re struggling:</strong> Stationary first. Just practice the drag without skating. Toe drag in place.</p>\n<p><strong>If they’ve got it:</strong> Add a live defender. The defender tries to poke check the puck. The skater toe-drags around.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/hockey-puck/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Hockey pucks (6-pack) →</a> — regulation pucks for drills and scrimmage.</p>\n<p><a href=\"/go/hockey-stick-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth hockey stick →</a> — Franklin Ripper, flex rated for young players.</p>\n<p><a href=\"/what-to-buy/hockey/\">Full hockey gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Toe Drag Intro","summary":"Pull the puck back with the toe of the stick to fake out a defender. 12 minutes. Ages 11-12.","sport":"hockey","ages":["11-12"],"fundamental":"stick-handling","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player using the toe of the stick to drag the puck backward and across the body, defender lunging the wrong direction.","editorial":{"qualityGrade":7,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Cone-or-defender setup gives easy progression from solo to live."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/hockey-toe-drag-intro.md";
				const url = undefined;
				function rawContent() {
					return "\nThe toe drag is the move that beats a defender who lunges at the puck. Reach the puck out, defender goes for it, you drag it back with the toe of the stick and slip past. Pro move. Worth teaching at 11-12 because the kids who learn it become the kids who score.\n\n**What you need:** Stick, puck, ice rink or off-ice space, optional defender or cone.\n\n**Setup:** Skater with the puck. Cone or defender 10 feet ahead.\n\n**How to run it:**\n\n1. Skater approaches the cone with the puck on the forehand side.\n2. As they reach the cone, they extend the stick out as if pushing the puck forward.\n3. Pull the puck back with the toe of the blade and across the body to the backhand.\n4. Continue past the cone with the puck on the backhand side.\n5. Do 6 reps each direction.\n\n**What to watch:** The drag. The toe of the stick has to make contact with the puck. If the toe misses, the puck stays where it was extended.\n\n**If they're struggling:** Stationary first. Just practice the drag without skating. Toe drag in place.\n\n**If they've got it:** Add a live defender. The defender tries to poke check the puck. The skater toe-drags around.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Hockey pucks (6-pack) →](/go/hockey-puck/) — regulation pucks for drills and scrimmage.\n\n[Youth hockey stick →](/go/hockey-stick-youth/) — Franklin Ripper, flex rated for young players.\n\n[Full hockey gear guide →](/what-to-buy/hockey/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
