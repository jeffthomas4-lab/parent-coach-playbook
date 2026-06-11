globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>When the ball is hit to the glove side (left for a right-handed kid), the easy fielding position works but the body has to lean and the feet have to step. This is the forehand. Different from a regular grounder, easier than a backhand, but still its own move.</p>\n<p><strong>What you need:</strong> A glove, 10 baseballs, flat field.</p>\n<p><strong>Setup:</strong> Kid stands 15 feet from you, ready position.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Drop, Show, Funnel, Send.</li>\n<li>Roll 5 slow balls to their glove side. They step with the glove-side foot, drop into fielding position with weight on that foot, and field with the glove out front.</li>\n<li>After the catch, they straighten up and toss back to you.</li>\n<li>Roll 5 more, this time slightly faster.</li>\n<li>Last 5: roll deeper to the glove side so they have to take two steps before they drop.</li>\n</ol>\n<p><strong>What to watch:</strong> Are the feet stepping or are they reaching with the glove only? Glove-only reach means the body is out of position. Step first, drop second.</p>\n<p><strong>If they’re struggling:</strong> Roll slower. Or have them practice the footwork without a ball: step glove-side, drop, recover.</p>\n<p><strong>If they’ve got it:</strong> Add a throw to first base after the catch. Now they have to field, recover, and throw on a target.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Forehand Reach","summary":"Field a grounder hit to the glove side without crossing the body. 12 minutes. Ages 8-10 and 11-12.","sport":"baseball","ages":["8-10","11-12"],"fundamental":"fielding","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A child fielding a grounder to their glove side with the glove low and out, weight on the glove-side foot.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-forehand-glove-only.md";
				const url = undefined;
				function rawContent() {
					return "\nWhen the ball is hit to the glove side (left for a right-handed kid), the easy fielding position works but the body has to lean and the feet have to step. This is the forehand. Different from a regular grounder, easier than a backhand, but still its own move.\n\n**What you need:** A glove, 10 baseballs, flat field.\n\n**Setup:** Kid stands 15 feet from you, ready position.\n\n**How to run it:**\n\n1. Cue: Drop, Show, Funnel, Send.\n2. Roll 5 slow balls to their glove side. They step with the glove-side foot, drop into fielding position with weight on that foot, and field with the glove out front.\n3. After the catch, they straighten up and toss back to you.\n4. Roll 5 more, this time slightly faster.\n5. Last 5: roll deeper to the glove side so they have to take two steps before they drop.\n\n**What to watch:** Are the feet stepping or are they reaching with the glove only? Glove-only reach means the body is out of position. Step first, drop second.\n\n**If they're struggling:** Roll slower. Or have them practice the footwork without a ball: step glove-side, drop, recover.\n\n**If they've got it:** Add a throw to first base after the catch. Now they have to field, recover, and throw on a target.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
