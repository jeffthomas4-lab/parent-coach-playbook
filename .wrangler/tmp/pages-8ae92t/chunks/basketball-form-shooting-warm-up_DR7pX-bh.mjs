globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The first shot of practice should look like every other shot. Form shooting from 3 feet primes the muscles before kids start shooting from real distance. Five minutes of close-range form is worth twenty minutes of bad shots from the three.</p>\n<p><strong>What you need:</strong> A hoop, a basketball, one or more players.</p>\n<p><strong>Setup:</strong> Player stands 3 feet from the rim. Optional: line up a few kids on either side of the rim.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Set, Bend, Lift, Cookie.</li>\n<li>Set feet square to the rim. Bend the knees. Lift the ball with elbow under. Snap the wrist into the cookie jar (hand relaxed forward, fingers at the rim).</li>\n<li>Make 10 shots from 3 feet. The hand should freeze in the cookie jar after each release.</li>\n<li>Move back to 6 feet. Make 10 more.</li>\n<li>Move to 10 feet. Make 5 more, then practice can begin.</li>\n</ol>\n<p><strong>What to watch:</strong> The follow-through. The hand should hang in the cookie jar position for at least one second after the release. If it drops too fast, the wrist snap is incomplete.</p>\n<p><strong>If they’re struggling:</strong> Stay at 3 feet. Or shoot one-handed (no guide hand) to feel the wrist snap clearly.</p>\n<p><strong>If they’ve got it:</strong> Add a back-cut after each shot: shoot, cut to half court, sprint back, shoot again.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Form Shooting Warm-Up","summary":"Close-range shooting before any structured drill. 5 minutes. Ages 8-10 and 11-12.","sport":"basketball","ages":["8-10","11-12"],"fundamental":"warm-up","progression":"intro","focus":"warm-up","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player shooting from 3 feet away with perfect form, hand finishing in the cookie jar position, ball going through the net.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Good lead about priming the muscles; reads tight."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-form-shooting-warm-up.md";
				const url = undefined;
				function rawContent() {
					return "\nThe first shot of practice should look like every other shot. Form shooting from 3 feet primes the muscles before kids start shooting from real distance. Five minutes of close-range form is worth twenty minutes of bad shots from the three.\n\n**What you need:** A hoop, a basketball, one or more players.\n\n**Setup:** Player stands 3 feet from the rim. Optional: line up a few kids on either side of the rim.\n\n**How to run it:**\n\n1. Cue: Set, Bend, Lift, Cookie.\n2. Set feet square to the rim. Bend the knees. Lift the ball with elbow under. Snap the wrist into the cookie jar (hand relaxed forward, fingers at the rim).\n3. Make 10 shots from 3 feet. The hand should freeze in the cookie jar after each release.\n4. Move back to 6 feet. Make 10 more.\n5. Move to 10 feet. Make 5 more, then practice can begin.\n\n**What to watch:** The follow-through. The hand should hang in the cookie jar position for at least one second after the release. If it drops too fast, the wrist snap is incomplete.\n\n**If they're struggling:** Stay at 3 feet. Or shoot one-handed (no guide hand) to feel the wrist snap clearly.\n\n**If they've got it:** Add a back-cut after each shot: shoot, cut to half court, sprint back, shoot again.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
