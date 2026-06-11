globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Tag up means advancing after a fly ball is caught. The runner stays on the base until the ball is caught, then sprints to the next base. This is a game situation that requires timing.</p>\n<p><strong>What you need:</strong> Bases set at 60 feet, outfielder, fly ball hitter, 10 kids.</p>\n<p><strong>Setup:</strong> Runner on third. Batter at home. Outfielder in the field.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Eyes, Drive, Touch, Brake (for the run home after the catch).</li>\n<li>Batter hits a fly ball to the outfield.</li>\n<li>Runner stays on third, watching the ball. When it’s caught, they sprint home.</li>\n<li>Do 5 reps. Count how many score safely before the throw home.</li>\n<li>Vary the catch location: shallow outfield, deep outfield, over the runner’s head.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the runner leave early or wait? They must wait for the catch. Does the runner see the catch or just run?</p>\n<p><strong>If they’re struggling:</strong> Have them practice leaving from third when you clap (simulate the catch sound). Then do it with actual fly balls.</p>\n<p><strong>If they’ve got it:</strong> Add a relay throw. Outfielder throws to the relay cutoff at a base. Runner has to judge if they can score.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/softball-glove-11in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth softball glove →</a> — 11-inch fielder’s glove for new players.</p>\n<p><a href=\"/what-to-buy/softball/\">Full softball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Tag Up on a Fly Ball","summary":"Run after a fly ball is caught. 12 minutes. Ages 8-10 and 11-12.","sport":"softball","ages":["8-10","11-12"],"fundamental":"base-running","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Runner on third base waiting, then sprinting toward home as a fly ball is caught by an outfielder.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Tag-up base-running drill with clear timing focus."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/softball-tag-up-on-fly.md";
				const url = undefined;
				function rawContent() {
					return "\nTag up means advancing after a fly ball is caught. The runner stays on the base until the ball is caught, then sprints to the next base. This is a game situation that requires timing.\n\n**What you need:** Bases set at 60 feet, outfielder, fly ball hitter, 10 kids.\n\n**Setup:** Runner on third. Batter at home. Outfielder in the field.\n\n**How to run it:**\n\n1. Cue: Eyes, Drive, Touch, Brake (for the run home after the catch).\n2. Batter hits a fly ball to the outfield.\n3. Runner stays on third, watching the ball. When it's caught, they sprint home.\n4. Do 5 reps. Count how many score safely before the throw home.\n5. Vary the catch location: shallow outfield, deep outfield, over the runner's head.\n\n**What to watch:** Does the runner leave early or wait? They must wait for the catch. Does the runner see the catch or just run?\n\n**If they're struggling:** Have them practice leaving from third when you clap (simulate the catch sound). Then do it with actual fly balls.\n\n**If they've got it:** Add a relay throw. Outfielder throws to the relay cutoff at a base. Runner has to judge if they can score.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth softball glove →](/go/softball-glove-11in/) — 11-inch fielder's glove for new players.\n\n[Full softball gear guide →](/what-to-buy/softball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
