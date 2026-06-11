globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Young kids need to feel like they belong to something. A simple closing ritual builds that feeling and gives them a memory of team.</p>\n<p><strong>Equipment needed:</strong> Nothing.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Circle up after the final drill (while kids are still standing).</li>\n<li>Pick one kid to share one good thing they saw today. One sentence: “I liked when Sarah passed to me” or “I worked hard on the corner kicks.”</li>\n<li>Coach adds one genuine observation: “I saw lots of effort. I saw kids helping each other.”</li>\n<li>Everyone puts a hand in the middle and says the team name, school, or a simple chant (“1-2-3, Team!”).</li>\n<li>Kids walk off with that shared moment.</li>\n</ol>\n<p><strong>What to look for:</strong></p>\n<p>Kids should feel included in the ritual, not rushed through it. If a kid is staring at the ground or looks uncomfortable, don’t force them to speak. The ritual should take 2 minutes max, or kids lose interest. The observation should be genuine. If you’re making up good things that didn’t happen, kids hear the fake note and the ritual stops mattering.</p>\n<p><strong>Variation:</strong> Rotate which kid gets to share each week. By practice 6, every kid has had a turn. Pin a small chant card to the bag so they know the words.</p>\n<p><strong>If they’re struggling:</strong> Cut step 2 and let the coach speak only. Get the chant in, get the hands in, send them home.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/agility-cones/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Agility cones →</a> — flat disc cones for any field drill.</p>\n<p><a href=\"/what-to-buy/training-gear/\">Full multi sport gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"The Practice-Ending Culture Moment","summary":"End practice with a brief ritual that builds team identity. 2 minutes.","sport":"multi-sport","ages":["5-7"],"focus":"culture","layer":"foundations","fundamental":"situational","progression":"intro","illustrationBrief":"A group of young children gathered together at the end of practice, participating in a simple team ritual like a chant or hand-in center.","publishedAt":"2026-01-06T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":6,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Body completed by editorial agent on 2026-05-09. Truncated original ended at 'didn\\'t happen, kids '."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/multi-sport-practice-ending-culture-moment-ages-5-7.md";
				const url = undefined;
				function rawContent() {
					return "\nYoung kids need to feel like they belong to something. A simple closing ritual builds that feeling and gives them a memory of team.\n\n**Equipment needed:** Nothing.\n\n**How to run it:**\n\n1. Circle up after the final drill (while kids are still standing).\n2. Pick one kid to share one good thing they saw today. One sentence: \"I liked when Sarah passed to me\" or \"I worked hard on the corner kicks.\"\n3. Coach adds one genuine observation: \"I saw lots of effort. I saw kids helping each other.\"\n4. Everyone puts a hand in the middle and says the team name, school, or a simple chant (\"1-2-3, Team!\").\n5. Kids walk off with that shared moment.\n\n**What to look for:**\n\nKids should feel included in the ritual, not rushed through it. If a kid is staring at the ground or looks uncomfortable, don't force them to speak. The ritual should take 2 minutes max, or kids lose interest. The observation should be genuine. If you're making up good things that didn't happen, kids hear the fake note and the ritual stops mattering.\n\n**Variation:** Rotate which kid gets to share each week. By practice 6, every kid has had a turn. Pin a small chant card to the bag so they know the words.\n\n**If they're struggling:** Cut step 2 and let the coach speak only. Get the chant in, get the hands in, send them home.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Agility cones →](/go/agility-cones/) — flat disc cones for any field drill.\n\n[Full multi sport gear guide →](/what-to-buy/training-gear/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
