globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A bunt looks simple from the offense. From the defense, it’s organized chaos. Five fielders have specific moves. Pitcher and corners charge. Second baseman covers first. Shortstop covers second. Catcher reads the bunt and either fields or backs up. Run this drill until the moves are automatic.</p>\n<p><strong>What you need:</strong> A full diamond, a coach to bunt, all four infielders plus pitcher and catcher.</p>\n<p><strong>Setup:</strong> Standard infield. Coach at home with a bat and balls.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Coach lays down a bunt to one side (third base side or first base side).</li>\n<li>Pitcher and corner infielders charge. Whoever has the best angle fields it.</li>\n<li>Second baseman sprints to cover first.</li>\n<li>Shortstop sprints to cover second.</li>\n<li>Catcher fields if it’s right at home, otherwise backs up first base.</li>\n</ol>\n<p><strong>What to watch:</strong> Did everyone move? Many kids stand still because the ball isn’t hit to them. On a bunt, every player moves. Standing still means coverage failure.</p>\n<p><strong>If they’re struggling:</strong> Walk through it. Place each player in their coverage spot before the bunt.</p>\n<p><strong>If they’ve got it:</strong> Add runners on base. Now the coverage decisions change based on where the runners are.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/go/baseball-catchers-gear-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth catcher’s set →</a> — chest protector, helmet, and leg guards.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Bunt Coverage Roles","summary":"Every fielder has a job when a bunt is laid down. 15 minutes. Ages 11-12.","sport":"baseball","ages":["11-12"],"fundamental":"situational","progression":"refine","focus":"situational","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Field diagram with arrows showing pitcher, first baseman, third baseman, second baseman, and catcher each moving to their bunt-coverage spot.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-bunt-coverage-roles.md";
				const url = undefined;
				function rawContent() {
					return "\nA bunt looks simple from the offense. From the defense, it's organized chaos. Five fielders have specific moves. Pitcher and corners charge. Second baseman covers first. Shortstop covers second. Catcher reads the bunt and either fields or backs up. Run this drill until the moves are automatic.\n\n**What you need:** A full diamond, a coach to bunt, all four infielders plus pitcher and catcher.\n\n**Setup:** Standard infield. Coach at home with a bat and balls.\n\n**How to run it:**\n\n1. Coach lays down a bunt to one side (third base side or first base side).\n2. Pitcher and corner infielders charge. Whoever has the best angle fields it.\n3. Second baseman sprints to cover first.\n4. Shortstop sprints to cover second.\n5. Catcher fields if it's right at home, otherwise backs up first base.\n\n**What to watch:** Did everyone move? Many kids stand still because the ball isn't hit to them. On a bunt, every player moves. Standing still means coverage failure.\n\n**If they're struggling:** Walk through it. Place each player in their coverage spot before the bunt.\n\n**If they've got it:** Add runners on base. Now the coverage decisions change based on where the runners are.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[Youth catcher's set →](/go/baseball-catchers-gear-youth/) — chest protector, helmet, and leg guards.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
