globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A proper grip is where throwing starts. The fingers go on the laces, not the palm. The thumb stays underneath for stability. Without the right grip, accurate throws are impossible.</p>\n<p><strong>What you need:</strong> One football. Open grass.</p>\n<p><strong>Setup:</strong> The kids stand in a line facing you, about 10 feet away.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Show them where the fingers go. Index, middle, and ring fingers on the laces. Spread apart. Thumb underneath.</li>\n<li>The pinky finger stays underneath too, supporting the thumb side.</li>\n<li>Have them hold the ball without throwing. Just getting used to the grip.</li>\n<li>Walk around and adjust each kid’s grip.</li>\n<li>Now they throw the ball to you from 10 feet. Easy tosses. Focus on the grip, not the distance.</li>\n<li>Do 10 throws each.</li>\n</ol>\n<p><strong>What to watch:</strong> Are the fingers on the laces or is the palm touching the ball? Laces only. Palm grip means no accuracy.</p>\n<p><strong>If they’re struggling:</strong> Use a smaller football. Easier to grip.</p>\n<p><strong>If they’ve got it:</strong> Move back to 15 feet. They’re still just throwing easy. Same grip, longer throw.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/football-rubber-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber football →</a> — Wilson youth rubber ball for rec and practice.</p>\n<p><a href=\"/what-to-buy/football/\">Full football gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"QB Grip and Throw","summary":"Hold and throw the football with proper mechanics. 10 minutes. Ages 8-10.","sport":"football","ages":["8-10"],"fundamental":"throwing","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A young QB holding the football in their grip, fingers on the laces, wrist cocked, ready to throw.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Beginner grip and throw mechanics. No contact."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/tackle-football-qb-grip-and-throw.md";
				const url = undefined;
				function rawContent() {
					return "\nA proper grip is where throwing starts. The fingers go on the laces, not the palm. The thumb stays underneath for stability. Without the right grip, accurate throws are impossible.\n\n**What you need:** One football. Open grass.\n\n**Setup:** The kids stand in a line facing you, about 10 feet away.\n\n**How to run it:**\n\n1. Show them where the fingers go. Index, middle, and ring fingers on the laces. Spread apart. Thumb underneath.\n2. The pinky finger stays underneath too, supporting the thumb side.\n3. Have them hold the ball without throwing. Just getting used to the grip.\n4. Walk around and adjust each kid's grip.\n5. Now they throw the ball to you from 10 feet. Easy tosses. Focus on the grip, not the distance.\n6. Do 10 throws each.\n\n**What to watch:** Are the fingers on the laces or is the palm touching the ball? Laces only. Palm grip means no accuracy.\n\n**If they're struggling:** Use a smaller football. Easier to grip.\n\n**If they've got it:** Move back to 15 feet. They're still just throwing easy. Same grip, longer throw.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber football →](/go/football-rubber-youth/) — Wilson youth rubber ball for rec and practice.\n\n[Full football gear guide →](/what-to-buy/football/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
