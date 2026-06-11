globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The charge is an advanced defensive play. The defender sets their feet in the path of the driver. The driver has to run into them. This is legal defense when done correctly.</p>\n<p><strong>What you need:</strong> Basketball. Two kids per rep (driver and defender). Half-court or full court.</p>\n<p><strong>Setup:</strong> Defender stands at the free throw line. Driver about 20 feet away with the ball.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Stance, Slide, Mirror, Hands.</li>\n<li>Driver attacks toward the defender.</li>\n<li>Defender plants both feet firmly and gets in a low stance. Chest out. Hands behind the back (so the ref knows they didn’t reach).</li>\n<li>Driver must go around or stop. If they run into the defender, it’s an offensive foul.</li>\n<li>Do 5 reps. Then switch roles.</li>\n</ol>\n<p><strong>What to watch:</strong> Are the defender’s feet set before the driver arrives? Feet must be set. If the defender is still moving, it’s a foul on the defense.</p>\n<p><strong>If they’re struggling:</strong> Have the driver slow down so the defender has time to set feet. Do just 3 reps.</p>\n<p><strong>If they’ve got it:</strong> Driver goes at full speed. Defender must react quickly and set feet.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Take Charge Position","summary":"Learn to set feet in the charge position on a drive. 9 minutes. Ages 11-12.","sport":"basketball","ages":["11-12"],"fundamental":"defending","progression":"refine","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A young defender standing with feet set, knees bent, hands behind their back as an offensive player drives toward them.","editorial":{"qualityGrade":6,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":true,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Flagged sensitive: charge drills at age 11-12 carry collision risk. Consider adding a safety note that contact should be at controlled speeds, and that many youth leagues discourage teaching the charge. Lead has four sentences."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-take-charge-position.md";
				const url = undefined;
				function rawContent() {
					return "\nThe charge is an advanced defensive play. The defender sets their feet in the path of the driver. The driver has to run into them. This is legal defense when done correctly.\n\n**What you need:** Basketball. Two kids per rep (driver and defender). Half-court or full court.\n\n**Setup:** Defender stands at the free throw line. Driver about 20 feet away with the ball.\n\n**How to run it:**\n\n1. Cue: Stance, Slide, Mirror, Hands.\n2. Driver attacks toward the defender.\n3. Defender plants both feet firmly and gets in a low stance. Chest out. Hands behind the back (so the ref knows they didn't reach).\n4. Driver must go around or stop. If they run into the defender, it's an offensive foul.\n5. Do 5 reps. Then switch roles.\n\n**What to watch:** Are the defender's feet set before the driver arrives? Feet must be set. If the defender is still moving, it's a foul on the defense.\n\n**If they're struggling:** Have the driver slow down so the defender has time to set feet. Do just 3 reps.\n\n**If they've got it:** Driver goes at full speed. Defender must react quickly and set feet.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
