globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Dribbling control improves when kids have to do it under pressure. Dribble tag forces them to keep the ball while being chased.</p>\n<p><strong>Equipment needed:</strong> One basketball per child (or one per two kids in rotation), a 30-by-30-foot space marked with cones.</p>\n<p><strong>Setup:</strong> Mark a square. All kids enter with a ball except one kid who is “it.”</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>The kid who is “it” tries to tag another kid.</li>\n<li>All other kids dribble their balls around the square, trying not to get tagged.</li>\n<li>If you’re tagged, you become “it.”</li>\n<li>Play for 10 minutes.</li>\n</ol>\n<p><strong>What to look for:</strong> Dribble control while moving fast. Kids who look at the ball will bump into people. Kids who keep their eyes up will see the tagger coming.</p>\n<p><strong>If they’re struggling:</strong> Shrink the square to 20 by 20 feet so taggers are easier to spot. Allow a two-hand carry once per round if they lose the ball.</p>\n<p><strong>If they’ve got it:</strong> Add a second tagger. Or shrink the square so traffic is denser and dribblers must change direction more often.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/go/agility-cones/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Agility cones →</a> — for lane markers, footwork guides, and drills.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Dribble Tag","summary":"Tag game while dribbling a ball. 12 minutes. Ages 5-7.","sport":"basketball","ages":["5-7"],"focus":"fundamentals","layer":"foundations","fundamental":"dribbling","progression":"intro","illustrationBrief":"A young child dribbling a basketball while another child chases them, both moving in an open court area.","publishedAt":"2026-01-13T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Fixed yards to feet on basketball court. Body had been truncated; completed with struggle/got-it tiers."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-dribble-tag-ages-5-7.md";
				const url = undefined;
				function rawContent() {
					return "\nDribbling control improves when kids have to do it under pressure. Dribble tag forces them to keep the ball while being chased.\n\n**Equipment needed:** One basketball per child (or one per two kids in rotation), a 30-by-30-foot space marked with cones.\n\n**Setup:** Mark a square. All kids enter with a ball except one kid who is \"it.\"\n\n**How to run it:**\n\n1. The kid who is \"it\" tries to tag another kid.\n2. All other kids dribble their balls around the square, trying not to get tagged.\n3. If you're tagged, you become \"it.\"\n4. Play for 10 minutes.\n\n**What to look for:** Dribble control while moving fast. Kids who look at the ball will bump into people. Kids who keep their eyes up will see the tagger coming.\n\n**If they're struggling:** Shrink the square to 20 by 20 feet so taggers are easier to spot. Allow a two-hand carry once per round if they lose the ball.\n\n**If they've got it:** Add a second tagger. Or shrink the square so traffic is denser and dribblers must change direction more often.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Agility cones →](/go/agility-cones/) — for lane markers, footwork guides, and drills.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
