globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Shell defense teaches the core of team defense: on-ball pressure, help-and-recovery, and switching. This drill is game-paced but no score.</p>\n<p><strong>Equipment needed:</strong> One basketball, one half court, 8 kids (4 offense, 4 defense).</p>\n<p><strong>Setup:</strong> Set up a half-court. Four offensive players in a box formation (high posts and low posts). Four defenders match up.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Offense passes around the perimeter and tries to get a good inside pass.</li>\n<li>Defenders play straight man-to-man, but can slide over to help on penetration.</li>\n<li>If a defender helps, the help defender’s man becomes open and must recover.</li>\n<li>Run for 5 minutes, then rotate.</li>\n<li>Do 25 minutes total so all kids play both sides.</li>\n</ol>\n<p><strong>What to look for:</strong> Help timing and recovery speed. Do defenders recover to their original player or chase the ball? Good team defense moves together on every pass.</p>\n<p><strong>If they’re struggling:</strong> Drop to three on three. Walk through the rotations first with no score, just shape.</p>\n<p><strong>If they’ve got it:</strong> Add a 14-second shot clock. Pressure forces the offense to attack and tests whether the defenders can hold their rotations.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Shell Defense","summary":"Four defenders vs four offensive players, help and recovery. 25 minutes. Ages 11-12.","sport":"basketball","ages":["11-12"],"focus":"situational","layer":"situational","fundamental":"defending","progression":"build","illustrationBrief":"Four defenders positioned against four offensive players, with one defender helping inside while others recover, no scorekeeping.","publishedAt":"2026-03-05T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Completed truncated body with two voice-matched scaling sentences. Standard shell-defense drill, sport language clean."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-shell-defense-ages-11-12.md";
				const url = undefined;
				function rawContent() {
					return "\nShell defense teaches the core of team defense: on-ball pressure, help-and-recovery, and switching. This drill is game-paced but no score.\n\n**Equipment needed:** One basketball, one half court, 8 kids (4 offense, 4 defense).\n\n**Setup:** Set up a half-court. Four offensive players in a box formation (high posts and low posts). Four defenders match up.\n\n**How to run it:**\n\n1. Offense passes around the perimeter and tries to get a good inside pass.\n2. Defenders play straight man-to-man, but can slide over to help on penetration.\n3. If a defender helps, the help defender's man becomes open and must recover.\n4. Run for 5 minutes, then rotate.\n5. Do 25 minutes total so all kids play both sides.\n\n**What to look for:** Help timing and recovery speed. Do defenders recover to their original player or chase the ball? Good team defense moves together on every pass.\n\n**If they're struggling:** Drop to three on three. Walk through the rotations first with no score, just shape.\n\n**If they've got it:** Add a 14-second shot clock. Pressure forces the offense to attack and tests whether the defenders can hold their rotations.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
