globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Real games have open field. The defender has nothing but a runner and a body. This drill is the test: can they pull the flag when the offensive player can go anywhere?</p>\n<p><strong>What you need:</strong> Flag belts and flags. A football. A 20x10 yard area marked with cones.</p>\n<p><strong>Setup:</strong> Offensive player with the ball at one end. Defender 5 yards in front. Goal line at the back of the box.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>On “go,” offensive player tries to reach the goal line.</li>\n<li>Defender stays in front, mirrors, takes angles.</li>\n<li>Defender pulls the flag to stop the play.</li>\n<li>If the runner reaches the line, the offense scores a point. If the flag gets pulled, defense scores.</li>\n<li>Do 8 reps. Switch roles every 4.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the defender lunge or stay patient? Lunging creates a clean break. Patience wins the rep.</p>\n<p><strong>If they’re struggling:</strong> Smaller box (10x5). Less room for the runner to maneuver.</p>\n<p><strong>If they’ve got it:</strong> Add a juke rule: the runner has to use one cut before reaching the line. Or run 2-on-2 in the same space.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/flag-football-belt-set/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Flag football belt set →</a> — 14-player set for organized flag practice.</p>\n<p><a href=\"/go/agility-cones/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Agility cones →</a> — for route trees, end zones, and field setup.</p>\n<p><a href=\"/what-to-buy/flag-football/\">Full flag football gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Open Field Pull","summary":"1-on-1 in open space, defender has to read and pull. 15 minutes. Ages 11-12.","sport":"flag-football","ages":["11-12"],"fundamental":"flag-pulling","progression":"refine","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Two players in a 20-yard square, the offensive player with a ball trying to reach the back line while the defender stays in front and pulls the flag.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"1-on-1 open-field test. Clean flag-pull vocabulary."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/flag-football-open-field-pull.md";
				const url = undefined;
				function rawContent() {
					return "\nReal games have open field. The defender has nothing but a runner and a body. This drill is the test: can they pull the flag when the offensive player can go anywhere?\n\n**What you need:** Flag belts and flags. A football. A 20x10 yard area marked with cones.\n\n**Setup:** Offensive player with the ball at one end. Defender 5 yards in front. Goal line at the back of the box.\n\n**How to run it:**\n\n1. On \"go,\" offensive player tries to reach the goal line.\n2. Defender stays in front, mirrors, takes angles.\n3. Defender pulls the flag to stop the play.\n4. If the runner reaches the line, the offense scores a point. If the flag gets pulled, defense scores.\n5. Do 8 reps. Switch roles every 4.\n\n**What to watch:** Does the defender lunge or stay patient? Lunging creates a clean break. Patience wins the rep.\n\n**If they're struggling:** Smaller box (10x5). Less room for the runner to maneuver.\n\n**If they've got it:** Add a juke rule: the runner has to use one cut before reaching the line. Or run 2-on-2 in the same space.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Flag football belt set →](/go/flag-football-belt-set/) — 14-player set for organized flag practice.\n\n[Agility cones →](/go/agility-cones/) — for route trees, end zones, and field setup.\n\n[Full flag football gear guide →](/what-to-buy/flag-football/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
