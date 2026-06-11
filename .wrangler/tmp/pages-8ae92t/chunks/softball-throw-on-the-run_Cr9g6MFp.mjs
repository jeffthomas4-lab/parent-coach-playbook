globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Fielders chase balls. They have to throw while moving, not standing still. This drill teaches rhythm between feet and arm so the throw doesn’t lose power or accuracy on the move.</p>\n<p><strong>What you need:</strong> 10 softballs (12”), a large open field, a partner at 40 feet.</p>\n<p><strong>Setup:</strong> Kid stands 40 feet from a partner. Both are spaced far enough apart to run.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Partner rolls the ball. Kid runs to field it, plants the back foot, and throws using Turn, Shuffle, Point, Fire.</li>\n<li>Do 5 rolls. After each throw, reset at the start line.</li>\n<li>Now kid runs forward (toward the partner) while fielding. Throw mid-stride without planting.</li>\n<li>Do 5 throws on the move.</li>\n<li>Switch roles so they see what good footwork looks like at game speed.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the shoulder stay level as they run? Bouncing up and down wastes arm energy.</p>\n<p><strong>If they’re struggling:</strong> Slow down the rolling speed. Let them plant before throwing, not mid-stride yet.</p>\n<p><strong>If they’ve got it:</strong> Add a third player. Create a chase situation where they have to run and throw to a cutoff while the runner advances.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/softball-glove-11in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth softball glove →</a> — 11-inch fielder’s glove for new players.</p>\n<p><a href=\"/what-to-buy/softball/\">Full softball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Throw on the Run","summary":"Throw while moving. 15 minutes. Ages 11-12.","sport":"softball","ages":["11-12"],"fundamental":"throwing","progression":"refine","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player running toward a partner and throwing a softball overhand mid-stride, shoulders rotated.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Throw-on-move drill for older fielders."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/softball-throw-on-the-run.md";
				const url = undefined;
				function rawContent() {
					return "\nFielders chase balls. They have to throw while moving, not standing still. This drill teaches rhythm between feet and arm so the throw doesn't lose power or accuracy on the move.\n\n**What you need:** 10 softballs (12\"), a large open field, a partner at 40 feet.\n\n**Setup:** Kid stands 40 feet from a partner. Both are spaced far enough apart to run.\n\n**How to run it:**\n\n1. Partner rolls the ball. Kid runs to field it, plants the back foot, and throws using Turn, Shuffle, Point, Fire.\n2. Do 5 rolls. After each throw, reset at the start line.\n3. Now kid runs forward (toward the partner) while fielding. Throw mid-stride without planting.\n4. Do 5 throws on the move.\n5. Switch roles so they see what good footwork looks like at game speed.\n\n**What to watch:** Does the shoulder stay level as they run? Bouncing up and down wastes arm energy.\n\n**If they're struggling:** Slow down the rolling speed. Let them plant before throwing, not mid-stride yet.\n\n**If they've got it:** Add a third player. Create a chase situation where they have to run and throw to a cutoff while the runner advances.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth softball glove →](/go/softball-glove-11in/) — 11-inch fielder's glove for new players.\n\n[Full softball gear guide →](/what-to-buy/softball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
