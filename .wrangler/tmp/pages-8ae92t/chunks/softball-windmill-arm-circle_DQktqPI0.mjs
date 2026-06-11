globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The windmill is the foundation of softball pitching. It takes months to build. Start with arm circles on flat ground before the mound. This is the Set and Wind part of the Set, Wind, Whip, Release cue.</p>\n<p><strong>What you need:</strong> A softball (12”), flat ground 30 feet from a target or wall.</p>\n<p><strong>Setup:</strong> Pitcher stands on flat ground facing the wall or target, feet shoulder-width apart.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Set, Wind, Whip, Release. Today focus on Set and Wind.</li>\n<li>Set: feet on the ground, glove pointing at the target, arm at the side.</li>\n<li>Wind: the arm makes a full circle over the head, building momentum.</li>\n<li>Do 5 slow arm circles with no ball. Check for smooth rotation and balance.</li>\n<li>Do 5 more arm circles with a ball in the hand. Release toward the target.</li>\n<li>Count how many pitches go to the target area. Accuracy is not important yet.</li>\n</ol>\n<p><strong>What to watch:</strong> Is the arm circle smooth and full? Or is it jerky and short? Full circles are crucial for power and control.</p>\n<p><strong>If they’re struggling:</strong> Have them do arm circles without a glove. Just the arm moving. Do 10 slow reps.</p>\n<p><strong>If they’ve got it:</strong> Add the full Whip and Release. The arm whips past the hip and the back of the hand finishes toward the target. Do 5 reps.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/softball-glove-11in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth softball glove →</a> — 11-inch fielder’s glove for new players.</p>\n<p><a href=\"/what-to-buy/softball/\">Full softball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Windmill Arm Circle","summary":"Build the windmill pitching arm motion. 10 minutes. Ages 11-12.","sport":"softball","ages":["11-12"],"fundamental":"pitching","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Young pitcher on the mound with arm extended, beginning a full windmill rotation above the head.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Windmill foundation; fixed ball terminology in equipment line."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/softball-windmill-arm-circle.md";
				const url = undefined;
				function rawContent() {
					return "\nThe windmill is the foundation of softball pitching. It takes months to build. Start with arm circles on flat ground before the mound. This is the Set and Wind part of the Set, Wind, Whip, Release cue.\n\n**What you need:** A softball (12\"), flat ground 30 feet from a target or wall.\n\n**Setup:** Pitcher stands on flat ground facing the wall or target, feet shoulder-width apart.\n\n**How to run it:**\n\n1. Cue: Set, Wind, Whip, Release. Today focus on Set and Wind.\n2. Set: feet on the ground, glove pointing at the target, arm at the side.\n3. Wind: the arm makes a full circle over the head, building momentum.\n4. Do 5 slow arm circles with no ball. Check for smooth rotation and balance.\n5. Do 5 more arm circles with a ball in the hand. Release toward the target.\n6. Count how many pitches go to the target area. Accuracy is not important yet.\n\n**What to watch:** Is the arm circle smooth and full? Or is it jerky and short? Full circles are crucial for power and control.\n\n**If they're struggling:** Have them do arm circles without a glove. Just the arm moving. Do 10 slow reps.\n\n**If they've got it:** Add the full Whip and Release. The arm whips past the hip and the back of the hand finishes toward the target. Do 5 reps.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth softball glove →](/go/softball-glove-11in/) — 11-inch fielder's glove for new players.\n\n[Full softball gear guide →](/what-to-buy/softball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
