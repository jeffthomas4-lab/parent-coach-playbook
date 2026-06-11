globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Young swimmers need to build leg strength and rhythm before worrying about full strokes. The kickboard isolates the kick so they can focus on the motion.</p>\n<p><strong>Equipment needed:</strong> 1 kickboard per swimmer, 1 pool.</p>\n<p><strong>Setup:</strong> Swimmers line up at one end of the pool, holding the kickboard at arm’s length in front of them.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Swimmer kicks from one end of the pool to the other (25 yards or 25 meters, depending on pool).</li>\n<li>The kick is a flutter kick: alternating leg beats with toes pointed, one leg down while the other is coming up.</li>\n<li>Kick should be from the hip, not the knee. Small, fast movements.</li>\n<li>Do one 25-yard kick, rest at the wall for 30 seconds.</li>\n<li>Repeat 4 times total.</li>\n</ol>\n<p><strong>What to look for:</strong></p>\n<p>The kick should be consistent and rhythmic. If a swimmer is kicking from the knee instead of the hip, their efficiency is low. The legs should move up and down together, alternating. If the legs are moving wildly or slowly, the rhythm is off. Young swimmers should be able to kick the full length without stopping, though they may be tired.</p>\n<p><strong>Variation:</strong> Add a challenge: kick faster on the second 25, maintaining control. This teaches pace variation.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/swim-goggles-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth swim goggles →</a> — Speedo Hydrospex, no-fog, fits ages 6–14.</p>\n<p><a href=\"/what-to-buy/swimming/\">Full swimming gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Kickboard Flutter Drill","summary":"Build flutter-kick rhythm and leg strength with a kickboard. 10 minutes.","sport":"swimming","ages":["5-7"],"focus":"fundamentals","layer":"foundations","fundamental":"freestyle","progression":"intro","illustrationBrief":"Flutter kick drill with kickboard","publishedAt":"2026-04-25T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Kickboard flutter for 5-7; clean."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/swimming-kickboard-flutter-ages-5-7.md";
				const url = undefined;
				function rawContent() {
					return "\nYoung swimmers need to build leg strength and rhythm before worrying about full strokes. The kickboard isolates the kick so they can focus on the motion.\n\n**Equipment needed:** 1 kickboard per swimmer, 1 pool.\n\n**Setup:** Swimmers line up at one end of the pool, holding the kickboard at arm's length in front of them.\n\n**How to run it:**\n\n1. Swimmer kicks from one end of the pool to the other (25 yards or 25 meters, depending on pool).\n2. The kick is a flutter kick: alternating leg beats with toes pointed, one leg down while the other is coming up.\n3. Kick should be from the hip, not the knee. Small, fast movements.\n4. Do one 25-yard kick, rest at the wall for 30 seconds.\n5. Repeat 4 times total.\n\n**What to look for:**\n\nThe kick should be consistent and rhythmic. If a swimmer is kicking from the knee instead of the hip, their efficiency is low. The legs should move up and down together, alternating. If the legs are moving wildly or slowly, the rhythm is off. Young swimmers should be able to kick the full length without stopping, though they may be tired.\n\n**Variation:** Add a challenge: kick faster on the second 25, maintaining control. This teaches pace variation.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth swim goggles →](/go/swim-goggles-youth/) — Speedo Hydrospex, no-fog, fits ages 6–14.\n\n[Full swimming gear guide →](/what-to-buy/swimming/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
