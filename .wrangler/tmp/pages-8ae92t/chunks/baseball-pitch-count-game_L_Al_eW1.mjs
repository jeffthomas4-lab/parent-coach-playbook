globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Real pitching isn’t throwing strikes for fun. It’s throwing strikes when the count matters. This drill puts the pitcher in fake at-bats with real ball and strike calls. The goal is to get to 3 outs before walking 2 batters.</p>\n<p><strong>What you need:</strong> 30 baseballs, a strike zone target, a parent or coach acting as the umpire calling balls and strikes, a fence behind the target.</p>\n<p><strong>Setup:</strong> Pitcher on the mound. Coach behind the target with a clipboard.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Set, Lift, Stride, Throw.</li>\n<li>Each “at-bat” is up to 6 pitches. Coach calls ball or strike. Three strikes is an out. Four balls is a walk.</li>\n<li>Pitcher tries to get 3 outs before allowing 2 walks.</li>\n<li>Track the result: 3 outs is a clean inning, 2 walks is a bad inning.</li>\n<li>Reset. Pitch a second inning.</li>\n</ol>\n<p><strong>What to watch:</strong> Behavior after a ball. Some kids fall apart after one ball. Two balls and they’re wild. Mental toughness is the goal: throw the next pitch without thinking about the last.</p>\n<p><strong>If they’re struggling:</strong> Drop the walk count. Just have them try to throw 3 strikeouts in a row.</p>\n<p><strong>If they’ve got it:</strong> Add a real batter who takes pitches but does not swing. Now the pitcher has to pitch to a hitter’s eye, which moves and reacts.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/go/baseball-bat-28in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">28-inch youth bat →</a> — drop-10 USA-stamped bat for ages 8–10.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Pitch Count Game","summary":"Simulate a real at-bat with ball and strike calls. 15 minutes. Ages 11-12.","sport":"baseball","ages":["11-12"],"fundamental":"pitching","progression":"refine","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Pitcher on the mound facing a coach acting as the umpire, with a chalkboard or cone setup tracking ball and strike count.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass. Good mental-toughness framing."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-pitch-count-game.md";
				const url = undefined;
				function rawContent() {
					return "\nReal pitching isn't throwing strikes for fun. It's throwing strikes when the count matters. This drill puts the pitcher in fake at-bats with real ball and strike calls. The goal is to get to 3 outs before walking 2 batters.\n\n**What you need:** 30 baseballs, a strike zone target, a parent or coach acting as the umpire calling balls and strikes, a fence behind the target.\n\n**Setup:** Pitcher on the mound. Coach behind the target with a clipboard.\n\n**How to run it:**\n\n1. Cue: Set, Lift, Stride, Throw.\n2. Each \"at-bat\" is up to 6 pitches. Coach calls ball or strike. Three strikes is an out. Four balls is a walk.\n3. Pitcher tries to get 3 outs before allowing 2 walks.\n4. Track the result: 3 outs is a clean inning, 2 walks is a bad inning.\n5. Reset. Pitch a second inning.\n\n**What to watch:** Behavior after a ball. Some kids fall apart after one ball. Two balls and they're wild. Mental toughness is the goal: throw the next pitch without thinking about the last.\n\n**If they're struggling:** Drop the walk count. Just have them try to throw 3 strikeouts in a row.\n\n**If they've got it:** Add a real batter who takes pitches but does not swing. Now the pitcher has to pitch to a hitter's eye, which moves and reacts.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[28-inch youth bat →](/go/baseball-bat-28in/) — drop-10 USA-stamped bat for ages 8–10.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
