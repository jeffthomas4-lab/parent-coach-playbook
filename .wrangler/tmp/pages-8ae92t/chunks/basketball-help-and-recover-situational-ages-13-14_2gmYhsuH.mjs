globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Help-and-recover is the most important team defense principle at this age. This drill forces defenders to make the right decision about when to help and when to recover.</p>\n<p><strong>Equipment needed:</strong> One basketball, one half court, 6 kids (3 offense, 3 defense).</p>\n<p><strong>Setup:</strong> Half court, three offensive players (wings and high post), three defenders. One offensive player is the primary scorer with the ball.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Offensive player attacks their defender with the ball.</li>\n<li>If a second defender helps, that defender’s man (who is now open) must be recovered to before the pass is caught.</li>\n<li>If the defense is tight, no help is needed.</li>\n<li>Play for 25 minutes, rotating positions every 5 minutes.</li>\n</ol>\n<p><strong>What to look for:</strong> Help timing and recovery speed. Is the defense helping too early (opening driving lanes) or too late (allowing an easy pass)? Is the recovery defender in position or recovering to the wrong player?</p>\n<p><strong>If they’re struggling:</strong> Slow the offense to walking speed. Call out “help” and “recover” so the timing becomes obvious. Reset every 30 seconds.</p>\n<p><strong>If they’ve got it:</strong> Add a fourth offensive player and a fourth defender. The rotations get harder when the help defender has a longer recovery.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Help-and-Recover Situational","summary":"Three-on-three with emphasis on helping without fouling. 25 minutes. Ages 13-14+.","sport":"basketball","ages":["13-14"],"focus":"situational","layer":"situational","fundamental":"defending","progression":"refine","illustrationBrief":"Three defenders in a 3v3 game, with one defender leaving their player to help on a penetrating ball-handler, then recovering back.","publishedAt":"2026-04-08T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":7,"originalityGrade":7,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Body was truncated mid-sentence; completed the closing sections."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-help-and-recover-situational-ages-13-14.md";
				const url = undefined;
				function rawContent() {
					return "\nHelp-and-recover is the most important team defense principle at this age. This drill forces defenders to make the right decision about when to help and when to recover.\n\n**Equipment needed:** One basketball, one half court, 6 kids (3 offense, 3 defense).\n\n**Setup:** Half court, three offensive players (wings and high post), three defenders. One offensive player is the primary scorer with the ball.\n\n**How to run it:**\n\n1. Offensive player attacks their defender with the ball.\n2. If a second defender helps, that defender's man (who is now open) must be recovered to before the pass is caught.\n3. If the defense is tight, no help is needed.\n4. Play for 25 minutes, rotating positions every 5 minutes.\n\n**What to look for:** Help timing and recovery speed. Is the defense helping too early (opening driving lanes) or too late (allowing an easy pass)? Is the recovery defender in position or recovering to the wrong player?\n\n**If they're struggling:** Slow the offense to walking speed. Call out \"help\" and \"recover\" so the timing becomes obvious. Reset every 30 seconds.\n\n**If they've got it:** Add a fourth offensive player and a fourth defender. The rotations get harder when the help defender has a longer recovery.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
