globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Spot shooting builds range and consistency. The spots are baseline, wing, top of key, other wing, and baseline other side. All about the same distance. Shooting five spots teaches game positioning.</p>\n<p><strong>What you need:</strong> Basketball. Five cones marking the five spots. Flat half-court.</p>\n<p><strong>Setup:</strong> Mark five spots 12 feet from the basket in a semi-circle (baseline, wing, top, wing, baseline).</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Set, Bend, Lift, Cookie.</li>\n<li>Start at spot 1 (baseline). Shoot 3 shots.</li>\n<li>Move to spot 2 (wing). Shoot 3 shots.</li>\n<li>Continue clockwise through all 5 spots. That’s 15 shots total.</li>\n<li>Rest 60 seconds. Do 2 rounds.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the form stay consistent at each distance or do they adjust? The form should be the same. The only variable is distance, not technique.</p>\n<p><strong>If they’re struggling:</strong> Move closer to 10 feet. Reduce to 2 shots per spot. Do 3 spots instead of 5.</p>\n<p><strong>If they’ve got it:</strong> Move back to 15 feet. Time them. Track makes vs. attempts. Adds scoring to the drill.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/go/agility-cones/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Agility cones →</a> — for lane markers, footwork guides, and drills.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Spot Shooting Five Spots","summary":"Shoot from five different spots on the court. 12 minutes. Ages 8-10.","sport":"basketball","ages":["8-10"],"fundamental":"shooting","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A young player shooting from the wing, one of five shooting spots around the arc.","editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Standard five-spot drill. Lead paragraph has four sentences."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-spot-shooting-five-spots.md";
				const url = undefined;
				function rawContent() {
					return "\nSpot shooting builds range and consistency. The spots are baseline, wing, top of key, other wing, and baseline other side. All about the same distance. Shooting five spots teaches game positioning.\n\n**What you need:** Basketball. Five cones marking the five spots. Flat half-court.\n\n**Setup:** Mark five spots 12 feet from the basket in a semi-circle (baseline, wing, top, wing, baseline).\n\n**How to run it:**\n\n1. Cue: Set, Bend, Lift, Cookie.\n2. Start at spot 1 (baseline). Shoot 3 shots.\n3. Move to spot 2 (wing). Shoot 3 shots.\n4. Continue clockwise through all 5 spots. That's 15 shots total.\n5. Rest 60 seconds. Do 2 rounds.\n\n**What to watch:** Does the form stay consistent at each distance or do they adjust? The form should be the same. The only variable is distance, not technique.\n\n**If they're struggling:** Move closer to 10 feet. Reduce to 2 shots per spot. Do 3 spots instead of 5.\n\n**If they've got it:** Move back to 15 feet. Time them. Track makes vs. attempts. Adds scoring to the drill.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Agility cones →](/go/agility-cones/) — for lane markers, footwork guides, and drills.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
