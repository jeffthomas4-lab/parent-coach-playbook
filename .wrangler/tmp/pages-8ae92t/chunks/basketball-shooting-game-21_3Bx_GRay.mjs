globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>21 is a classic shooting game that teaches pressure. You shoot from different spots at different ranges. Make it from one spot, move to the next. First to 21 points wins.</p>\n<p><strong>What you need:</strong> Basketball. Two kids per game. Half-court. Five shooting spots marked.</p>\n<p><strong>Setup:</strong> Spot 1 is the left corner (3 feet). Spot 2 is left wing (12 feet). Spot 3 is top of key (15 feet). Spot 4 is right wing (12 feet). Spot 5 is right corner (3 feet).</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Player A shoots from Spot 1. Make = 1 point and move to Spot 2. Miss = stay at Spot 1.</li>\n<li>First to 21 points wins.</li>\n<li>Play one full game. Track the winner.</li>\n</ol>\n<p><strong>What to watch:</strong> Are they making high-percentage shots at the corners or missing? Corner threes are high-percentage.</p>\n<p><strong>If they’re struggling:</strong> Reduce winning score to 15 points. Move all spots closer. Give 2 points for makes instead of 1.</p>\n<p><strong>If they’ve got it:</strong> Play for 25 points. Increase spot distances to three-point line.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Shooting Game 21","summary":"Competitive shooting game where first to 21 points wins. 15 minutes. Ages 11-12.","sport":"basketball","ages":["11-12"],"fundamental":"shooting","progression":"refine","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Two young players at the basket, one shooting while the other watches their make or miss.","editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Classic shooting game. Note: 'corner threes' line is inconsistent with corner spot listed at 3 feet, not beyond the arc."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-shooting-game-21.md";
				const url = undefined;
				function rawContent() {
					return "\n21 is a classic shooting game that teaches pressure. You shoot from different spots at different ranges. Make it from one spot, move to the next. First to 21 points wins.\n\n**What you need:** Basketball. Two kids per game. Half-court. Five shooting spots marked.\n\n**Setup:** Spot 1 is the left corner (3 feet). Spot 2 is left wing (12 feet). Spot 3 is top of key (15 feet). Spot 4 is right wing (12 feet). Spot 5 is right corner (3 feet).\n\n**How to run it:**\n\n1. Player A shoots from Spot 1. Make = 1 point and move to Spot 2. Miss = stay at Spot 1.\n2. First to 21 points wins.\n3. Play one full game. Track the winner.\n\n**What to watch:** Are they making high-percentage shots at the corners or missing? Corner threes are high-percentage.\n\n**If they're struggling:** Reduce winning score to 15 points. Move all spots closer. Give 2 points for makes instead of 1.\n\n**If they've got it:** Play for 25 points. Increase spot distances to three-point line.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
