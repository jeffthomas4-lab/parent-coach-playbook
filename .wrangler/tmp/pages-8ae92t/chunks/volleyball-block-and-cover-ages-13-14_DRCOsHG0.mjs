globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Blocking and covering are two parts of the same play. This drill teaches young players how to position and react when a ball bounces off the block.</p>\n<p><strong>Equipment needed:</strong> 1 net, 4 cones, 4 balls.</p>\n<p><strong>Setup:</strong> Place two blockers at the net (middle and pin hitter). Place three covering players about 8 feet behind the blockers in a triangle formation.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Coach or setter tosses the ball to a hitter who hits at the blockers.</li>\n<li>Blockers try to block the ball or deflect it. If blocked, the covering players must react and pass the ball.</li>\n<li>If the block is solid, the ball dies on the block side. If the ball gets through or deflects, covering players pursue.</li>\n<li>Do 8 reps per group.</li>\n</ol>\n<p><strong>What to look for:</strong></p>\n<p>Blockers should be at the net with hands up and ready. Covering players should be low and ready to move in any direction. If a covering player is standing up watching, they can’t react. When the ball bounces off the block, one covering player should be calling it and moving to it. Communication prevents collisions.</p>\n<p><strong>Variation:</strong> Add hitting from multiple angles. Hitters attack from different positions at the net. Blockers and covering players now have to adjust their positioning based on where the attack is coming from.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/volleyball-net/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Portable volleyball net →</a> — full regulation height. Useful for off-gym reps.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Block and Cover","summary":"Teach defensive positioning: blockers at the net, then cover behind them. 12 minutes.","sport":"volleyball","ages":["13-14"],"focus":"fundamentals","layer":"foundations","fundamental":"blocking","progression":"refine","illustrationBrief":"Blocking and covering blocked balls","publishedAt":"2026-04-03T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"13-14 block-cover combo. Slight overlap with the 11-12 game version. Affiliate disclosure present."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/volleyball-block-and-cover-ages-13-14.md";
				const url = undefined;
				function rawContent() {
					return "\nBlocking and covering are two parts of the same play. This drill teaches young players how to position and react when a ball bounces off the block.\n\n**Equipment needed:** 1 net, 4 cones, 4 balls.\n\n**Setup:** Place two blockers at the net (middle and pin hitter). Place three covering players about 8 feet behind the blockers in a triangle formation.\n\n**How to run it:**\n\n1. Coach or setter tosses the ball to a hitter who hits at the blockers.\n2. Blockers try to block the ball or deflect it. If blocked, the covering players must react and pass the ball.\n3. If the block is solid, the ball dies on the block side. If the ball gets through or deflects, covering players pursue.\n4. Do 8 reps per group.\n\n**What to look for:**\n\nBlockers should be at the net with hands up and ready. Covering players should be low and ready to move in any direction. If a covering player is standing up watching, they can't react. When the ball bounces off the block, one covering player should be calling it and moving to it. Communication prevents collisions.\n\n**Variation:** Add hitting from multiple angles. Hitters attack from different positions at the net. Blockers and covering players now have to adjust their positioning based on where the attack is coming from.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Portable volleyball net →](/go/volleyball-net/) — full regulation height. Useful for off-gym reps.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
