globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Game finishes happen with defenders bumping you. This drill adds light contact. The finisher stays strong and focuses on the rim, not the defender.</p>\n<p><strong>What you need:</strong> Basketball. Three kids per rep (shooter, passer, light defender). Half-court.</p>\n<p><strong>Setup:</strong> Passer near the top of the key. Shooter at the wing. Defender in the lane on the shooter.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Passer passes to the shooter at the wing.</li>\n<li>Shooter drives toward the basket. Defender applies light contact (bumping, not fouling).</li>\n<li>Shooter finishes the layup through contact. Eyes on the rim, not the defender.</li>\n<li>Do 5 reps. Rest. Rotate roles.</li>\n</ol>\n<p><strong>What to watch:</strong> Do they keep their eyes on the rim or do they look at the defender? Eyes on the rim always. That’s where the finish happens.</p>\n<p><strong>If they’re struggling:</strong> Have the defender apply no contact, just presence. Let the shooter build confidence first.</p>\n<p><strong>If they’ve got it:</strong> Increase contact intensity. Defender plays at 75% effort, still legal but more realistic.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Finishing With Contact","summary":"Finish around the basket against contact from a defender. 10 minutes. Ages 11-12.","sport":"basketball","ages":["11-12"],"fundamental":"finishing","progression":"refine","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A young player driving to the basket, being jostled by a defender, and still finishing the layup.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean voice, age-appropriate contact framing."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-finishing-with-contact.md";
				const url = undefined;
				function rawContent() {
					return "\nGame finishes happen with defenders bumping you. This drill adds light contact. The finisher stays strong and focuses on the rim, not the defender.\n\n**What you need:** Basketball. Three kids per rep (shooter, passer, light defender). Half-court.\n\n**Setup:** Passer near the top of the key. Shooter at the wing. Defender in the lane on the shooter.\n\n**How to run it:**\n\n1. Passer passes to the shooter at the wing.\n2. Shooter drives toward the basket. Defender applies light contact (bumping, not fouling).\n3. Shooter finishes the layup through contact. Eyes on the rim, not the defender.\n4. Do 5 reps. Rest. Rotate roles.\n\n**What to watch:** Do they keep their eyes on the rim or do they look at the defender? Eyes on the rim always. That's where the finish happens.\n\n**If they're struggling:** Have the defender apply no contact, just presence. Let the shooter build confidence first.\n\n**If they've got it:** Increase contact intensity. Defender plays at 75% effort, still legal but more realistic.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
