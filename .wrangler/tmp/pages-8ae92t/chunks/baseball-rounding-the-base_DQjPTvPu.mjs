globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>When a runner is going to second on a hit, they can’t run a straight line to first and then make a 90-degree turn. They have to round the bag. The path curves out before the base and back in to touch the inside corner. This is the “round” turn.</p>\n<p><strong>What you need:</strong> Bases at first, second. Cones to mark the path.</p>\n<p><strong>Setup:</strong> Set a cone 10 feet outside the foul line, halfway between home and first. The runner has to get to the cone before the bag.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Eyes, Drive, Touch, Brake. Drive becomes “drive through the cone first.”</li>\n<li>Runner starts at home. They sprint toward first but curve out to touch the cone first.</li>\n<li>From the cone, they cut in to the inside corner of first base.</li>\n<li>They keep running toward second after the touch.</li>\n<li>Do 6 reps. Time each one.</li>\n</ol>\n<p><strong>What to watch:</strong> Are they running through the cone or cutting it short? The wider angle costs a step but lets them turn the corner without slowing. Cutting it short means they have to slow down to turn.</p>\n<p><strong>If they’re struggling:</strong> Walk through the path. Use chalk to mark the curve.</p>\n<p><strong>If they’ve got it:</strong> Add the second base. Round first, decide whether to continue to second based on a coach’s “go” or “stop.”</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/go/agility-cones/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Agility cones →</a> — for setup, base paths, and field drills.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Rounding the Base","summary":"Take a wide angle into the base, hit the inside corner, and continue. 12 minutes. Ages 8-10 and 11-12.","sport":"baseball","ages":["8-10","11-12"],"fundamental":"base-running","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Top-down view of a runner taking a curved path approaching first base, swinging wide before the bag and cutting in to touch the inside corner.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-rounding-the-base.md";
				const url = undefined;
				function rawContent() {
					return "\nWhen a runner is going to second on a hit, they can't run a straight line to first and then make a 90-degree turn. They have to round the bag. The path curves out before the base and back in to touch the inside corner. This is the \"round\" turn.\n\n**What you need:** Bases at first, second. Cones to mark the path.\n\n**Setup:** Set a cone 10 feet outside the foul line, halfway between home and first. The runner has to get to the cone before the bag.\n\n**How to run it:**\n\n1. Cue: Eyes, Drive, Touch, Brake. Drive becomes \"drive through the cone first.\"\n2. Runner starts at home. They sprint toward first but curve out to touch the cone first.\n3. From the cone, they cut in to the inside corner of first base.\n4. They keep running toward second after the touch.\n5. Do 6 reps. Time each one.\n\n**What to watch:** Are they running through the cone or cutting it short? The wider angle costs a step but lets them turn the corner without slowing. Cutting it short means they have to slow down to turn.\n\n**If they're struggling:** Walk through the path. Use chalk to mark the curve.\n\n**If they've got it:** Add the second base. Round first, decide whether to continue to second based on a coach's \"go\" or \"stop.\"\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[Agility cones →](/go/agility-cones/) — for setup, base paths, and field drills.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
