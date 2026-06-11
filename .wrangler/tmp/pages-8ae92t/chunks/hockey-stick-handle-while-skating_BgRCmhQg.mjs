globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Stick handling standing still is one skill. Stick handling while skating full speed is another. The puck moves. The body moves. The eyes have to be up. This drill brings them together.</p>\n<p><strong>What you need:</strong> Stick, puck, full gear, ice rink.</p>\n<p><strong>Setup:</strong> Skater at one end of the ice with a puck. Open lane to skate.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Skater pushes off and skates forward at three-quarter speed.</li>\n<li>Stick handles the puck side to side every two strides.</li>\n<li>Eyes up after the first 10 feet. Look at the cone or person at the other end.</li>\n<li>Skate to the other end. Stop. Turn. Skate back.</li>\n<li>Do 4 trips. Last trip at full speed.</li>\n</ol>\n<p><strong>What to watch:</strong> Eyes. Do they look down at the puck? At this stage, eyes up is the goal. Tell them: “If you’re looking at the puck, you can’t see the play.”</p>\n<p><strong>If they’re struggling:</strong> Slow the skating speed. Or do the drill off-ice with a ball first.</p>\n<p><strong>If they’ve got it:</strong> Add a defender (a teammate with a stick) at center ice. Skater has to go around or fake.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/hockey-puck/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Hockey pucks (6-pack) →</a> — regulation pucks for drills and scrimmage.</p>\n<p><a href=\"/go/hockey-stick-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth hockey stick →</a> — Franklin Ripper, flex rated for young players.</p>\n<p><a href=\"/what-to-buy/hockey/\">Full hockey gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Stick Handle While Skating","summary":"Carry the puck across the ice with stick on puck. 12 minutes. Ages 8-10.","sport":"hockey","ages":["8-10"],"fundamental":"stick-handling","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player skating across the rink with the stick controlling a puck on the forehand side, head up scanning the ice.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Eyes-up cue is the right next step after stationary handling."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/hockey-stick-handle-while-skating.md";
				const url = undefined;
				function rawContent() {
					return "\nStick handling standing still is one skill. Stick handling while skating full speed is another. The puck moves. The body moves. The eyes have to be up. This drill brings them together.\n\n**What you need:** Stick, puck, full gear, ice rink.\n\n**Setup:** Skater at one end of the ice with a puck. Open lane to skate.\n\n**How to run it:**\n\n1. Skater pushes off and skates forward at three-quarter speed.\n2. Stick handles the puck side to side every two strides.\n3. Eyes up after the first 10 feet. Look at the cone or person at the other end.\n4. Skate to the other end. Stop. Turn. Skate back.\n5. Do 4 trips. Last trip at full speed.\n\n**What to watch:** Eyes. Do they look down at the puck? At this stage, eyes up is the goal. Tell them: \"If you're looking at the puck, you can't see the play.\"\n\n**If they're struggling:** Slow the skating speed. Or do the drill off-ice with a ball first.\n\n**If they've got it:** Add a defender (a teammate with a stick) at center ice. Skater has to go around or fake.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Hockey pucks (6-pack) →](/go/hockey-puck/) — regulation pucks for drills and scrimmage.\n\n[Youth hockey stick →](/go/hockey-stick-youth/) — Franklin Ripper, flex rated for young players.\n\n[Full hockey gear guide →](/what-to-buy/hockey/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
