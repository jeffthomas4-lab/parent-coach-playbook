globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The lacrosse goalie position is unique. Stick held high in front. Body square to the ball. Feet shuffle along an imaginary arc that follows the shooter. Get the stance right and the saves are easier. Most goalies are made by stance, not by reflexes.</p>\n<p><strong>What you need:</strong> Goalie stick (longer with bigger head), full goalie gear, lacrosse goal, ball.</p>\n<p><strong>Setup:</strong> Goalie in the crease in front of the goal.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Show the stance: feet wider than shoulders, knees bent, stick held vertical in front of the body, top hand at chest height, bottom hand at hip.</li>\n<li>Hold the stance for 15 seconds. Coach checks: stick vertical, body low.</li>\n<li>Coach walks an arc around the goal (from one wing to the other).</li>\n<li>Goalie shuffles along the arc, body always square to the coach.</li>\n<li>Continue for 60 seconds. Mix wing positions.</li>\n</ol>\n<p><strong>What to watch:</strong> Stick angle. The stick has to be vertical, not tilted. A tilted stick exposes a corner of the goal.</p>\n<p><strong>If they’re struggling:</strong> Slower coach movement. Or stay in stance for shorter periods.</p>\n<p><strong>If they’ve got it:</strong> Add a tossed ball. Goalie shuffles AND saves a softly tossed ball at chest level.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/lacrosse-ball/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Lacrosse balls (6-pack) →</a> — NOCSAE-stamped practice balls.</p>\n<p><a href=\"/go/lacrosse-starter-kit-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">STX Stallion complete stick →</a> — shaft and head combo for new players.</p>\n<p><a href=\"/what-to-buy/lacrosse-boys/\">Full lacrosse (boys) gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Goalie Stance and Arc","summary":"Goalie sets the basic stance and tracks the ball along an arc. 10 minutes. Ages 11-12.","sport":"lacrosse-boys","ages":["11-12"],"fundamental":"goalkeeping","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Lacrosse goalie in stance with the stick held vertical in front of the body, knees bent, feet shuffling along an arc to track an offensive player.","editorial":{"qualityGrade":8,"originalityGrade":8,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Goalie stance basics; useful 'goalies made by stance, not reflexes' line."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/lacrosse-boys-goalie-stance-arc.md";
				const url = undefined;
				function rawContent() {
					return "\nThe lacrosse goalie position is unique. Stick held high in front. Body square to the ball. Feet shuffle along an imaginary arc that follows the shooter. Get the stance right and the saves are easier. Most goalies are made by stance, not by reflexes.\n\n**What you need:** Goalie stick (longer with bigger head), full goalie gear, lacrosse goal, ball.\n\n**Setup:** Goalie in the crease in front of the goal.\n\n**How to run it:**\n\n1. Show the stance: feet wider than shoulders, knees bent, stick held vertical in front of the body, top hand at chest height, bottom hand at hip.\n2. Hold the stance for 15 seconds. Coach checks: stick vertical, body low.\n3. Coach walks an arc around the goal (from one wing to the other).\n4. Goalie shuffles along the arc, body always square to the coach.\n5. Continue for 60 seconds. Mix wing positions.\n\n**What to watch:** Stick angle. The stick has to be vertical, not tilted. A tilted stick exposes a corner of the goal.\n\n**If they're struggling:** Slower coach movement. Or stay in stance for shorter periods.\n\n**If they've got it:** Add a tossed ball. Goalie shuffles AND saves a softly tossed ball at chest level.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Lacrosse balls (6-pack) →](/go/lacrosse-ball/) — NOCSAE-stamped practice balls.\n\n[STX Stallion complete stick →](/go/lacrosse-starter-kit-youth/) — shaft and head combo for new players.\n\n[Full lacrosse (boys) gear guide →](/what-to-buy/lacrosse-boys/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
