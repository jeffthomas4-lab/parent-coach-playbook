globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A catcher’s job is to stop all pitches, even bad ones. Blocking is the skill that saves runs. The body goes in front of the ball, not the glove.</p>\n<p><strong>What you need:</strong> 15 softballs (12”), catcher gear (chest protector at minimum), pitcher at 40 feet.</p>\n<p><strong>Setup:</strong> Catcher in full gear crouched at home plate. Pitcher 40 feet away.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Pitcher throws pitches in the dirt intentionally. Low, left, right.</li>\n<li>Catcher uses Eyes, Hands, Squeeze, Pull to track, then drops to block.</li>\n<li>Do 10 pitches low in front of home. Stay on knees and absorb.</li>\n<li>Do 5 pitches left of home. Drop and block with the body angled that way.</li>\n<li>Do 5 pitches right of home. Same technique, opposite side.</li>\n<li>After each block, catcher retrieves the ball and resets.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the catcher drop onto knees or bend at the waist? Knees and chest should block, not just the glove reaching.</p>\n<p><strong>If they’re struggling:</strong> Start with the catcher standing. Pitcher throws waist-high pitches so they can see the motion first.</p>\n<p><strong>If they’ve got it:</strong> Add a runner on third. Practice blocking with a runner and timing a throw home for tag plays.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/softball-glove-11in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth softball glove →</a> — 11-inch fielder’s glove for new players.</p>\n<p><a href=\"/go/baseball-catchers-gear-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth catcher’s set →</a> — chest protector, helmet, and leg guards.</p>\n<p><a href=\"/what-to-buy/softball/\">Full softball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Catcher Blocking","summary":"Block wild pitches in the dirt. 12 minutes. Ages 11-12.","sport":"softball","ages":["11-12"],"fundamental":"catching","progression":"refine","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Catcher in full gear dropping to block a low pitch in the dirt in front of home plate.","editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":true,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Catcher contact flagged sensitive. Cues correct; changed soft baseballs to softballs."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/softball-catcher-blocking.md";
				const url = undefined;
				function rawContent() {
					return "\nA catcher's job is to stop all pitches, even bad ones. Blocking is the skill that saves runs. The body goes in front of the ball, not the glove.\n\n**What you need:** 15 softballs (12\"), catcher gear (chest protector at minimum), pitcher at 40 feet.\n\n**Setup:** Catcher in full gear crouched at home plate. Pitcher 40 feet away.\n\n**How to run it:**\n\n1. Pitcher throws pitches in the dirt intentionally. Low, left, right.\n2. Catcher uses Eyes, Hands, Squeeze, Pull to track, then drops to block.\n3. Do 10 pitches low in front of home. Stay on knees and absorb.\n4. Do 5 pitches left of home. Drop and block with the body angled that way.\n5. Do 5 pitches right of home. Same technique, opposite side.\n6. After each block, catcher retrieves the ball and resets.\n\n**What to watch:** Does the catcher drop onto knees or bend at the waist? Knees and chest should block, not just the glove reaching.\n\n**If they're struggling:** Start with the catcher standing. Pitcher throws waist-high pitches so they can see the motion first.\n\n**If they've got it:** Add a runner on third. Practice blocking with a runner and timing a throw home for tag plays.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth softball glove →](/go/softball-glove-11in/) — 11-inch fielder's glove for new players.\n\n[Youth catcher's set →](/go/baseball-catchers-gear-youth/) — chest protector, helmet, and leg guards.\n\n[Full softball gear guide →](/what-to-buy/softball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
