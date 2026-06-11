globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Softball throwing is the same overhand motion as baseball. Most young kids sidearm because it feels natural. Overhand has to be taught early or bad arm paths stick.</p>\n<p><strong>What you need:</strong> 5 softballs (11” for 10U). Open grass.</p>\n<p><strong>Setup:</strong> Stand 8 feet apart. Kid faces you with throwing-side foot back and glove-side foot forward.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Walk through the cue: Turn, Shuffle, Point, Fire. Today we focus on Turn and Point.</li>\n<li>Show them: throwing shoulder turns sideways toward you, glove arm points at your chest, throwing arm bent in an L behind the ear.</li>\n<li>Have them mirror it without a ball. Three reps.</li>\n<li>Hand them a ball. They turn, point, and throw to you. No shuffle yet.</li>\n<li>Do 10 reps. Then switch and you throw so they see what good looks like.</li>\n</ol>\n<p><strong>What to watch:</strong> Is the throwing arm coming up over the top of the ear? If it’s coming around the side, gently move their elbow up and have them try again.</p>\n<p><strong>If they’re struggling:</strong> Move closer to 5 feet. Use a softer ball. Skip mechanics and just have them hand the ball in the right body position.</p>\n<p><strong>If they’ve got it:</strong> Move back to 12 feet and add the Shuffle. They take a small step with the back foot toward the front foot before the throw.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/softball-glove-11in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth softball glove →</a> — 11-inch fielder’s glove for new players.</p>\n<p><a href=\"/what-to-buy/softball/\">Full softball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Overhand Toss with a Partner","summary":"First exposure to throwing overhand. 8 minutes. T-ball and ages 5-7.","sport":"softball","ages":["t-ball","5-7"],"fundamental":"throwing","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Adult and child standing 8 feet apart on grass, child's throwing arm raised behind the ear in an L-shape, glove pointing at the adult.","editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Overhand here means non-pitch throwing motion, which is correct. Pitching is windmill; this is a fielding throw drill. Changed soft baseballs to softballs."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/softball-overhand-toss-partner.md";
				const url = undefined;
				function rawContent() {
					return "\nSoftball throwing is the same overhand motion as baseball. Most young kids sidearm because it feels natural. Overhand has to be taught early or bad arm paths stick.\n\n**What you need:** 5 softballs (11\" for 10U). Open grass.\n\n**Setup:** Stand 8 feet apart. Kid faces you with throwing-side foot back and glove-side foot forward.\n\n**How to run it:**\n\n1. Walk through the cue: Turn, Shuffle, Point, Fire. Today we focus on Turn and Point.\n2. Show them: throwing shoulder turns sideways toward you, glove arm points at your chest, throwing arm bent in an L behind the ear.\n3. Have them mirror it without a ball. Three reps.\n4. Hand them a ball. They turn, point, and throw to you. No shuffle yet.\n5. Do 10 reps. Then switch and you throw so they see what good looks like.\n\n**What to watch:** Is the throwing arm coming up over the top of the ear? If it's coming around the side, gently move their elbow up and have them try again.\n\n**If they're struggling:** Move closer to 5 feet. Use a softer ball. Skip mechanics and just have them hand the ball in the right body position.\n\n**If they've got it:** Move back to 12 feet and add the Shuffle. They take a small step with the back foot toward the front foot before the throw.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth softball glove →](/go/softball-glove-11in/) — 11-inch fielder's glove for new players.\n\n[Full softball gear guide →](/what-to-buy/softball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
