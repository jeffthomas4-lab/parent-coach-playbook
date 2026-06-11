globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Game shooting happens against defenders. This drill adds a defender playing at 75% intensity. The shooter must still get a clean look and the defender must contest without fouling.</p>\n<p><strong>What you need:</strong> Basketball. Three kids (shooter, passer, defender). Half-court.</p>\n<p><strong>Setup:</strong> Shooter at a designated spot (wing or elbow). Passer at the top of the key. Defender on the shooter.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Passer throws to the shooter. Defender plays tight but doesn’t foul.</li>\n<li>Shooter catches and shoots over the defender.</li>\n<li>Do 5 shots per shooter. Rest. Rotate roles.</li>\n</ol>\n<p><strong>What to watch:</strong> Can the shooter still make shots with pressure? And is the defender’s hand actually contesting (up, not fouling)?</p>\n<p><strong>If they’re struggling:</strong> Defender plays at 50% intensity instead of 75%. Move the shooter spot closer to the basket.</p>\n<p><strong>If they’ve got it:</strong> Defender plays at 90% effort. The shooter must be excellent to get clean looks.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Shooting With Defender","summary":"Shoot while a defender plays tight defense. 10 minutes. Ages 11-12.","sport":"basketball","ages":["11-12"],"fundamental":"shooting","progression":"refine","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A young player shooting over a defender's outstretched hands on the spot.","editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Contested-shot drill, sport language clean. Could use more rep volume per shooter."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-shooting-with-defender.md";
				const url = undefined;
				function rawContent() {
					return "\nGame shooting happens against defenders. This drill adds a defender playing at 75% intensity. The shooter must still get a clean look and the defender must contest without fouling.\n\n**What you need:** Basketball. Three kids (shooter, passer, defender). Half-court.\n\n**Setup:** Shooter at a designated spot (wing or elbow). Passer at the top of the key. Defender on the shooter.\n\n**How to run it:**\n\n1. Passer throws to the shooter. Defender plays tight but doesn't foul.\n2. Shooter catches and shoots over the defender.\n3. Do 5 shots per shooter. Rest. Rotate roles.\n\n**What to watch:** Can the shooter still make shots with pressure? And is the defender's hand actually contesting (up, not fouling)?\n\n**If they're struggling:** Defender plays at 50% intensity instead of 75%. Move the shooter spot closer to the basket.\n\n**If they've got it:** Defender plays at 90% effort. The shooter must be excellent to get clean looks.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
