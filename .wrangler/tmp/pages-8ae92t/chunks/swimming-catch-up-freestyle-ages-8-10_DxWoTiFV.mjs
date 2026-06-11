globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Catch-up freestyle teaches hand coordination. The swimmer must touch one hand to the other before beginning the next stroke, forcing a deliberate rhythm.</p>\n<p><strong>Equipment needed:</strong> 1 pool, no kickboard.</p>\n<p><strong>Setup:</strong> Swimmers line up at one end of the pool.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Swimmer does freestyle, but the trailing hand must “catch up” to the lead hand before starting the next stroke.</li>\n<li>This means the arms are fully extended, then the swimmer takes a stroke and the hands meet before the next stroke begins.</li>\n<li>Swim one 25-yard length at controlled pace, focusing on rhythm.</li>\n<li>Rest at the wall.</li>\n<li>Repeat 4 times.</li>\n</ol>\n<p><strong>What to look for:</strong></p>\n<p>The catch-up forces a disciplined arm extension. If a swimmer is rushing and overlapping their hands, the drill isn’t working. The catch-up should feel smooth and controlled. The kick should be steady underneath, not frantic. If a swimmer is struggling to make the catch-up, they might be accelerating the stroke too much early.</p>\n<p><strong>Variation:</strong> Add speed. Once the catch-up feels natural, have swimmers try it at a slightly faster pace, maintaining the rhythm.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/swim-goggles-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth swim goggles →</a> — Speedo Hydrospex, no-fog, fits ages 6–14.</p>\n<p><a href=\"/what-to-buy/swimming/\">Full swimming gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Catch-Up Freestyle","summary":"Build freestyle rhythm and stroke synchronization. 10 minutes.","sport":"swimming","ages":["8-10"],"focus":"fundamentals","layer":"foundations","fundamental":"freestyle","progression":"intro","illustrationBrief":"Lead hand catch-up drill for freestyle","publishedAt":"2026-04-28T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Catch-up freestyle for hand timing; uses yards correctly."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/swimming-catch-up-freestyle-ages-8-10.md";
				const url = undefined;
				function rawContent() {
					return "\nCatch-up freestyle teaches hand coordination. The swimmer must touch one hand to the other before beginning the next stroke, forcing a deliberate rhythm.\n\n**Equipment needed:** 1 pool, no kickboard.\n\n**Setup:** Swimmers line up at one end of the pool.\n\n**How to run it:**\n\n1. Swimmer does freestyle, but the trailing hand must \"catch up\" to the lead hand before starting the next stroke.\n2. This means the arms are fully extended, then the swimmer takes a stroke and the hands meet before the next stroke begins.\n3. Swim one 25-yard length at controlled pace, focusing on rhythm.\n4. Rest at the wall.\n5. Repeat 4 times.\n\n**What to look for:**\n\nThe catch-up forces a disciplined arm extension. If a swimmer is rushing and overlapping their hands, the drill isn't working. The catch-up should feel smooth and controlled. The kick should be steady underneath, not frantic. If a swimmer is struggling to make the catch-up, they might be accelerating the stroke too much early.\n\n**Variation:** Add speed. Once the catch-up feels natural, have swimmers try it at a slightly faster pace, maintaining the rhythm.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth swim goggles →](/go/swim-goggles-youth/) — Speedo Hydrospex, no-fog, fits ages 6–14.\n\n[Full swimming gear guide →](/what-to-buy/swimming/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
