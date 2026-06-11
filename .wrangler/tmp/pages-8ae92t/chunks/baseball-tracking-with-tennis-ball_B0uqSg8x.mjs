globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Before a kid can field a fly ball, they need to learn how to follow a ball through the air with their eyes. A tennis racquet hits a tennis ball higher and softer than a bat hits a baseball, so this is a safer way to teach tracking.</p>\n<p><strong>What you need:</strong> A tennis racquet, 5 tennis balls, an open grass area.</p>\n<p><strong>Setup:</strong> Kid stands 30 feet from where you stand with the racquet.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Find, Track, Camp, Catch. Today the focus is Find and Track.</li>\n<li>You hit a soft pop-up with the racquet. The ball goes about 20 feet up.</li>\n<li>Kid watches the ball from your racquet to wherever it lands. They don’t have to catch it. Just track it with their eyes.</li>\n<li>After 5 tosses without catching, add the catch. Glove up, two hands.</li>\n<li>Last 5: hit slightly off-center so they have to move to the ball, then track and catch.</li>\n</ol>\n<p><strong>What to watch:</strong> Are their eyes following the ball or are they watching you? Eyes on the ball from contact to landing. If they look away, they lose it.</p>\n<p><strong>If they’re struggling:</strong> Hit shorter and softer pops. Or just toss the ball up by hand so it’s slower.</p>\n<p><strong>If they’ve got it:</strong> Hit higher pops. Or hit two in a row so they have to track one then quickly find the next.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/go/baseball-bat-28in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">28-inch youth bat →</a> — drop-10 USA-stamped bat for ages 8–10.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Tennis Ball Tracking","summary":"Track a tossed tennis ball off a tennis racquet. 8 minutes. Ages 5-7.","sport":"baseball","ages":["5-7"],"fundamental":"fielding","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Adult tossing a tennis ball into the air with a tennis racquet, child watching the ball arc through the air with eyes following.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Tennis racquet used as training tool, not as baseball vocab; sport language fine."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-tracking-with-tennis-ball.md";
				const url = undefined;
				function rawContent() {
					return "\nBefore a kid can field a fly ball, they need to learn how to follow a ball through the air with their eyes. A tennis racquet hits a tennis ball higher and softer than a bat hits a baseball, so this is a safer way to teach tracking.\n\n**What you need:** A tennis racquet, 5 tennis balls, an open grass area.\n\n**Setup:** Kid stands 30 feet from where you stand with the racquet.\n\n**How to run it:**\n\n1. Cue: Find, Track, Camp, Catch. Today the focus is Find and Track.\n2. You hit a soft pop-up with the racquet. The ball goes about 20 feet up.\n3. Kid watches the ball from your racquet to wherever it lands. They don't have to catch it. Just track it with their eyes.\n4. After 5 tosses without catching, add the catch. Glove up, two hands.\n5. Last 5: hit slightly off-center so they have to move to the ball, then track and catch.\n\n**What to watch:** Are their eyes following the ball or are they watching you? Eyes on the ball from contact to landing. If they look away, they lose it.\n\n**If they're struggling:** Hit shorter and softer pops. Or just toss the ball up by hand so it's slower.\n\n**If they've got it:** Hit higher pops. Or hit two in a row so they have to track one then quickly find the next.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[28-inch youth bat →](/go/baseball-bat-28in/) — drop-10 USA-stamped bat for ages 8–10.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
