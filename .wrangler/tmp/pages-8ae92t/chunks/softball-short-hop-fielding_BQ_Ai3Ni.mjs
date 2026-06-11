globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A short hop is the trickiest ground ball. The ball bounces right in front of the fielder. They have to time the catch perfectly or the ball skips off the glove.</p>\n<p><strong>What you need:</strong> 20 softballs (12”), a partner at 15 feet, a glove.</p>\n<p><strong>Setup:</strong> Partner stands 15 feet away. Fielder in ready position.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Partner rolls the ball hard enough that it bounces 2 feet in front of the fielder.</li>\n<li>Fielder waits for the apex of the bounce, then Drop, Show, and catch in the glove.</li>\n<li>Do 5 short-hop grounders straight ahead. Reset each time.</li>\n<li>Do 5 short-hop grounders to the forehand. Do 5 to the backhand.</li>\n<li>After the catch, throw the ball back to the partner.</li>\n</ol>\n<p><strong>What to watch:</strong> Do they start the drop early or wait for the bounce? Wait too long and they miss. Wait too early and the ball hits them.</p>\n<p><strong>If they’re struggling:</strong> Have the partner roll slower so the bounce is higher. Stay at 15 feet.</p>\n<p><strong>If they’ve got it:</strong> Roll from 20 feet. Mix short-hop with regular ground balls and fly balls in random order.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/softball-glove-11in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth softball glove →</a> — 11-inch fielder’s glove for new players.</p>\n<p><a href=\"/what-to-buy/softball/\">Full softball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Short Hop Fielding","summary":"Field a ball right after the bounce. 12 minutes. Ages 11-12.","sport":"softball","ages":["11-12"],"fundamental":"fielding","progression":"refine","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player bending low to field a grounder that has just bounced off the ground, catching it in mid-hop.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Solid short-hop progression; ball terminology corrected."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/softball-short-hop-fielding.md";
				const url = undefined;
				function rawContent() {
					return "\nA short hop is the trickiest ground ball. The ball bounces right in front of the fielder. They have to time the catch perfectly or the ball skips off the glove.\n\n**What you need:** 20 softballs (12\"), a partner at 15 feet, a glove.\n\n**Setup:** Partner stands 15 feet away. Fielder in ready position.\n\n**How to run it:**\n\n1. Partner rolls the ball hard enough that it bounces 2 feet in front of the fielder.\n2. Fielder waits for the apex of the bounce, then Drop, Show, and catch in the glove.\n3. Do 5 short-hop grounders straight ahead. Reset each time.\n4. Do 5 short-hop grounders to the forehand. Do 5 to the backhand.\n5. After the catch, throw the ball back to the partner.\n\n**What to watch:** Do they start the drop early or wait for the bounce? Wait too long and they miss. Wait too early and the ball hits them.\n\n**If they're struggling:** Have the partner roll slower so the bounce is higher. Stay at 15 feet.\n\n**If they've got it:** Roll from 20 feet. Mix short-hop with regular ground balls and fly balls in random order.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth softball glove →](/go/softball-glove-11in/) — 11-inch fielder's glove for new players.\n\n[Full softball gear guide →](/what-to-buy/softball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
