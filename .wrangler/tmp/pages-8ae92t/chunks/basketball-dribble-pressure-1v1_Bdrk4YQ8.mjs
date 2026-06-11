globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Dribbling in practice is easy when nobody’s guarding you. This drill adds a defender who plays 50% effort, not full pressure. The dribbler practices reading pressure and using moves.</p>\n<p><strong>What you need:</strong> Basketball. Half-court. Open space. Two players per rep.</p>\n<p><strong>Setup:</strong> Two kids per rep. One is the dribbler. One is the defender. Start at the top of the key.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Dribbler dribbles around the half-court space. Defender plays at 50% effort, applying soft pressure but not full speed.</li>\n<li>Dribbler uses dribble moves (crossover, change of pace, pull-back) to create separation.</li>\n<li>20 seconds on. Then switch roles.</li>\n<li>Do 3 reps per player. Rest between.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the dribbler keep eyes up? Are they trying moves or just running away? Good dribbling under pressure includes reading space and executing moves.</p>\n<p><strong>If they’re struggling:</strong> Reduce to 15 seconds. Let the defender play 25% effort instead of 50%. Give more space.</p>\n<p><strong>If they’ve got it:</strong> Defender plays 75% effort. Dribbler must stay in a tight half-court space instead of the full area. Higher difficulty.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Dribble Pressure 1v1","summary":"Dribble under defensive pressure for 20 seconds. 10 minutes. Ages 11-12.","sport":"basketball","ages":["11-12"],"fundamental":"dribbling","progression":"refine","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Two young players, one dribbling and trying to create space while a defender applies pressure from the side.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Effort-percentage scaffolding (25/50/75%) is a good repeatable pattern across the basketball series."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-dribble-pressure-1v1.md";
				const url = undefined;
				function rawContent() {
					return "\nDribbling in practice is easy when nobody's guarding you. This drill adds a defender who plays 50% effort, not full pressure. The dribbler practices reading pressure and using moves.\n\n**What you need:** Basketball. Half-court. Open space. Two players per rep.\n\n**Setup:** Two kids per rep. One is the dribbler. One is the defender. Start at the top of the key.\n\n**How to run it:**\n\n1. Dribbler dribbles around the half-court space. Defender plays at 50% effort, applying soft pressure but not full speed.\n2. Dribbler uses dribble moves (crossover, change of pace, pull-back) to create separation.\n3. 20 seconds on. Then switch roles.\n4. Do 3 reps per player. Rest between.\n\n**What to watch:** Does the dribbler keep eyes up? Are they trying moves or just running away? Good dribbling under pressure includes reading space and executing moves.\n\n**If they're struggling:** Reduce to 15 seconds. Let the defender play 25% effort instead of 50%. Give more space.\n\n**If they've got it:** Defender plays 75% effort. Dribbler must stay in a tight half-court space instead of the full area. Higher difficulty.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
