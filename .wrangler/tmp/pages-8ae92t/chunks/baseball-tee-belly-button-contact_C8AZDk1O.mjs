globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The first hitting drill teaches the kid that the bat has to hit the ball, not the ball has to hit the bat. The ball is sitting still on the tee. They are in charge. Belly button height is the easiest contact height for a kid to feel.</p>\n<p><strong>What you need:</strong> A T-ball tee, 10 plastic or safety-core baseballs, an age-appropriate bat, a fence or net.</p>\n<p><strong>Setup:</strong> Tee at belly button height. Kid stands so the tee is between them and the net.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Set, Load, Step, Swing. Today’s focus is Set and Swing.</li>\n<li>Set: feet shoulder-width apart, knees soft, hands by the back shoulder.</li>\n<li>They swing through the ball.</li>\n<li>After contact, they retrieve and reset. That’s their job.</li>\n<li>Do 10 swings.</li>\n</ol>\n<p><strong>What to watch:</strong> Are they making solid contact? Solid contact sounds different than a glance. If they’re glancing, the swing path is over or under the ball. Have them aim for the back of the ball.</p>\n<p><strong>If they’re struggling:</strong> Lower the tee to belt height or knee height. The closer to the ground, the easier the contact for some kids.</p>\n<p><strong>If they’ve got it:</strong> Move the tee slightly forward (in front of the front hip). Now they have to hit the ball out in front of the plate. That’s the next skill.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/go/baseball-trainer/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Batting trainer →</a> — tee and trainer setup for solo swings.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Tee Belly Button Contact","summary":"Hit the ball off a tee at belly button height. 12 minutes. T-ball and ages 5-7.","sport":"baseball","ages":["t-ball","5-7"],"fundamental":"hitting","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A young child swinging a bat at a tee with the ball positioned at belly button height, contact happening out in front of the body.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-tee-belly-button-contact.md";
				const url = undefined;
				function rawContent() {
					return "\nThe first hitting drill teaches the kid that the bat has to hit the ball, not the ball has to hit the bat. The ball is sitting still on the tee. They are in charge. Belly button height is the easiest contact height for a kid to feel.\n\n**What you need:** A T-ball tee, 10 plastic or safety-core baseballs, an age-appropriate bat, a fence or net.\n\n**Setup:** Tee at belly button height. Kid stands so the tee is between them and the net.\n\n**How to run it:**\n\n1. Cue: Set, Load, Step, Swing. Today's focus is Set and Swing.\n2. Set: feet shoulder-width apart, knees soft, hands by the back shoulder.\n3. They swing through the ball.\n4. After contact, they retrieve and reset. That's their job.\n5. Do 10 swings.\n\n**What to watch:** Are they making solid contact? Solid contact sounds different than a glance. If they're glancing, the swing path is over or under the ball. Have them aim for the back of the ball.\n\n**If they're struggling:** Lower the tee to belt height or knee height. The closer to the ground, the easier the contact for some kids.\n\n**If they've got it:** Move the tee slightly forward (in front of the front hip). Now they have to hit the ball out in front of the plate. That's the next skill.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[Batting trainer →](/go/baseball-trainer/) — tee and trainer setup for solo swings.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
