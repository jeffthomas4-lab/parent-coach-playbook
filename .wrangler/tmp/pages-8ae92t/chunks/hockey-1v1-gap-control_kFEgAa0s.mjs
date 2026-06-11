globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Gap is the distance between defender and attacker. Too close, the attacker dekes around. Too far, the attacker shoots or passes freely. The right gap is 5-7 feet: close enough to pressure but not so close they get beat. This drill builds gap control.</p>\n<p><strong>What you need:</strong> Sticks, puck, two players in full gear, ice rink.</p>\n<p><strong>Setup:</strong> Attacker at one blue line with the puck. Defender at center ice, facing the attacker.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Coach blows whistle.</li>\n<li>Attacker skates forward with the puck.</li>\n<li>Defender skates backward, keeping a 6-foot gap.</li>\n<li>As the attacker tries to deke around, the defender mirrors with backward skating.</li>\n<li>At the other blue line, defender either poke checks or stays in front. Reset.</li>\n</ol>\n<p><strong>What to watch:</strong> Gap distance. If the defender gets closer than 5 feet, they get faked out. If further than 8 feet, the attacker has space to shoot.</p>\n<p><strong>If they’re struggling:</strong> Slow the attacker. Or limit the deke moves.</p>\n<p><strong>If they’ve got it:</strong> Allow the attacker to use a teammate (2v1). The defender has to read pass vs. deke.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/hockey-puck/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Hockey pucks (6-pack) →</a> — regulation pucks for drills and scrimmage.</p>\n<p><a href=\"/what-to-buy/hockey/\">Full hockey gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"1v1 Gap Control","summary":"Defender keeps the right distance to the attacker without getting beat. 12 minutes. Ages 11-12.","sport":"hockey","ages":["11-12"],"fundamental":"defending","progression":"build","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Defender skating backward 6 feet in front of an attacker who has the puck, both moving up the ice in parallel lines.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"11-12, no body checks. Defender ends with poke check or stay-in-front, fits USA Hockey age rules. Fixed dek to deke and pokechecks to poke checks for sport-language compliance."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/hockey-1v1-gap-control.md";
				const url = undefined;
				function rawContent() {
					return "\nGap is the distance between defender and attacker. Too close, the attacker dekes around. Too far, the attacker shoots or passes freely. The right gap is 5-7 feet: close enough to pressure but not so close they get beat. This drill builds gap control.\n\n**What you need:** Sticks, puck, two players in full gear, ice rink.\n\n**Setup:** Attacker at one blue line with the puck. Defender at center ice, facing the attacker.\n\n**How to run it:**\n\n1. Coach blows whistle.\n2. Attacker skates forward with the puck.\n3. Defender skates backward, keeping a 6-foot gap.\n4. As the attacker tries to deke around, the defender mirrors with backward skating.\n5. At the other blue line, defender either poke checks or stays in front. Reset.\n\n**What to watch:** Gap distance. If the defender gets closer than 5 feet, they get faked out. If further than 8 feet, the attacker has space to shoot.\n\n**If they're struggling:** Slow the attacker. Or limit the deke moves.\n\n**If they've got it:** Allow the attacker to use a teammate (2v1). The defender has to read pass vs. deke.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Hockey pucks (6-pack) →](/go/hockey-puck/) — regulation pucks for drills and scrimmage.\n\n[Full hockey gear guide →](/what-to-buy/hockey/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
