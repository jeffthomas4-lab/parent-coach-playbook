globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>This is the standard layup drill that teaches footwork, touch, and finishing under light pressure. Two lines feed each other and a defender contests lightly.</p>\n<p><strong>Equipment needed:</strong> One hoop, 15 basketballs, cones to mark lines.</p>\n<p><strong>Setup:</strong> Two lines facing the hoop, about 25 feet away. One line on the right, one on the left. A defender stands near the hoop but allows the shot.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>First kid in Right line dribbles toward the hoop and shoots a layup. Defender contests but doesn’t block.</li>\n<li>First kid in Left line rebounds and passes to the next kid in Right line.</li>\n<li>That kid dribbles from the left and shoots. Left line rebounder passes to next in Left line.</li>\n<li>Alternate. Do 20 shots (10 per side).</li>\n</ol>\n<p><strong>What to look for:</strong> Footwork and soft touch. The shot should kiss the backboard, not bang it. If the ball is rattling out, the kid is shooting too hard. Layups are touch shots.</p>\n<p><strong>If they’re struggling:</strong> Remove the defender. Slow down the dribble approach. Drop to 15 feet so the run-up is shorter.</p>\n<p><strong>If they’ve got it:</strong> Defender contests harder. Add a counter: if the defender takes the layup away, the shooter pulls back for a short jumper instead.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/go/agility-cones/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Agility cones →</a> — for lane markers, footwork guides, and drills.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Two-Line Layups","summary":"Game-speed two-line layup drill with a defender. 20 minutes. Ages 8-10.","sport":"basketball","ages":["8-10"],"focus":"fundamentals","layer":"foundations","fundamental":"finishing","progression":"build","illustrationBrief":"Two lines of players alternating, with one feeding the other for a layup while a light defender provides minimal contest.","publishedAt":"2026-02-12T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Completed truncated body with two voice-matched closing lines. Standard two-line layup drill, sport language clean."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-two-line-layups-ages-8-10.md";
				const url = undefined;
				function rawContent() {
					return "\nThis is the standard layup drill that teaches footwork, touch, and finishing under light pressure. Two lines feed each other and a defender contests lightly.\n\n**Equipment needed:** One hoop, 15 basketballs, cones to mark lines.\n\n**Setup:** Two lines facing the hoop, about 25 feet away. One line on the right, one on the left. A defender stands near the hoop but allows the shot.\n\n**How to run it:**\n\n1. First kid in Right line dribbles toward the hoop and shoots a layup. Defender contests but doesn't block.\n2. First kid in Left line rebounds and passes to the next kid in Right line.\n3. That kid dribbles from the left and shoots. Left line rebounder passes to next in Left line.\n4. Alternate. Do 20 shots (10 per side).\n\n**What to look for:** Footwork and soft touch. The shot should kiss the backboard, not bang it. If the ball is rattling out, the kid is shooting too hard. Layups are touch shots.\n\n**If they're struggling:** Remove the defender. Slow down the dribble approach. Drop to 15 feet so the run-up is shorter.\n\n**If they've got it:** Defender contests harder. Add a counter: if the defender takes the layup away, the shooter pulls back for a short jumper instead.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Agility cones →](/go/agility-cones/) — for lane markers, footwork guides, and drills.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
