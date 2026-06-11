globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>On a bunt, the first baseman often fields the ball near the line and has to make a quick throw to first. Either the pitcher or the second baseman covers the base. Communication is key.</p>\n<p><strong>What you need:</strong> Bases, balls, pitcher, first baseman, runner at home.</p>\n<p><strong>Setup:</strong> Bunter at home. Bases loaded or runner on first. Pitcher on mound. First baseman at first.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Bunter bunts the ball down the first base line.</li>\n<li>First baseman fields the bunt.</li>\n<li>Pitcher sprints to cover first base (or second baseman if pitcher is late).</li>\n<li>First baseman throws to the covering player for the out.</li>\n<li>Do 10 reps. Alternate covering (pitcher one, second baseman next). Track timing and accuracy.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the pitcher get to first in time? Does the throw beat the runner? Communication must be loud (no silent calls).</p>\n<p><strong>If they’re struggling:</strong> Do 5 reps with no runner. Just focus on the pitcher covering and receiving the throw. Add runner once the mechanics are clean.</p>\n<p><strong>If they’ve got it:</strong> Add multiple situations (bases loaded, runner on first and third). Practice communication with both pitcher and second baseman covering.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/softball-glove-11in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth softball glove →</a> — 11-inch fielder’s glove for new players.</p>\n<p><a href=\"/what-to-buy/softball/\">Full softball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Cover First on Bunt","summary":"Pitcher or first baseman covers first on bunts. 15 minutes. Ages 11-12.","sport":"softball","ages":["11-12"],"fundamental":"situational","progression":"refine","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Pitcher or first baseman sprinting to cover first base as the first baseman fields the bunt.","editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Bunt coverage drill; situational. Voice clean."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/softball-cover-first-on-bunt.md";
				const url = undefined;
				function rawContent() {
					return "\nOn a bunt, the first baseman often fields the ball near the line and has to make a quick throw to first. Either the pitcher or the second baseman covers the base. Communication is key.\n\n**What you need:** Bases, balls, pitcher, first baseman, runner at home.\n\n**Setup:** Bunter at home. Bases loaded or runner on first. Pitcher on mound. First baseman at first.\n\n**How to run it:**\n\n1. Bunter bunts the ball down the first base line.\n2. First baseman fields the bunt.\n3. Pitcher sprints to cover first base (or second baseman if pitcher is late).\n4. First baseman throws to the covering player for the out.\n5. Do 10 reps. Alternate covering (pitcher one, second baseman next). Track timing and accuracy.\n\n**What to watch:** Does the pitcher get to first in time? Does the throw beat the runner? Communication must be loud (no silent calls).\n\n**If they're struggling:** Do 5 reps with no runner. Just focus on the pitcher covering and receiving the throw. Add runner once the mechanics are clean.\n\n**If they've got it:** Add multiple situations (bases loaded, runner on first and third). Practice communication with both pitcher and second baseman covering.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth softball glove →](/go/softball-glove-11in/) — 11-inch fielder's glove for new players.\n\n[Full softball gear guide →](/what-to-buy/softball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
