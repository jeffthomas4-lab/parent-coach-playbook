globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>By 8-10, young players can aim. This drill teaches them to hit to specific targets on the court, building direction and control.</p>\n<p><strong>Equipment needed:</strong> 4 cones, 8 tennis balls, 1 net, 2 rackets.</p>\n<p><strong>Setup:</strong> Place cones at the four corners of the opponent’s baseline. One player hits from the baseline, the other feeds them balls from the service line.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Feeder tosses a ball to the hitter at about chest height.</li>\n<li>Hitter aims at one corner (coach calls which one: “Right corner, backhand”).</li>\n<li>Hitter attempts to hit the ball to that corner. If it lands near the cone, that’s a success.</li>\n<li>Do 8 reps, trying to hit each corner 2 times.</li>\n<li>Switch roles.</li>\n</ol>\n<p><strong>What to look for:</strong></p>\n<p>The hitter should adjust their stance and swing direction for each target. Hitting the right corner requires different footwork than the left. If the hitter is always hitting the same shot regardless of the target, they’re not adjusting. Success is hitting within 3-4 feet of the target. Perfect accuracy isn’t the goal at this age. Control and awareness are.</p>\n<p><strong>Variation:</strong> Add targets at the service line as well. Now the hitter has to aim at two different depths, teaching depth variation.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/tennis-net/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Portable tennis net →</a> — practice anywhere, not just at the courts.</p>\n<p><a href=\"/go/agility-cones/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Agility cones →</a> — bright targets for the corner reps.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Target Hitting at Corners","summary":"Teach directional hitting by targeting the corners of the court. 12 minutes.","sport":"tennis","ages":["8-10"],"focus":"fundamentals","layer":"foundations","fundamental":"forehand","progression":"intro","illustrationBrief":"Hitting forehands to corner targets","publishedAt":"2026-04-19T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Target work; affiliate disclosure present."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/tennis-target-hitting-at-corners-ages-8-10.md";
				const url = undefined;
				function rawContent() {
					return "\nBy 8-10, young players can aim. This drill teaches them to hit to specific targets on the court, building direction and control.\n\n**Equipment needed:** 4 cones, 8 tennis balls, 1 net, 2 rackets.\n\n**Setup:** Place cones at the four corners of the opponent's baseline. One player hits from the baseline, the other feeds them balls from the service line.\n\n**How to run it:**\n\n1. Feeder tosses a ball to the hitter at about chest height.\n2. Hitter aims at one corner (coach calls which one: \"Right corner, backhand\").\n3. Hitter attempts to hit the ball to that corner. If it lands near the cone, that's a success.\n4. Do 8 reps, trying to hit each corner 2 times.\n5. Switch roles.\n\n**What to look for:**\n\nThe hitter should adjust their stance and swing direction for each target. Hitting the right corner requires different footwork than the left. If the hitter is always hitting the same shot regardless of the target, they're not adjusting. Success is hitting within 3-4 feet of the target. Perfect accuracy isn't the goal at this age. Control and awareness are.\n\n**Variation:** Add targets at the service line as well. Now the hitter has to aim at two different depths, teaching depth variation.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Portable tennis net →](/go/tennis-net/) — practice anywhere, not just at the courts.\n\n[Agility cones →](/go/agility-cones/) — bright targets for the corner reps.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
