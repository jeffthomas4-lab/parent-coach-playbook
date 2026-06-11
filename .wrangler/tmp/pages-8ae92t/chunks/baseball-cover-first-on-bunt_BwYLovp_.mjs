globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>When the bunt is laid down, the first baseman has to charge in. Someone has to cover first base. That someone is the second baseman. If they don’t move, the bunt becomes a single. This is the most common bunt-coverage failure in youth baseball.</p>\n<p><strong>What you need:</strong> Bases at first and second. A first baseman, second baseman, pitcher, catcher, and a coach to bunt.</p>\n<p><strong>Setup:</strong> Standard infield. Coach stands at home plate with a bat and a few balls.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Coach lays down a bunt toward first base side.</li>\n<li>Pitcher and first baseman charge the ball.</li>\n<li>Second baseman sprints to cover first base.</li>\n<li>Whoever fields the bunt throws to second baseman at first.</li>\n<li>Do 6 reps.</li>\n</ol>\n<p><strong>What to watch:</strong> Did the second baseman move? Many will hesitate or stay at second. Sprint to first as soon as the bunt is laid down.</p>\n<p><strong>If they’re struggling:</strong> Slow it down. Walk through the coverage. Show every player where they go.</p>\n<p><strong>If they’ve got it:</strong> Add runners on base. Now the second baseman has to read whether to cover first or stay at second based on the runners.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/go/baseball-catchers-gear-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth catcher’s set →</a> — chest protector, helmet, and leg guards.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Cover First on a Bunt","summary":"First baseman charges, second baseman covers first. 12 minutes. Ages 8-10 and 11-12.","sport":"baseball","ages":["8-10","11-12"],"fundamental":"situational","progression":"build","focus":"situational","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Top-down diagram of the infield showing the first baseman charging toward home plate while the second baseman runs to cover first base.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-cover-first-on-bunt.md";
				const url = undefined;
				function rawContent() {
					return "\nWhen the bunt is laid down, the first baseman has to charge in. Someone has to cover first base. That someone is the second baseman. If they don't move, the bunt becomes a single. This is the most common bunt-coverage failure in youth baseball.\n\n**What you need:** Bases at first and second. A first baseman, second baseman, pitcher, catcher, and a coach to bunt.\n\n**Setup:** Standard infield. Coach stands at home plate with a bat and a few balls.\n\n**How to run it:**\n\n1. Coach lays down a bunt toward first base side.\n2. Pitcher and first baseman charge the ball.\n3. Second baseman sprints to cover first base.\n4. Whoever fields the bunt throws to second baseman at first.\n5. Do 6 reps.\n\n**What to watch:** Did the second baseman move? Many will hesitate or stay at second. Sprint to first as soon as the bunt is laid down.\n\n**If they're struggling:** Slow it down. Walk through the coverage. Show every player where they go.\n\n**If they've got it:** Add runners on base. Now the second baseman has to read whether to cover first or stay at second based on the runners.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[Youth catcher's set →](/go/baseball-catchers-gear-youth/) — chest protector, helmet, and leg guards.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
