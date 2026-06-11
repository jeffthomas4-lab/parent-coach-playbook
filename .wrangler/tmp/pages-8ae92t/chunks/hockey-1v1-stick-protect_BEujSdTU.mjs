globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Protecting the puck is body position. Defender on one side, puck on the other, body between. This is how players hold the puck under pressure long enough to make a play. Most kids just try to outskate the defender. This drill teaches them to hold instead.</p>\n<p><strong>What you need:</strong> Sticks, puck, two players in full gear.</p>\n<p><strong>Setup:</strong> Player A with the puck along the boards. Player B (defender) 5 feet away.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Coach blows whistle. Defender skates toward Player A.</li>\n<li>Player A turns the body so the defender is on one side and the puck is on the other (puck on the far side of the body).</li>\n<li>Player A skates along the boards while keeping the body between defender and puck.</li>\n<li>After 5 seconds, Player A makes a play (pass to coach or shoot).</li>\n<li>Do 6 reps. Switch roles.</li>\n</ol>\n<p><strong>What to watch:</strong> Body position. If the defender can reach the puck without going through Player A, the body isn’t between them. The puck has to be on the far side.</p>\n<p><strong>If they’re struggling:</strong> Slower defender. Or no contact (defender just stick-checks).</p>\n<p><strong>If they’ve got it:</strong> Two defenders. Or open ice (no boards) so the player has nothing to lean on.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/hockey-puck/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Hockey pucks (6-pack) →</a> — regulation pucks for drills and scrimmage.</p>\n<p><a href=\"/go/hockey-stick-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth hockey stick →</a> — Franklin Ripper, flex rated for young players.</p>\n<p><a href=\"/what-to-buy/hockey/\">Full hockey gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"1v1 Stick Protect","summary":"Keep the body between the defender and the puck while moving. 15 minutes. Ages 11-12.","sport":"hockey","ages":["11-12"],"fundamental":"stick-handling","progression":"refine","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player skating along the boards with the body between a defender and the puck, the stick on the far side of the body shielding the puck.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"11-12, no body checks. Drill uses body position and shielding only, defender stick-checks. Within USA Hockey age rules."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/hockey-1v1-stick-protect.md";
				const url = undefined;
				function rawContent() {
					return "\nProtecting the puck is body position. Defender on one side, puck on the other, body between. This is how players hold the puck under pressure long enough to make a play. Most kids just try to outskate the defender. This drill teaches them to hold instead.\n\n**What you need:** Sticks, puck, two players in full gear.\n\n**Setup:** Player A with the puck along the boards. Player B (defender) 5 feet away.\n\n**How to run it:**\n\n1. Coach blows whistle. Defender skates toward Player A.\n2. Player A turns the body so the defender is on one side and the puck is on the other (puck on the far side of the body).\n3. Player A skates along the boards while keeping the body between defender and puck.\n4. After 5 seconds, Player A makes a play (pass to coach or shoot).\n5. Do 6 reps. Switch roles.\n\n**What to watch:** Body position. If the defender can reach the puck without going through Player A, the body isn't between them. The puck has to be on the far side.\n\n**If they're struggling:** Slower defender. Or no contact (defender just stick-checks).\n\n**If they've got it:** Two defenders. Or open ice (no boards) so the player has nothing to lean on.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Hockey pucks (6-pack) →](/go/hockey-puck/) — regulation pucks for drills and scrimmage.\n\n[Youth hockey stick →](/go/hockey-stick-youth/) — Franklin Ripper, flex rated for young players.\n\n[Full hockey gear guide →](/what-to-buy/hockey/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
