globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A block doesn’t always stop the spike. Sometimes the attacker tips it over the block. Good defenders block AND cover. Jump up, land, turn, find the ball. This drill builds that recovery.</p>\n<p><strong>What you need:</strong> A volleyball, a net, three players (blocker + tipper + back court defender).</p>\n<p><strong>Setup:</strong> Blocker at the net. Tipper on the other side at the front. Back court defender behind the blocker.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Tipper holds the ball at the net.</li>\n<li>Blocker jumps to block.</li>\n<li>Tipper drops the ball over the block (a tip).</li>\n<li>Blocker lands, turns, and either covers the tip or directs the back court defender to it.</li>\n<li>Back court defender plays the ball if it’s deep.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the blocker turn after landing? Some blockers stand still after landing, waiting. The block is over. Turn and find the ball.</p>\n<p><strong>If they’re struggling:</strong> Slow the tip. Coach holds the ball longer before dropping.</p>\n<p><strong>If they’ve got it:</strong> Add a real attack instead of a tip. Sometimes the blocker has to play the ball off the block, sometimes turn and cover.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/volleyball-volley-lite/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Volley Lite training ball →</a> — lightweight ball for beginners learning to pass.</p>\n<p><a href=\"/go/volleyball-net/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Portable volleyball net →</a> — 32-ft set with adjustable steel poles.</p>\n<p><a href=\"/what-to-buy/volleyball/\">Full volleyball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Block and Cover","summary":"Block at the net then turn and cover the tip behind. 10 minutes. Ages 11-12.","sport":"volleyball","ages":["11-12"],"fundamental":"blocking","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player at the net jumping to block, then immediately turning toward the back court to cover a soft tip ball that landed behind the block.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Tip-after-block recovery drill. Specific and well-paced."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/volleyball-block-and-cover-game.md";
				const url = undefined;
				function rawContent() {
					return "\nA block doesn't always stop the spike. Sometimes the attacker tips it over the block. Good defenders block AND cover. Jump up, land, turn, find the ball. This drill builds that recovery.\n\n**What you need:** A volleyball, a net, three players (blocker + tipper + back court defender).\n\n**Setup:** Blocker at the net. Tipper on the other side at the front. Back court defender behind the blocker.\n\n**How to run it:**\n\n1. Tipper holds the ball at the net.\n2. Blocker jumps to block.\n3. Tipper drops the ball over the block (a tip).\n4. Blocker lands, turns, and either covers the tip or directs the back court defender to it.\n5. Back court defender plays the ball if it's deep.\n\n**What to watch:** Does the blocker turn after landing? Some blockers stand still after landing, waiting. The block is over. Turn and find the ball.\n\n**If they're struggling:** Slow the tip. Coach holds the ball longer before dropping.\n\n**If they've got it:** Add a real attack instead of a tip. Sometimes the blocker has to play the ball off the block, sometimes turn and cover.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Volley Lite training ball →](/go/volleyball-volley-lite/) — lightweight ball for beginners learning to pass.\n\n[Portable volleyball net →](/go/volleyball-net/) — 32-ft set with adjustable steel poles.\n\n[Full volleyball gear guide →](/what-to-buy/volleyball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
