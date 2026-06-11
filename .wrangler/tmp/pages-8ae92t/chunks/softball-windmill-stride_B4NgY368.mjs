globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A stride adds power to the windmill. The pitcher steps forward with the back leg while the arm circles. This is where the motion becomes a real pitch.</p>\n<p><strong>What you need:</strong> A mound or flat ground, 10 softballs (12”), catcher at 40 feet.</p>\n<p><strong>Setup:</strong> Pitcher on the mound or flat ground. Catcher at 40 feet.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Set, Wind, Whip, Release.</li>\n<li>Set on the rubber (or mark) with feet parallel.</li>\n<li>As the arm begins the Wind, the back foot steps forward.</li>\n<li>The stride foot lands just as the arm completes the circle.</li>\n<li>Do 10 strides with no ball. Check timing: foot and arm finishing together.</li>\n<li>Do 10 more with a ball. Focus on releasing toward the catcher.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the stride foot land before or after the arm finishes the circle? They should land at the same time for balance.</p>\n<p><strong>If they’re struggling:</strong> Have them do wind-ups without the stride first. Add the stride after 5 reps.</p>\n<p><strong>If they’ve got it:</strong> Increase stride length. Add a rest day rule: no pitching back-to-back days. Track pitch counts: max 35 pitches per day for youth.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/softball-glove-11in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth softball glove →</a> — 11-inch fielder’s glove for new players.</p>\n<p><a href=\"/go/baseball-catchers-gear-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth catcher’s set →</a> — chest protector, helmet, and leg guards.</p>\n<p><a href=\"/what-to-buy/softball/\">Full softball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Windmill Stride","summary":"Add the stride step to the windmill motion. 12 minutes. Ages 11-12.","sport":"softball","ages":["11-12"],"fundamental":"pitching","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Pitcher on the mound stepping forward with back leg while beginning the windmill arm rotation.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Stride-and-arm timing drill; pitch-count rule included."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/softball-windmill-stride.md";
				const url = undefined;
				function rawContent() {
					return "\nA stride adds power to the windmill. The pitcher steps forward with the back leg while the arm circles. This is where the motion becomes a real pitch.\n\n**What you need:** A mound or flat ground, 10 softballs (12\"), catcher at 40 feet.\n\n**Setup:** Pitcher on the mound or flat ground. Catcher at 40 feet.\n\n**How to run it:**\n\n1. Cue: Set, Wind, Whip, Release.\n2. Set on the rubber (or mark) with feet parallel.\n3. As the arm begins the Wind, the back foot steps forward.\n4. The stride foot lands just as the arm completes the circle.\n5. Do 10 strides with no ball. Check timing: foot and arm finishing together.\n6. Do 10 more with a ball. Focus on releasing toward the catcher.\n\n**What to watch:** Does the stride foot land before or after the arm finishes the circle? They should land at the same time for balance.\n\n**If they're struggling:** Have them do wind-ups without the stride first. Add the stride after 5 reps.\n\n**If they've got it:** Increase stride length. Add a rest day rule: no pitching back-to-back days. Track pitch counts: max 35 pitches per day for youth.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth softball glove →](/go/softball-glove-11in/) — 11-inch fielder's glove for new players.\n\n[Youth catcher's set →](/go/baseball-catchers-gear-youth/) — chest protector, helmet, and leg guards.\n\n[Full softball gear guide →](/what-to-buy/softball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
