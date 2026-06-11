globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Consistency is the foundation of tennis. This drill challenges young players to keep the ball in play over an extended rally, teaching patience and control.</p>\n<p><strong>Equipment needed:</strong> 1 full court, 4 tennis balls, 2 rackets.</p>\n<p><strong>Setup:</strong> Two players on opposite sides of the court, baseline rally position.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>One player starts the rally with a serve (easy, not competitive).</li>\n<li>Players rally back and forth, counting each shot.</li>\n<li>Goal is to reach 25 consecutive shots over the net without missing.</li>\n<li>If the ball goes out or hits the net, they start over at 1.</li>\n<li>Each pair tries 4 times to reach 25.</li>\n</ol>\n<p><strong>What to look for:</strong></p>\n<p>Players should be adjusting their pace. If they’re blasting every ball, they’ll make errors. If they’re pushing the ball too softly, it might float long. The goal is controlled pace that stays in the court. If a pair consistently misses at certain numbers (like always at 12-15), that’s fatigue or losing focus. Push them to stay sharp the entire rally.</p>\n<p><strong>Variation:</strong> Set a target number other than 25. For players struggling, use 15. For advanced players, use 40 or 50. The goal is building consistency, not a specific number.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/tennis-balls-orange/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Orange tennis balls (12-pack) →</a> — slower-bounce balls for learning groundstrokes.</p>\n<p><a href=\"/go/tennis-net/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Portable tennis net →</a> — Boulder foldable net, adjusts to regulation height.</p>\n<p><a href=\"/what-to-buy/tennis/\">Full tennis gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Consistency Rally to 25","summary":"Build stroke consistency by rallying continuously for 25 shots. 12 minutes.","sport":"tennis","ages":["11-12"],"focus":"fundamentals","layer":"skills","fundamental":"match-play","progression":"build","illustrationBrief":"Extended rally practice maintaining shots","publishedAt":"2026-04-22T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Solid cooperative rally drill; uses correct rally/court vocab."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/tennis-consistency-rally-to-25-ages-11-12.md";
				const url = undefined;
				function rawContent() {
					return "\nConsistency is the foundation of tennis. This drill challenges young players to keep the ball in play over an extended rally, teaching patience and control.\n\n**Equipment needed:** 1 full court, 4 tennis balls, 2 rackets.\n\n**Setup:** Two players on opposite sides of the court, baseline rally position.\n\n**How to run it:**\n\n1. One player starts the rally with a serve (easy, not competitive).\n2. Players rally back and forth, counting each shot.\n3. Goal is to reach 25 consecutive shots over the net without missing.\n4. If the ball goes out or hits the net, they start over at 1.\n5. Each pair tries 4 times to reach 25.\n\n**What to look for:**\n\nPlayers should be adjusting their pace. If they're blasting every ball, they'll make errors. If they're pushing the ball too softly, it might float long. The goal is controlled pace that stays in the court. If a pair consistently misses at certain numbers (like always at 12-15), that's fatigue or losing focus. Push them to stay sharp the entire rally.\n\n**Variation:** Set a target number other than 25. For players struggling, use 15. For advanced players, use 40 or 50. The goal is building consistency, not a specific number.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Orange tennis balls (12-pack) →](/go/tennis-balls-orange/) — slower-bounce balls for learning groundstrokes.\n\n[Portable tennis net →](/go/tennis-net/) — Boulder foldable net, adjusts to regulation height.\n\n[Full tennis gear guide →](/what-to-buy/tennis/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
