globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Five-year-olds learning flag football need to learn the move that wins the game: pull the flag. The game version teaches the move while they’re having fun. Skip the technique lecture. Play.</p>\n<p><strong>What you need:</strong> Flag belts and flags for each kid. A 20x20 yard area on grass.</p>\n<p><strong>Setup:</strong> All kids inside the box wearing flags. Coach outside the box.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>On “go,” every kid is both offense and defense. They run around pulling each other’s flags.</li>\n<li>When a kid loses both flags, they go to the sideline.</li>\n<li>Last kid with flags wins.</li>\n<li>Reset. Run 4 rounds, each about 90 seconds.</li>\n<li>Last round: smaller box (10x10). More chaos.</li>\n</ol>\n<p><strong>What to watch:</strong> Are they pulling or grabbing the body? Tell them: “Hand on the flag, not the shirt.” Pulling is hand to flag.</p>\n<p><strong>If they’re struggling:</strong> Bigger box. Slower start (walking only for first round).</p>\n<p><strong>If they’ve got it:</strong> Smaller box. Or two-flag rule (have to pull both flags off the same kid in one chase).</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/flag-football-belt-set/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Flag football belt set →</a> — 14-player set for organized flag practice.</p>\n<p><a href=\"/what-to-buy/flag-football/\">Full flag football gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Tag and Pull Game","summary":"First exposure to flag pulling, played as tag. 8 minutes. Ages 5-7.","sport":"flag-football","ages":["5-7"],"fundamental":"flag-pulling","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Five young children running in a 20x20 yard area, each wearing flags, chasing each other to pull flags off.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":9,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean flag-pull language throughout. Tight voice."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/flag-football-tag-and-pull-game.md";
				const url = undefined;
				function rawContent() {
					return "\nFive-year-olds learning flag football need to learn the move that wins the game: pull the flag. The game version teaches the move while they're having fun. Skip the technique lecture. Play.\n\n**What you need:** Flag belts and flags for each kid. A 20x20 yard area on grass.\n\n**Setup:** All kids inside the box wearing flags. Coach outside the box.\n\n**How to run it:**\n\n1. On \"go,\" every kid is both offense and defense. They run around pulling each other's flags.\n2. When a kid loses both flags, they go to the sideline.\n3. Last kid with flags wins.\n4. Reset. Run 4 rounds, each about 90 seconds.\n5. Last round: smaller box (10x10). More chaos.\n\n**What to watch:** Are they pulling or grabbing the body? Tell them: \"Hand on the flag, not the shirt.\" Pulling is hand to flag.\n\n**If they're struggling:** Bigger box. Slower start (walking only for first round).\n\n**If they've got it:** Smaller box. Or two-flag rule (have to pull both flags off the same kid in one chase).\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Flag football belt set →](/go/flag-football-belt-set/) — 14-player set for organized flag practice.\n\n[Full flag football gear guide →](/what-to-buy/flag-football/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
