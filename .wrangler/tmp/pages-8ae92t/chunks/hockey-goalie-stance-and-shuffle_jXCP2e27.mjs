globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The goalie stance is the position from which every save starts. Knees bent. Glove and blocker out front. Stick on the ice. Body square to the puck. From there, the goalie shuffles side to side without crossing feet to track the puck.</p>\n<p><strong>What you need:</strong> Full goalie gear (mask, chest, leg pads, glove, blocker, stick), an ice rink with a net.</p>\n<p><strong>Setup:</strong> Goalie in the crease in front of the net.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Show the stance: skates shoulder-width, knees bent, hips low, glove and blocker out at the side, stick on the ice in front.</li>\n<li>Hold the stance for 10 seconds.</li>\n<li>Coach calls “right.” Goalie shuffles 2 feet right. Stays in stance.</li>\n<li>Coach calls “left.” Goalie shuffles 2 feet left.</li>\n<li>Continue for 60 seconds. Mix directions.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the stance break during the shuffle? Some goalies stand up tall when they move. Knees stay bent the whole time.</p>\n<p><strong>If they’re struggling:</strong> Slower shuffles. Or hold the stance off-ice for 30 seconds at a time first.</p>\n<p><strong>If they’ve got it:</strong> Add a puck. Coach passes a puck along the ice in front of the net. Goalie shuffles to track it.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/hockey-puck/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Hockey pucks (6-pack) →</a> — regulation pucks for drills and scrimmage.</p>\n<p><a href=\"/go/hockey-stick-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth hockey stick →</a> — Franklin Ripper, flex rated for young players.</p>\n<p><a href=\"/what-to-buy/hockey/\">Full hockey gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Goalie Stance and Shuffle","summary":"Goalie sets the basic stance and shuffles side to side. 10 minutes. Ages 8-10.","sport":"hockey","ages":["8-10"],"fundamental":"goaltending","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Young goalie in stance with knees bent, glove and blocker out front, stick on the ice, shuffling sideways across the crease.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Stance description with shoulder-width skates and stick on ice is correct."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/hockey-goalie-stance-and-shuffle.md";
				const url = undefined;
				function rawContent() {
					return "\nThe goalie stance is the position from which every save starts. Knees bent. Glove and blocker out front. Stick on the ice. Body square to the puck. From there, the goalie shuffles side to side without crossing feet to track the puck.\n\n**What you need:** Full goalie gear (mask, chest, leg pads, glove, blocker, stick), an ice rink with a net.\n\n**Setup:** Goalie in the crease in front of the net.\n\n**How to run it:**\n\n1. Show the stance: skates shoulder-width, knees bent, hips low, glove and blocker out at the side, stick on the ice in front.\n2. Hold the stance for 10 seconds.\n3. Coach calls \"right.\" Goalie shuffles 2 feet right. Stays in stance.\n4. Coach calls \"left.\" Goalie shuffles 2 feet left.\n5. Continue for 60 seconds. Mix directions.\n\n**What to watch:** Does the stance break during the shuffle? Some goalies stand up tall when they move. Knees stay bent the whole time.\n\n**If they're struggling:** Slower shuffles. Or hold the stance off-ice for 30 seconds at a time first.\n\n**If they've got it:** Add a puck. Coach passes a puck along the ice in front of the net. Goalie shuffles to track it.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Hockey pucks (6-pack) →](/go/hockey-puck/) — regulation pucks for drills and scrimmage.\n\n[Youth hockey stick →](/go/hockey-stick-youth/) — Franklin Ripper, flex rated for young players.\n\n[Full hockey gear guide →](/what-to-buy/hockey/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
