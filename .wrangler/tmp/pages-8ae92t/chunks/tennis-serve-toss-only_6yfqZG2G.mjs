globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A bad toss kills the serve. Most beginners toss the ball wherever and try to hit it. The right move is a consistent toss every time. This drill takes the racquet out and just builds the toss.</p>\n<p><strong>What you need:</strong> Tennis balls (orange or green).</p>\n<p><strong>Setup:</strong> Player on the baseline.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Show the toss: ball held lightly in fingertips of the non-hitting hand. Arm straight up. Release at the top.</li>\n<li>Toss the ball straight up about 8 feet. Catch it without moving the feet.</li>\n<li>Goal: 10 tosses in a row that land in the same spot in front of the body.</li>\n<li>After 10, add a step (front foot forward) and toss while stepping.</li>\n<li>Last 5 tosses: toss as if serving (slightly in front of the body).</li>\n</ol>\n<p><strong>What to watch:</strong> The release. A toss that flips off the fingers spins. A toss with a clean release is straight up. Fingers open, ball rolls off.</p>\n<p><strong>If they’re struggling:</strong> Lower toss height. Slower motion.</p>\n<p><strong>If they’ve got it:</strong> Close eyes during the catch. The toss should be consistent enough to predict.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/tennis-balls-orange/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Orange tennis balls (12-pack) →</a> — slower-bounce balls for learning groundstrokes.</p>\n<p><a href=\"/go/tennis-racquet-junior/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Junior tennis racquet →</a> — HEAD Speed, pre-strung for beginners.</p>\n<p><a href=\"/what-to-buy/tennis/\">Full tennis gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Serve Toss Only","summary":"Practice the toss without hitting the ball. 8 minutes. Ages 8-10.","sport":"tennis","ages":["8-10"],"fundamental":"serving","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player tossing a tennis ball straight up to about 8 feet high, catching it without moving the feet, the toss landing in front of the body.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Toss isolation drill; specifics on release and height."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/tennis-serve-toss-only.md";
				const url = undefined;
				function rawContent() {
					return "\nA bad toss kills the serve. Most beginners toss the ball wherever and try to hit it. The right move is a consistent toss every time. This drill takes the racquet out and just builds the toss.\n\n**What you need:** Tennis balls (orange or green).\n\n**Setup:** Player on the baseline.\n\n**How to run it:**\n\n1. Show the toss: ball held lightly in fingertips of the non-hitting hand. Arm straight up. Release at the top.\n2. Toss the ball straight up about 8 feet. Catch it without moving the feet.\n3. Goal: 10 tosses in a row that land in the same spot in front of the body.\n4. After 10, add a step (front foot forward) and toss while stepping.\n5. Last 5 tosses: toss as if serving (slightly in front of the body).\n\n**What to watch:** The release. A toss that flips off the fingers spins. A toss with a clean release is straight up. Fingers open, ball rolls off.\n\n**If they're struggling:** Lower toss height. Slower motion.\n\n**If they've got it:** Close eyes during the catch. The toss should be consistent enough to predict.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Orange tennis balls (12-pack) →](/go/tennis-balls-orange/) — slower-bounce balls for learning groundstrokes.\n\n[Junior tennis racquet →](/go/tennis-racquet-junior/) — HEAD Speed, pre-strung for beginners.\n\n[Full tennis gear guide →](/what-to-buy/tennis/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
