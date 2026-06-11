globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Sprinters drive the knee high. Joggers shuffle. The knee-drive pattern generates more power per stride and uses less effort overall. Worth teaching at 11-12 because it’s the foundation of every track event.</p>\n<p><strong>What you need:</strong> Open space, 30 yards.</p>\n<p><strong>Setup:</strong> Runner at one end of the area.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Show the move: front knee lifts to hip height, back leg straight under the body, opposite arm drives forward.</li>\n<li>March in place: alternate legs, knee to hip height. 30 reps each leg.</li>\n<li>March forward: same motion, slowly walking forward. 20 yards.</li>\n<li>A-skip: the marching pattern with a small skip between each lift. 20 yards.</li>\n<li>Last drill: full sprint with high knees. 20 yards.</li>\n</ol>\n<p><strong>What to watch:</strong> Body position. Some kids lean forward when lifting the knee. Stay tall, chest forward, knee up.</p>\n<p><strong>If they’re struggling:</strong> Lower knee height. Or hold a wall for balance during marches.</p>\n<p><strong>If they’ve got it:</strong> Add a B-skip (knee up, then kick the leg out before the foot lands). Or run in a zigzag pattern with high knees.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/xc-trainers-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth running trainers →</a> — everyday training shoe for track and XC.</p>\n<p><a href=\"/what-to-buy/track-field/\">Full track field gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Knee Drive Form","summary":"Build the high-knee running stride. 10 minutes. Ages 11-12.","sport":"track-field","ages":["11-12"],"fundamental":"running-form","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Runner with the front leg lifted high, knee at hip height, opposite arm driving forward, standing tall with chest forward.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Knee-drive A-skip progression with body-position cue."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/track-knee-drive-form.md";
				const url = undefined;
				function rawContent() {
					return "\nSprinters drive the knee high. Joggers shuffle. The knee-drive pattern generates more power per stride and uses less effort overall. Worth teaching at 11-12 because it's the foundation of every track event.\n\n**What you need:** Open space, 30 yards.\n\n**Setup:** Runner at one end of the area.\n\n**How to run it:**\n\n1. Show the move: front knee lifts to hip height, back leg straight under the body, opposite arm drives forward.\n2. March in place: alternate legs, knee to hip height. 30 reps each leg.\n3. March forward: same motion, slowly walking forward. 20 yards.\n4. A-skip: the marching pattern with a small skip between each lift. 20 yards.\n5. Last drill: full sprint with high knees. 20 yards.\n\n**What to watch:** Body position. Some kids lean forward when lifting the knee. Stay tall, chest forward, knee up.\n\n**If they're struggling:** Lower knee height. Or hold a wall for balance during marches.\n\n**If they've got it:** Add a B-skip (knee up, then kick the leg out before the foot lands). Or run in a zigzag pattern with high knees.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth running trainers →](/go/xc-trainers-youth/) — everyday training shoe for track and XC.\n\n[Full track field gear guide →](/what-to-buy/track-field/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
