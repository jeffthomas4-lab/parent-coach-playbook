globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A base block is a blocker going straight at a defender and driving them back. This is the simplest block and the one that builds everything else. Cue: Plant, Punch, Drive, Finish.</p>\n<p><strong>What you need:</strong> Two bags, two cones, or just a lined field.</p>\n<p><strong>Setup:</strong> Mark a line in the middle. One kid starts 3 yards away, the other stays at the line.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Review the cue: Plant, Punch, Drive, Finish.</li>\n<li>The blocker (Kid A) comes forward. Plant the front foot and punch both hands into the defender’s chest. Punch hard.</li>\n<li>Drive the legs. Once the hands are in, the job is to keep running the feet forward. The defender should move backward.</li>\n<li>Finish means they keep the block until you blow the whistle.</li>\n<li>Do 5 reps. Then switch roles.</li>\n</ol>\n<p><strong>What to watch:</strong> Are the feet moving after they punch, or do they stop? The feet have to keep going. That’s where the power comes from.</p>\n<p><strong>If they’re struggling:</strong> Have the defender stay still and not resist. Just let the blocker practice the motion of planting, punching, and driving without the defender pushing back.</p>\n<p><strong>If they’ve got it:</strong> Have the defender lean into the block a little. Now the blocker has to work harder to move them.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/football-rubber-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber football →</a> — Wilson youth rubber ball for rec and practice.</p>\n<p><a href=\"/go/agility-cones/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Agility cones →</a> — for route trees, blocking lanes, and setup.</p>\n<p><a href=\"/what-to-buy/football/\">Full football gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Base Block","summary":"Block straight ahead with hands and legs. 10 minutes. Ages 8-10.","sport":"football","ages":["8-10"],"fundamental":"blocking","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A young blocker with hands in the chest of a defender, driving the legs and moving them backward.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":true,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Live partner blocking; sensitive flagged for player-to-player contact."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/tackle-football-base-block.md";
				const url = undefined;
				function rawContent() {
					return "\nA base block is a blocker going straight at a defender and driving them back. This is the simplest block and the one that builds everything else. Cue: Plant, Punch, Drive, Finish.\n\n**What you need:** Two bags, two cones, or just a lined field.\n\n**Setup:** Mark a line in the middle. One kid starts 3 yards away, the other stays at the line.\n\n**How to run it:**\n\n1. Review the cue: Plant, Punch, Drive, Finish.\n2. The blocker (Kid A) comes forward. Plant the front foot and punch both hands into the defender's chest. Punch hard.\n3. Drive the legs. Once the hands are in, the job is to keep running the feet forward. The defender should move backward.\n4. Finish means they keep the block until you blow the whistle.\n5. Do 5 reps. Then switch roles.\n\n**What to watch:** Are the feet moving after they punch, or do they stop? The feet have to keep going. That's where the power comes from.\n\n**If they're struggling:** Have the defender stay still and not resist. Just let the blocker practice the motion of planting, punching, and driving without the defender pushing back.\n\n**If they've got it:** Have the defender lean into the block a little. Now the blocker has to work harder to move them.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber football →](/go/football-rubber-youth/) — Wilson youth rubber ball for rec and practice.\n\n[Agility cones →](/go/agility-cones/) — for route trees, blocking lanes, and setup.\n\n[Full football gear guide →](/what-to-buy/football/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
