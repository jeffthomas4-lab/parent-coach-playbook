globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Hockey is start-stop. Players sprint, stop hard, sprint again. The kid who can stop and reaccelerate the fastest gets to every loose puck first. This drill builds that pattern.</p>\n<p><strong>What you need:</strong> Full gear, ice rink, two cones.</p>\n<p><strong>Setup:</strong> Cones at the blue line and the red line (about 25 feet apart).</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Push, Glide, Recover, Repeat. Add: Stop hard. Push again.</li>\n<li>Skater sprints from the blue line to the red line.</li>\n<li>At the red line, plows to a hard stop using the inside edges (snowplow stop).</li>\n<li>Pushes back hard toward the blue line.</li>\n<li>Stops at the blue line. Do 6 round trips.</li>\n</ol>\n<p><strong>What to watch:</strong> The stop. A soft stop (gradual deceleration) wastes time. A hard stop creates ice spray and the body sinks low. That’s the move.</p>\n<p><strong>If they’re struggling:</strong> Use only one stop direction. Build the snowplow on one side first.</p>\n<p><strong>If they’ve got it:</strong> Add a hockey stop (sideways stop with both blades). Or do the drill carrying a puck.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/hockey-puck/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Hockey pucks (6-pack) →</a> — regulation pucks for drills and scrimmage.</p>\n<p><a href=\"/go/agility-cones/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Agility cones →</a> — for stickhandling courses and skating drills.</p>\n<p><a href=\"/what-to-buy/hockey/\">Full hockey gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Stop and Go","summary":"Skate forward, stop hard, accelerate again. 12 minutes. Ages 8-10.","sport":"hockey","ages":["8-10"],"fundamental":"skating","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Skater snowplowing to a stop, ice spraying from the blade, body low, then exploding back into a forward push.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Snowplow stop into hockey stop progression is correct for 8-10."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/hockey-stop-and-go.md";
				const url = undefined;
				function rawContent() {
					return "\nHockey is start-stop. Players sprint, stop hard, sprint again. The kid who can stop and reaccelerate the fastest gets to every loose puck first. This drill builds that pattern.\n\n**What you need:** Full gear, ice rink, two cones.\n\n**Setup:** Cones at the blue line and the red line (about 25 feet apart).\n\n**How to run it:**\n\n1. Cue: Push, Glide, Recover, Repeat. Add: Stop hard. Push again.\n2. Skater sprints from the blue line to the red line.\n3. At the red line, plows to a hard stop using the inside edges (snowplow stop).\n4. Pushes back hard toward the blue line.\n5. Stops at the blue line. Do 6 round trips.\n\n**What to watch:** The stop. A soft stop (gradual deceleration) wastes time. A hard stop creates ice spray and the body sinks low. That's the move.\n\n**If they're struggling:** Use only one stop direction. Build the snowplow on one side first.\n\n**If they've got it:** Add a hockey stop (sideways stop with both blades). Or do the drill carrying a puck.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Hockey pucks (6-pack) →](/go/hockey-puck/) — regulation pucks for drills and scrimmage.\n\n[Agility cones →](/go/agility-cones/) — for stickhandling courses and skating drills.\n\n[Full hockey gear guide →](/what-to-buy/hockey/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
