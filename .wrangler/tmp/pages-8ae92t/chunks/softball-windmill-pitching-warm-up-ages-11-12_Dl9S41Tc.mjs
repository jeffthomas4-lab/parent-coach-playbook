globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Windmill pitching is hard on the arm. A proper warm-up prevents injury and builds strength. This is the sequence to use before every throwing session.</p>\n<p><strong>Equipment needed:</strong> A mound or flat area, 20 softballs, a bucket, a catcher.</p>\n<p><strong>Setup:</strong> Pitcher on the mound. Catcher 43 feet away. You’re watching form.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>5 reps: Small-radius windmill (arm circle is tight, ball stays low). Nice and easy.</li>\n<li>5 reps: Medium-radius windmill (arm extends, ball comes up). Still easy.</li>\n<li>5 reps: Full windmill with velocity building.</li>\n<li>Rest 1 minute.</li>\n<li>5 reps: Full speed pitches.</li>\n</ol>\n<p>Total: 20 pitches from easy to game speed. This takes 20 minutes.</p>\n<p><strong>What to look for:</strong> Smooth arm action, consistent timing, and a balanced follow-through. If the arm slot is changing or the follow-through is rough, stop and reset.</p>\n<p><strong>Variation:</strong> For younger kids (11), skip the velocity progression and stick with medium-radius windmills. For advanced pitchers (12), add count work after the 20-pitch build-up (pitch in a game scenario).</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/softball-glove-11in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth softball glove →</a> — 11-inch fielder’s glove for new players.</p>\n<p><a href=\"/go/baseball-catchers-gear-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth catcher’s set →</a> — chest protector, helmet, and leg guards.</p>\n<p><a href=\"/what-to-buy/softball/\">Full softball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Windmill Pitching Warm-Up","summary":"Build arm strength and mechanics with interval work before pitching. 20 minutes. Ages 11-12.","sport":"softball","ages":["11-12"],"focus":"fundamentals","layer":"skills","fundamental":"pitching","progression":"build","illustrationBrief":"Windmill mechanics and arm circles","publishedAt":"2026-03-03T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Windmill-specific pre-throwing progression."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/softball-windmill-pitching-warm-up-ages-11-12.md";
				const url = undefined;
				function rawContent() {
					return "\nWindmill pitching is hard on the arm. A proper warm-up prevents injury and builds strength. This is the sequence to use before every throwing session.\n\n**Equipment needed:** A mound or flat area, 20 softballs, a bucket, a catcher.\n\n**Setup:** Pitcher on the mound. Catcher 43 feet away. You're watching form.\n\n**How to run it:**\n\n1. 5 reps: Small-radius windmill (arm circle is tight, ball stays low). Nice and easy.\n2. 5 reps: Medium-radius windmill (arm extends, ball comes up). Still easy.\n3. 5 reps: Full windmill with velocity building.\n4. Rest 1 minute.\n5. 5 reps: Full speed pitches.\n\nTotal: 20 pitches from easy to game speed. This takes 20 minutes.\n\n**What to look for:** Smooth arm action, consistent timing, and a balanced follow-through. If the arm slot is changing or the follow-through is rough, stop and reset.\n\n**Variation:** For younger kids (11), skip the velocity progression and stick with medium-radius windmills. For advanced pitchers (12), add count work after the 20-pitch build-up (pitch in a game scenario).\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth softball glove →](/go/softball-glove-11in/) — 11-inch fielder's glove for new players.\n\n[Youth catcher's set →](/go/baseball-catchers-gear-youth/) — chest protector, helmet, and leg guards.\n\n[Full softball gear guide →](/what-to-buy/softball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
