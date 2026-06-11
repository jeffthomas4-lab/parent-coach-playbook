globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A pitcher’s arm has to be warm before they throw a single pitch. Cold arms get hurt. Two minutes of arm circles and a five-minute easy catch warms the shoulder enough to handle 30 pitches. Skip this and you’re playing with an injury risk.</p>\n<p><strong>What you need:</strong> Open space. A baseball and partner for the catch portion.</p>\n<p><strong>Setup:</strong> Kid stands with arms loose at the sides.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Slow forward circles: 10 reps each arm. Big slow circles.</li>\n<li>Slow backward circles: 10 reps each arm.</li>\n<li>Faster forward circles: 10 reps each arm.</li>\n<li>Cross-body arm swings: hug yourself with each arm 10 times.</li>\n<li>Light catch with partner from 10 feet, 6 throws each. Then 20 feet, 6 throws each. Then 30 feet, 6 throws each.</li>\n</ol>\n<p><strong>What to watch:</strong> Are they actually warming up or rushing through? The slow circles should be slow. The fast circles should be fast. Both have a purpose.</p>\n<p><strong>If they’re struggling:</strong> Reduce the rep count. 5 of each instead of 10.</p>\n<p><strong>If they’ve got it:</strong> Add resistance bands for shoulder activation before the circles. Same drill, more strength work built in.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Pitcher Arm Circle Warm-Up","summary":"Warm up the throwing arm before pitching. 8 minutes. Ages 8-10.","sport":"baseball","ages":["8-10"],"fundamental":"pitching","progression":"intro","focus":"warm-up","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A young pitcher swinging the throwing arm in a slow circle, then in faster circles, with the glove arm relaxed at the side.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":true,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Touches arm-care safety. Clean voice. Specific rep counts and distances are good."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-arm-circle-warm-up.md";
				const url = undefined;
				function rawContent() {
					return "\nA pitcher's arm has to be warm before they throw a single pitch. Cold arms get hurt. Two minutes of arm circles and a five-minute easy catch warms the shoulder enough to handle 30 pitches. Skip this and you're playing with an injury risk.\n\n**What you need:** Open space. A baseball and partner for the catch portion.\n\n**Setup:** Kid stands with arms loose at the sides.\n\n**How to run it:**\n\n1. Slow forward circles: 10 reps each arm. Big slow circles.\n2. Slow backward circles: 10 reps each arm.\n3. Faster forward circles: 10 reps each arm.\n4. Cross-body arm swings: hug yourself with each arm 10 times.\n5. Light catch with partner from 10 feet, 6 throws each. Then 20 feet, 6 throws each. Then 30 feet, 6 throws each.\n\n**What to watch:** Are they actually warming up or rushing through? The slow circles should be slow. The fast circles should be fast. Both have a purpose.\n\n**If they're struggling:** Reduce the rep count. 5 of each instead of 10.\n\n**If they've got it:** Add resistance bands for shoulder activation before the circles. Same drill, more strength work built in.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
