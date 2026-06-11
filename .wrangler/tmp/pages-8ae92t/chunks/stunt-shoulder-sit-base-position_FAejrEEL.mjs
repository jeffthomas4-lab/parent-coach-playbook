globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Shoulder sit is the entry stunt. Base position matters more than flyer position.</p>\n<p><strong>Equipment needed:</strong> Mat. One base, one flyer (close in size for safety), one spotter behind.</p>\n<p><strong>Setup:</strong> Base in a quarter squat, hands on shoulders pre-load.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Flyer approaches from behind, places foot in base’s hand.</li>\n<li>Base lifts, flyer sits on shoulder.</li>\n<li>Base’s hands grip flyer’s calves. Base’s head looks straight ahead, NOT up.</li>\n<li>Hold for 10 seconds, dismount.</li>\n<li>Five reps.</li>\n</ol>\n<p><strong>What to look for:</strong> Base’s back is straight, knees slightly bent. If the base is leaning back, the flyer will tip backward.</p>\n<p><strong>Variation:</strong> Add a one-handed wave from the flyer to test stability.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/multi-sport-mouthguard-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth mouthguard →</a> — required for most stunt and cheer programs.</p>\n<p><a href=\"/what-to-buy/stunt/\">Full stunt gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Shoulder-Sit Base Position","summary":"Base learns to hold a flyer in a shoulder sit. Static hold. Ages 11-14.","sport":"stunt","age":"11-12","ages":["11-12","13-14"],"focus":"fundamentals","layer":"foundations","fundamental":"positioning","progression":"intro","illustrationBrief":"A youth stunt base holding a flyer in a shoulder sit, base's hands gripping the flyer's calves.","publishedAt":"2026-05-12T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":6,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-12T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Generated as part of the per-sport content baseline. Voice may need a Jeff pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/stunt-shoulder-sit-base-position.md";
				const url = undefined;
				function rawContent() {
					return "\nShoulder sit is the entry stunt. Base position matters more than flyer position.\n\n**Equipment needed:** Mat. One base, one flyer (close in size for safety), one spotter behind.\n\n**Setup:** Base in a quarter squat, hands on shoulders pre-load.\n\n**How to run it:**\n\n1. Flyer approaches from behind, places foot in base's hand.\n2. Base lifts, flyer sits on shoulder.\n3. Base's hands grip flyer's calves. Base's head looks straight ahead, NOT up.\n4. Hold for 10 seconds, dismount.\n5. Five reps.\n\n**What to look for:** Base's back is straight, knees slightly bent. If the base is leaning back, the flyer will tip backward.\n\n**Variation:** Add a one-handed wave from the flyer to test stability.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth mouthguard →](/go/multi-sport-mouthguard-youth/) — required for most stunt and cheer programs.\n\n[Full stunt gear guide →](/what-to-buy/stunt/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
