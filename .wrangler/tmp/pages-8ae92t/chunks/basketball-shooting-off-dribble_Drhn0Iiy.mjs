globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Pull-up shooting is how guards score in games. This drill teaches the rhythm of dribble-to-stop-to-shoot. The key is the stop (plant feet) before the shot.</p>\n<p><strong>What you need:</strong> Basketball. Half-court. Cones to mark pull-up spots.</p>\n<p><strong>Setup:</strong> Mark four spots at mid-range (12-15 feet) in different directions from the key.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Start at the baseline. Dribble hard to the first spot (right wing).</li>\n<li>Plant your feet (both land at the same time). This is the stop.</li>\n<li>Shoot off the stop immediately. No hesitation.</li>\n<li>Do 4 pull-up shots (one at each spot). Rest. Do 2 rounds.</li>\n</ol>\n<p><strong>What to watch:</strong> Do they plant both feet or does one foot arrive first? Both feet landing together means they’re ready to shoot immediately.</p>\n<p><strong>If they’re struggling:</strong> Move spots closer to 10 feet. Slow the dribble approach. Do just 2 spots instead of 4.</p>\n<p><strong>If they’ve got it:</strong> Add a defender playing soft pressure. The shooter must still get their shot off clean from the plant.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/go/agility-cones/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Agility cones →</a> — for lane markers, footwork guides, and drills.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Shooting Off Dribble","summary":"Dribble then shoot without a pause. 10 minutes. Ages 11-12.","sport":"basketball","ages":["11-12"],"fundamental":"shooting","progression":"refine","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A young player dribbling to a spot, then pulling up to shoot mid-range.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Pull-up shooting drill, clear cues, sport language correct."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-shooting-off-dribble.md";
				const url = undefined;
				function rawContent() {
					return "\nPull-up shooting is how guards score in games. This drill teaches the rhythm of dribble-to-stop-to-shoot. The key is the stop (plant feet) before the shot.\n\n**What you need:** Basketball. Half-court. Cones to mark pull-up spots.\n\n**Setup:** Mark four spots at mid-range (12-15 feet) in different directions from the key.\n\n**How to run it:**\n\n1. Start at the baseline. Dribble hard to the first spot (right wing).\n2. Plant your feet (both land at the same time). This is the stop.\n3. Shoot off the stop immediately. No hesitation.\n4. Do 4 pull-up shots (one at each spot). Rest. Do 2 rounds.\n\n**What to watch:** Do they plant both feet or does one foot arrive first? Both feet landing together means they're ready to shoot immediately.\n\n**If they're struggling:** Move spots closer to 10 feet. Slow the dribble approach. Do just 2 spots instead of 4.\n\n**If they've got it:** Add a defender playing soft pressure. The shooter must still get their shot off clean from the plant.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Agility cones →](/go/agility-cones/) — for lane markers, footwork guides, and drills.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
