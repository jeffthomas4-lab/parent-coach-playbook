globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>When the glove is off, kids stop hiding behind it. They have to drop low and bring both hands together to catch a rolling ball. The body learns the right position because the body has no choice.</p>\n<p><strong>What you need:</strong> 5 tennis balls. No gloves.</p>\n<p><strong>Setup:</strong> Stand 8 feet from the kid on grass. They face you with no glove, both hands ready in front.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Drop, Show, Funnel. No throw today.</li>\n<li>They drop into a low position, both hands cupped together palms-up on the ground.</li>\n<li>Roll a slow ball into their hands. They squeeze it between both hands and bring it up to the chest.</li>\n<li>Do 10 rolls. Reset between each.</li>\n<li>Last 5: roll slightly to one side. Now they have to step before they drop.</li>\n</ol>\n<p><strong>What to watch:</strong> Are both hands together? If one hand is in front of the other or off to the side, the catch is one-handed and ball will pop out. Hands together palm-to-palm.</p>\n<p><strong>If they’re struggling:</strong> Slower rolls. Bigger soft ball.</p>\n<p><strong>If they’ve got it:</strong> Add the glove back. Same drill, now with the glove. The glove should feel easier than no glove.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Rolling Grounders No Glove","summary":"Field grounders with bare hands so the body learns the position. 8 minutes. T-ball and ages 5-7.","sport":"baseball","ages":["t-ball","5-7"],"fundamental":"fielding","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A young child crouched low with both hands together palms-up on the grass, fielding a slow tennis ball without a glove.","editorial":{"qualityGrade":8,"originalityGrade":8,"voiceGrade":9,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-rolling-grounders-no-glove.md";
				const url = undefined;
				function rawContent() {
					return "\nWhen the glove is off, kids stop hiding behind it. They have to drop low and bring both hands together to catch a rolling ball. The body learns the right position because the body has no choice.\n\n**What you need:** 5 tennis balls. No gloves.\n\n**Setup:** Stand 8 feet from the kid on grass. They face you with no glove, both hands ready in front.\n\n**How to run it:**\n\n1. Cue: Drop, Show, Funnel. No throw today.\n2. They drop into a low position, both hands cupped together palms-up on the ground.\n3. Roll a slow ball into their hands. They squeeze it between both hands and bring it up to the chest.\n4. Do 10 rolls. Reset between each.\n5. Last 5: roll slightly to one side. Now they have to step before they drop.\n\n**What to watch:** Are both hands together? If one hand is in front of the other or off to the side, the catch is one-handed and ball will pop out. Hands together palm-to-palm.\n\n**If they're struggling:** Slower rolls. Bigger soft ball.\n\n**If they've got it:** Add the glove back. Same drill, now with the glove. The glove should feel easier than no glove.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
