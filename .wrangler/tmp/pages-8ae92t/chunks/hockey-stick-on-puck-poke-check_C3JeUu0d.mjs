globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A poke check is the cleanest defensive move in hockey. Stick out, blade on puck, knock it loose. No body contact needed. Done right, it’s the way to disrupt an attacker without taking a penalty.</p>\n<p><strong>What you need:</strong> Sticks, puck, two players in full gear.</p>\n<p><strong>Setup:</strong> Attacker carries the puck along the boards. Defender skates parallel.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Defender stays in gap (5 feet from attacker).</li>\n<li>As attacker reaches a vulnerable moment (puck slightly extended), defender extends the stick out fast.</li>\n<li>Blade contacts the puck, not the attacker’s stick or body.</li>\n<li>Puck comes loose. Defender or third player picks it up.</li>\n<li>Do 8 reps. Switch roles.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the defender lunge or stay balanced? A lunge that misses leaves them out of position. Quick stick extension while keeping feet under the body is the move.</p>\n<p><strong>If they’re struggling:</strong> Drop the speed. Walk through the timing.</p>\n<p><strong>If they’ve got it:</strong> Add a 2v1. The defender has to read whether to poke check the puck carrier or the pass.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/hockey-puck/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Hockey pucks (6-pack) →</a> — regulation pucks for drills and scrimmage.</p>\n<p><a href=\"/go/hockey-stick-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth hockey stick →</a> — Franklin Ripper, flex rated for young players.</p>\n<p><a href=\"/what-to-buy/hockey/\">Full hockey gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Stick on Puck Poke Check","summary":"Use the stick to take the puck without grabbing or hitting. 10 minutes. Ages 11-12.","sport":"hockey","ages":["11-12"],"fundamental":"defending","progression":"refine","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Defender extending the stick with one hand, the blade meeting the puck on the attacker's stick to knock it loose.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"11-12, no body checks. Stick-on-puck only, fits USA Hockey age rules."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/hockey-stick-on-puck-poke-check.md";
				const url = undefined;
				function rawContent() {
					return "\nA poke check is the cleanest defensive move in hockey. Stick out, blade on puck, knock it loose. No body contact needed. Done right, it's the way to disrupt an attacker without taking a penalty.\n\n**What you need:** Sticks, puck, two players in full gear.\n\n**Setup:** Attacker carries the puck along the boards. Defender skates parallel.\n\n**How to run it:**\n\n1. Defender stays in gap (5 feet from attacker).\n2. As attacker reaches a vulnerable moment (puck slightly extended), defender extends the stick out fast.\n3. Blade contacts the puck, not the attacker's stick or body.\n4. Puck comes loose. Defender or third player picks it up.\n5. Do 8 reps. Switch roles.\n\n**What to watch:** Does the defender lunge or stay balanced? A lunge that misses leaves them out of position. Quick stick extension while keeping feet under the body is the move.\n\n**If they're struggling:** Drop the speed. Walk through the timing.\n\n**If they've got it:** Add a 2v1. The defender has to read whether to poke check the puck carrier or the pass.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Hockey pucks (6-pack) →](/go/hockey-puck/) — regulation pucks for drills and scrimmage.\n\n[Youth hockey stick →](/go/hockey-stick-youth/) — Franklin Ripper, flex rated for young players.\n\n[Full hockey gear guide →](/what-to-buy/hockey/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
