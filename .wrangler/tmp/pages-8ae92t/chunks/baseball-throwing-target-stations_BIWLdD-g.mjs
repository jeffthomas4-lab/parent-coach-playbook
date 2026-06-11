globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Kids get bored throwing at one target. Three targets at different distances keep their interest and teach them that distance changes the throw. Closer is easier. Further requires more.</p>\n<p><strong>What you need:</strong> 10 tennis balls. Three large cardboard targets (boxes work) labeled 1, 2, and 3.</p>\n<p><strong>Setup:</strong> Place target 1 at 8 feet, target 2 at 12 feet, target 3 at 16 feet. All in a line from where the kid throws.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Review the cue: Turn, Shuffle, Point, Fire.</li>\n<li>Round 1: throw 3 balls at target 1. Count hits.</li>\n<li>Round 2: throw 3 balls at target 2. Count hits.</li>\n<li>Round 3: throw 3 balls at target 3. Count hits.</li>\n<li>Last ball: they pick the target they want. They get one shot.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the throwing motion stay the same when the target moves further away? Most kids will start chucking the ball with their whole body when they reach for distance. Same form, more leg drive, is what we want.</p>\n<p><strong>If they’re struggling:</strong> Use only targets 1 and 2. Stay inside 12 feet.</p>\n<p><strong>If they’ve got it:</strong> Add a target 4 at 20 feet. Or take away the closest target and start at 12 feet.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Throwing Target Stations","summary":"Three target stations at different distances. 12 minutes. T-ball and ages 5-7.","sport":"baseball","ages":["t-ball","5-7"],"fundamental":"throwing","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Three large cardboard targets standing at 8, 12, and 16 feet from a child holding a tennis ball, each target labeled 1-2-3.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-throwing-target-stations.md";
				const url = undefined;
				function rawContent() {
					return "\nKids get bored throwing at one target. Three targets at different distances keep their interest and teach them that distance changes the throw. Closer is easier. Further requires more.\n\n**What you need:** 10 tennis balls. Three large cardboard targets (boxes work) labeled 1, 2, and 3.\n\n**Setup:** Place target 1 at 8 feet, target 2 at 12 feet, target 3 at 16 feet. All in a line from where the kid throws.\n\n**How to run it:**\n\n1. Review the cue: Turn, Shuffle, Point, Fire.\n2. Round 1: throw 3 balls at target 1. Count hits.\n3. Round 2: throw 3 balls at target 2. Count hits.\n4. Round 3: throw 3 balls at target 3. Count hits.\n5. Last ball: they pick the target they want. They get one shot.\n\n**What to watch:** Does the throwing motion stay the same when the target moves further away? Most kids will start chucking the ball with their whole body when they reach for distance. Same form, more leg drive, is what we want.\n\n**If they're struggling:** Use only targets 1 and 2. Stay inside 12 feet.\n\n**If they've got it:** Add a target 4 at 20 feet. Or take away the closest target and start at 12 feet.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
