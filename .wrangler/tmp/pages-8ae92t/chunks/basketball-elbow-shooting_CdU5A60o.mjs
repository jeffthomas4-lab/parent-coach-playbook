globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The elbow is a key shooting spot for bigs and wings. It’s at the intersection of the free throw line and the three-point line (about 12-15 feet). This drill builds confidence at that range.</p>\n<p><strong>What you need:</strong> Basketball. Two kids per pair (shooter and passer). Two elbows marked.</p>\n<p><strong>Setup:</strong> Shooter at the left elbow. Passer near the top of the key.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Passer throws a chest pass to the shooter at the elbow.</li>\n<li>Shooter catches and shoots immediately. No dribble.</li>\n<li>After 5 shots from the left elbow, move to the right elbow.</li>\n<li>Do 5 more shots. Rest. Switch roles.</li>\n</ol>\n<p><strong>What to watch:</strong> Are they in balance when they shoot? The catch should be comfortable so they can shoot with feet set.</p>\n<p><strong>If they’re struggling:</strong> Move closer to 12 feet. Use a slower, softer pass. Reduce to 3 shots per elbow.</p>\n<p><strong>If they’ve got it:</strong> Add a defender playing 50% pressure on the shooter. Simulates game-like contest.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Elbow Shooting","summary":"Shoot from the elbow (high post) with a catch-and-shoot. 10 minutes. Ages 11-12.","sport":"basketball","ages":["11-12"],"fundamental":"shooting","progression":"refine","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A young player at the elbow receiving a pass and shooting over defenders with a high release.","editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Minor: free throw line is 15 feet, three-point arc is much further; the 'intersection' framing is loose. Body left as-is."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-elbow-shooting.md";
				const url = undefined;
				function rawContent() {
					return "\nThe elbow is a key shooting spot for bigs and wings. It's at the intersection of the free throw line and the three-point line (about 12-15 feet). This drill builds confidence at that range.\n\n**What you need:** Basketball. Two kids per pair (shooter and passer). Two elbows marked.\n\n**Setup:** Shooter at the left elbow. Passer near the top of the key.\n\n**How to run it:**\n\n1. Passer throws a chest pass to the shooter at the elbow.\n2. Shooter catches and shoots immediately. No dribble.\n3. After 5 shots from the left elbow, move to the right elbow.\n4. Do 5 more shots. Rest. Switch roles.\n\n**What to watch:** Are they in balance when they shoot? The catch should be comfortable so they can shoot with feet set.\n\n**If they're struggling:** Move closer to 12 feet. Use a slower, softer pass. Reduce to 3 shots per elbow.\n\n**If they've got it:** Add a defender playing 50% pressure on the shooter. Simulates game-like contest.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
