globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Every junior golfer swings too fast. This drill resets the tempo.</p>\n<p><strong>Equipment needed:</strong> A 7-iron or pitching wedge, twenty balls on tees at a driving range, an alignment stick.</p>\n<p><strong>Setup:</strong> Set up at the tee with the alignment stick on the ground showing the target line.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Take the club back on a count of “one… two.”</li>\n<li>Hold for a fraction at the top — “and.”</li>\n<li>Swing through on “three.”</li>\n<li>So: “one-two-and-three.” Out loud at first.</li>\n<li>Twenty balls. Don’t think about distance. Think about tempo.</li>\n</ol>\n<p><strong>What to look for:</strong> A smooth transition at the top. If the kid is whipping the club down, they’re skipping “and.”</p>\n<p><strong>Variation:</strong> Try a slower count, “one-two-three-and-four,” for ages 8-9. Builds patience into the swing.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/agility-cones/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Agility cones →</a> — useful for alignment and target drills.</p>\n<p><a href=\"/what-to-buy/golf/\">Full golf gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Tee-Up Tempo","summary":"Slow the backswing. Match the tempo to a count. Twenty reps. Ages 8-12.","sport":"golf","age":"8-10","ages":["8-10","11-12"],"focus":"fundamentals","layer":"foundations","fundamental":"stance","progression":"intro","illustrationBrief":"A young golfer at a driving range tee, taking a slow backswing with a 7-iron in hand.","publishedAt":"2026-05-12T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":6,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-12T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Generated as part of the per-sport content baseline. Voice may need a Jeff pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/golf-tee-up-tempo.md";
				const url = undefined;
				function rawContent() {
					return "\nEvery junior golfer swings too fast. This drill resets the tempo.\n\n**Equipment needed:** A 7-iron or pitching wedge, twenty balls on tees at a driving range, an alignment stick.\n\n**Setup:** Set up at the tee with the alignment stick on the ground showing the target line.\n\n**How to run it:**\n\n1. Take the club back on a count of \"one… two.\"\n2. Hold for a fraction at the top — \"and.\"\n3. Swing through on \"three.\"\n4. So: \"one-two-and-three.\" Out loud at first.\n5. Twenty balls. Don't think about distance. Think about tempo.\n\n**What to look for:** A smooth transition at the top. If the kid is whipping the club down, they're skipping \"and.\"\n\n**Variation:** Try a slower count, \"one-two-three-and-four,\" for ages 8-9. Builds patience into the swing.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Agility cones →](/go/agility-cones/) — useful for alignment and target drills.\n\n[Full golf gear guide →](/what-to-buy/golf/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
