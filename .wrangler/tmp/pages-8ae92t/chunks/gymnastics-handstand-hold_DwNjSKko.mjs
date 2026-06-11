globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The handstand is the foundation of gymnastics. Hold it long, you own it.</p>\n<p><strong>Equipment needed:</strong> A wall, a mat, a spotter for ages under 10.</p>\n<p><strong>Setup:</strong> Mat against the wall. Gymnast kicks up to a handstand, heels touching the wall.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>First attempt: hold for 15 seconds. Body straight — no banana back, no piked hips.</li>\n<li>Rest one minute.</li>\n<li>Second attempt: 20 seconds.</li>\n<li>Build by five seconds each session until 60 seconds is sustainable.</li>\n</ol>\n<p><strong>What to look for:</strong> Straight line from wrist to ankle. Hands shoulder-width. Pushing hard through the shoulders, not letting them sink toward the ears.</p>\n<p><strong>Variation:</strong> Once 60 seconds is easy, do one-arm taps — shift weight to one hand and lift the other for two seconds, then switch.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/resistance-bands-set/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Resistance band set →</a> — for conditioning, stretching, and mobility work.</p>\n<p><a href=\"/what-to-buy/gymnastics/\">Full gymnastics gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Handstand Hold Conditioning","summary":"Hold a handstand against the wall for time. Build to 60 seconds. Ages 8-12.","sport":"gymnastics","age":"8-10","ages":["8-10","11-12"],"focus":"fundamentals","layer":"skills","fundamental":"conditioning","progression":"build","illustrationBrief":"A young gymnast in a handstand against a wall, body straight from wrists to ankles.","publishedAt":"2026-05-12T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":6,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-12T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Generated as part of the per-sport content baseline. Voice may need a Jeff pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/gymnastics-handstand-hold.md";
				const url = undefined;
				function rawContent() {
					return "\nThe handstand is the foundation of gymnastics. Hold it long, you own it.\n\n**Equipment needed:** A wall, a mat, a spotter for ages under 10.\n\n**Setup:** Mat against the wall. Gymnast kicks up to a handstand, heels touching the wall.\n\n**How to run it:**\n\n1. First attempt: hold for 15 seconds. Body straight — no banana back, no piked hips.\n2. Rest one minute.\n3. Second attempt: 20 seconds.\n4. Build by five seconds each session until 60 seconds is sustainable.\n\n**What to look for:** Straight line from wrist to ankle. Hands shoulder-width. Pushing hard through the shoulders, not letting them sink toward the ears.\n\n**Variation:** Once 60 seconds is easy, do one-arm taps — shift weight to one hand and lift the other for two seconds, then switch.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Resistance band set →](/go/resistance-bands-set/) — for conditioning, stretching, and mobility work.\n\n[Full gymnastics gear guide →](/what-to-buy/gymnastics/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
