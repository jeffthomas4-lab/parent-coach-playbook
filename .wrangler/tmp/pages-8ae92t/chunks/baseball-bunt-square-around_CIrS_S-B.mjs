globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Bunting is the easiest way to put the ball in play and the easiest way to move a runner. The square-around is the basic version. Kids learn it once, use it for years.</p>\n<p><strong>What you need:</strong> A bat, 10 plastic or safety-core baseballs, a tee or coach to pitch.</p>\n<p><strong>Setup:</strong> Tee at the top of the strike zone (chest height) or coach pitching at half speed from 30 feet.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Square, Show, Soft, Drop.</li>\n<li>Square: turn the body to face the pitcher. Both feet point at the pitcher.</li>\n<li>Show: the bat is held flat across the body, at the top of the strike zone, with the top hand pinching the barrel.</li>\n<li>Soft: hands stay soft, no swinging motion. Let the ball hit the bat.</li>\n<li>Drop: the ball drops off the bat in front of the plate.</li>\n</ol>\n<p><strong>What to watch:</strong> Is the bat held at the top of the strike zone? If the bat is at the belt, every ball at the top is a strike that can’t be bunted. The bat goes UP from there to lay off, not DOWN.</p>\n<p><strong>If they’re struggling:</strong> Drop the pitch. Use a tee. Just have them practice the position 10 times.</p>\n<p><strong>If they’ve got it:</strong> Add a target zone (a cone 10 feet in front of the plate on the third base line). The bunt has to roll toward the cone.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/go/agility-cones/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Agility cones →</a> — for setup, base paths, and field drills.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Bunt Square Around","summary":"Turn the body toward the pitcher and lay the bat flat. 12 minutes. Ages 8-10 and 11-12.","sport":"baseball","ages":["8-10","11-12"],"fundamental":"hitting","progression":"intro","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A child squared around to face the pitcher with the bat held flat across the body at the top of the strike zone, both knees bent.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-bunt-square-around.md";
				const url = undefined;
				function rawContent() {
					return "\nBunting is the easiest way to put the ball in play and the easiest way to move a runner. The square-around is the basic version. Kids learn it once, use it for years.\n\n**What you need:** A bat, 10 plastic or safety-core baseballs, a tee or coach to pitch.\n\n**Setup:** Tee at the top of the strike zone (chest height) or coach pitching at half speed from 30 feet.\n\n**How to run it:**\n\n1. Cue: Square, Show, Soft, Drop.\n2. Square: turn the body to face the pitcher. Both feet point at the pitcher.\n3. Show: the bat is held flat across the body, at the top of the strike zone, with the top hand pinching the barrel.\n4. Soft: hands stay soft, no swinging motion. Let the ball hit the bat.\n5. Drop: the ball drops off the bat in front of the plate.\n\n**What to watch:** Is the bat held at the top of the strike zone? If the bat is at the belt, every ball at the top is a strike that can't be bunted. The bat goes UP from there to lay off, not DOWN.\n\n**If they're struggling:** Drop the pitch. Use a tee. Just have them practice the position 10 times.\n\n**If they've got it:** Add a target zone (a cone 10 feet in front of the plate on the third base line). The bunt has to roll toward the cone.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[Agility cones →](/go/agility-cones/) — for setup, base paths, and field drills.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
