globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>When a kid throws from one knee, the legs can’t help and the lower body can’t cheat. The drill forces the upper body, shoulder, and arm to do the work the right way. This is how you fix arm-only throwers.</p>\n<p><strong>What you need:</strong> 5 baseballs, a glove, a partner.</p>\n<p><strong>Setup:</strong> Both kids kneel on their throwing-side knee with the front leg bent in front. They face each other 15 feet apart.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Demonstrate: throwing-side knee on the ground, front knee up, glove arm pointing at the target, throwing arm up in an L shape behind the ear.</li>\n<li>Cue: Point, Fire. Turn and Shuffle don’t apply on the knee.</li>\n<li>Have them throw 5 to each other slowly. The ball should come out over the top of the head, not from the side.</li>\n<li>Reset and do 5 more focusing on the follow-through. After release, the throwing hand should finish across the body near the opposite knee.</li>\n<li>Last round: 5 throws at full speed.</li>\n</ol>\n<p><strong>What to watch:</strong> The follow-through. If the throwing hand stops at the chest, it’s an arm throw. The hand has to finish past the opposite knee. That’s the sign the shoulder rotated.</p>\n<p><strong>If they’re struggling:</strong> Move closer to 10 feet. Slow down the throws.</p>\n<p><strong>If they’ve got it:</strong> Add a target on the wall behind the partner. They aim for the target, not the partner’s chest.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Knee Throwing","summary":"Throw from one knee to isolate the upper body. 10 minutes. Ages 8-10.","sport":"baseball","ages":["8-10"],"fundamental":"throwing","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Two children kneeling on the throwing-side knee 15 feet apart, throwing a baseball back and forth in clean overhand form.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":true,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Throwing mechanics; arm-care adjacent."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-knee-throwing.md";
				const url = undefined;
				function rawContent() {
					return "\nWhen a kid throws from one knee, the legs can't help and the lower body can't cheat. The drill forces the upper body, shoulder, and arm to do the work the right way. This is how you fix arm-only throwers.\n\n**What you need:** 5 baseballs, a glove, a partner.\n\n**Setup:** Both kids kneel on their throwing-side knee with the front leg bent in front. They face each other 15 feet apart.\n\n**How to run it:**\n\n1. Demonstrate: throwing-side knee on the ground, front knee up, glove arm pointing at the target, throwing arm up in an L shape behind the ear.\n2. Cue: Point, Fire. Turn and Shuffle don't apply on the knee.\n3. Have them throw 5 to each other slowly. The ball should come out over the top of the head, not from the side.\n4. Reset and do 5 more focusing on the follow-through. After release, the throwing hand should finish across the body near the opposite knee.\n5. Last round: 5 throws at full speed.\n\n**What to watch:** The follow-through. If the throwing hand stops at the chest, it's an arm throw. The hand has to finish past the opposite knee. That's the sign the shoulder rotated.\n\n**If they're struggling:** Move closer to 10 feet. Slow down the throws.\n\n**If they've got it:** Add a target on the wall behind the partner. They aim for the target, not the partner's chest.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
