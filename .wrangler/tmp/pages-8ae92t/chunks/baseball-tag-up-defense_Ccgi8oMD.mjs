globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>When a runner tags up on a fly ball with less than two outs, the defense has one chance: catch the ball and throw home before the runner gets there. The throw has to be on a line, and the cutoff has to be in position. Practice the throw home from different outfield positions.</p>\n<p><strong>What you need:</strong> A full field, an outfielder, a cutoff infielder, a runner on third, a catcher.</p>\n<p><strong>Setup:</strong> Runner on third. Outfielder in right or center. Cutoff infielder positioned between outfielder and home plate.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Coach hits a deep fly ball to the outfielder.</li>\n<li>Runner on third tags up at the catch.</li>\n<li>Outfielder catches and throws home through the cutoff.</li>\n<li>Cutoff catches and either relays or lets the ball through.</li>\n<li>Catcher catches and tags. Was the runner safe or out?</li>\n</ol>\n<p><strong>What to watch:</strong> Did the outfielder hit the cutoff? Or did they air-mail it over? Throw on a line that hits the cutoff chest-high.</p>\n<p><strong>If they’re struggling:</strong> Use shorter fly balls. Build the timing of the throw and the cutoff.</p>\n<p><strong>If they’ve got it:</strong> Add deeper flies. The runner has more time, the throw has to be perfect.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/go/baseball-catchers-gear-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth catcher’s set →</a> — chest protector, helmet, and leg guards.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Tag Up Defense","summary":"Defending against the runner who tags up on a fly ball. 12 minutes. Ages 11-12.","sport":"baseball","ages":["11-12"],"fundamental":"situational","progression":"refine","focus":"situational","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Outfielder catching a fly ball with a runner on third tagging up, the cutoff player and catcher both ready for the throw home.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-tag-up-defense.md";
				const url = undefined;
				function rawContent() {
					return "\nWhen a runner tags up on a fly ball with less than two outs, the defense has one chance: catch the ball and throw home before the runner gets there. The throw has to be on a line, and the cutoff has to be in position. Practice the throw home from different outfield positions.\n\n**What you need:** A full field, an outfielder, a cutoff infielder, a runner on third, a catcher.\n\n**Setup:** Runner on third. Outfielder in right or center. Cutoff infielder positioned between outfielder and home plate.\n\n**How to run it:**\n\n1. Coach hits a deep fly ball to the outfielder.\n2. Runner on third tags up at the catch.\n3. Outfielder catches and throws home through the cutoff.\n4. Cutoff catches and either relays or lets the ball through.\n5. Catcher catches and tags. Was the runner safe or out?\n\n**What to watch:** Did the outfielder hit the cutoff? Or did they air-mail it over? Throw on a line that hits the cutoff chest-high.\n\n**If they're struggling:** Use shorter fly balls. Build the timing of the throw and the cutoff.\n\n**If they've got it:** Add deeper flies. The runner has more time, the throw has to be perfect.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[Youth catcher's set →](/go/baseball-catchers-gear-youth/) — chest protector, helmet, and leg guards.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
