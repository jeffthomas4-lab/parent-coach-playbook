globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A deep fly ball that’s going to land behind the outfielder needs the toughest catch in the game. The kid runs to the spot looking over their shoulder and catches the ball without ever turning around. This is a skill, not a stunt. Outfielders make this catch every weekend in college baseball.</p>\n<p><strong>What you need:</strong> A glove, 5 tennis balls (start with tennis), an open field at least 50 yards long.</p>\n<p><strong>Setup:</strong> Kid stands 30 feet from you. You hit deep fly balls over their head.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Find, Track, Camp, Catch. Camp becomes “run to the spot.”</li>\n<li>Hit a fly ball deep over their head. They drop step and run with their head turned slightly to track the ball.</li>\n<li>As the ball comes down, the glove reaches up and back. Catch with one hand if needed.</li>\n<li>Do 5 reps. Hit different angles.</li>\n<li>Last 3: switch to a real baseball but at half hit speed.</li>\n</ol>\n<p><strong>What to watch:</strong> The head position while running. They should turn their head, not their body. Body runs forward at the spot, head looks back at the ball.</p>\n<p><strong>If they’re struggling:</strong> Hit shorter pops. Or just have them practice running and looking back without a ball.</p>\n<p><strong>If they’ve got it:</strong> Hit longer flies. Or add a wall or fence at the back of the field. They have to track the ball and watch for the wall.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Deep Fly Over the Shoulder","summary":"Catch a fly ball running away from home plate, looking back over the shoulder. 12 minutes. Ages 11-12.","sport":"baseball","ages":["11-12"],"fundamental":"fielding","progression":"refine","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"An outfielder running away from home plate, looking back over the shoulder at a ball coming down behind them, glove reaching back.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-deep-fly-over-the-shoulder.md";
				const url = undefined;
				function rawContent() {
					return "\nA deep fly ball that's going to land behind the outfielder needs the toughest catch in the game. The kid runs to the spot looking over their shoulder and catches the ball without ever turning around. This is a skill, not a stunt. Outfielders make this catch every weekend in college baseball.\n\n**What you need:** A glove, 5 tennis balls (start with tennis), an open field at least 50 yards long.\n\n**Setup:** Kid stands 30 feet from you. You hit deep fly balls over their head.\n\n**How to run it:**\n\n1. Cue: Find, Track, Camp, Catch. Camp becomes \"run to the spot.\"\n2. Hit a fly ball deep over their head. They drop step and run with their head turned slightly to track the ball.\n3. As the ball comes down, the glove reaches up and back. Catch with one hand if needed.\n4. Do 5 reps. Hit different angles.\n5. Last 3: switch to a real baseball but at half hit speed.\n\n**What to watch:** The head position while running. They should turn their head, not their body. Body runs forward at the spot, head looks back at the ball.\n\n**If they're struggling:** Hit shorter pops. Or just have them practice running and looking back without a ball.\n\n**If they've got it:** Hit longer flies. Or add a wall or fence at the back of the field. They have to track the ball and watch for the wall.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
