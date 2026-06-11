globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>With two strikes, the goal changes. It’s no longer hit a hard line drive. It’s put the ball in play. A two-strike swing is shorter, the bat is choked up, and any pitch close to the zone gets a swing. This is mental and mechanical.</p>\n<p><strong>What you need:</strong> A bat, 15 baseballs, a coach to pitch from 30 feet behind a screen.</p>\n<p><strong>Setup:</strong> Coach pitches at half speed. Batter at home plate.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Tell the batter every pitch is a 0-2 count. Two strikes already.</li>\n<li>They choke up an inch on the bat. Slightly wider stance.</li>\n<li>Cue: Set, Load, Step, Swing. The Swing is shorter. No big finish.</li>\n<li>Coach pitches 10 balls. Some clear strikes, some on the edge of the zone.</li>\n<li>Batter swings at anything close. Goal: put every pitch in play.</li>\n</ol>\n<p><strong>What to watch:</strong> Are they trying to crush the ball? Two-strike swing is contact, not power. Soft contact in play beats a strikeout. If they swing for the fence, reset them.</p>\n<p><strong>If they’re struggling:</strong> Throw only obvious strikes. Build the contact swing first.</p>\n<p><strong>If they’ve got it:</strong> Add pitches off the plate that they have to fight off (foul off intentionally) until they get something to hit.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/go/baseball-bat-28in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">28-inch youth bat →</a> — drop-10 USA-stamped bat for ages 8–10.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Two Strike Approach","summary":"Choke up, shorten the swing, protect the plate. 12 minutes. Ages 11-12.","sport":"baseball","ages":["11-12"],"fundamental":"hitting","progression":"refine","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Batter with hands choked up an inch on the bat, slightly wider stance, and a shorter swing path through the strike zone.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-two-strike-approach.md";
				const url = undefined;
				function rawContent() {
					return "\nWith two strikes, the goal changes. It's no longer hit a hard line drive. It's put the ball in play. A two-strike swing is shorter, the bat is choked up, and any pitch close to the zone gets a swing. This is mental and mechanical.\n\n**What you need:** A bat, 15 baseballs, a coach to pitch from 30 feet behind a screen.\n\n**Setup:** Coach pitches at half speed. Batter at home plate.\n\n**How to run it:**\n\n1. Tell the batter every pitch is a 0-2 count. Two strikes already.\n2. They choke up an inch on the bat. Slightly wider stance.\n3. Cue: Set, Load, Step, Swing. The Swing is shorter. No big finish.\n4. Coach pitches 10 balls. Some clear strikes, some on the edge of the zone.\n5. Batter swings at anything close. Goal: put every pitch in play.\n\n**What to watch:** Are they trying to crush the ball? Two-strike swing is contact, not power. Soft contact in play beats a strikeout. If they swing for the fence, reset them.\n\n**If they're struggling:** Throw only obvious strikes. Build the contact swing first.\n\n**If they've got it:** Add pitches off the plate that they have to fight off (foul off intentionally) until they get something to hit.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[28-inch youth bat →](/go/baseball-bat-28in/) — drop-10 USA-stamped bat for ages 8–10.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
