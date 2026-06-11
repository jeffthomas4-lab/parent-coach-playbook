globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Stick handling starts with the puck moving on the blade. Tap, tap, tap. Forehand, backhand, forehand. Hundreds of taps build the soft hands every hockey player needs.</p>\n<p><strong>What you need:</strong> A hockey stick, a puck (or street hockey ball off-ice), open space.</p>\n<p><strong>Setup:</strong> Kid stands still with the stick on the ice or floor. Puck in front of them.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Tap the puck from the forehand to the backhand.</li>\n<li>Tap it back to the forehand.</li>\n<li>Continue tapping for 30 seconds. Slow tempo.</li>\n<li>Rest 15 seconds. Repeat for 4 rounds.</li>\n<li>Last round: faster tempo. Same control.</li>\n</ol>\n<p><strong>What to watch:</strong> Are they looking at the puck? At this age, looking at the puck is fine. Eyes-up handling comes later. Right now: feel the puck on the stick.</p>\n<p><strong>If they’re struggling:</strong> Use a softer ball (street hockey ball) instead of a puck. Slower tempo.</p>\n<p><strong>If they’ve got it:</strong> Tap-tap-pull (two taps, then pull the puck back toward the body). Or tap with eyes closed for 10 seconds.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/hockey-puck/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Hockey pucks (6-pack) →</a> — regulation pucks for drills and scrimmage.</p>\n<p><a href=\"/go/hockey-stick-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth hockey stick →</a> — Franklin Ripper, flex rated for young players.</p>\n<p><a href=\"/what-to-buy/hockey/\">Full hockey gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Tap Tap Stick Handle","summary":"Tap the puck back and forth between forehand and backhand. 8 minutes. Ages 5-7.","sport":"hockey","ages":["5-7"],"fundamental":"stick-handling","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A young player standing still with a hockey stick, tapping a puck softly back and forth between the forehand and backhand sides of the blade.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Letting eyes-down be okay at 5-7 is the right call. Builds feel first."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/hockey-tap-tap-stick-handle.md";
				const url = undefined;
				function rawContent() {
					return "\nStick handling starts with the puck moving on the blade. Tap, tap, tap. Forehand, backhand, forehand. Hundreds of taps build the soft hands every hockey player needs.\n\n**What you need:** A hockey stick, a puck (or street hockey ball off-ice), open space.\n\n**Setup:** Kid stands still with the stick on the ice or floor. Puck in front of them.\n\n**How to run it:**\n\n1. Tap the puck from the forehand to the backhand.\n2. Tap it back to the forehand.\n3. Continue tapping for 30 seconds. Slow tempo.\n4. Rest 15 seconds. Repeat for 4 rounds.\n5. Last round: faster tempo. Same control.\n\n**What to watch:** Are they looking at the puck? At this age, looking at the puck is fine. Eyes-up handling comes later. Right now: feel the puck on the stick.\n\n**If they're struggling:** Use a softer ball (street hockey ball) instead of a puck. Slower tempo.\n\n**If they've got it:** Tap-tap-pull (two taps, then pull the puck back toward the body). Or tap with eyes closed for 10 seconds.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Hockey pucks (6-pack) →](/go/hockey-puck/) — regulation pucks for drills and scrimmage.\n\n[Youth hockey stick →](/go/hockey-stick-youth/) — Franklin Ripper, flex rated for young players.\n\n[Full hockey gear guide →](/what-to-buy/hockey/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
