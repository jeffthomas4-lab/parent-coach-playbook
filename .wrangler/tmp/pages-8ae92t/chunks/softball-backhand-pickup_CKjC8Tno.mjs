globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Backhand fielding means the ball is going away from the throwing-side arm. It requires footwork to get the body in front and the glove across.</p>\n<p><strong>What you need:</strong> 15 softballs (12”), a partner at 15 feet away.</p>\n<p><strong>Setup:</strong> Fielder and partner stand 15 feet apart. Partner will roll balls to the fielder’s right (backhand side).</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Partner rolls a grounder to the backhand side (right side for a right-handed player).</li>\n<li>Fielder steps right, Drop into position, Show the glove, Funnel, and throw back.</li>\n<li>Do 5 rolls to the backhand. Rest.</li>\n<li>Do 5 rolls to the forehand (left side). Rest.</li>\n<li>Do 5 more to the backhand. Focus on footwork, not speed.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the right foot step in front of the left? If the left foot is in front, the body is closed off and the throw will be weak.</p>\n<p><strong>If they’re struggling:</strong> Roll slower. Stay at 12 feet. Have them charge the ball instead of moving laterally.</p>\n<p><strong>If they’ve got it:</strong> Roll from 20 feet away. Mix forehand and backhand in random order. Add a runner and throw to a base.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/softball-glove-11in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth softball glove →</a> — 11-inch fielder’s glove for new players.</p>\n<p><a href=\"/what-to-buy/softball/\">Full softball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Backhand Pickup","summary":"Field a grounder on the backhand side. 12 minutes. Ages 8-10 and 11-12.","sport":"softball","ages":["8-10","11-12"],"fundamental":"fielding","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player moving right, reaching across the body with the glove on the backhand side to field a grounder.","editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Changed soft baseballs to softballs in equipment line."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/softball-backhand-pickup.md";
				const url = undefined;
				function rawContent() {
					return "\nBackhand fielding means the ball is going away from the throwing-side arm. It requires footwork to get the body in front and the glove across.\n\n**What you need:** 15 softballs (12\"), a partner at 15 feet away.\n\n**Setup:** Fielder and partner stand 15 feet apart. Partner will roll balls to the fielder's right (backhand side).\n\n**How to run it:**\n\n1. Partner rolls a grounder to the backhand side (right side for a right-handed player).\n2. Fielder steps right, Drop into position, Show the glove, Funnel, and throw back.\n3. Do 5 rolls to the backhand. Rest.\n4. Do 5 rolls to the forehand (left side). Rest.\n5. Do 5 more to the backhand. Focus on footwork, not speed.\n\n**What to watch:** Does the right foot step in front of the left? If the left foot is in front, the body is closed off and the throw will be weak.\n\n**If they're struggling:** Roll slower. Stay at 12 feet. Have them charge the ball instead of moving laterally.\n\n**If they've got it:** Roll from 20 feet away. Mix forehand and backhand in random order. Add a runner and throw to a base.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth softball glove →](/go/softball-glove-11in/) — 11-inch fielder's glove for new players.\n\n[Full softball gear guide →](/what-to-buy/softball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
