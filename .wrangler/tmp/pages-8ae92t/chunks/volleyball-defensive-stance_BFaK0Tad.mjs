globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Defense in volleyball is reading and reacting fast. The starting position is a low athletic stance. Lower than infield. Lower than basketball defense. The lower the stance, the easier it is to dig a hard spike.</p>\n<p><strong>What you need:</strong> Open space.</p>\n<p><strong>Setup:</strong> Kid in the back court of a volleyball court (or any open space).</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Show the stance: feet wider than shoulders, knees deeply bent (almost a squat), chest forward, hands out in front, weight on the balls of the feet.</li>\n<li>Hold for 10 seconds. Reset. 5 reps of holding the stance.</li>\n<li>Coach calls “right.” Player shuffles 2 feet right while staying in the low stance.</li>\n<li>Coach calls “left.” Player shuffles back.</li>\n<li>60 seconds of shuffling in the stance.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the stance break during shuffles? Some kids stand up to move. Stay low the whole time.</p>\n<p><strong>If they’re struggling:</strong> Reduce the depth of the stance. Or hold for shorter periods.</p>\n<p><strong>If they’ve got it:</strong> Add a tossed ball. Player has to dig from the stance without standing up.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/volleyball-volley-lite/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Volley Lite training ball →</a> — lightweight ball for beginners learning to pass.</p>\n<p><a href=\"/what-to-buy/volleyball/\">Full volleyball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Defensive Stance","summary":"Build the basic defensive position before the dig. 8 minutes. Ages 8-10.","sport":"volleyball","ages":["8-10"],"fundamental":"defending","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player in low defensive stance with feet wider than shoulders, knees deeply bent, chest forward, hands ready in front of the body.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Cross-sport stance comparison lands well. Clean foundations drill."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/volleyball-defensive-stance.md";
				const url = undefined;
				function rawContent() {
					return "\nDefense in volleyball is reading and reacting fast. The starting position is a low athletic stance. Lower than infield. Lower than basketball defense. The lower the stance, the easier it is to dig a hard spike.\n\n**What you need:** Open space.\n\n**Setup:** Kid in the back court of a volleyball court (or any open space).\n\n**How to run it:**\n\n1. Show the stance: feet wider than shoulders, knees deeply bent (almost a squat), chest forward, hands out in front, weight on the balls of the feet.\n2. Hold for 10 seconds. Reset. 5 reps of holding the stance.\n3. Coach calls \"right.\" Player shuffles 2 feet right while staying in the low stance.\n4. Coach calls \"left.\" Player shuffles back.\n5. 60 seconds of shuffling in the stance.\n\n**What to watch:** Does the stance break during shuffles? Some kids stand up to move. Stay low the whole time.\n\n**If they're struggling:** Reduce the depth of the stance. Or hold for shorter periods.\n\n**If they've got it:** Add a tossed ball. Player has to dig from the stance without standing up.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Volley Lite training ball →](/go/volleyball-volley-lite/) — lightweight ball for beginners learning to pass.\n\n[Full volleyball gear guide →](/what-to-buy/volleyball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
