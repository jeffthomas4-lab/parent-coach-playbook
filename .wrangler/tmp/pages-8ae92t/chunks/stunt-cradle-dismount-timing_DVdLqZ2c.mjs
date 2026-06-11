globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The cradle is how every stunt ends safely. Timing is everything.</p>\n<p><strong>Equipment needed:</strong> Mat. Two bases, one flyer, one spotter behind.</p>\n<p><strong>Setup:</strong> Flyer is in a shoulder sit (start simple).</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Bases call “one, two, down, UP” — on UP, flyer pops upward and back.</li>\n<li>Bases catch the flyer with one arm under the back, one arm under the legs.</li>\n<li>Spotter behind supports the flyer’s head and shoulders during the catch.</li>\n<li>Flyer’s body should be horizontal, eyes up.</li>\n<li>Six reps.</li>\n</ol>\n<p><strong>What to look for:</strong> The catch is synchronized. If bases catch at different moments, the flyer twists. Spotter’s hands cradle the head — never grab the hair.</p>\n<p><strong>Variation:</strong> Once cradle from shoulder sit is clean, progress to cradle from prep (waist-level stunt).</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/multi-sport-mouthguard-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth mouthguard →</a> — required for most stunt and cheer programs.</p>\n<p><a href=\"/what-to-buy/stunt/\">Full stunt gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Cradle Dismount Timing","summary":"Bases and flyer sync the cradle catch. Six reps. Ages 13-14.","sport":"stunt","age":"13-14","ages":["13-14"],"focus":"situational","layer":"situational","fundamental":"situational","progression":"build","illustrationBrief":"A flyer cradling backward into two bases' arms, body horizontal, ready for the catch.","publishedAt":"2026-05-12T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":6,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-12T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Generated as part of the per-sport content baseline. Voice may need a Jeff pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/stunt-cradle-dismount-timing.md";
				const url = undefined;
				function rawContent() {
					return "\nThe cradle is how every stunt ends safely. Timing is everything.\n\n**Equipment needed:** Mat. Two bases, one flyer, one spotter behind.\n\n**Setup:** Flyer is in a shoulder sit (start simple).\n\n**How to run it:**\n\n1. Bases call \"one, two, down, UP\" — on UP, flyer pops upward and back.\n2. Bases catch the flyer with one arm under the back, one arm under the legs.\n3. Spotter behind supports the flyer's head and shoulders during the catch.\n4. Flyer's body should be horizontal, eyes up.\n5. Six reps.\n\n**What to look for:** The catch is synchronized. If bases catch at different moments, the flyer twists. Spotter's hands cradle the head — never grab the hair.\n\n**Variation:** Once cradle from shoulder sit is clean, progress to cradle from prep (waist-level stunt).\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth mouthguard →](/go/multi-sport-mouthguard-youth/) — required for most stunt and cheer programs.\n\n[Full stunt gear guide →](/what-to-buy/stunt/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
