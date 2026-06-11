globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>In a game, receivers don’t always have open space. This drill teaches them to catch while a defender is trying to knock the ball away or get between them and the throw.</p>\n<p><strong>What you need:</strong> One football. Open field.</p>\n<p><strong>Setup:</strong> Place two cones 15 yards apart. The receiver and defender start between the cones, about 5 yards apart.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>The quarterback is 20 yards away. The receiver and defender both know the throw is coming but don’t know exactly when.</li>\n<li>The QB throws the ball. Both the receiver and defender go for it.</li>\n<li>The receiver’s job is to See the ball early, Reach with their hands, Squeeze it, and Tuck it away.</li>\n<li>Do 5 reps. Then switch roles.</li>\n</ol>\n<p><strong>What to watch:</strong> Who wins the catch? The receiver who sees the ball earliest and gets their hands on it first. Eyes up on the incoming ball, not on the defender.</p>\n<p><strong>If they’re struggling:</strong> Have the defender start farther away. Give the receiver time to catch before the defender arrives.</p>\n<p><strong>If they’ve got it:</strong> Add more contact. The defender can press the receiver’s body. The receiver has to shield the ball and still make the catch.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/football-rubber-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber football →</a> — Wilson youth rubber ball for rec and practice.</p>\n<p><a href=\"/go/agility-cones/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Agility cones →</a> — for route trees, blocking lanes, and setup.</p>\n<p><a href=\"/what-to-buy/football/\">Full football gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Contested Catch","summary":"Catch the ball while a defender pressures. 12 minutes. Ages 11-12.","sport":"football","ages":["11-12"],"fundamental":"catching","progression":"refine","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A receiver reaching for the ball with a defender nearby, both fighting for the catch.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":true,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Body contact at higher progression; sensitive flagged for press contact."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/tackle-football-contested-catch.md";
				const url = undefined;
				function rawContent() {
					return "\nIn a game, receivers don't always have open space. This drill teaches them to catch while a defender is trying to knock the ball away or get between them and the throw.\n\n**What you need:** One football. Open field.\n\n**Setup:** Place two cones 15 yards apart. The receiver and defender start between the cones, about 5 yards apart.\n\n**How to run it:**\n\n1. The quarterback is 20 yards away. The receiver and defender both know the throw is coming but don't know exactly when.\n2. The QB throws the ball. Both the receiver and defender go for it.\n3. The receiver's job is to See the ball early, Reach with their hands, Squeeze it, and Tuck it away.\n4. Do 5 reps. Then switch roles.\n\n**What to watch:** Who wins the catch? The receiver who sees the ball earliest and gets their hands on it first. Eyes up on the incoming ball, not on the defender.\n\n**If they're struggling:** Have the defender start farther away. Give the receiver time to catch before the defender arrives.\n\n**If they've got it:** Add more contact. The defender can press the receiver's body. The receiver has to shield the ball and still make the catch.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber football →](/go/football-rubber-youth/) — Wilson youth rubber ball for rec and practice.\n\n[Agility cones →](/go/agility-cones/) — for route trees, blocking lanes, and setup.\n\n[Full football gear guide →](/what-to-buy/football/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
