globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Receiving a thrown ball is different from self-toss. Now the kid has to react to the speed and angle. The cue is Eyes, Hands, Squeeze, Pull.</p>\n<p><strong>What you need:</strong> 10 softballs (11”), two kids or an adult and kid at 12 feet apart.</p>\n<p><strong>Setup:</strong> Stand 12 feet apart. Kid wears a glove and faces you in ready position.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Eyes, Hands, Squeeze, Pull. Today focus on Eyes and Hands.</li>\n<li>You toss underhand to them at chest height.</li>\n<li>They keep Eyes on the ball the whole time. Both Hands reach for it. Catch it in the glove.</li>\n<li>Do 10 tosses. No throwing back yet. Just catch and hand the ball back.</li>\n<li>After 10, they throw the ball back to you using their throw mechanics.</li>\n</ol>\n<p><strong>What to watch:</strong> Do both hands move to catch? Or does one hand hang? Both hands is the standard.</p>\n<p><strong>If they’re struggling:</strong> Stand closer at 8 feet. Toss even softer. Use a bigger ball.</p>\n<p><strong>If they’ve got it:</strong> Toss to different heights (high, low, shoulder). Make them reach and adjust.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/softball-glove-11in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth softball glove →</a> — 11-inch fielder’s glove for new players.</p>\n<p><a href=\"/what-to-buy/softball/\">Full softball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Two Hands Receive","summary":"Catch a thrown ball with proper hand technique. 10 minutes. Ages 5-7 and 8-10.","sport":"softball","ages":["5-7","8-10"],"fundamental":"catching","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Child in ready position with a glove on, receiving an underhand toss from an adult 12 feet away.","editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Two-hand catch fundamentals; ball term fixed."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/softball-two-hands-receive.md";
				const url = undefined;
				function rawContent() {
					return "\nReceiving a thrown ball is different from self-toss. Now the kid has to react to the speed and angle. The cue is Eyes, Hands, Squeeze, Pull.\n\n**What you need:** 10 softballs (11\"), two kids or an adult and kid at 12 feet apart.\n\n**Setup:** Stand 12 feet apart. Kid wears a glove and faces you in ready position.\n\n**How to run it:**\n\n1. Cue: Eyes, Hands, Squeeze, Pull. Today focus on Eyes and Hands.\n2. You toss underhand to them at chest height.\n3. They keep Eyes on the ball the whole time. Both Hands reach for it. Catch it in the glove.\n4. Do 10 tosses. No throwing back yet. Just catch and hand the ball back.\n5. After 10, they throw the ball back to you using their throw mechanics.\n\n**What to watch:** Do both hands move to catch? Or does one hand hang? Both hands is the standard.\n\n**If they're struggling:** Stand closer at 8 feet. Toss even softer. Use a bigger ball.\n\n**If they've got it:** Toss to different heights (high, low, shoulder). Make them reach and adjust.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth softball glove →](/go/softball-glove-11in/) — 11-inch fielder's glove for new players.\n\n[Full softball gear guide →](/what-to-buy/softball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
