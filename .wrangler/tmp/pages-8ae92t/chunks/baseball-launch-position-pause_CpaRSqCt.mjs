globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The Load is the moment right before the swing. Hands back, weight on the back leg, ready to fire. Most kids rush past it. This drill forces them to pause at the Load and feel the ready position before the bat moves.</p>\n<p><strong>What you need:</strong> A bat, 10 baseballs on a tee or 10 soft toss reps, a fence.</p>\n<p><strong>Setup:</strong> Tee or soft toss setup as normal. Kid in batting stance.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Set, Load, Step, Swing. Today the Load gets a pause.</li>\n<li>Set: stance ready.</li>\n<li>Load: hands back, weight back, bat angled over the back shoulder.</li>\n<li>PAUSE at the Load for 2 seconds. Coach says “go” and they swing.</li>\n<li>Do 10 reps with the pause. The pause makes the swing feel slower but more controlled.</li>\n</ol>\n<p><strong>What to watch:</strong> What the hands and bat do during the pause. If they drift forward during the 2 seconds, they’re not really loaded. The hands have to stay back through the pause.</p>\n<p><strong>If they’re struggling:</strong> Drop the pause to 1 second. Or just have them practice the Load position without swinging.</p>\n<p><strong>If they’ve got it:</strong> Vary the pause length. Sometimes 1 second, sometimes 3 seconds. They have to hold whatever you call.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/go/baseball-trainer/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Batting trainer →</a> — tee and trainer setup for solo swings.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Loaded Position Pause","summary":"Pause at the top of the load to feel the ready position. 10 minutes. Ages 8-10 and 11-12.","sport":"baseball","ages":["8-10","11-12"],"fundamental":"hitting","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A child paused mid-stance with hands held back and bat angled over the back shoulder, weight on the back leg, just before the swing starts.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-launch-position-pause.md";
				const url = undefined;
				function rawContent() {
					return "\nThe Load is the moment right before the swing. Hands back, weight on the back leg, ready to fire. Most kids rush past it. This drill forces them to pause at the Load and feel the ready position before the bat moves.\n\n**What you need:** A bat, 10 baseballs on a tee or 10 soft toss reps, a fence.\n\n**Setup:** Tee or soft toss setup as normal. Kid in batting stance.\n\n**How to run it:**\n\n1. Cue: Set, Load, Step, Swing. Today the Load gets a pause.\n2. Set: stance ready.\n3. Load: hands back, weight back, bat angled over the back shoulder.\n4. PAUSE at the Load for 2 seconds. Coach says \"go\" and they swing.\n5. Do 10 reps with the pause. The pause makes the swing feel slower but more controlled.\n\n**What to watch:** What the hands and bat do during the pause. If they drift forward during the 2 seconds, they're not really loaded. The hands have to stay back through the pause.\n\n**If they're struggling:** Drop the pause to 1 second. Or just have them practice the Load position without swinging.\n\n**If they've got it:** Vary the pause length. Sometimes 1 second, sometimes 3 seconds. They have to hold whatever you call.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[Batting trainer →](/go/baseball-trainer/) — tee and trainer setup for solo swings.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
