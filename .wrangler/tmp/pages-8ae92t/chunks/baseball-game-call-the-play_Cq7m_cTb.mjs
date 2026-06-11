globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A team that knows the play before the pitch is fast. A team that figures it out during the pitch is slow. This drill is verbal: coach calls a situation, kids name the play.</p>\n<p><strong>What you need:</strong> A full team or position group. No equipment.</p>\n<p><strong>Setup:</strong> Defense in their positions. Coach near the pitcher’s mound.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Coach calls a situation: “Runner on second, one out.”</li>\n<li>Coach asks: “Where do we throw on a ground ball to short?”</li>\n<li>Kids answer. Coach says right or wrong.</li>\n<li>Coach changes the situation: “Runner on first, two outs.”</li>\n<li>Repeat. Cover 8-10 different situations in 10 minutes.</li>\n</ol>\n<p><strong>What to watch:</strong> Are the same kids answering every time? Call on the quiet ones. Defense knowledge has to be team-wide.</p>\n<p><strong>If they’re struggling:</strong> Simplify the situations. “No runners, ground ball to short. Where?” Easy answer: first base.</p>\n<p><strong>If they’ve got it:</strong> Add tricky situations. “Bases loaded, no outs, ground ball to first.” The answer involves cutoffs and force outs.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Call the Play","summary":"Coach calls a situation, kids name the play before the pitch. 10 minutes. Ages 11-12.","sport":"baseball","ages":["11-12"],"fundamental":"situational","progression":"refine","focus":"game-management","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Coach holding up fingers showing 'two outs, runner on second' while a circle of players in the field name the play they would make on a ground ball.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-game-call-the-play.md";
				const url = undefined;
				function rawContent() {
					return "\nA team that knows the play before the pitch is fast. A team that figures it out during the pitch is slow. This drill is verbal: coach calls a situation, kids name the play.\n\n**What you need:** A full team or position group. No equipment.\n\n**Setup:** Defense in their positions. Coach near the pitcher's mound.\n\n**How to run it:**\n\n1. Coach calls a situation: \"Runner on second, one out.\"\n2. Coach asks: \"Where do we throw on a ground ball to short?\"\n3. Kids answer. Coach says right or wrong.\n4. Coach changes the situation: \"Runner on first, two outs.\"\n5. Repeat. Cover 8-10 different situations in 10 minutes.\n\n**What to watch:** Are the same kids answering every time? Call on the quiet ones. Defense knowledge has to be team-wide.\n\n**If they're struggling:** Simplify the situations. \"No runners, ground ball to short. Where?\" Easy answer: first base.\n\n**If they've got it:** Add tricky situations. \"Bases loaded, no outs, ground ball to first.\" The answer involves cutoffs and force outs.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
