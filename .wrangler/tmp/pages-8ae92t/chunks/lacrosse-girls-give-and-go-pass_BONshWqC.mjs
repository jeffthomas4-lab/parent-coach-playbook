globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Give and go is movement after the pass. Most kids stand still after passing. Give and go teaches them to pass and cut. The defender watches the ball and forgets the passer. Cut to space, get it back, score.</p>\n<p><strong>What you need:</strong> Two sticks, ball, two players, half-field with a goal or target.</p>\n<p><strong>Setup:</strong> Player A near the midfield with the ball. Player B closer to the goal. Goal or target 20 yards away.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Player A passes to Player B (the give).</li>\n<li>Player A cuts hard toward the goal immediately after the pass.</li>\n<li>Player B catches and passes back to Player A’s new position (the go).</li>\n<li>Player A receives and shoots on goal.</li>\n<li>Do 6 reps. Switch starting roles.</li>\n</ol>\n<p><strong>What to watch:</strong> The cut. A jog isn’t a cut. The pass triggers a sprint.</p>\n<p><strong>If they’re struggling:</strong> Walk the pattern. Build the timing without speed.</p>\n<p><strong>If they’ve got it:</strong> Add a defender. The cut has to beat the defender to space.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/lacrosse-ball/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Lacrosse balls (6-pack) →</a> — NOCSAE-stamped practice balls.</p>\n<p><a href=\"/what-to-buy/lacrosse-girls/\">Full lacrosse (girls) gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Give and Go Pass","summary":"Pass to a teammate, cut to a new spot, get the return pass. 12 minutes. Ages 11-12.","sport":"lacrosse-girls","ages":["11-12"],"fundamental":"passing","progression":"refine","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player A passing to Player B at midfield, then cutting toward the goal, Player B passing back to a new spot near the goal.","editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Pass and cut sequence reads clean for girls' vocabulary."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/lacrosse-girls-give-and-go-pass.md";
				const url = undefined;
				function rawContent() {
					return "\nGive and go is movement after the pass. Most kids stand still after passing. Give and go teaches them to pass and cut. The defender watches the ball and forgets the passer. Cut to space, get it back, score.\n\n**What you need:** Two sticks, ball, two players, half-field with a goal or target.\n\n**Setup:** Player A near the midfield with the ball. Player B closer to the goal. Goal or target 20 yards away.\n\n**How to run it:**\n\n1. Player A passes to Player B (the give).\n2. Player A cuts hard toward the goal immediately after the pass.\n3. Player B catches and passes back to Player A's new position (the go).\n4. Player A receives and shoots on goal.\n5. Do 6 reps. Switch starting roles.\n\n**What to watch:** The cut. A jog isn't a cut. The pass triggers a sprint.\n\n**If they're struggling:** Walk the pattern. Build the timing without speed.\n\n**If they've got it:** Add a defender. The cut has to beat the defender to space.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Lacrosse balls (6-pack) →](/go/lacrosse-ball/) — NOCSAE-stamped practice balls.\n\n[Full lacrosse (girls) gear guide →](/what-to-buy/lacrosse-girls/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
