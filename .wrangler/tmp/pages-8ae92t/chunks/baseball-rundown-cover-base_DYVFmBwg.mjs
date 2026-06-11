globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A rundown isn’t just two players. It’s at least four. Two players chase the runner. Two more cover the bases behind in case the runner reverses. Without backup, the runner escapes. This is a coverage drill.</p>\n<p><strong>What you need:</strong> Two bases set 60 feet apart, four players, a baseball.</p>\n<p><strong>Setup:</strong> Two players at the bases (first and second). Two extra players behind the bases as backup. Runner between the bases.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Player at the lead base has the ball. They run at the runner.</li>\n<li>The other player at the trail base is ready to receive a throw.</li>\n<li>As soon as the throw happens, the player who threw runs to the OTHER backup spot. Now there’s a fresh runner-chaser ready.</li>\n<li>Backup players catch any thrown balls that get past the chasers.</li>\n<li>Do 5 reps. Rotate positions.</li>\n</ol>\n<p><strong>What to watch:</strong> Are the backup players where they need to be? Many kids think rundowns are 1-on-1 with the runner. They’re not. Two chasers, two backup, every time.</p>\n<p><strong>If they’re struggling:</strong> Walk through the positioning. Show every player where they go.</p>\n<p><strong>If they’ve got it:</strong> Add a fielder who throws errantly on purpose so the backup gets a real test.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Rundown Cover the Base","summary":"When the runner is in a pickle, who covers each base? 12 minutes. Ages 8-10 and 11-12.","sport":"baseball","ages":["8-10","11-12"],"fundamental":"situational","progression":"build","focus":"situational","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Diagram of a rundown between first and second with the second baseman and shortstop chasing the runner, while another fielder backs up each base.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-rundown-cover-base.md";
				const url = undefined;
				function rawContent() {
					return "\nA rundown isn't just two players. It's at least four. Two players chase the runner. Two more cover the bases behind in case the runner reverses. Without backup, the runner escapes. This is a coverage drill.\n\n**What you need:** Two bases set 60 feet apart, four players, a baseball.\n\n**Setup:** Two players at the bases (first and second). Two extra players behind the bases as backup. Runner between the bases.\n\n**How to run it:**\n\n1. Player at the lead base has the ball. They run at the runner.\n2. The other player at the trail base is ready to receive a throw.\n3. As soon as the throw happens, the player who threw runs to the OTHER backup spot. Now there's a fresh runner-chaser ready.\n4. Backup players catch any thrown balls that get past the chasers.\n5. Do 5 reps. Rotate positions.\n\n**What to watch:** Are the backup players where they need to be? Many kids think rundowns are 1-on-1 with the runner. They're not. Two chasers, two backup, every time.\n\n**If they're struggling:** Walk through the positioning. Show every player where they go.\n\n**If they've got it:** Add a fielder who throws errantly on purpose so the backup gets a real test.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
