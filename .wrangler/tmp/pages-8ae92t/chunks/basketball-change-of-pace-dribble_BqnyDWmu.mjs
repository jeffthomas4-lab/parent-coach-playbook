globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Change of pace makes the defender commit to a wrong speed. You go fast, they react fast, you go slow and leave them behind. This drill teaches the feel for tempo changes while dribbling.</p>\n<p><strong>What you need:</strong> Basketball. Full court or half-court. Open baseline.</p>\n<p><strong>Setup:</strong> Kids line up at the baseline. Each runs the length of the court with a dribble.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Start at the baseline. Dribble at half-speed (walk pace) for 10 feet.</li>\n<li>Suddenly accelerate to full speed for 15 feet. Ball stays in front, bounces higher.</li>\n<li>Suddenly slow down to half-speed again for 10 feet.</li>\n<li>Accelerate to full speed for the final 15 feet to the baseline.</li>\n<li>Do 2 reps. Rest. Do another set.</li>\n</ol>\n<p><strong>What to watch:</strong> Do they actually slow down or just keep cruising? Real change of pace means they look like they’re stopping. That’s when a defender gets caught.</p>\n<p><strong>If they’re struggling:</strong> Use cones to mark the speed change zones so they know exactly where to shift tempo. Practice 3 tempo changes instead of 4.</p>\n<p><strong>If they’ve got it:</strong> Add decision making. Tell them to explode when you clap. Slow when you’re silent. Keeps them reacting instead of following a set pattern.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/go/agility-cones/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Agility cones →</a> — for lane markers, footwork guides, and drills.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Change of Pace Dribble","summary":"Dribble fast then slow then fast to create space. 10 minutes. Ages 11-12.","sport":"basketball","ages":["11-12"],"fundamental":"dribbling","progression":"refine","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A young player dribbling at speed for a few steps, then slowing down suddenly, then accelerating again.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clap-cue progression is a nice touch. 'Real change of pace means they look like they're stopping' is a sticky cue."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-change-of-pace-dribble.md";
				const url = undefined;
				function rawContent() {
					return "\nChange of pace makes the defender commit to a wrong speed. You go fast, they react fast, you go slow and leave them behind. This drill teaches the feel for tempo changes while dribbling.\n\n**What you need:** Basketball. Full court or half-court. Open baseline.\n\n**Setup:** Kids line up at the baseline. Each runs the length of the court with a dribble.\n\n**How to run it:**\n\n1. Start at the baseline. Dribble at half-speed (walk pace) for 10 feet.\n2. Suddenly accelerate to full speed for 15 feet. Ball stays in front, bounces higher.\n3. Suddenly slow down to half-speed again for 10 feet.\n4. Accelerate to full speed for the final 15 feet to the baseline.\n5. Do 2 reps. Rest. Do another set.\n\n**What to watch:** Do they actually slow down or just keep cruising? Real change of pace means they look like they're stopping. That's when a defender gets caught.\n\n**If they're struggling:** Use cones to mark the speed change zones so they know exactly where to shift tempo. Practice 3 tempo changes instead of 4.\n\n**If they've got it:** Add decision making. Tell them to explode when you clap. Slow when you're silent. Keeps them reacting instead of following a set pattern.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Agility cones →](/go/agility-cones/) — for lane markers, footwork guides, and drills.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
