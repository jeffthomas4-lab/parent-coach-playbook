globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>In a game, RBs get hit. This drill teaches them to hold the ball tight and power through contact. The ball stays cradled against the body no matter what.</p>\n<p><strong>What you need:</strong> Two lines of defenders or cones creating a tunnel, about 3 yards wide and 10 yards long.</p>\n<p><strong>Setup:</strong> Line the RBs up at one end of the tunnel. Defenders line both sides inside the tunnel.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>The RB holds the ball in a secure grip, cradled against their body.</li>\n<li>They run through the tunnel. The defenders line up lightly to simulate contact. Not full speed, but enough to make the RB work.</li>\n<li>The RB’s job is to keep the ball tight and not fumble.</li>\n<li>Do 5 reps at controlled speed.</li>\n</ol>\n<p><strong>What to watch:</strong> When contact happens, does the RB squeeze the ball or does it get loose? Squeeze it every time.</p>\n<p><strong>If they’re struggling:</strong> Have the defenders stand still and just be a wall. The RB runs through without contact first.</p>\n<p><strong>If they’ve got it:</strong> Increase the intensity. Defenders can now make light contact with the arms holding the ball. The RB has to fight through and keep the ball.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/football-rubber-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber football →</a> — Wilson youth rubber ball for rec and practice.</p>\n<p><a href=\"/go/agility-cones/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Agility cones →</a> — for route trees, blocking lanes, and setup.</p>\n<p><a href=\"/what-to-buy/football/\">Full football gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Ball Protection Tunnel","summary":"Run through contact while keeping the ball secure. 10 minutes. Ages 11-12.","sport":"football","ages":["11-12"],"fundamental":"ball-carrying","progression":"refine","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A running back driving through defenders with the ball tucked tight against their body.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":true,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Light contact tunnel; intensity is controlled. Sensitive flagged for body contact."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/tackle-football-ball-protection-tunnel.md";
				const url = undefined;
				function rawContent() {
					return "\nIn a game, RBs get hit. This drill teaches them to hold the ball tight and power through contact. The ball stays cradled against the body no matter what.\n\n**What you need:** Two lines of defenders or cones creating a tunnel, about 3 yards wide and 10 yards long.\n\n**Setup:** Line the RBs up at one end of the tunnel. Defenders line both sides inside the tunnel.\n\n**How to run it:**\n\n1. The RB holds the ball in a secure grip, cradled against their body.\n2. They run through the tunnel. The defenders line up lightly to simulate contact. Not full speed, but enough to make the RB work.\n3. The RB's job is to keep the ball tight and not fumble.\n4. Do 5 reps at controlled speed.\n\n**What to watch:** When contact happens, does the RB squeeze the ball or does it get loose? Squeeze it every time.\n\n**If they're struggling:** Have the defenders stand still and just be a wall. The RB runs through without contact first.\n\n**If they've got it:** Increase the intensity. Defenders can now make light contact with the arms holding the ball. The RB has to fight through and keep the ball.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber football →](/go/football-rubber-youth/) — Wilson youth rubber ball for rec and practice.\n\n[Agility cones →](/go/agility-cones/) — for route trees, blocking lanes, and setup.\n\n[Full football gear guide →](/what-to-buy/football/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
