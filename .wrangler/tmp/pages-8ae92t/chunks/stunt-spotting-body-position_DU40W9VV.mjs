globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The spotter is the safety net. Good spotting body position prevents most injuries.</p>\n<p><strong>Equipment needed:</strong> Mat.</p>\n<p><strong>Setup:</strong> Spotter behind a stunt group (or imagined flyer).</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Spotter stands close enough to touch the flyer with extended arms.</li>\n<li>Knees bent in a half-squat — never standing straight.</li>\n<li>Hands up at the flyer’s waist height, palms ready.</li>\n<li>Eyes locked on the flyer’s hips. Never look away.</li>\n<li>Hold the position through a 20-second imaginary stunt.</li>\n</ol>\n<p><strong>What to look for:</strong> Stable base. If the spotter is leaning or off-balance, they can’t catch. Eyes stay up.</p>\n<p><strong>Variation:</strong> Add a “fall” call where the flyer pretends to slip. Spotter’s job is to immediately bring hands to the hips and steady the flyer (or catch them in a cradle motion).</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/multi-sport-mouthguard-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth mouthguard →</a> — required for most stunt and cheer programs.</p>\n<p><a href=\"/what-to-buy/stunt/\">Full stunt gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Spotting Body Position","summary":"Spotters learn the ready position. Hands up, knees bent. Ages 11-14.","sport":"stunt","age":"11-12","ages":["11-12","13-14"],"focus":"fundamentals","layer":"foundations","fundamental":"positioning","progression":"intro","illustrationBrief":"A youth cheer spotter behind a stunt group with hands up at flyer's waist height, knees bent, eyes on the flyer.","publishedAt":"2026-05-12T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":6,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-12T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Generated as part of the per-sport content baseline. Voice may need a Jeff pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/stunt-spotting-body-position.md";
				const url = undefined;
				function rawContent() {
					return "\nThe spotter is the safety net. Good spotting body position prevents most injuries.\n\n**Equipment needed:** Mat.\n\n**Setup:** Spotter behind a stunt group (or imagined flyer).\n\n**How to run it:**\n\n1. Spotter stands close enough to touch the flyer with extended arms.\n2. Knees bent in a half-squat — never standing straight.\n3. Hands up at the flyer's waist height, palms ready.\n4. Eyes locked on the flyer's hips. Never look away.\n5. Hold the position through a 20-second imaginary stunt.\n\n**What to look for:** Stable base. If the spotter is leaning or off-balance, they can't catch. Eyes stay up.\n\n**Variation:** Add a \"fall\" call where the flyer pretends to slip. Spotter's job is to immediately bring hands to the hips and steady the flyer (or catch them in a cradle motion).\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth mouthguard →](/go/multi-sport-mouthguard-youth/) — required for most stunt and cheer programs.\n\n[Full stunt gear guide →](/what-to-buy/stunt/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
