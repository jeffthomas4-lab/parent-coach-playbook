globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Give and go is the oldest play in basketball. Pass the ball, cut to the basket, get it back. It works because the defender watches the ball and forgets about the passer. Most kids stand still after passing. Teach the cut and they’re a threat every possession.</p>\n<p><strong>What you need:</strong> A half court, two players.</p>\n<p><strong>Setup:</strong> Player 1 at the wing with the ball. Player 2 at the top of the key.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Player 1 passes to Player 2 (the give).</li>\n<li>Player 1 cuts hard toward the basket immediately after the pass.</li>\n<li>Player 2 reads the cut and either bounces it back or hits the cutter on a shot pass.</li>\n<li>Cutter finishes at the rim with a layup.</li>\n<li>Do 8 reps. Switch starting positions.</li>\n</ol>\n<p><strong>What to watch:</strong> The cut speed. A jog is not a cut. The pass is the trigger to sprint. If the cut is slow, the defender recovers and the play dies.</p>\n<p><strong>If they’re struggling:</strong> Drop the defender (no defender at this stage anyway). Just work on the timing of pass and cut.</p>\n<p><strong>If they’ve got it:</strong> Add a defender on the cutter. Now the cutter has to read the defense (cut to the rim if defender helped on the ball, fade to the corner if defender stayed).</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Give and Go Cuts","summary":"Pass to a teammate, cut hard to the basket, get the return pass. 12 minutes. Ages 11-12.","sport":"basketball","ages":["11-12"],"fundamental":"positioning","progression":"refine","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player at the wing passing to a player at the top of the key, then cutting hard toward the rim, the second player passing back for a layup.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Strong lead, clean cut-vs-jog distinction."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-give-and-go-cuts.md";
				const url = undefined;
				function rawContent() {
					return "\nGive and go is the oldest play in basketball. Pass the ball, cut to the basket, get it back. It works because the defender watches the ball and forgets about the passer. Most kids stand still after passing. Teach the cut and they're a threat every possession.\n\n**What you need:** A half court, two players.\n\n**Setup:** Player 1 at the wing with the ball. Player 2 at the top of the key.\n\n**How to run it:**\n\n1. Player 1 passes to Player 2 (the give).\n2. Player 1 cuts hard toward the basket immediately after the pass.\n3. Player 2 reads the cut and either bounces it back or hits the cutter on a shot pass.\n4. Cutter finishes at the rim with a layup.\n5. Do 8 reps. Switch starting positions.\n\n**What to watch:** The cut speed. A jog is not a cut. The pass is the trigger to sprint. If the cut is slow, the defender recovers and the play dies.\n\n**If they're struggling:** Drop the defender (no defender at this stage anyway). Just work on the timing of pass and cut.\n\n**If they've got it:** Add a defender on the cutter. Now the cutter has to read the defense (cut to the rim if defender helped on the ball, fade to the corner if defender stayed).\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
