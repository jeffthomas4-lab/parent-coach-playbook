globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Free throws are the only unguarded shot in basketball. Building a routine early creates confidence. The NBA line is 15 feet. Youth often shoots from 12-13 feet depending on age and league rules.</p>\n<p><strong>What you need:</strong> Basketball. Free throw line (or mark one 12-13 feet from the basket for youth). Flat court.</p>\n<p><strong>Setup:</strong> Kids shoot from the free throw line one at a time.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Establish a routine. Bounce the ball 3 times. Take a deep breath. Look at the rim.</li>\n<li>Cue: Set, Bend, Lift, Cookie. Feet shoulder-width apart. Knees bend. Lift the ball. Finish with cookie jar.</li>\n<li>Shoot 10 free throws. Track makes and misses.</li>\n<li>Rest 60 seconds. Do 2 more sets of 10.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the routine stay exactly the same for every shot? Consistency is the point. The routine is a mental reset.</p>\n<p><strong>If they’re struggling:</strong> Move to 10 feet. Reduce to 5 free throws per set. Check form (Set, Bend, Lift, Cookie).</p>\n<p><strong>If they’ve got it:</strong> Track the percentage. Aim for 8 out of 10. Next week, beat that number.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Free Throw Routine","summary":"Shoot free throws from the line with a consistent routine. 10 minutes. Ages 8-10.","sport":"basketball","ages":["8-10"],"fundamental":"shooting","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A young player at the free throw line in a ready stance, about to shoot.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Cites NBA 15 ft and youth 12-13 ft, league varies."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-free-throw-routine.md";
				const url = undefined;
				function rawContent() {
					return "\nFree throws are the only unguarded shot in basketball. Building a routine early creates confidence. The NBA line is 15 feet. Youth often shoots from 12-13 feet depending on age and league rules.\n\n**What you need:** Basketball. Free throw line (or mark one 12-13 feet from the basket for youth). Flat court.\n\n**Setup:** Kids shoot from the free throw line one at a time.\n\n**How to run it:**\n\n1. Establish a routine. Bounce the ball 3 times. Take a deep breath. Look at the rim.\n2. Cue: Set, Bend, Lift, Cookie. Feet shoulder-width apart. Knees bend. Lift the ball. Finish with cookie jar.\n3. Shoot 10 free throws. Track makes and misses.\n4. Rest 60 seconds. Do 2 more sets of 10.\n\n**What to watch:** Does the routine stay exactly the same for every shot? Consistency is the point. The routine is a mental reset.\n\n**If they're struggling:** Move to 10 feet. Reduce to 5 free throws per set. Check form (Set, Bend, Lift, Cookie).\n\n**If they've got it:** Track the percentage. Aim for 8 out of 10. Next week, beat that number.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
