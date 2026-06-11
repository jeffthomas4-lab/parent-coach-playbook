globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A slap bunt is a move, not a swing. It requires a specific grip and a running start. Start with the grip and first step, and the swing comes later.</p>\n<p><strong>Equipment needed:</strong> 10 softballs, a bucket, one bat, soft toss net, 30 feet of open space.</p>\n<p><strong>Setup:</strong> You stand 30 feet away with the bucket. Hitter is at home plate. Net is behind them.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>First five reps: Hitter takes the slap grip (choke up on the bat, hands together), takes two quick steps forward, and bunts down the first baseline.</li>\n<li>You soft toss easy pitches at chest height.</li>\n<li>Next five reps: Same thing, but they bunt down the third baseline.</li>\n</ol>\n<p>Don’t worry about perfect bunts yet. The goal is grip and footwork, not contact.</p>\n<p><strong>What to look for:</strong> Quick feet and a short swing. The slap is an accelerated quick step into a controlled bunt. Kids who take a full swing won’t get the speed needed.</p>\n<p><strong>Variation:</strong> For younger kids (8-9), just work the grip and stance without bunting. For older kids (10), add a base runner so they practice laying the bunt down in a game situation.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/softball-glove-11in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth softball glove →</a> — 11-inch fielder’s glove for new players.</p>\n<p><a href=\"/what-to-buy/softball/\">Full softball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Slap Bunting Intro","summary":"Teach the slap bunt grip and first-step timing. 20 minutes. Ages 8-10.","sport":"softball","ages":["8-10"],"focus":"fundamentals","layer":"foundations","fundamental":"hitting","progression":"intro","illustrationBrief":"Introduction to slap bunting technique","publishedAt":"2026-02-03T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":7,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Intro to softball-specific slap; clear grip-and-step focus."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/softball-slap-bunting-intro-ages-8-10.md";
				const url = undefined;
				function rawContent() {
					return "\nA slap bunt is a move, not a swing. It requires a specific grip and a running start. Start with the grip and first step, and the swing comes later.\n\n**Equipment needed:** 10 softballs, a bucket, one bat, soft toss net, 30 feet of open space.\n\n**Setup:** You stand 30 feet away with the bucket. Hitter is at home plate. Net is behind them.\n\n**How to run it:**\n\n1. First five reps: Hitter takes the slap grip (choke up on the bat, hands together), takes two quick steps forward, and bunts down the first baseline.\n2. You soft toss easy pitches at chest height.\n3. Next five reps: Same thing, but they bunt down the third baseline.\n\nDon't worry about perfect bunts yet. The goal is grip and footwork, not contact.\n\n**What to look for:** Quick feet and a short swing. The slap is an accelerated quick step into a controlled bunt. Kids who take a full swing won't get the speed needed.\n\n**Variation:** For younger kids (8-9), just work the grip and stance without bunting. For older kids (10), add a base runner so they practice laying the bunt down in a game situation.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth softball glove →](/go/softball-glove-11in/) — 11-inch fielder's glove for new players.\n\n[Full softball gear guide →](/what-to-buy/softball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
