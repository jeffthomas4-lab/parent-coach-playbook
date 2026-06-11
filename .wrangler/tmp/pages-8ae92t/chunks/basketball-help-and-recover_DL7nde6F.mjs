globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Help defense is when you leave your player to stop a drive, then get back to your own player. This drill teaches the timing and footwork.</p>\n<p><strong>What you need:</strong> Basketball. Four kids per rep (driver, on-ball defender, helper, and shooter). Half-court.</p>\n<p><strong>Setup:</strong> Driver with the ball on one wing. On-ball defender guarding driver. Helper guarding a shooter on the opposite wing. Shooter is the helper’s responsibility.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Driver attacks the on-ball defender.</li>\n<li>When the drive gets to the lane, the helper steps in to help.</li>\n<li>The helper must then recover back to their shooter before the driver kicks the ball out.</li>\n<li>If the shooter gets the ball and shoots, recovery was too slow.</li>\n<li>Do 5 reps. Rotate roles.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the helper recover fast enough or do they get out of position? Recovery must be quick. One step in, then back.</p>\n<p><strong>If they’re struggling:</strong> Have the driver slow down the attack. Give the helper more time to recover. Reduce the distance.</p>\n<p><strong>If they’ve got it:</strong> Driver passes faster. Helper must sprint to recover.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Help and Recover","summary":"Help on a drive then recover to your player. 10 minutes. Ages 8-10, 11-12.","sport":"basketball","ages":["8-10","11-12"],"fundamental":"defending","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Two defenders, one stepping in to help on a drive while the other recovers to stay with a shooter.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Tight, role-by-role explanation; reads cleanly."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-help-and-recover.md";
				const url = undefined;
				function rawContent() {
					return "\nHelp defense is when you leave your player to stop a drive, then get back to your own player. This drill teaches the timing and footwork.\n\n**What you need:** Basketball. Four kids per rep (driver, on-ball defender, helper, and shooter). Half-court.\n\n**Setup:** Driver with the ball on one wing. On-ball defender guarding driver. Helper guarding a shooter on the opposite wing. Shooter is the helper's responsibility.\n\n**How to run it:**\n\n1. Driver attacks the on-ball defender.\n2. When the drive gets to the lane, the helper steps in to help.\n3. The helper must then recover back to their shooter before the driver kicks the ball out.\n4. If the shooter gets the ball and shoots, recovery was too slow.\n5. Do 5 reps. Rotate roles.\n\n**What to watch:** Does the helper recover fast enough or do they get out of position? Recovery must be quick. One step in, then back.\n\n**If they're struggling:** Have the driver slow down the attack. Give the helper more time to recover. Reduce the distance.\n\n**If they've got it:** Driver passes faster. Helper must sprint to recover.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
