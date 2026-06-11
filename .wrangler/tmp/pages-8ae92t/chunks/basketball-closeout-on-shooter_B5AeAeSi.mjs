globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The closeout is when you run to contest a shooter who just caught the ball. This drill teaches the final steps and hand positioning to contest without fouling.</p>\n<p><strong>What you need:</strong> Basketball. Two kids per pair (defender and shooter). Half-court.</p>\n<p><strong>Setup:</strong> Shooter stands on the wing 15 feet from the basket. Defender starts at the baseline 15 feet away.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Stance, Slide, Mirror, Hands.</li>\n<li>Passer passes to the shooter. Defender immediately sprints to the shooter.</li>\n<li>As the defender gets close (last 2 steps), they plant feet and get in stance.</li>\n<li>Hands go up but don’t reach. Contest the shot, don’t foul.</li>\n<li>Shooter takes the shot. Defender retreats.</li>\n<li>Do 5 closeouts per defender. Rest. Rotate.</li>\n</ol>\n<p><strong>What to watch:</strong> Do they get into stance before the shot or are they still moving forward? The last 2 steps are the plant and stance. If they’re still moving, they’ll foul.</p>\n<p><strong>If they’re struggling:</strong> Start the defender closer (5 feet away). Slow the pace. Just focus on the final stance without the sprint.</p>\n<p><strong>If they’ve got it:</strong> Shooter can shoot or pass out. Defender must adjust to either.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Closeout On Shooter","summary":"Sprint to a shooter and contest without fouling. 10 minutes. Ages 8-10.","sport":"basketball","ages":["8-10"],"fundamental":"defending","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A young defender sprinting to close out on a shooter, hands up but not reaching, feet in stance.","editorial":{"qualityGrade":8,"originalityGrade":6,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Last-two-steps plant cue is the right teach. 'Don't reach' keeps it foul-aware."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-closeout-on-shooter.md";
				const url = undefined;
				function rawContent() {
					return "\nThe closeout is when you run to contest a shooter who just caught the ball. This drill teaches the final steps and hand positioning to contest without fouling.\n\n**What you need:** Basketball. Two kids per pair (defender and shooter). Half-court.\n\n**Setup:** Shooter stands on the wing 15 feet from the basket. Defender starts at the baseline 15 feet away.\n\n**How to run it:**\n\n1. Cue: Stance, Slide, Mirror, Hands.\n2. Passer passes to the shooter. Defender immediately sprints to the shooter.\n3. As the defender gets close (last 2 steps), they plant feet and get in stance.\n4. Hands go up but don't reach. Contest the shot, don't foul.\n5. Shooter takes the shot. Defender retreats.\n6. Do 5 closeouts per defender. Rest. Rotate.\n\n**What to watch:** Do they get into stance before the shot or are they still moving forward? The last 2 steps are the plant and stance. If they're still moving, they'll foul.\n\n**If they're struggling:** Start the defender closer (5 feet away). Slow the pace. Just focus on the final stance without the sprint.\n\n**If they've got it:** Shooter can shoot or pass out. Defender must adjust to either.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
