globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A relay teaches kids to throw across distance and to catch incoming throws. It’s also the first time they feel the game speed of a real relay situation.</p>\n<p><strong>What you need:</strong> 5 softballs (12”), three kids standing in a line 30 feet apart.</p>\n<p><strong>Setup:</strong> Three players in a straight line across the field, 30 feet apart.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Start with Player A. They throw to Player B using the Turn, Shuffle, Point, Fire cue.</li>\n<li>Player B catches and throws to Player C.</li>\n<li>Player C catches and throws back to Player B.</li>\n<li>Player B catches and throws back to Player A.</li>\n<li>Do 10 rounds of throws. Then rotate so everyone plays each position.</li>\n<li>Move the line to 35 feet apart. Do 10 more rounds.</li>\n</ol>\n<p><strong>What to watch:</strong> Are the throws landing in front of the receiver so they can step into it? Lazy throws that arrive behind the body make catching harder.</p>\n<p><strong>If they’re struggling:</strong> Keep it at 25 feet. Use underhand throws for the first round to build confidence.</p>\n<p><strong>If they’ve got it:</strong> Move to 40 feet. Add a fourth player and make a square, throwing corner to corner.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/softball-glove-11in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth softball glove →</a> — 11-inch fielder’s glove for new players.</p>\n<p><a href=\"/what-to-buy/softball/\">Full softball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Cross-Field Relay","summary":"Throw distance and accuracy with multiple players. 15 minutes. Ages 8-10 and 11-12.","sport":"softball","ages":["8-10","11-12"],"fundamental":"throwing","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Three kids in a line across the field, passing a softball back and forth with full throws.","editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Standard relay drill. Changed soft baseballs to softballs."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/softball-cross-field-relay.md";
				const url = undefined;
				function rawContent() {
					return "\nA relay teaches kids to throw across distance and to catch incoming throws. It's also the first time they feel the game speed of a real relay situation.\n\n**What you need:** 5 softballs (12\"), three kids standing in a line 30 feet apart.\n\n**Setup:** Three players in a straight line across the field, 30 feet apart.\n\n**How to run it:**\n\n1. Start with Player A. They throw to Player B using the Turn, Shuffle, Point, Fire cue.\n2. Player B catches and throws to Player C.\n3. Player C catches and throws back to Player B.\n4. Player B catches and throws back to Player A.\n5. Do 10 rounds of throws. Then rotate so everyone plays each position.\n6. Move the line to 35 feet apart. Do 10 more rounds.\n\n**What to watch:** Are the throws landing in front of the receiver so they can step into it? Lazy throws that arrive behind the body make catching harder.\n\n**If they're struggling:** Keep it at 25 feet. Use underhand throws for the first round to build confidence.\n\n**If they've got it:** Move to 40 feet. Add a fourth player and make a square, throwing corner to corner.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth softball glove →](/go/softball-glove-11in/) — 11-inch fielder's glove for new players.\n\n[Full softball gear guide →](/what-to-buy/softball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
