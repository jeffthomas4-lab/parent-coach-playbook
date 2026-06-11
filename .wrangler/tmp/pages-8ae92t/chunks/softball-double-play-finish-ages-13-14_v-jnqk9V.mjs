globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A double play is won or lost at second base and first base. The feed to second is first. The finish at first (where the force play ends) is second. This drill runs both.</p>\n<p><strong>Equipment needed:</strong> 10 softballs, two bases, a short, second baseman, and a first baseman.</p>\n<p><strong>Setup:</strong> Shortstop at short, second baseman at second, first baseman at first. You’re rolling ground balls.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Roll a grounder to short.</li>\n<li>Shortstop fields and feeds to second baseman at second base.</li>\n<li>Second baseman catches, steps on second, and throws to first baseman.</li>\n<li>First baseman catches and finishes the play.</li>\n<li>Do 10 reps. Keep track of how many are “double play outs.”</li>\n</ol>\n<p><strong>What to look for:</strong> Feed accuracy, footwork at second, and throw to first. One breakdown anywhere and it’s not a double play.</p>\n<p><strong>Variation:</strong> For younger kids (13), do the drill without a runner so they focus on the mechanics. For older kids, add a runner sliding into second so they practice the finish under game conditions.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/softball-glove-11in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth softball glove →</a> — 11-inch fielder’s glove for new players.</p>\n<p><a href=\"/what-to-buy/softball/\">Full softball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Double Play Finish","summary":"Second baseman and first baseman practice the 6-4-3 finish. 20 minutes. Ages 13-14+.","sport":"softball","ages":["13-14"],"focus":"situational","layer":"skills","fundamental":"fielding","progression":"refine","illustrationBrief":"Second and first baseman executing 6-4-3 finish","publishedAt":"2026-03-24T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":true,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"DP drill with sliding contact at second flagged sensitive."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/softball-double-play-finish-ages-13-14.md";
				const url = undefined;
				function rawContent() {
					return "\nA double play is won or lost at second base and first base. The feed to second is first. The finish at first (where the force play ends) is second. This drill runs both.\n\n**Equipment needed:** 10 softballs, two bases, a short, second baseman, and a first baseman.\n\n**Setup:** Shortstop at short, second baseman at second, first baseman at first. You're rolling ground balls.\n\n**How to run it:**\n\n1. Roll a grounder to short.\n2. Shortstop fields and feeds to second baseman at second base.\n3. Second baseman catches, steps on second, and throws to first baseman.\n4. First baseman catches and finishes the play.\n5. Do 10 reps. Keep track of how many are \"double play outs.\"\n\n**What to look for:** Feed accuracy, footwork at second, and throw to first. One breakdown anywhere and it's not a double play.\n\n**Variation:** For younger kids (13), do the drill without a runner so they focus on the mechanics. For older kids, add a runner sliding into second so they practice the finish under game conditions.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth softball glove →](/go/softball-glove-11in/) — 11-inch fielder's glove for new players.\n\n[Full softball gear guide →](/what-to-buy/softball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
