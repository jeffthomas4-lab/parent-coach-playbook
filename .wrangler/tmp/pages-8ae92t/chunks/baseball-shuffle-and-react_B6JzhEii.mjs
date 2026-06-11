globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Fielding is mostly side-to-side movement. This drill warms the legs up by making the kids shuffle in different directions on a signal. Bonus: it’s a game, so they pay attention.</p>\n<p><strong>What you need:</strong> Open space. No equipment.</p>\n<p><strong>Setup:</strong> Kids in a line facing the coach, 15 feet away.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Kids start in athletic stance: feet apart, knees soft, hands ready.</li>\n<li>Coach points right: kids shuffle 3 steps right.</li>\n<li>Coach points left: kids shuffle 3 steps left.</li>\n<li>Coach points down: kids drop to fielding position.</li>\n<li>Coach points up: kids jump up. Mix it up. Random pattern. Make it a game.</li>\n</ol>\n<p><strong>What to watch:</strong> Are their feet shuffling or crossing? Shuffle means feet stay apart and move sideways. Cross-stepping is what we don’t want.</p>\n<p><strong>If they’re struggling:</strong> Slower pattern. Bigger gestures so they can read the signal.</p>\n<p><strong>If they’ve got it:</strong> Faster pattern. Or add a verbal command at the same time as a fake gesture so they have to listen too.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Shuffle and React","summary":"Lateral movement game that doubles as a warm-up. 8 minutes. Ages 5-7 and 8-10.","sport":"baseball","ages":["5-7","8-10"],"fundamental":"warm-up","progression":"intro","focus":"warm-up","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A line of children in athletic stance shuffling sideways and changing direction on coach's hand signals.","editorial":{"qualityGrade":7,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-shuffle-and-react.md";
				const url = undefined;
				function rawContent() {
					return "\nFielding is mostly side-to-side movement. This drill warms the legs up by making the kids shuffle in different directions on a signal. Bonus: it's a game, so they pay attention.\n\n**What you need:** Open space. No equipment.\n\n**Setup:** Kids in a line facing the coach, 15 feet away.\n\n**How to run it:**\n\n1. Kids start in athletic stance: feet apart, knees soft, hands ready.\n2. Coach points right: kids shuffle 3 steps right.\n3. Coach points left: kids shuffle 3 steps left.\n4. Coach points down: kids drop to fielding position.\n5. Coach points up: kids jump up. Mix it up. Random pattern. Make it a game.\n\n**What to watch:** Are their feet shuffling or crossing? Shuffle means feet stay apart and move sideways. Cross-stepping is what we don't want.\n\n**If they're struggling:** Slower pattern. Bigger gestures so they can read the signal.\n\n**If they've got it:** Faster pattern. Or add a verbal command at the same time as a fake gesture so they have to listen too.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
