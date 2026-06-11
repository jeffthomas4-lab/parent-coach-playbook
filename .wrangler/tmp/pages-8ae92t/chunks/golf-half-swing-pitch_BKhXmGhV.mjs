globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The half swing teaches feel. Most kids try to crush every wedge — this drill is about distance control.</p>\n<p><strong>Equipment needed:</strong> A pitching or sand wedge, twenty balls, a target (towel, basket, or flag) 30 yards out.</p>\n<p><strong>Setup:</strong> A flat patch of fairway or practice green. Target laid out 30 yards.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Take the club back to about waist height. Not full backswing.</li>\n<li>Swing through, finish with hands at chin height.</li>\n<li>The whole motion should be the same length back and through.</li>\n<li>Twenty balls. Goal: ten land within five paces of the target.</li>\n</ol>\n<p><strong>What to look for:</strong> A balanced finish. If the kid falls forward or back, they swung too hard. The half swing should feel almost lazy.</p>\n<p><strong>Variation:</strong> Add a 50-yard target after the 30-yard set. Same swing length — they have to club up to a longer iron to cover the distance.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/agility-cones/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Agility cones →</a> — useful for alignment and target drills.</p>\n<p><a href=\"/what-to-buy/golf/\">Full golf gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Half-Swing Pitch","summary":"Twenty pitches from 30 yards with a half swing. Ages 11-14.","sport":"golf","age":"11-12","ages":["11-12","13-14"],"focus":"fundamentals","layer":"skills","fundamental":"stance","progression":"build","illustrationBrief":"A young golfer making a controlled half-swing pitch shot toward a green, sand wedge in hand.","publishedAt":"2026-05-12T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":6,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-12T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Generated as part of the per-sport content baseline. Voice may need a Jeff pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/golf-half-swing-pitch.md";
				const url = undefined;
				function rawContent() {
					return "\nThe half swing teaches feel. Most kids try to crush every wedge — this drill is about distance control.\n\n**Equipment needed:** A pitching or sand wedge, twenty balls, a target (towel, basket, or flag) 30 yards out.\n\n**Setup:** A flat patch of fairway or practice green. Target laid out 30 yards.\n\n**How to run it:**\n\n1. Take the club back to about waist height. Not full backswing.\n2. Swing through, finish with hands at chin height.\n3. The whole motion should be the same length back and through.\n4. Twenty balls. Goal: ten land within five paces of the target.\n\n**What to look for:** A balanced finish. If the kid falls forward or back, they swung too hard. The half swing should feel almost lazy.\n\n**Variation:** Add a 50-yard target after the 30-yard set. Same swing length — they have to club up to a longer iron to cover the distance.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Agility cones →](/go/agility-cones/) — useful for alignment and target drills.\n\n[Full golf gear guide →](/what-to-buy/golf/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
