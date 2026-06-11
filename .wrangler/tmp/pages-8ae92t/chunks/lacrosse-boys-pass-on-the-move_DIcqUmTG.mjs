globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>In a real game, players pass while moving. Lead the pass to where the receiver is going, not where they are. This drill builds that connection between motion and accuracy.</p>\n<p><strong>What you need:</strong> Two sticks, ball, two players, 30-yard area.</p>\n<p><strong>Setup:</strong> Two players at one end of the area, 15 feet apart. Open lane to run.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Both players jog forward in parallel lanes.</li>\n<li>Player A passes to Player B. Lead the pass (aim ahead of the receiver).</li>\n<li>Player B catches without slowing. Takes a stride.</li>\n<li>Player B passes back, leading Player A.</li>\n<li>Continue passing across the area. Do 4 trips.</li>\n</ol>\n<p><strong>What to watch:</strong> Are the passes leading the receiver or behind? A pass behind makes the receiver stop or reach back. The pass should arrive 1-2 strides ahead.</p>\n<p><strong>If they’re struggling:</strong> Walk the pace. Or pass with no lead first to build the timing.</p>\n<p><strong>If they’ve got it:</strong> Add a defender at midfield. The passes have to beat the defender too.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/lacrosse-ball/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Lacrosse balls (6-pack) →</a> — NOCSAE-stamped practice balls.</p>\n<p><a href=\"/what-to-buy/lacrosse-boys/\">Full lacrosse (boys) gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Pass on the Move","summary":"Two players passing back and forth while running. 12 minutes. Ages 11-12.","sport":"lacrosse-boys","ages":["11-12"],"fundamental":"passing","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Two players running parallel up the field, exchanging passes while continuing to sprint forward.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Fixed typo: 'The lead the pass' to 'Lead the pass' in lede."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/lacrosse-boys-pass-on-the-move.md";
				const url = undefined;
				function rawContent() {
					return "\nIn a real game, players pass while moving. Lead the pass to where the receiver is going, not where they are. This drill builds that connection between motion and accuracy.\n\n**What you need:** Two sticks, ball, two players, 30-yard area.\n\n**Setup:** Two players at one end of the area, 15 feet apart. Open lane to run.\n\n**How to run it:**\n\n1. Both players jog forward in parallel lanes.\n2. Player A passes to Player B. Lead the pass (aim ahead of the receiver).\n3. Player B catches without slowing. Takes a stride.\n4. Player B passes back, leading Player A.\n5. Continue passing across the area. Do 4 trips.\n\n**What to watch:** Are the passes leading the receiver or behind? A pass behind makes the receiver stop or reach back. The pass should arrive 1-2 strides ahead.\n\n**If they're struggling:** Walk the pace. Or pass with no lead first to build the timing.\n\n**If they've got it:** Add a defender at midfield. The passes have to beat the defender too.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Lacrosse balls (6-pack) →](/go/lacrosse-ball/) — NOCSAE-stamped practice balls.\n\n[Full lacrosse (boys) gear guide →](/what-to-buy/lacrosse-boys/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
