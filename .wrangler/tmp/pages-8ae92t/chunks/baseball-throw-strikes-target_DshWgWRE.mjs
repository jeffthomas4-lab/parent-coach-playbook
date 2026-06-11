globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Pitching is throwing strikes. A pitcher who can’t throw strikes can’t pitch. This drill puts a target on a fence at strike zone height and asks the kid to hit it. Track and tell. The score is the motivator.</p>\n<p><strong>What you need:</strong> 15 baseballs, a fence or net, masking tape or paint to mark a strike zone, a pitching mound or flat marker.</p>\n<p><strong>Setup:</strong> Mark a strike zone on a fence: 18 inches wide, 24 inches tall, bottom edge at knee height for a typical batter. Pitcher 46 feet away.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Set, Lift, Stride, Throw.</li>\n<li>Pitcher throws 10 pitches at the target. Count strikes.</li>\n<li>After 10, tell them the count. Goal: 6 of 10.</li>\n<li>Take a 1-minute break. Throw 10 more.</li>\n<li>Last round: aim for specific corners (top-left, bottom-right). Now placement matters, not just hitting the zone.</li>\n</ol>\n<p><strong>What to watch:</strong> Are they slowing down to hit the target? Some kids ease up to throw strikes. Strikes need to be at full speed. Slow strikes are still slow.</p>\n<p><strong>If they’re struggling:</strong> Make the target bigger. Move the mound closer.</p>\n<p><strong>If they’ve got it:</strong> Shrink the target to 12 inches by 18 inches. Or call balls and strikes umpire-style and see how many strike-outs they can throw.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Throw Strikes to a Target","summary":"Pitch to a marked target and count strikes. 15 minutes. Ages 8-10 and 11-12.","sport":"baseball","ages":["8-10","11-12"],"fundamental":"pitching","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A target taped to a chain link fence at the strike zone, with a pitcher 46 feet away throwing toward the center of the target.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":true,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Pitching volume drill; flagged sensitive for arm care and pitch counts."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-throw-strikes-target.md";
				const url = undefined;
				function rawContent() {
					return "\nPitching is throwing strikes. A pitcher who can't throw strikes can't pitch. This drill puts a target on a fence at strike zone height and asks the kid to hit it. Track and tell. The score is the motivator.\n\n**What you need:** 15 baseballs, a fence or net, masking tape or paint to mark a strike zone, a pitching mound or flat marker.\n\n**Setup:** Mark a strike zone on a fence: 18 inches wide, 24 inches tall, bottom edge at knee height for a typical batter. Pitcher 46 feet away.\n\n**How to run it:**\n\n1. Cue: Set, Lift, Stride, Throw.\n2. Pitcher throws 10 pitches at the target. Count strikes.\n3. After 10, tell them the count. Goal: 6 of 10.\n4. Take a 1-minute break. Throw 10 more.\n5. Last round: aim for specific corners (top-left, bottom-right). Now placement matters, not just hitting the zone.\n\n**What to watch:** Are they slowing down to hit the target? Some kids ease up to throw strikes. Strikes need to be at full speed. Slow strikes are still slow.\n\n**If they're struggling:** Make the target bigger. Move the mound closer.\n\n**If they've got it:** Shrink the target to 12 inches by 18 inches. Or call balls and strikes umpire-style and see how many strike-outs they can throw.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
