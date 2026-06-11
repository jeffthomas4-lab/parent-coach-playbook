globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The slap-bunt is a softball-specific skill. The hitter takes a running step toward first base while contacting the ball, creating bat speed without a full swing. It’s deadly for fast left-handed hitters.</p>\n<p><strong>What you need:</strong> A tee, 20 softballs (12”), an age-appropriate bat, a net.</p>\n<p><strong>Setup:</strong> Tee at mid-thigh height. Batter in Set position facing the tee at an angle.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Square, Show, Soft, Drop. Today focus on Square and Show.</li>\n<li>Square: feet are staggered, ready to step. Show: bat is visible across the strike zone (bunting position).</li>\n<li>Have them hold the Square, Show position 10 times without the ball. Check alignment.</li>\n<li>Now add the tee. From the Square position, they take a step toward first and drop the bat on the ball (Soft contact).</li>\n<li>Do 10 reps. Emphasize a slow step, not a sprint. Contact is more important than speed.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the step happen toward first base? Or straight ahead? The step should angle toward first.</p>\n<p><strong>If they’re struggling:</strong> Use a slower tee. Have them practice the step without the ball first.</p>\n<p><strong>If they’ve got it:</strong> Remove the tee. Have a coach pitch underhand and do the slap on live pitches. Add a baserunner to make it game-speed.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/softball-glove-11in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth softball glove →</a> — 11-inch fielder’s glove for new players.</p>\n<p><a href=\"/what-to-buy/softball/\">Full softball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Slap Bunt Progression","summary":"Learn the slap-bunt hitting technique. 15 minutes. Ages 11-12.","sport":"softball","ages":["11-12"],"fundamental":"hitting","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Left-handed batter taking a step toward first base while contacting the ball with a slap motion.","editorial":{"qualityGrade":8,"originalityGrade":8,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Sport-specific slap-bunt; cue chain works."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/softball-slap-bunt-progression.md";
				const url = undefined;
				function rawContent() {
					return "\nThe slap-bunt is a softball-specific skill. The hitter takes a running step toward first base while contacting the ball, creating bat speed without a full swing. It's deadly for fast left-handed hitters.\n\n**What you need:** A tee, 20 softballs (12\"), an age-appropriate bat, a net.\n\n**Setup:** Tee at mid-thigh height. Batter in Set position facing the tee at an angle.\n\n**How to run it:**\n\n1. Cue: Square, Show, Soft, Drop. Today focus on Square and Show.\n2. Square: feet are staggered, ready to step. Show: bat is visible across the strike zone (bunting position).\n3. Have them hold the Square, Show position 10 times without the ball. Check alignment.\n4. Now add the tee. From the Square position, they take a step toward first and drop the bat on the ball (Soft contact).\n5. Do 10 reps. Emphasize a slow step, not a sprint. Contact is more important than speed.\n\n**What to watch:** Does the step happen toward first base? Or straight ahead? The step should angle toward first.\n\n**If they're struggling:** Use a slower tee. Have them practice the step without the ball first.\n\n**If they've got it:** Remove the tee. Have a coach pitch underhand and do the slap on live pitches. Add a baserunner to make it game-speed.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth softball glove →](/go/softball-glove-11in/) — 11-inch fielder's glove for new players.\n\n[Full softball gear guide →](/what-to-buy/softball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
