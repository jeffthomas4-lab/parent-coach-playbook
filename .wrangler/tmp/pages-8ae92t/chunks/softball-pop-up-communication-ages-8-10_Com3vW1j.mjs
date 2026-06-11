globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Pop-ups are the easiest outs to mess up. Kids hesitate, two fielders run at the same ball, and the ball drops. Loud communication fixes this.</p>\n<p><strong>Equipment needed:</strong> 10 softballs, a bucket, four fielders (any positions), open space.</p>\n<p><strong>Setup:</strong> Spread four fielders around an infield (short, second, third, first). You stand in the middle with the bucket.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Pop a ball up to a location (short left, right center, behind home, etc.).</li>\n<li>The fielders go for it. Whoever is closest calls “I got it” loud and repeating.</li>\n<li>The other fielders call “Take it” and back off.</li>\n<li>The fielder makes the catch.</li>\n<li>Do 10 pops to different locations.</li>\n</ol>\n<p><strong>What to look for:</strong> Who’s calling and who’s backing off. The kid who calls must be loud. The kid backing off must move away visibly.</p>\n<p><strong>Variation:</strong> For younger kids (8-9), you call it out: “Shortstop’s got it.” For older kids (10), add a base runner and a throw to a base.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/softball-glove-11in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth softball glove →</a> — 11-inch fielder’s glove for new players.</p>\n<p><a href=\"/what-to-buy/softball/\">Full softball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Pop-Up Communication","summary":"Call pop-ups loudly so no two fielders go for the same ball. 15 minutes. Ages 8-10.","sport":"softball","ages":["8-10"],"focus":"fundamentals","layer":"foundations","fundamental":"situational","progression":"intro","illustrationBrief":"Fielders calling and positioning for fly balls","publishedAt":"2026-02-10T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Strong opening; specific cues. Voice is solid."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/softball-pop-up-communication-ages-8-10.md";
				const url = undefined;
				function rawContent() {
					return "\nPop-ups are the easiest outs to mess up. Kids hesitate, two fielders run at the same ball, and the ball drops. Loud communication fixes this.\n\n**Equipment needed:** 10 softballs, a bucket, four fielders (any positions), open space.\n\n**Setup:** Spread four fielders around an infield (short, second, third, first). You stand in the middle with the bucket.\n\n**How to run it:**\n\n1. Pop a ball up to a location (short left, right center, behind home, etc.).\n2. The fielders go for it. Whoever is closest calls \"I got it\" loud and repeating.\n3. The other fielders call \"Take it\" and back off.\n4. The fielder makes the catch.\n5. Do 10 pops to different locations.\n\n**What to look for:** Who's calling and who's backing off. The kid who calls must be loud. The kid backing off must move away visibly.\n\n**Variation:** For younger kids (8-9), you call it out: \"Shortstop's got it.\" For older kids (10), add a base runner and a throw to a base.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth softball glove →](/go/softball-glove-11in/) — 11-inch fielder's glove for new players.\n\n[Full softball gear guide →](/what-to-buy/softball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
