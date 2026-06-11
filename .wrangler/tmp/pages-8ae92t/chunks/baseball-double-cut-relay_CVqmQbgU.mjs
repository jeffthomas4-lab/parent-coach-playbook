globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>When the ball is hit deep into the gap, one relay isn’t enough. A double cut puts two relay players in a line. Outfielder throws to the first cut, who catches and throws to the second cut, who throws home. Three short throws beat one long one every time.</p>\n<p><strong>What you need:</strong> A full field, an outfielder, two infielders, a coach with a bat, a catcher.</p>\n<p><strong>Setup:</strong> Outfielder in the gap. Shortstop as the first relay (closer to outfielder). Second baseman as the second relay (closer to home plate).</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Coach hits a deep ball into the gap.</li>\n<li>Outfielder fields, turns, and throws to the first relay player. Throw should hit chest-high.</li>\n<li>First relay catches and immediately throws to the second relay player.</li>\n<li>Second relay catches and throws home to the catcher.</li>\n<li>Do 5 reps. Time the play from hit to ball arriving home.</li>\n</ol>\n<p><strong>What to watch:</strong> Time wasted between throws. Each catch should turn into the next throw within 1 second. Slow exchanges kill the play.</p>\n<p><strong>If they’re struggling:</strong> Drop one relay. Single cut only. Build the timing of one before adding two.</p>\n<p><strong>If they’ve got it:</strong> Add a runner from second who’s trying to score. The throw home has to beat the runner.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/go/baseball-catchers-gear-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth catcher’s set →</a> — chest protector, helmet, and leg guards.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Double Cut Relay","summary":"Two relay players in a line for the deepest throws. 15 minutes. Ages 11-12.","sport":"baseball","ages":["11-12"],"fundamental":"situational","progression":"refine","focus":"situational","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Field diagram with an outfielder, then a shortstop relay player, then a second baseman second relay player, all in a line toward home plate.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-double-cut-relay.md";
				const url = undefined;
				function rawContent() {
					return "\nWhen the ball is hit deep into the gap, one relay isn't enough. A double cut puts two relay players in a line. Outfielder throws to the first cut, who catches and throws to the second cut, who throws home. Three short throws beat one long one every time.\n\n**What you need:** A full field, an outfielder, two infielders, a coach with a bat, a catcher.\n\n**Setup:** Outfielder in the gap. Shortstop as the first relay (closer to outfielder). Second baseman as the second relay (closer to home plate).\n\n**How to run it:**\n\n1. Coach hits a deep ball into the gap.\n2. Outfielder fields, turns, and throws to the first relay player. Throw should hit chest-high.\n3. First relay catches and immediately throws to the second relay player.\n4. Second relay catches and throws home to the catcher.\n5. Do 5 reps. Time the play from hit to ball arriving home.\n\n**What to watch:** Time wasted between throws. Each catch should turn into the next throw within 1 second. Slow exchanges kill the play.\n\n**If they're struggling:** Drop one relay. Single cut only. Build the timing of one before adding two.\n\n**If they've got it:** Add a runner from second who's trying to score. The throw home has to beat the runner.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[Youth catcher's set →](/go/baseball-catchers-gear-youth/) — chest protector, helmet, and leg guards.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
