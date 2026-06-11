globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Most kids slow down before reaching first base because they think they have to stop on the bag. The rule on a force play: run THROUGH first like it’s not there. Slowing down before the bag is the most common reason kids get out at first by half a step.</p>\n<p><strong>What you need:</strong> A base or a flat marker. An open area.</p>\n<p><strong>Setup:</strong> Mark home plate. Base 60 feet away (or whatever your league distance is).</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Eyes, Drive, Touch, Brake.</li>\n<li>Eyes: look at the front edge of the bag.</li>\n<li>Drive: run hard from home, no slowing down.</li>\n<li>Touch: foot hits the front edge of the bag.</li>\n<li>Brake: slow down 10 feet PAST the bag, not before. Tell them: “Run past the base, then stop.”</li>\n</ol>\n<p><strong>What to watch:</strong> Are they slowing down before the bag? Most kids do. Stand 5 feet past the bag and tell them: “Run to me, not to the base.”</p>\n<p><strong>If they’re struggling:</strong> Shorten the distance to 30 feet. Same rules, less running.</p>\n<p><strong>If they’ve got it:</strong> Add a thrown ball. You toss a ball to a partner at first base. They have to beat the throw.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Run Through First","summary":"Run hard through first base, don't slow down at the bag. 8 minutes. T-ball and ages 5-7.","sport":"baseball","ages":["t-ball","5-7"],"fundamental":"base-running","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A young child sprinting through first base without slowing down, foot striking the front edge of the bag mid-stride.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":9,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-run-through-first.md";
				const url = undefined;
				function rawContent() {
					return "\nMost kids slow down before reaching first base because they think they have to stop on the bag. The rule on a force play: run THROUGH first like it's not there. Slowing down before the bag is the most common reason kids get out at first by half a step.\n\n**What you need:** A base or a flat marker. An open area.\n\n**Setup:** Mark home plate. Base 60 feet away (or whatever your league distance is).\n\n**How to run it:**\n\n1. Cue: Eyes, Drive, Touch, Brake.\n2. Eyes: look at the front edge of the bag.\n3. Drive: run hard from home, no slowing down.\n4. Touch: foot hits the front edge of the bag.\n5. Brake: slow down 10 feet PAST the bag, not before. Tell them: \"Run past the base, then stop.\"\n\n**What to watch:** Are they slowing down before the bag? Most kids do. Stand 5 feet past the bag and tell them: \"Run to me, not to the base.\"\n\n**If they're struggling:** Shorten the distance to 30 feet. Same rules, less running.\n\n**If they've got it:** Add a thrown ball. You toss a ball to a partner at first base. They have to beat the throw.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
