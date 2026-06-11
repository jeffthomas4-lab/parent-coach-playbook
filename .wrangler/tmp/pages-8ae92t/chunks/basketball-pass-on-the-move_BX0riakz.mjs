globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Passing while standing still is easy. Passing while moving is game reality. This drill makes passing part of the movement, not an extra skill.</p>\n<p><strong>What you need:</strong> Basketball. Two kids per pair. A line on the court.</p>\n<p><strong>Setup:</strong> Two partners stand on a baseline facing each other, about 12 feet apart.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Both kids walk slowly toward each other.</li>\n<li>As they move closer, one passes to the other.</li>\n<li>The catcher keeps walking and passes back.</li>\n<li>Continue passing as they move forward past each other.</li>\n<li>After they pass, they turn around and walk back.</li>\n<li>Do 2 full reps (down and back). Rest.</li>\n</ol>\n<p><strong>What to watch:</strong> Are they passing on rhythm or pausing to get balance before passing? On rhythm means the pass comes while they’re moving, not from a planted stance.</p>\n<p><strong>If they’re struggling:</strong> Slow to a near-stop between passes. Let them gather balance before passing. Reduce the distance.</p>\n<p><strong>If they’ve got it:</strong> Increase the walk to a jog. Do diagonal passes (left to right, right to left) instead of straight ahead.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Pass On the Move","summary":"Pass while walking or jogging at slow speed. 8 minutes. Ages 8-10.","sport":"basketball","ages":["8-10"],"fundamental":"passing","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Two young players passing a basketball while walking toward each other on the court.","editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"On-rhythm vs planted-stance contrast is clear."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-pass-on-the-move.md";
				const url = undefined;
				function rawContent() {
					return "\nPassing while standing still is easy. Passing while moving is game reality. This drill makes passing part of the movement, not an extra skill.\n\n**What you need:** Basketball. Two kids per pair. A line on the court.\n\n**Setup:** Two partners stand on a baseline facing each other, about 12 feet apart.\n\n**How to run it:**\n\n1. Both kids walk slowly toward each other.\n2. As they move closer, one passes to the other.\n3. The catcher keeps walking and passes back.\n4. Continue passing as they move forward past each other.\n5. After they pass, they turn around and walk back.\n6. Do 2 full reps (down and back). Rest.\n\n**What to watch:** Are they passing on rhythm or pausing to get balance before passing? On rhythm means the pass comes while they're moving, not from a planted stance.\n\n**If they're struggling:** Slow to a near-stop between passes. Let them gather balance before passing. Reduce the distance.\n\n**If they've got it:** Increase the walk to a jog. Do diagonal passes (left to right, right to left) instead of straight ahead.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
