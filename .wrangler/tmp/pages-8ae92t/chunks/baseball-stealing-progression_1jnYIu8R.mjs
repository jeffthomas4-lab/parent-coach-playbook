globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A stolen base is a lead, a quick first step, and a full sprint to the next base. Most kids try to steal on a hop or a jump. The right first step is a crossover where the back foot crosses over the front foot toward the next base. This drill builds the move.</p>\n<p><strong>What you need:</strong> A base, a coach to play pitcher, a stopwatch.</p>\n<p><strong>Setup:</strong> Runner on first. Pitcher 46 feet from home plate. Second base 60 feet from first.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Runner takes a primary lead of 8 feet.</li>\n<li>On the pitcher’s first move, the back foot crosses over the front foot toward second.</li>\n<li>From the crossover, full sprint to second base.</li>\n<li>Time the steal from the pitcher’s first move to the runner touching second. Goal: under 4 seconds.</li>\n<li>Do 6 reps. Tell them their time after each.</li>\n</ol>\n<p><strong>What to watch:</strong> The first step. If the back foot goes backward or stays planted, the runner is slow. The crossover is fast because it points the body toward the next base immediately.</p>\n<p><strong>If they’re struggling:</strong> Drop the timing. Just work on the crossover step. 10 reps without running.</p>\n<p><strong>If they’ve got it:</strong> Add a catcher who throws to second. The runner has to beat the throw.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/go/baseball-catchers-gear-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth catcher’s set →</a> — chest protector, helmet, and leg guards.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Stealing Progression","summary":"Lead, jump, run. The stolen base in three steps. 15 minutes. Ages 11-12.","sport":"baseball","ages":["11-12"],"fundamental":"base-running","progression":"refine","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Sequence of three drawings: runner taking a lead, then crossing over with the back foot, then sprinting toward second base.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":true,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Sliding/contact-adjacent at second base; flagged sensitive."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-stealing-progression.md";
				const url = undefined;
				function rawContent() {
					return "\nA stolen base is a lead, a quick first step, and a full sprint to the next base. Most kids try to steal on a hop or a jump. The right first step is a crossover where the back foot crosses over the front foot toward the next base. This drill builds the move.\n\n**What you need:** A base, a coach to play pitcher, a stopwatch.\n\n**Setup:** Runner on first. Pitcher 46 feet from home plate. Second base 60 feet from first.\n\n**How to run it:**\n\n1. Runner takes a primary lead of 8 feet.\n2. On the pitcher's first move, the back foot crosses over the front foot toward second.\n3. From the crossover, full sprint to second base.\n4. Time the steal from the pitcher's first move to the runner touching second. Goal: under 4 seconds.\n5. Do 6 reps. Tell them their time after each.\n\n**What to watch:** The first step. If the back foot goes backward or stays planted, the runner is slow. The crossover is fast because it points the body toward the next base immediately.\n\n**If they're struggling:** Drop the timing. Just work on the crossover step. 10 reps without running.\n\n**If they've got it:** Add a catcher who throws to second. The runner has to beat the throw.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[Youth catcher's set →](/go/baseball-catchers-gear-youth/) — chest protector, helmet, and leg guards.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
