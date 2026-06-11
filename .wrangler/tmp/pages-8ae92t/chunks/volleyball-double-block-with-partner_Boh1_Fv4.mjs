globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A double block is two blockers jumping together. Done right, the wall is 4 feet wide and the spiker has nowhere to hit. Done wrong, there’s a gap and the spike goes through. This drill builds the timing.</p>\n<p><strong>What you need:</strong> A net, two blockers, an attacker, a setter.</p>\n<p><strong>Setup:</strong> Two blockers at the net (outside and middle). Attacker on the other side. Setter at center.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Setter sets to the attacker.</li>\n<li>Outside blocker stays at the outside spot. Middle blocker shuffles to join the outside.</li>\n<li>Both blockers jump together. Hands seal: no gap between blockers.</li>\n<li>Attacker spikes. Block either stops it or directs it to the floor.</li>\n<li>Do 6 reps. Switch which side blockers come from.</li>\n</ol>\n<p><strong>What to watch:</strong> The gap. If the middle blocker arrives late or doesn’t seal hands with the outside blocker, the spike goes through the seam. Hands together, no daylight.</p>\n<p><strong>If they’re struggling:</strong> Slow the play. Coach stops the action and adjusts blocker spacing.</p>\n<p><strong>If they’ve got it:</strong> Add a third blocker for a triple block on the middle hitter.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/volleyball-volley-lite/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Volley Lite training ball →</a> — lightweight ball for beginners learning to pass.</p>\n<p><a href=\"/go/volleyball-net/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Portable volleyball net →</a> — 32-ft set with adjustable steel poles.</p>\n<p><a href=\"/what-to-buy/volleyball/\">Full volleyball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Double Block with Partner","summary":"Two blockers seal the net together. 12 minutes. Ages 11-12.","sport":"volleyball","ages":["11-12"],"fundamental":"blocking","progression":"refine","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Two players at the net jumping side by side with their hands creating a solid wall above the net, no gap between them.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Seam-sealing teaching point is the load-bearing detail."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/volleyball-double-block-with-partner.md";
				const url = undefined;
				function rawContent() {
					return "\nA double block is two blockers jumping together. Done right, the wall is 4 feet wide and the spiker has nowhere to hit. Done wrong, there's a gap and the spike goes through. This drill builds the timing.\n\n**What you need:** A net, two blockers, an attacker, a setter.\n\n**Setup:** Two blockers at the net (outside and middle). Attacker on the other side. Setter at center.\n\n**How to run it:**\n\n1. Setter sets to the attacker.\n2. Outside blocker stays at the outside spot. Middle blocker shuffles to join the outside.\n3. Both blockers jump together. Hands seal: no gap between blockers.\n4. Attacker spikes. Block either stops it or directs it to the floor.\n5. Do 6 reps. Switch which side blockers come from.\n\n**What to watch:** The gap. If the middle blocker arrives late or doesn't seal hands with the outside blocker, the spike goes through the seam. Hands together, no daylight.\n\n**If they're struggling:** Slow the play. Coach stops the action and adjusts blocker spacing.\n\n**If they've got it:** Add a third blocker for a triple block on the middle hitter.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Volley Lite training ball →](/go/volleyball-volley-lite/) — lightweight ball for beginners learning to pass.\n\n[Portable volleyball net →](/go/volleyball-net/) — 32-ft set with adjustable steel poles.\n\n[Full volleyball gear guide →](/what-to-buy/volleyball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
