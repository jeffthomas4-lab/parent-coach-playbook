globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>In flag football, the offense wins by spreading out the defense. If three defenders cover three zones, two zones are open. The QB throws to whoever is in the open zone. This drill teaches receivers to find space, not run set routes.</p>\n<p><strong>What you need:</strong> A football, cones, eight players (5 offense + 3 defense), open field.</p>\n<p><strong>Setup:</strong> 25-yard field marked with cones. Five receivers spread across the line of scrimmage. Three defenders 10 yards back covering zones (left, middle, right).</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>QB takes the snap.</li>\n<li>Receivers run downfield and find the open zone. No pre-set routes.</li>\n<li>QB scans the field and throws to the open receiver.</li>\n<li>If receiver catches, they keep running until the flag is pulled.</li>\n<li>Reset. Do 6 plays. Rotate offense and defense.</li>\n</ol>\n<p><strong>What to watch:</strong> Are receivers running to the same zone? If two end up in the same spot, both are covered. Tell them: “If your teammate is in your zone, you have to leave.”</p>\n<p><strong>If they’re struggling:</strong> Reduce to 4v2. Less complexity.</p>\n<p><strong>If they’ve got it:</strong> Add a fourth defender (4 defenders + 1 rusher). Tighter coverage.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/flag-football-belt-set/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Flag football belt set →</a> — 14-player set for organized flag practice.</p>\n<p><a href=\"/go/agility-cones/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Agility cones →</a> — for route trees, end zones, and field setup.</p>\n<p><a href=\"/what-to-buy/flag-football/\">Full flag football gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Spread and Find Space","summary":"Receivers spread out and run to open zones in a 5v3 game. 15 minutes. Ages 8-10 and 11-12.","sport":"flag-football","ages":["8-10","11-12"],"fundamental":"positioning","progression":"build","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Five offensive players spread across the field with three defenders, the QB scanning the field and the receivers in different empty zones.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"5v3 space-finding game. Clean flag-pull language."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/flag-football-spread-and-find-space.md";
				const url = undefined;
				function rawContent() {
					return "\nIn flag football, the offense wins by spreading out the defense. If three defenders cover three zones, two zones are open. The QB throws to whoever is in the open zone. This drill teaches receivers to find space, not run set routes.\n\n**What you need:** A football, cones, eight players (5 offense + 3 defense), open field.\n\n**Setup:** 25-yard field marked with cones. Five receivers spread across the line of scrimmage. Three defenders 10 yards back covering zones (left, middle, right).\n\n**How to run it:**\n\n1. QB takes the snap.\n2. Receivers run downfield and find the open zone. No pre-set routes.\n3. QB scans the field and throws to the open receiver.\n4. If receiver catches, they keep running until the flag is pulled.\n5. Reset. Do 6 plays. Rotate offense and defense.\n\n**What to watch:** Are receivers running to the same zone? If two end up in the same spot, both are covered. Tell them: \"If your teammate is in your zone, you have to leave.\"\n\n**If they're struggling:** Reduce to 4v2. Less complexity.\n\n**If they've got it:** Add a fourth defender (4 defenders + 1 rusher). Tighter coverage.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Flag football belt set →](/go/flag-football-belt-set/) — 14-player set for organized flag practice.\n\n[Agility cones →](/go/agility-cones/) — for route trees, end zones, and field setup.\n\n[Full flag football gear guide →](/what-to-buy/flag-football/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
