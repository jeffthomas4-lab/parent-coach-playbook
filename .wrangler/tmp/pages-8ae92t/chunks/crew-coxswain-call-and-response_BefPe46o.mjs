globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A boat is one body or it’s eight people fighting each other. Call-and-response builds rhythm.</p>\n<p><strong>Equipment needed:</strong> A boat with a coxswain seat, or an erg group with one designated caller.</p>\n<p><strong>Setup:</strong> Coxswain in the stern. Rowers ready.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Coxswain calls “ready, row” to start.</li>\n<li>Every five strokes, coxswain calls “catch!” on the catch of the next stroke.</li>\n<li>Rowers respond with one syllable on that catch — “yes” or “go.”</li>\n<li>Build to 10 strokes between calls. The boat finds its rhythm.</li>\n</ol>\n<p><strong>What to look for:</strong> Everyone catches at the same moment when the call lands. If a rower is early or late, they hear the gap in the response.</p>\n<p><strong>Variation:</strong> Add a power-ten call — “power ten in two, that’s one… two…” then the boat hits ten harder strokes together.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/resistance-bands-set/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Resistance band set →</a> — land-based strength and conditioning supplement.</p>\n<p><a href=\"/what-to-buy/crew/\">Full crew gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Coxswain Call-and-Response","summary":"Practice the coxswain's race calls with the rowers responding. Builds boat unity. Ages 11-14.","sport":"crew","age":"11-12","ages":["11-12","13-14"],"focus":"culture","layer":"skills","fundamental":"situational","progression":"build","illustrationBrief":"A young coxswain in the stern of a four, calling out cadence with rowers responding on the catch.","publishedAt":"2026-05-12T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":6,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-12T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Generated as part of the per-sport content baseline. Voice may need a Jeff pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/crew-coxswain-call-and-response.md";
				const url = undefined;
				function rawContent() {
					return "\nA boat is one body or it's eight people fighting each other. Call-and-response builds rhythm.\n\n**Equipment needed:** A boat with a coxswain seat, or an erg group with one designated caller.\n\n**Setup:** Coxswain in the stern. Rowers ready.\n\n**How to run it:**\n\n1. Coxswain calls \"ready, row\" to start.\n2. Every five strokes, coxswain calls \"catch!\" on the catch of the next stroke.\n3. Rowers respond with one syllable on that catch — \"yes\" or \"go.\"\n4. Build to 10 strokes between calls. The boat finds its rhythm.\n\n**What to look for:** Everyone catches at the same moment when the call lands. If a rower is early or late, they hear the gap in the response.\n\n**Variation:** Add a power-ten call — \"power ten in two, that's one… two…\" then the boat hits ten harder strokes together.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Resistance band set →](/go/resistance-bands-set/) — land-based strength and conditioning supplement.\n\n[Full crew gear guide →](/what-to-buy/crew/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
