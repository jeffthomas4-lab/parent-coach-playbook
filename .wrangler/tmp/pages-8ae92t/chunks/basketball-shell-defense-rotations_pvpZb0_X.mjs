globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The shell drill teaches team defense and rotations. Four defenders guard four offensive players. As the ball moves, defenders rotate to stay in position.</p>\n<p><strong>What you need:</strong> Basketball. Eight kids (four on offense, four on defense). Half-court.</p>\n<p><strong>Setup:</strong> Four offensive players at the five spots (baseline, wing, top, wing, baseline). Four defenders match up on them.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Stance, Slide, Mirror, Hands.</li>\n<li>Offensive team passes the ball around the arc (no dribbling).</li>\n<li>Defenders rotate to maintain solid defensive position on each pass.</li>\n<li>60 seconds on. Defenders try to get a stop (turnover or bad shot).</li>\n<li>Do 2 possessions. Then switch offense and defense.</li>\n</ol>\n<p><strong>What to watch:</strong> Do they rotate as a team or is it chaotic? Rotations should flow together. When the ball moves, they move together.</p>\n<p><strong>If they’re struggling:</strong> Slow the pace. Offense passes slowly. Offense doesn’t cut. Just rotations on the perimeter.</p>\n<p><strong>If they’ve got it:</strong> Offensive cuts. Full game-speed movement. Defenders must handle everything.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Shell Defense Rotations","summary":"Four defenders rotate on pass movement in shell drill. 12 minutes. Ages 11-12.","sport":"basketball","ages":["11-12"],"fundamental":"defending","progression":"refine","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Four defenders in a shell formation passing a basketball around, with defenders rotating and adjusting to each pass.","editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Standard rotations drill, sport language clean. Minor inconsistency: setup mentions 'five spots' but only four offensive players are listed."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-shell-defense-rotations.md";
				const url = undefined;
				function rawContent() {
					return "\nThe shell drill teaches team defense and rotations. Four defenders guard four offensive players. As the ball moves, defenders rotate to stay in position.\n\n**What you need:** Basketball. Eight kids (four on offense, four on defense). Half-court.\n\n**Setup:** Four offensive players at the five spots (baseline, wing, top, wing, baseline). Four defenders match up on them.\n\n**How to run it:**\n\n1. Cue: Stance, Slide, Mirror, Hands.\n2. Offensive team passes the ball around the arc (no dribbling).\n3. Defenders rotate to maintain solid defensive position on each pass.\n4. 60 seconds on. Defenders try to get a stop (turnover or bad shot).\n5. Do 2 possessions. Then switch offense and defense.\n\n**What to watch:** Do they rotate as a team or is it chaotic? Rotations should flow together. When the ball moves, they move together.\n\n**If they're struggling:** Slow the pace. Offense passes slowly. Offense doesn't cut. Just rotations on the perimeter.\n\n**If they've got it:** Offensive cuts. Full game-speed movement. Defenders must handle everything.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
