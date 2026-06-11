globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A serve that just goes over the net is a free ball for the receivers. A serve to a specific zone (the seam between two players, or the back corner where no one’s standing) is a weapon. This drill teaches the kid to aim, not just hit.</p>\n<p><strong>What you need:</strong> A volleyball, a net, cones marking zones.</p>\n<p><strong>Setup:</strong> Set 6 zones on the opposing court (1-6 like a real volleyball rotation). Server at the back line.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Coach calls a zone number before each serve.</li>\n<li>Server has to serve to that zone.</li>\n<li>Track makes and misses for each zone.</li>\n<li>Do 12 serves total (2 to each zone).</li>\n<li>Goal: 8 of 12 land in the correct zone.</li>\n</ol>\n<p><strong>What to watch:</strong> Body alignment. Serving to zone 5 (back left) requires a different body angle than zone 1 (back right). Are they adjusting their feet to aim?</p>\n<p><strong>If they’re struggling:</strong> Use only 3 zones (left, middle, right). Or move closer to the net.</p>\n<p><strong>If they’ve got it:</strong> Add scoring: easy zones (middle) = 1 point, hard zones (corners and seams) = 3 points. Score to 21.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/volleyball-volley-lite/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Volley Lite training ball →</a> — lightweight ball for beginners learning to pass.</p>\n<p><a href=\"/go/volleyball-net/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Portable volleyball net →</a> — 32-ft set with adjustable steel poles.</p>\n<p><a href=\"/what-to-buy/volleyball/\">Full volleyball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Serve to Target Zones","summary":"Serve to specific zones on the opposing court. 12 minutes. Ages 11-12.","sport":"volleyball","ages":["11-12"],"fundamental":"serving","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A volleyball court with cones marking six zones (1-6), the server aiming serves at specific zones to score points.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Zone scoring variation makes this competitive. Vocabulary correct."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/volleyball-serve-target-zone.md";
				const url = undefined;
				function rawContent() {
					return "\nA serve that just goes over the net is a free ball for the receivers. A serve to a specific zone (the seam between two players, or the back corner where no one's standing) is a weapon. This drill teaches the kid to aim, not just hit.\n\n**What you need:** A volleyball, a net, cones marking zones.\n\n**Setup:** Set 6 zones on the opposing court (1-6 like a real volleyball rotation). Server at the back line.\n\n**How to run it:**\n\n1. Coach calls a zone number before each serve.\n2. Server has to serve to that zone.\n3. Track makes and misses for each zone.\n4. Do 12 serves total (2 to each zone).\n5. Goal: 8 of 12 land in the correct zone.\n\n**What to watch:** Body alignment. Serving to zone 5 (back left) requires a different body angle than zone 1 (back right). Are they adjusting their feet to aim?\n\n**If they're struggling:** Use only 3 zones (left, middle, right). Or move closer to the net.\n\n**If they've got it:** Add scoring: easy zones (middle) = 1 point, hard zones (corners and seams) = 3 points. Score to 21.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Volley Lite training ball →](/go/volleyball-volley-lite/) — lightweight ball for beginners learning to pass.\n\n[Portable volleyball net →](/go/volleyball-net/) — 32-ft set with adjustable steel poles.\n\n[Full volleyball gear guide →](/what-to-buy/volleyball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
