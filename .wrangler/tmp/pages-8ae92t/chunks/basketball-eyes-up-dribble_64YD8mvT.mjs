globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Ball watchers can’t see the defense or where to go next. This drill forces the eyes to stay up. Start slow and let them build confidence that they don’t need to look down.</p>\n<p><strong>What you need:</strong> 8-foot basket. Youth ball (5-7) or regular ball (8-10). One per kid. Some cones or targets.</p>\n<p><strong>Setup:</strong> Place 4 cones in a square at halfcourt, about 8 feet apart. Kids line up on the baseline.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>First rep: walk to halfcourt while dribbling with the right hand. Look at the first cone the whole time. Never look at the ball.</li>\n<li>At the cone, plant your feet and stop the ball.</li>\n<li>Walk back with the left hand. Look at a cone.</li>\n<li>Do 2 rounds. Rest.</li>\n<li>On round 3, walk faster. It’s still walking, but with more speed and power in the dribble.</li>\n</ol>\n<p><strong>What to watch:</strong> Are their eyes down on the ball? Stop them and redirect. Eyes stay on that cone or the wall or your face. Anywhere but the ball.</p>\n<p><strong>If they’re struggling:</strong> Have them dribble in place while you hold up fingers. They guess the number. This keeps eyes on you, not the ball.</p>\n<p><strong>If they’ve got it:</strong> Walk at half speed now, almost jogging. Still eyes up. Still controlled. No racing yet.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/go/agility-cones/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Agility cones →</a> — for lane markers, footwork guides, and drills.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Eyes Up Dribble","summary":"Dribble without looking at the ball. 7 minutes. Ages 5-7, 8-10.","sport":"basketball","ages":["5-7","8-10"],"fundamental":"dribbling","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A child dribbling while looking ahead at targets on the court, not down at the ball.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Hold-up-fingers struggle variation is a great forced-eyes-up trick."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-eyes-up-dribble.md";
				const url = undefined;
				function rawContent() {
					return "\nBall watchers can't see the defense or where to go next. This drill forces the eyes to stay up. Start slow and let them build confidence that they don't need to look down.\n\n**What you need:** 8-foot basket. Youth ball (5-7) or regular ball (8-10). One per kid. Some cones or targets.\n\n**Setup:** Place 4 cones in a square at halfcourt, about 8 feet apart. Kids line up on the baseline.\n\n**How to run it:**\n\n1. First rep: walk to halfcourt while dribbling with the right hand. Look at the first cone the whole time. Never look at the ball.\n2. At the cone, plant your feet and stop the ball.\n3. Walk back with the left hand. Look at a cone.\n4. Do 2 rounds. Rest.\n5. On round 3, walk faster. It's still walking, but with more speed and power in the dribble.\n\n**What to watch:** Are their eyes down on the ball? Stop them and redirect. Eyes stay on that cone or the wall or your face. Anywhere but the ball.\n\n**If they're struggling:** Have them dribble in place while you hold up fingers. They guess the number. This keeps eyes on you, not the ball.\n\n**If they've got it:** Walk at half speed now, almost jogging. Still eyes up. Still controlled. No racing yet.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Agility cones →](/go/agility-cones/) — for lane markers, footwork guides, and drills.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
