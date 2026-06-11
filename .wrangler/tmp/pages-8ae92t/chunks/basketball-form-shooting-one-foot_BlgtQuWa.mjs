globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>One-foot shooting teaches balance and isolation. It forces kids to focus on the arm and hand motion without the distraction of footwork. Start close to the basket.</p>\n<p><strong>What you need:</strong> 8-foot basket. Youth ball. One per kid. Flat court.</p>\n<p><strong>Setup:</strong> Kids stand 5 feet from the basket, on one leg. Their other leg is up for balance.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Set, Bend, Lift, Cookie. Feet set (stand on right leg). Knees bend slightly. Lift the ball up with elbow under.</li>\n<li>Release with the cookie jar follow-through. Hand finishes relaxed forward, fingers pointing at the rim.</li>\n<li>Shoot 5 shots from the right leg. Then switch and shoot 5 from the left leg.</li>\n<li>Do 2 rounds.</li>\n</ol>\n<p><strong>What to watch:</strong> Is the shooting arm elbow under the ball or out to the side? Under the ball is the key. If the elbow flares out, the shot will be off-line.</p>\n<p><strong>If they’re struggling:</strong> Use a lower hoop (6 feet). Move closer to 3 feet. Use a softer ball. Skip the balance drill and let them stand normally while they build confidence.</p>\n<p><strong>If they’ve got it:</strong> Add 2-foot form shooting from 6 feet. Keep the same Set, Bend, Lift, Cookie cues.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Form Shooting One Foot","summary":"Shoot from one foot in place, no movement. 8 minutes. Ages 5-7.","sport":"basketball","ages":["5-7"],"fundamental":"shooting","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A young child standing on one leg, shooting a basketball toward a lower hoop with proper form.","editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Good isolation drill for elbow position."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-form-shooting-one-foot.md";
				const url = undefined;
				function rawContent() {
					return "\nOne-foot shooting teaches balance and isolation. It forces kids to focus on the arm and hand motion without the distraction of footwork. Start close to the basket.\n\n**What you need:** 8-foot basket. Youth ball. One per kid. Flat court.\n\n**Setup:** Kids stand 5 feet from the basket, on one leg. Their other leg is up for balance.\n\n**How to run it:**\n\n1. Cue: Set, Bend, Lift, Cookie. Feet set (stand on right leg). Knees bend slightly. Lift the ball up with elbow under.\n2. Release with the cookie jar follow-through. Hand finishes relaxed forward, fingers pointing at the rim.\n3. Shoot 5 shots from the right leg. Then switch and shoot 5 from the left leg.\n4. Do 2 rounds.\n\n**What to watch:** Is the shooting arm elbow under the ball or out to the side? Under the ball is the key. If the elbow flares out, the shot will be off-line.\n\n**If they're struggling:** Use a lower hoop (6 feet). Move closer to 3 feet. Use a softer ball. Skip the balance drill and let them stand normally while they build confidence.\n\n**If they've got it:** Add 2-foot form shooting from 6 feet. Keep the same Set, Bend, Lift, Cookie cues.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
