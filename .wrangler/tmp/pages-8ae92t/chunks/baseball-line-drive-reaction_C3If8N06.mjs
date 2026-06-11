globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Line drives come fast. The kid has half a second to react. Slow hands or wrong starting position turns a catch into a black eye. This drill trains the hands to come up fast from the ready position.</p>\n<p><strong>What you need:</strong> A glove. 5 tennis balls (start with tennis, not baseballs). A partner with a tennis racquet or a throwing arm.</p>\n<p><strong>Setup:</strong> Kid stands 25 feet away with the glove ready at chest level. You hit or throw firm line drives toward them.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Eyes, Hands, Squeeze, Pull. On line drives the whole sequence happens in under a second.</li>\n<li>Throw or hit a firm line drive at chest height. Tennis balls only at first.</li>\n<li>They catch with two hands. The glove pops up to the ball.</li>\n<li>Do 5 to chest, 5 to head height (with hands, not eyes), 5 below the chest.</li>\n<li>Last 3: switch to a real baseball but at half speed. Tennis-ball speed in a real ball.</li>\n</ol>\n<p><strong>What to watch:</strong> Are they backing up on the catch? Or stepping forward? Stepping forward to a line drive is brave and correct. Backing up means the glove arrives late.</p>\n<p><strong>If they’re struggling:</strong> Slow the throws down. Or use bigger softer balls (rag balls) so the consequences of a miss are smaller.</p>\n<p><strong>If they’ve got it:</strong> Throw harder and add hot-shot ground balls into the mix randomly. They have to react to whatever comes.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Line Drive Reaction","summary":"Catch hard line drives with quick hands. 12 minutes. Ages 8-10 and 11-12.","sport":"baseball","ages":["8-10","11-12"],"fundamental":"catching","progression":"refine","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A child crouched in fielding position with the glove starting at the chest, snapping up to catch a line drive at face height.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":true,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Mentions face/black-eye risk on hard line drives; safety-adjacent."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-line-drive-reaction.md";
				const url = undefined;
				function rawContent() {
					return "\nLine drives come fast. The kid has half a second to react. Slow hands or wrong starting position turns a catch into a black eye. This drill trains the hands to come up fast from the ready position.\n\n**What you need:** A glove. 5 tennis balls (start with tennis, not baseballs). A partner with a tennis racquet or a throwing arm.\n\n**Setup:** Kid stands 25 feet away with the glove ready at chest level. You hit or throw firm line drives toward them.\n\n**How to run it:**\n\n1. Cue: Eyes, Hands, Squeeze, Pull. On line drives the whole sequence happens in under a second.\n2. Throw or hit a firm line drive at chest height. Tennis balls only at first.\n3. They catch with two hands. The glove pops up to the ball.\n4. Do 5 to chest, 5 to head height (with hands, not eyes), 5 below the chest.\n5. Last 3: switch to a real baseball but at half speed. Tennis-ball speed in a real ball.\n\n**What to watch:** Are they backing up on the catch? Or stepping forward? Stepping forward to a line drive is brave and correct. Backing up means the glove arrives late.\n\n**If they're struggling:** Slow the throws down. Or use bigger softer balls (rag balls) so the consequences of a miss are smaller.\n\n**If they've got it:** Throw harder and add hot-shot ground balls into the mix randomly. They have to react to whatever comes.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
