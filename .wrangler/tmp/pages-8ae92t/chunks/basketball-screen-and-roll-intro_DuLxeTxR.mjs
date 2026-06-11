globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The screen and roll (or pick and roll) is the most common play in basketball. Two players, one defender beat by setup. The screener sets a body. The ball-handler dribbles past. The screener rolls to the rim. Done right, two offensive players occupy three defenders.</p>\n<p><strong>What you need:</strong> A half court, two players.</p>\n<p><strong>Setup:</strong> Ball-handler at the top of the key. Screener at the wing. No defender for the first reps.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Screener walks up to a spot beside the ball-handler’s defender (imaginary at first). Sets feet shoulder-width, hands by chest, body still. That’s the screen.</li>\n<li>Ball-handler dribbles past the screen, tight to the screener’s hip.</li>\n<li>Screener “rolls” by pivoting toward the basket and sprinting to the rim.</li>\n<li>Ball-handler reads the play: shoots if open, passes to the rolling screener, or kicks to another teammate.</li>\n<li>Do 6 reps. Rotate roles.</li>\n</ol>\n<p><strong>What to watch:</strong> The screen quality. The screener cannot move during the screen or it’s an illegal screen (offensive foul). Feet still, body still, take the contact.</p>\n<p><strong>If they’re struggling:</strong> Walk through the timing without dribbling. Just work on screen-and-roll footwork.</p>\n<p><strong>If they’ve got it:</strong> Add two defenders. Now the play has to actually beat someone.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Screen and Roll Intro","summary":"First exposure to the on-ball screen. 15 minutes. Ages 11-12.","sport":"basketball","ages":["11-12"],"fundamental":"positioning","progression":"refine","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"One player setting a stationary screen on the side of an imaginary defender, the ball-handler dribbling around the screen, the screener rolling toward the basket.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Illegal-screen warning is a useful detail."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-screen-and-roll-intro.md";
				const url = undefined;
				function rawContent() {
					return "\nThe screen and roll (or pick and roll) is the most common play in basketball. Two players, one defender beat by setup. The screener sets a body. The ball-handler dribbles past. The screener rolls to the rim. Done right, two offensive players occupy three defenders.\n\n**What you need:** A half court, two players.\n\n**Setup:** Ball-handler at the top of the key. Screener at the wing. No defender for the first reps.\n\n**How to run it:**\n\n1. Screener walks up to a spot beside the ball-handler's defender (imaginary at first). Sets feet shoulder-width, hands by chest, body still. That's the screen.\n2. Ball-handler dribbles past the screen, tight to the screener's hip.\n3. Screener \"rolls\" by pivoting toward the basket and sprinting to the rim.\n4. Ball-handler reads the play: shoots if open, passes to the rolling screener, or kicks to another teammate.\n5. Do 6 reps. Rotate roles.\n\n**What to watch:** The screen quality. The screener cannot move during the screen or it's an illegal screen (offensive foul). Feet still, body still, take the contact.\n\n**If they're struggling:** Walk through the timing without dribbling. Just work on screen-and-roll footwork.\n\n**If they've got it:** Add two defenders. Now the play has to actually beat someone.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
