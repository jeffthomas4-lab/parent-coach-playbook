globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A catcher who can block balls in the dirt is the difference between a runner advancing and a runner staying put. The block is not a catch. It’s the catcher’s body stopping the ball and keeping it close. This is a 12-and-up skill because it requires gear and commitment.</p>\n<p><strong>What you need:</strong> <a href=\"/go/baseball-catchers-gear-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Catcher’s gear</a> (mask, chest protector, shin guards), 6 tennis balls, a glove.</p>\n<p><strong>Setup:</strong> Catcher in stance about 8 feet from where you stand. You bounce balls toward them in the dirt.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Eyes, Hands, Squeeze, Pull. On a block, the whole body becomes the glove.</li>\n<li>Demonstrate the block: drop to both knees, glove drops to the dirt between the legs, chest angled forward and down so the ball doesn’t bounce up.</li>\n<li>Throw 5 slow bounces straight at them. They block, ball drops in front, they pick it up.</li>\n<li>Throw 5 to the glove side. They angle the body to keep the ball in front of the plate.</li>\n<li>Throw 5 to the throwing-hand side. Same angle work.</li>\n</ol>\n<p><strong>What to watch:</strong> Where the ball ends up after the block. If it bounces away 10 feet, the chest was not angled forward. If it stays within 3 feet of the catcher, the block is good.</p>\n<p><strong>If they’re struggling:</strong> Use tennis balls or rag balls only. The block is a confidence drill before it’s a skill drill.</p>\n<p><strong>If they’ve got it:</strong> Move to real baseballs and harder bounces. Add a runner on third</p>";

				const frontmatter = {"title":"Catcher Blocking","summary":"Catcher blocks balls in the dirt with the body. 12 minutes. Ages 11-12.","sport":"baseball","ages":["11-12"],"fundamental":"catching","progression":"refine","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A catcher in full gear dropping to both knees with the glove between the legs and the chest angled forward to keep the ball in front.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":true,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Contact-safety drill (catcher gear required); flagged sensitive."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-catcher-blocking-balls.md";
				const url = undefined;
				function rawContent() {
					return "\nA catcher who can block balls in the dirt is the difference between a runner advancing and a runner staying put. The block is not a catch. It's the catcher's body stopping the ball and keeping it close. This is a 12-and-up skill because it requires gear and commitment.\n\n**What you need:** [Catcher's gear](/go/baseball-catchers-gear-youth/) (mask, chest protector, shin guards), 6 tennis balls, a glove.\n\n**Setup:** Catcher in stance about 8 feet from where you stand. You bounce balls toward them in the dirt.\n\n**How to run it:**\n\n1. Cue: Eyes, Hands, Squeeze, Pull. On a block, the whole body becomes the glove.\n2. Demonstrate the block: drop to both knees, glove drops to the dirt between the legs, chest angled forward and down so the ball doesn't bounce up.\n3. Throw 5 slow bounces straight at them. They block, ball drops in front, they pick it up.\n4. Throw 5 to the glove side. They angle the body to keep the ball in front of the plate.\n5. Throw 5 to the throwing-hand side. Same angle work.\n\n**What to watch:** Where the ball ends up after the block. If it bounces away 10 feet, the chest was not angled forward. If it stays within 3 feet of the catcher, the block is good.\n\n**If they're struggling:** Use tennis balls or rag balls only. The block is a confidence drill before it's a skill drill.\n\n**If they've got it:** Move to real baseballs and harder bounces. Add a runner on third";
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
