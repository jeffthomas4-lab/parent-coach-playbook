globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The first set rep should be predictable. The ball comes from the player’s own toss. They form the window, set the ball back up. Repeat. The ball never goes far. The skill builds in the hands.</p>\n<p><strong>What you need:</strong> A volleyball, open space.</p>\n<p><strong>Setup:</strong> Kid stands with the ball.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Window, Soft, Push, Target.</li>\n<li>Toss the ball straight up about 4 feet (head height).</li>\n<li>Get into the window position before the ball comes down.</li>\n<li>Set the ball straight back up using both hands. Push with the legs and arms.</li>\n<li>Catch the set. Repeat for 10 reps.</li>\n</ol>\n<p><strong>What to watch:</strong> Ball contact. The ball should touch the fingertips, not the palms. If the palm slaps the ball, the contact is too low or too flat.</p>\n<p><strong>If they’re struggling:</strong> Catch the toss instead of setting it. Build the window position with the catch first.</p>\n<p><strong>If they’ve got it:</strong> Continuous setting (don’t catch, just keep setting). Goal: 5 in a row without dropping.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/volleyball-volley-lite/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Volley Lite training ball →</a> — lightweight ball for beginners learning to pass.</p>\n<p><a href=\"/what-to-buy/volleyball/\">Full volleyball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Self Toss and Set","summary":"Toss to yourself and set the ball straight up. 10 minutes. Ages 8-10.","sport":"volleyball","ages":["8-10"],"fundamental":"setting","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player tossing a volleyball straight up, then setting it back up with both hands above the forehead in a clean window position.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Solo set rep. Fingertip vs palm cue is the keeper detail."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/volleyball-self-toss-and-set.md";
				const url = undefined;
				function rawContent() {
					return "\nThe first set rep should be predictable. The ball comes from the player's own toss. They form the window, set the ball back up. Repeat. The ball never goes far. The skill builds in the hands.\n\n**What you need:** A volleyball, open space.\n\n**Setup:** Kid stands with the ball.\n\n**How to run it:**\n\n1. Cue: Window, Soft, Push, Target.\n2. Toss the ball straight up about 4 feet (head height).\n3. Get into the window position before the ball comes down.\n4. Set the ball straight back up using both hands. Push with the legs and arms.\n5. Catch the set. Repeat for 10 reps.\n\n**What to watch:** Ball contact. The ball should touch the fingertips, not the palms. If the palm slaps the ball, the contact is too low or too flat.\n\n**If they're struggling:** Catch the toss instead of setting it. Build the window position with the catch first.\n\n**If they've got it:** Continuous setting (don't catch, just keep setting). Goal: 5 in a row without dropping.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Volley Lite training ball →](/go/volleyball-volley-lite/) — lightweight ball for beginners learning to pass.\n\n[Full volleyball gear guide →](/what-to-buy/volleyball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
