globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Cold arms are injured arms. Eight minutes of progressive warm-up tosses prevents shoulder pain and gets the kid ready to actually practice. Skip this and you risk a kid who can’t throw the next day.</p>\n<p><strong>What you need:</strong> A glove for each player, 1 baseball, an open area.</p>\n<p><strong>Setup:</strong> Two players face each other 10 feet apart with gloves on.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Stage 1 (3 minutes): 10 feet apart. Easy throws. Just popping the ball back and forth.</li>\n<li>Stage 2 (3 minutes): 25 feet apart. Cue: Turn, Shuffle, Point, Fire. Half speed.</li>\n<li>Stage 3 (2 minutes): 45 feet apart. Full motion. Three-quarter speed throws. No max effort yet.</li>\n<li>Optional Stage 4 for older kids: 60 feet at full speed for 10 throws.</li>\n<li>End with both players moving back to 25 feet for a cool-down round.</li>\n</ol>\n<p><strong>What to watch:</strong> Are they rushing through to start the drill? The warm-up IS the drill for the first 8 minutes. If they cheat the warm-up, they’ll feel it later.</p>\n<p><strong>If they’re struggling:</strong> Reduce the distances. 5, 15, 25 instead of 10, 25, 45.</p>\n<p><strong>If they’ve got it:</strong> Add a long-toss element. Stage 4 at 80 feet. Or add the shuffle-step on every throw past 30 feet.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Throwing Warm-Up Progression","summary":"Three-stage throwing warm-up before any drill or game. 8 minutes. Ages 5-7, 8-10, and 11-12.","sport":"baseball","ages":["5-7","8-10","11-12"],"fundamental":"warm-up","progression":"intro","focus":"warm-up","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Two players warming up, starting close together, then mid-distance, then far apart, throwing softly at each step.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":9,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":true,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Arm-care content; flagged sensitive."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-throwing-warm-up-progression.md";
				const url = undefined;
				function rawContent() {
					return "\nCold arms are injured arms. Eight minutes of progressive warm-up tosses prevents shoulder pain and gets the kid ready to actually practice. Skip this and you risk a kid who can't throw the next day.\n\n**What you need:** A glove for each player, 1 baseball, an open area.\n\n**Setup:** Two players face each other 10 feet apart with gloves on.\n\n**How to run it:**\n\n1. Stage 1 (3 minutes): 10 feet apart. Easy throws. Just popping the ball back and forth.\n2. Stage 2 (3 minutes): 25 feet apart. Cue: Turn, Shuffle, Point, Fire. Half speed.\n3. Stage 3 (2 minutes): 45 feet apart. Full motion. Three-quarter speed throws. No max effort yet.\n4. Optional Stage 4 for older kids: 60 feet at full speed for 10 throws.\n5. End with both players moving back to 25 feet for a cool-down round.\n\n**What to watch:** Are they rushing through to start the drill? The warm-up IS the drill for the first 8 minutes. If they cheat the warm-up, they'll feel it later.\n\n**If they're struggling:** Reduce the distances. 5, 15, 25 instead of 10, 25, 45.\n\n**If they've got it:** Add a long-toss element. Stage 4 at 80 feet. Or add the shuffle-step on every throw past 30 feet.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
