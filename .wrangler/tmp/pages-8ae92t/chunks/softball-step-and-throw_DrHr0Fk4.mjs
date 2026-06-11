globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Now the throw gets power. A step toward the target gives the kid momentum and teaches hip rotation. Without stepping, kids rely on arm strength alone.</p>\n<p><strong>What you need:</strong> 10 softballs (11”), a partner at 20 feet, open grass.</p>\n<p><strong>Setup:</strong> Stand 20 feet apart. Kid stands with feet together, ready to step.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Turn, Shuffle, Point, Fire.</li>\n<li>They turn their shoulders (Turn), step toward you with the glove-side foot (Shuffle), point the glove (Point), and throw (Fire).</li>\n<li>Do 5 throws. Check that the step lands in front of the back foot.</li>\n<li>Add distance: move back to 25 feet. Do 5 more.</li>\n<li>Move back to 30 feet. Do 5 more. If accuracy drops, back up to 25 feet.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the step happen before the arm fires? If the arm goes first, the body has no power behind it.</p>\n<p><strong>If they’re struggling:</strong> Stand closer at 15 feet. Have them step without throwing first, just to feel the motion.</p>\n<p><strong>If they’ve got it:</strong> Add targets. Throw to different spots (high, low, left, right) and adjust the step direction.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/softball-glove-11in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth softball glove →</a> — 11-inch fielder’s glove for new players.</p>\n<p><a href=\"/what-to-buy/softball/\">Full softball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Step and Throw","summary":"Add a step into the throw. 10 minutes. Ages 5-7 and 8-10.","sport":"softball","ages":["5-7","8-10"],"fundamental":"throwing","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Child stepping forward with the glove-side foot while rotating the throwing shoulder and extending the arm forward.","editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Step-into-throw build; ball terminology corrected."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/softball-step-and-throw.md";
				const url = undefined;
				function rawContent() {
					return "\nNow the throw gets power. A step toward the target gives the kid momentum and teaches hip rotation. Without stepping, kids rely on arm strength alone.\n\n**What you need:** 10 softballs (11\"), a partner at 20 feet, open grass.\n\n**Setup:** Stand 20 feet apart. Kid stands with feet together, ready to step.\n\n**How to run it:**\n\n1. Cue: Turn, Shuffle, Point, Fire.\n2. They turn their shoulders (Turn), step toward you with the glove-side foot (Shuffle), point the glove (Point), and throw (Fire).\n3. Do 5 throws. Check that the step lands in front of the back foot.\n4. Add distance: move back to 25 feet. Do 5 more.\n5. Move back to 30 feet. Do 5 more. If accuracy drops, back up to 25 feet.\n\n**What to watch:** Does the step happen before the arm fires? If the arm goes first, the body has no power behind it.\n\n**If they're struggling:** Stand closer at 15 feet. Have them step without throwing first, just to feel the motion.\n\n**If they've got it:** Add targets. Throw to different spots (high, low, left, right) and adjust the step direction.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth softball glove →](/go/softball-glove-11in/) — 11-inch fielder's glove for new players.\n\n[Full softball gear guide →](/what-to-buy/softball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
