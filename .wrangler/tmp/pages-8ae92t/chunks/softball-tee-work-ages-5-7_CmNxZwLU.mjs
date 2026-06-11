globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Softball hitting starts with the tee and a single thought: level swing, follow through. The underhand mechanics are taught later. Right now, contact is everything.</p>\n<p><strong>Equipment needed:</strong> A softball tee, 15 safety-core softballs, a bucket, one bat.</p>\n<p><strong>Setup:</strong> Place the tee at home plate. Stand 20 feet away with the bucket. A fence or net is behind the tee.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Place a ball on the tee at the hitter’s belt height.</li>\n<li>Hitter addresses the plate, sets their feet, and swings level.</li>\n<li>You call “Swing” and they go. Simple trigger.</li>\n<li>After the swing, they place the next ball on the tee.</li>\n<li>Do 15 reps. Count how many make solid contact (not perfect contact, just solid).</li>\n</ol>\n<p><strong>What to look for:</strong> A level swing and a complete follow-through. The bat should finish at shoulder height. Kids who drop the bat early are slapping instead of swinging.</p>\n<p><strong>Variation:</strong> For younger kids (5-6), tee the ball slightly higher so they’re more likely to make contact. For older kids (7), tee the ball lower (knee height) and work on staying level through the bottom of the zone.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/softball-glove-11in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth softball glove →</a> — 11-inch fielder’s glove for new players.</p>\n<p><a href=\"/what-to-buy/softball/\">Full softball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Softball Tee Work","summary":"Hit off a tee with the proper underhand swing approach. 15 minutes. Ages 5-7.","sport":"softball","ages":["5-7"],"focus":"fundamentals","layer":"foundations","fundamental":"hitting","progression":"intro","illustrationBrief":"Batting off the tee with proper form","publishedAt":"2026-01-02T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Solid intro tee drill; level swing focus."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/softball-tee-work-ages-5-7.md";
				const url = undefined;
				function rawContent() {
					return "\nSoftball hitting starts with the tee and a single thought: level swing, follow through. The underhand mechanics are taught later. Right now, contact is everything.\n\n**Equipment needed:** A softball tee, 15 safety-core softballs, a bucket, one bat.\n\n**Setup:** Place the tee at home plate. Stand 20 feet away with the bucket. A fence or net is behind the tee.\n\n**How to run it:**\n\n1. Place a ball on the tee at the hitter's belt height.\n2. Hitter addresses the plate, sets their feet, and swings level.\n3. You call \"Swing\" and they go. Simple trigger.\n4. After the swing, they place the next ball on the tee.\n5. Do 15 reps. Count how many make solid contact (not perfect contact, just solid).\n\n**What to look for:** A level swing and a complete follow-through. The bat should finish at shoulder height. Kids who drop the bat early are slapping instead of swinging.\n\n**Variation:** For younger kids (5-6), tee the ball slightly higher so they're more likely to make contact. For older kids (7), tee the ball lower (knee height) and work on staying level through the bottom of the zone.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth softball glove →](/go/softball-glove-11in/) — 11-inch fielder's glove for new players.\n\n[Full softball gear guide →](/what-to-buy/softball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
