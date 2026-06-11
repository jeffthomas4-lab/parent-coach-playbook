globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A rundown (pickle) happens when a runner is caught between bases. The defense throws the ball back and forth to chase the runner and force a mistake. A good rundown ends in an out without allowing advancement.</p>\n<p><strong>What you need:</strong> Two bases 60 feet apart, 10 kids, multiple balls.</p>\n<p><strong>Setup:</strong> Bases at 60 feet. Runner between bases. Two fielders (one at each base).</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Runner starts between first and second. Fielders at each base with gloves.</li>\n<li>Fielder at first throws to fielder at second. If runner goes toward second, throw cuts off runner.</li>\n<li>Runner must turn and run toward first. Fielder at second throws back to fielder at first.</li>\n<li>Continue until runner is tagged or forced to advance beyond a base.</li>\n<li>Do 10 rundowns. Keep throws to cutoff positions, not full-distance throws.</li>\n</ol>\n<p><strong>What to watch:</strong> Do fielders make crisp throws? Do they cover bases after throwing? Base coverage is key to avoiding passed runners.</p>\n<p><strong>If they’re struggling:</strong> Start with no runner. Fielders practice throws back and forth to get timing. Add runner once throws are clean.</p>\n<p><strong>If they’ve got it:</strong> Add a third fielder. Add time pressure: rundown must be done in 5 throws or the runner is safe.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/softball-glove-11in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth softball glove →</a> — 11-inch fielder’s glove for new players.</p>\n<p><a href=\"/what-to-buy/softball/\">Full softball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Rundown Cover Base","summary":"Chase runners between bases with efficient throws. 15 minutes. Ages 11-12.","sport":"softball","ages":["11-12"],"fundamental":"situational","progression":"refine","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Two infielders throwing a ball back and forth, chasing a runner trapped between two bases.","editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Rundown drill; voice clean. 60ft base paths correct for softball."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/softball-rundown-cover-base.md";
				const url = undefined;
				function rawContent() {
					return "\nA rundown (pickle) happens when a runner is caught between bases. The defense throws the ball back and forth to chase the runner and force a mistake. A good rundown ends in an out without allowing advancement.\n\n**What you need:** Two bases 60 feet apart, 10 kids, multiple balls.\n\n**Setup:** Bases at 60 feet. Runner between bases. Two fielders (one at each base).\n\n**How to run it:**\n\n1. Runner starts between first and second. Fielders at each base with gloves.\n2. Fielder at first throws to fielder at second. If runner goes toward second, throw cuts off runner.\n3. Runner must turn and run toward first. Fielder at second throws back to fielder at first.\n4. Continue until runner is tagged or forced to advance beyond a base.\n5. Do 10 rundowns. Keep throws to cutoff positions, not full-distance throws.\n\n**What to watch:** Do fielders make crisp throws? Do they cover bases after throwing? Base coverage is key to avoiding passed runners.\n\n**If they're struggling:** Start with no runner. Fielders practice throws back and forth to get timing. Add runner once throws are clean.\n\n**If they've got it:** Add a third fielder. Add time pressure: rundown must be done in 5 throws or the runner is safe.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth softball glove →](/go/softball-glove-11in/) — 11-inch fielder's glove for new players.\n\n[Full softball gear guide →](/what-to-buy/softball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
