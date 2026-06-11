globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Before kids can read a hit and run multiple bases, they need to run hard from base to base when told. Station to station is the basic version of base running. One whistle, one base.</p>\n<p><strong>What you need:</strong> A diamond setup with all four bases.</p>\n<p><strong>Setup:</strong> Three runners, one at each base (first, second, third). Coach at home plate with a whistle.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Eyes, Drive, Touch, Brake.</li>\n<li>On the whistle, all three runners advance one base at full speed.</li>\n<li>The runner at third scores. The other two move up.</li>\n<li>Reset. Whistle again. Two more advance.</li>\n<li>Cycle through 5-6 whistles. Rotate runners so everyone runs from each base.</li>\n</ol>\n<p><strong>What to watch:</strong> Are they hitting the inside corner of the base? Are they touching every base? Some kids will skip a base or run on the outside.</p>\n<p><strong>If they’re struggling:</strong> Slow it down. Walk through it once. Then jog. Then sprint.</p>\n<p><strong>If they’ve got it:</strong> Two whistles in a row, fast. Runners advance two bases.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Station to Station","summary":"Run one base at a time, full speed, from a stationary start. 10 minutes. Ages 5-7 and 8-10.","sport":"baseball","ages":["5-7","8-10"],"fundamental":"base-running","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Three runners at first, second, and third base, each ready to sprint to the next base on coach's whistle.","editorial":{"qualityGrade":7,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-station-to-station.md";
				const url = undefined;
				function rawContent() {
					return "\nBefore kids can read a hit and run multiple bases, they need to run hard from base to base when told. Station to station is the basic version of base running. One whistle, one base.\n\n**What you need:** A diamond setup with all four bases.\n\n**Setup:** Three runners, one at each base (first, second, third). Coach at home plate with a whistle.\n\n**How to run it:**\n\n1. Cue: Eyes, Drive, Touch, Brake.\n2. On the whistle, all three runners advance one base at full speed.\n3. The runner at third scores. The other two move up.\n4. Reset. Whistle again. Two more advance.\n5. Cycle through 5-6 whistles. Rotate runners so everyone runs from each base.\n\n**What to watch:** Are they hitting the inside corner of the base? Are they touching every base? Some kids will skip a base or run on the outside.\n\n**If they're struggling:** Slow it down. Walk through it once. Then jog. Then sprint.\n\n**If they've got it:** Two whistles in a row, fast. Runners advance two bases.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
