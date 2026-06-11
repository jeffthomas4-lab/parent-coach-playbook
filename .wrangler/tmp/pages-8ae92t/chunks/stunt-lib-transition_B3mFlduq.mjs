globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The lib is the next level after shoulder sit. Transition is where stunts succeed or collapse.</p>\n<p><strong>Equipment needed:</strong> Mat. Base, flyer, two spotters (front and back).</p>\n<p><strong>Setup:</strong> Shoulder sit established. Flyer’s foot tucked under the seated leg.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Spotters set: one in front (hands at flyer’s foot), one behind (hands at hip).</li>\n<li>On count, flyer extends the standing leg.</li>\n<li>Base supports the flyer’s foot with both hands.</li>\n<li>Flyer pulls the other leg into a lib (knee bent, thigh parallel to ground).</li>\n<li>Hold three seconds. Dismount.</li>\n<li>Three reps.</li>\n</ol>\n<p><strong>What to look for:</strong> Flyer’s eyes look ahead, not down. Base’s hands stay locked under the flyer’s foot. Spotters’ hands stay LIGHT — they’re there for safety, not lifting.</p>\n<p><strong>Variation:</strong> Once stable, hold for five seconds. Build to ten.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/multi-sport-mouthguard-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth mouthguard →</a> — required for most stunt and cheer programs.</p>\n<p><a href=\"/what-to-buy/stunt/\">Full stunt gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Lib Transition","summary":"Move from a shoulder sit into a lib (one-foot stance). Three reps. Ages 13-14.","sport":"stunt","age":"13-14","ages":["13-14"],"focus":"situational","layer":"situational","fundamental":"positioning","progression":"build","illustrationBrief":"A stunt group transitioning a flyer from a shoulder sit to a single-leg lib stand on a base's shoulder.","publishedAt":"2026-05-12T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":6,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-12T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Generated as part of the per-sport content baseline. Voice may need a Jeff pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/stunt-lib-transition.md";
				const url = undefined;
				function rawContent() {
					return "\nThe lib is the next level after shoulder sit. Transition is where stunts succeed or collapse.\n\n**Equipment needed:** Mat. Base, flyer, two spotters (front and back).\n\n**Setup:** Shoulder sit established. Flyer's foot tucked under the seated leg.\n\n**How to run it:**\n\n1. Spotters set: one in front (hands at flyer's foot), one behind (hands at hip).\n2. On count, flyer extends the standing leg.\n3. Base supports the flyer's foot with both hands.\n4. Flyer pulls the other leg into a lib (knee bent, thigh parallel to ground).\n5. Hold three seconds. Dismount.\n6. Three reps.\n\n**What to look for:** Flyer's eyes look ahead, not down. Base's hands stay locked under the flyer's foot. Spotters' hands stay LIGHT — they're there for safety, not lifting.\n\n**Variation:** Once stable, hold for five seconds. Build to ten.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth mouthguard →](/go/multi-sport-mouthguard-youth/) — required for most stunt and cheer programs.\n\n[Full stunt gear guide →](/what-to-buy/stunt/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
