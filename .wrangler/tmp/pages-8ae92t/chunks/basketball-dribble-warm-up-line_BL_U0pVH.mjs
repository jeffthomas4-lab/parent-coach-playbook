globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Practice starts with the ball in their hands. The dribble warm-up gets the muscles working, the eyes up, and the brain ready before any structured drill. Six minutes, lots of touches.</p>\n<p><strong>What you need:</strong> A basketball for each kid. A full or half court.</p>\n<p><strong>Setup:</strong> Kids in a line on the baseline, each with a ball. Cones at the opposite baseline mark the turn.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>First trip: walking dribble with right hand to the far baseline, left hand back. Eyes up.</li>\n<li>Second trip: jogging dribble. Same hand pattern.</li>\n<li>Third trip: skip dribble (skip step plus dribble). Both hands.</li>\n<li>Fourth trip: backwards dribble (walking backward while dribbling).</li>\n<li>Fifth trip: full speed dribble. Then water break.</li>\n</ol>\n<p><strong>What to watch:</strong> Eyes up. Most kids will look at the ball. Tell them to look at the back of the kid in front of them.</p>\n<p><strong>If they’re struggling:</strong> Use a smaller ball (junior size 25 or 27). Slow the pace.</p>\n<p><strong>If they’ve got it:</strong> Add a crossover at half court on each trip. Or have them dribble two balls at once.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/go/agility-cones/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Agility cones →</a> — for lane markers, footwork guides, and drills.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Dribble Warm-Up Line","summary":"Dribble up and back across the court as a warm-up. 6 minutes. Ages 5-7 and 8-10.","sport":"basketball","ages":["5-7","8-10"],"fundamental":"warm-up","progression":"intro","focus":"warm-up","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A line of children dribbling basketballs from one baseline to the other, each in their own lane, eyes up.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"'Look at the back of the kid in front of them' is a sticky concrete cue."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-dribble-warm-up-line.md";
				const url = undefined;
				function rawContent() {
					return "\nPractice starts with the ball in their hands. The dribble warm-up gets the muscles working, the eyes up, and the brain ready before any structured drill. Six minutes, lots of touches.\n\n**What you need:** A basketball for each kid. A full or half court.\n\n**Setup:** Kids in a line on the baseline, each with a ball. Cones at the opposite baseline mark the turn.\n\n**How to run it:**\n\n1. First trip: walking dribble with right hand to the far baseline, left hand back. Eyes up.\n2. Second trip: jogging dribble. Same hand pattern.\n3. Third trip: skip dribble (skip step plus dribble). Both hands.\n4. Fourth trip: backwards dribble (walking backward while dribbling).\n5. Fifth trip: full speed dribble. Then water break.\n\n**What to watch:** Eyes up. Most kids will look at the ball. Tell them to look at the back of the kid in front of them.\n\n**If they're struggling:** Use a smaller ball (junior size 25 or 27). Slow the pace.\n\n**If they've got it:** Add a crossover at half court on each trip. Or have them dribble two balls at once.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Agility cones →](/go/agility-cones/) — for lane markers, footwork guides, and drills.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
