globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>When a runner gets caught between bases (a “pickle”), most kids panic and run in zigzags. The right move: commit to one direction, force the fielder to throw, then go the other way if you can. This drill teaches the read.</p>\n<p><strong>What you need:</strong> Two bases set 60 feet apart. Two fielders with gloves. A baseball.</p>\n<p><strong>Setup:</strong> Runner halfway between two bases. Fielders at each base. Ball starts with one fielder.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Fielder with the ball runs at the runner. The runner has to react.</li>\n<li>Rule: runner commits to one direction (back to the original base, usually safer). Sprint full speed.</li>\n<li>The fielder either tags or throws to the other fielder. If they throw, the runner reverses and sprints the other way.</li>\n<li>Each reversal costs the defense a throw. The more throws, the more chances they drop the ball.</li>\n<li>Do 6 reps. Reset the runner each time.</li>\n</ol>\n<p><strong>What to watch:</strong> Is the runner committing to a direction or zigzagging? Zigzagging means they get tagged. Commit, force a throw, react.</p>\n<p><strong>If they’re struggling:</strong> Slow it down. Walk through the rundown at half speed.</p>\n<p><strong>If they’ve got it:</strong> Add a third fielder. Now the defense has more options and the runner has to read who has the ball.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Pickle Rundown","summary":"Runner caught between bases, has to commit to one direction. 12 minutes. Ages 8-10 and 11-12.","sport":"baseball","ages":["8-10","11-12"],"fundamental":"base-running","progression":"build","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Runner caught between two bases, two fielders with the ball, runner about to commit to running back toward the closest base.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-pickle-rundown.md";
				const url = undefined;
				function rawContent() {
					return "\nWhen a runner gets caught between bases (a \"pickle\"), most kids panic and run in zigzags. The right move: commit to one direction, force the fielder to throw, then go the other way if you can. This drill teaches the read.\n\n**What you need:** Two bases set 60 feet apart. Two fielders with gloves. A baseball.\n\n**Setup:** Runner halfway between two bases. Fielders at each base. Ball starts with one fielder.\n\n**How to run it:**\n\n1. Fielder with the ball runs at the runner. The runner has to react.\n2. Rule: runner commits to one direction (back to the original base, usually safer). Sprint full speed.\n3. The fielder either tags or throws to the other fielder. If they throw, the runner reverses and sprints the other way.\n4. Each reversal costs the defense a throw. The more throws, the more chances they drop the ball.\n5. Do 6 reps. Reset the runner each time.\n\n**What to watch:** Is the runner committing to a direction or zigzagging? Zigzagging means they get tagged. Commit, force a throw, react.\n\n**If they're struggling:** Slow it down. Walk through the rundown at half speed.\n\n**If they've got it:** Add a third fielder. Now the defense has more options and the runner has to read who has the ball.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
