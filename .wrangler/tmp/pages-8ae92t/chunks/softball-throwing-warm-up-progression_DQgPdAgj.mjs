globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A proper warm-up prevents injury. Start short distance, easy effort. Build to game-distance with controlled throws. Never go full-speed without warming up first.</p>\n<p><strong>What you need:</strong> 20 softballs (11” or 12”), players in pairs at 20-foot intervals.</p>\n<p><strong>Setup:</strong> Pairs of players standing 20 feet apart on grass.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Round one (20 feet): Easy underhand or overhand throws. 10 throws total. Light effort.</li>\n<li>Round two (30 feet): Increase distance. Use Turn, Shuffle, Point, Fire. 10 throws total. Medium effort.</li>\n<li>Round three (40 feet): Game distance. Controlled throws with good mechanics. 10 throws total. Game effort.</li>\n<li>Round four: players spread to their game positions. 5 throws from each position. Then ready to play.</li>\n</ol>\n<p><strong>What to watch:</strong> Effort builds gradually. No full-effort throws in rounds one and two. Does the arm feel loose by round four?</p>\n<p><strong>If they’re struggling:</strong> Add more rounds. Do 5 throws at each distance. Don’t skip to full-effort too fast.</p>\n<p><strong>If they’ve got it:</strong> This progression is standard. Use it before every practice and game. Never start practice without this warm-up.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/softball-glove-11in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth softball glove →</a> — 11-inch fielder’s glove for new players.</p>\n<p><a href=\"/what-to-buy/softball/\">Full softball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Throwing Warm-Up Progression","summary":"Safe, effective warm-up sequence. 8 minutes. Ages 5-7, 8-10, and 11-12.","sport":"softball","ages":["5-7","8-10","11-12"],"fundamental":"warm-up","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Kids and coach lined up throwing soft distance, gradually increasing distance, no full-effort throws.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Standard pre-practice warm-up sequence."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/softball-throwing-warm-up-progression.md";
				const url = undefined;
				function rawContent() {
					return "\nA proper warm-up prevents injury. Start short distance, easy effort. Build to game-distance with controlled throws. Never go full-speed without warming up first.\n\n**What you need:** 20 softballs (11\" or 12\"), players in pairs at 20-foot intervals.\n\n**Setup:** Pairs of players standing 20 feet apart on grass.\n\n**How to run it:**\n\n1. Round one (20 feet): Easy underhand or overhand throws. 10 throws total. Light effort.\n2. Round two (30 feet): Increase distance. Use Turn, Shuffle, Point, Fire. 10 throws total. Medium effort.\n3. Round three (40 feet): Game distance. Controlled throws with good mechanics. 10 throws total. Game effort.\n4. Round four: players spread to their game positions. 5 throws from each position. Then ready to play.\n\n**What to watch:** Effort builds gradually. No full-effort throws in rounds one and two. Does the arm feel loose by round four?\n\n**If they're struggling:** Add more rounds. Do 5 throws at each distance. Don't skip to full-effort too fast.\n\n**If they've got it:** This progression is standard. Use it before every practice and game. Never start practice without this warm-up.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth softball glove →](/go/softball-glove-11in/) — 11-inch fielder's glove for new players.\n\n[Full softball gear guide →](/what-to-buy/softball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
