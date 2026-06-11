globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The dive is the last-resort defense. Ball is going to land 6 feet in front of the player. They dive forward, hit it with one or both hands, slide on the chest after contact. Done right, it’s a clean dig. Done wrong, it’s a wipeout. Worth teaching slowly.</p>\n<p><strong>What you need:</strong> A <a href=\"/go/volleyball-volley-lite/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">volleyball</a>, a clean court (or <a href=\"/go/volleyball-knee-pads-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">knee pads</a> on grass), two players.</p>\n<p><strong>Setup:</strong> Defender in the back court. Coach 20 feet away with the ball.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Coach drops a soft ball 5 feet in front of the defender (just out of reach for a normal dig).</li>\n<li>Defender steps and dives forward, arms extended.</li>\n<li>Contact the ball with one or both hands. Push it up.</li>\n<li>Body lands flat, slides on the chest. Hands come down to absorb.</li>\n<li>Do 6 reps each side. This drill needs a clean court or pads.</li>\n</ol>\n<p><strong>What to watch:</strong> The landing. Hands down to break the fall. Chest slides. Knees do NOT hit the floor.</p>\n<p><strong>If they’re struggling:</strong> Skip the dive. Practice forward stretch with a step instead. Build the dive when the kid is ready.</p>\n<p><strong>If they’ve got it:</strong></p>";

				const frontmatter = {"title":"Emergency Dive Intro","summary":"Dive forward to dig a ball that's just out of reach. 12 minutes. Ages 11-12.","sport":"volleyball","ages":["11-12"],"fundamental":"defending","progression":"refine","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player in mid-air horizontal to the floor, arms extended forward to dig a ball, body sliding to the floor on the chest after contact.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":true,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Sensitive flag for diving injury risk. Body-mechanics call-out (knees do NOT hit floor) is critical."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/volleyball-emergency-dive-intro.md";
				const url = undefined;
				function rawContent() {
					return "\nThe dive is the last-resort defense. Ball is going to land 6 feet in front of the player. They dive forward, hit it with one or both hands, slide on the chest after contact. Done right, it's a clean dig. Done wrong, it's a wipeout. Worth teaching slowly.\n\n**What you need:** A [volleyball](/go/volleyball-volley-lite/), a clean court (or [knee pads](/go/volleyball-knee-pads-youth/) on grass), two players.\n\n**Setup:** Defender in the back court. Coach 20 feet away with the ball.\n\n**How to run it:**\n\n1. Coach drops a soft ball 5 feet in front of the defender (just out of reach for a normal dig).\n2. Defender steps and dives forward, arms extended.\n3. Contact the ball with one or both hands. Push it up.\n4. Body lands flat, slides on the chest. Hands come down to absorb.\n5. Do 6 reps each side. This drill needs a clean court or pads.\n\n**What to watch:** The landing. Hands down to break the fall. Chest slides. Knees do NOT hit the floor.\n\n**If they're struggling:** Skip the dive. Practice forward stretch with a step instead. Build the dive when the kid is ready.\n\n**If they've got it:** ";
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
