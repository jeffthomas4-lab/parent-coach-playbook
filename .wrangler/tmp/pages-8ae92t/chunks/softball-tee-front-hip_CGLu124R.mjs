globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Now the tee moves forward. Front hip contact teaches the kid to extend the arms and create better bat speed. This is the next step after belly button.</p>\n<p><strong>What you need:</strong> A T-ball tee, 15 softballs (11”), an age-appropriate bat, a fence or net.</p>\n<p><strong>Setup:</strong> Tee positioned in front of the front hip, slightly lower than belly button. Kid in ready position.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Set, Load, Step, Swing.</li>\n<li>Set feet, Load hands, Step toward the pitcher with the front foot.</li>\n<li>Swing and hit the ball out in front.</li>\n<li>Do 10 swings. Focus on the step before the swing.</li>\n<li>Round two: move the tee even more forward (6 inches more). Do 10 more.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the front foot step before the swing? Or does it step during the swing? Step first, swing second.</p>\n<p><strong>If they’re struggling:</strong> Move the tee back to belly button. Focus on the step without the swing.</p>\n<p><strong>If they’ve got it:</strong> Move the tee to the outside corner (further away from the body). They have to extend to reach it.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/softball-glove-11in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth softball glove →</a> — 11-inch fielder’s glove for new players.</p>\n<p><a href=\"/what-to-buy/softball/\">Full softball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Tee Front Hip Contact","summary":"Hit the ball out in front at front hip position. 12 minutes. Ages 5-7 and 8-10.","sport":"softball","ages":["5-7","8-10"],"fundamental":"hitting","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Child swinging at a tee positioned in front of the front hip, contacting the ball with an extended arm.","editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Tee progression to front-hip contact; ball term fixed."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/softball-tee-front-hip.md";
				const url = undefined;
				function rawContent() {
					return "\nNow the tee moves forward. Front hip contact teaches the kid to extend the arms and create better bat speed. This is the next step after belly button.\n\n**What you need:** A T-ball tee, 15 softballs (11\"), an age-appropriate bat, a fence or net.\n\n**Setup:** Tee positioned in front of the front hip, slightly lower than belly button. Kid in ready position.\n\n**How to run it:**\n\n1. Cue: Set, Load, Step, Swing.\n2. Set feet, Load hands, Step toward the pitcher with the front foot.\n3. Swing and hit the ball out in front.\n4. Do 10 swings. Focus on the step before the swing.\n5. Round two: move the tee even more forward (6 inches more). Do 10 more.\n\n**What to watch:** Does the front foot step before the swing? Or does it step during the swing? Step first, swing second.\n\n**If they're struggling:** Move the tee back to belly button. Focus on the step without the swing.\n\n**If they've got it:** Move the tee to the outside corner (further away from the body). They have to extend to reach it.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth softball glove →](/go/softball-glove-11in/) — 11-inch fielder's glove for new players.\n\n[Full softball gear guide →](/what-to-buy/softball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
