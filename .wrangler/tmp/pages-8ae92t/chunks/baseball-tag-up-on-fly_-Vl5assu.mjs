globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>When a fly ball is hit with less than two outs, the runner has a choice. If the ball is caught, they have to be on the base or they’ll be doubled off. The right move on a deep fly: tag up. Stay on the bag, watch the catch, run after the catch.</p>\n<p><strong>What you need:</strong> A base, an outfielder with a glove, a coach to hit fly balls.</p>\n<p><strong>Setup:</strong> Runner on third base. Outfielder in right or center. Coach at home plate with a bucket of balls.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Coach hits a fly ball to the outfielder.</li>\n<li>Runner watches the ball, foot on the bag.</li>\n<li>The instant the ball hits the glove, runner takes off for home.</li>\n<li>Outfielder catches and throws home.</li>\n<li>Do 6 reps from third base. Then move runner to second and tag up on deep fly balls.</li>\n</ol>\n<p><strong>What to watch:</strong> When the runner leaves the base. They cannot leave before the catch. Even a hair early and they’re out on appeal. Foot stays on the base until the catch.</p>\n<p><strong>If they’re struggling:</strong> Slow down the throw. Use a parent in the outfield throwing soft. Build the timing.</p>\n<p><strong>If they’ve got it:</strong> Add a competitive element. The runner has to beat the throw home. Tell them: out or safe, score it.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Tag Up on a Fly Ball","summary":"Stay on the base until the catch, then run. 12 minutes. Ages 8-10 and 11-12.","sport":"baseball","ages":["8-10","11-12"],"fundamental":"base-running","progression":"build","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Runner standing on third base watching an outfielder, ready to sprint home the moment the ball is caught.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-tag-up-on-fly.md";
				const url = undefined;
				function rawContent() {
					return "\nWhen a fly ball is hit with less than two outs, the runner has a choice. If the ball is caught, they have to be on the base or they'll be doubled off. The right move on a deep fly: tag up. Stay on the bag, watch the catch, run after the catch.\n\n**What you need:** A base, an outfielder with a glove, a coach to hit fly balls.\n\n**Setup:** Runner on third base. Outfielder in right or center. Coach at home plate with a bucket of balls.\n\n**How to run it:**\n\n1. Coach hits a fly ball to the outfielder.\n2. Runner watches the ball, foot on the bag.\n3. The instant the ball hits the glove, runner takes off for home.\n4. Outfielder catches and throws home.\n5. Do 6 reps from third base. Then move runner to second and tag up on deep fly balls.\n\n**What to watch:** When the runner leaves the base. They cannot leave before the catch. Even a hair early and they're out on appeal. Foot stays on the base until the catch.\n\n**If they're struggling:** Slow down the throw. Use a parent in the outfield throwing soft. Build the timing.\n\n**If they've got it:** Add a competitive element. The runner has to beat the throw home. Tell them: out or safe, score it.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
