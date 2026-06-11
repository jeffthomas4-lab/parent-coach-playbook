globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Three line passing is the warm-up for a fast-break offense. Players run, pass, catch, finish. It builds conditioning and chemistry at the same time. Most teams use this every practice.</p>\n<p><strong>What you need:</strong> A full court, basketballs (one per group of three), six or more players.</p>\n<p><strong>Setup:</strong> Three lines at one baseline. Middle line slightly behind the two outside lines. First three players step up.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Middle player has the ball. They pass to either outside player.</li>\n<li>The trio runs forward. Middle player gets the ball back, then passes to the other outside player.</li>\n<li>Continue passing back and forth, running full speed down the court.</li>\n<li>Last pass goes to the player in front of the rim, who finishes with a layup.</li>\n<li>Three new players step up. Repeat down the other direction.</li>\n</ol>\n<p><strong>What to watch:</strong> Are they passing on the move? Stopping to pass kills the rhythm. The ball should be in the air more than in any one player’s hands.</p>\n<p><strong>If they’re struggling:</strong> Walk through the pattern at half speed. Just work on the timing of passes.</p>\n<p><strong>If they’ve got it:</strong> Add no-look passes or behind-the-back passes. Or finish with a kick-out instead of a layup (last pass goes back to the trailer for a jumper).</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Three Line Passing Warm-Up","summary":"Three lines, one ball, full-court passing on the move. 7 minutes. Ages 11-12.","sport":"basketball","ages":["11-12"],"fundamental":"warm-up","progression":"intro","focus":"warm-up","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Three lines of players running down the court in zigzag patterns, the middle player passing left and right to the outside players in succession.","editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Pattern as written keeps the ball flowing through the middle rather than the classic weave (pass-and-cut-behind). Lead has four sentences."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-three-line-passing-warm-up.md";
				const url = undefined;
				function rawContent() {
					return "\nThree line passing is the warm-up for a fast-break offense. Players run, pass, catch, finish. It builds conditioning and chemistry at the same time. Most teams use this every practice.\n\n**What you need:** A full court, basketballs (one per group of three), six or more players.\n\n**Setup:** Three lines at one baseline. Middle line slightly behind the two outside lines. First three players step up.\n\n**How to run it:**\n\n1. Middle player has the ball. They pass to either outside player.\n2. The trio runs forward. Middle player gets the ball back, then passes to the other outside player.\n3. Continue passing back and forth, running full speed down the court.\n4. Last pass goes to the player in front of the rim, who finishes with a layup.\n5. Three new players step up. Repeat down the other direction.\n\n**What to watch:** Are they passing on the move? Stopping to pass kills the rhythm. The ball should be in the air more than in any one player's hands.\n\n**If they're struggling:** Walk through the pattern at half speed. Just work on the timing of passes.\n\n**If they've got it:** Add no-look passes or behind-the-back passes. Or finish with a kick-out instead of a layup (last pass goes back to the trailer for a jumper).\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
