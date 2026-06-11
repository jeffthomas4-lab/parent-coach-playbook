globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Two hands is the rule for game catches. But the glove hand alone has to be strong enough to hold a ball when reaching, diving, or catching off-balance. This drill builds that hand without letting the kid cheat by snapping with the throwing hand.</p>\n<p><strong>What you need:</strong> A <a href=\"/go/baseball-glove-9in-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">glove</a>. 5 baseballs or tennis balls.</p>\n<p><strong>Setup:</strong> Stand 15 feet apart. The kid puts their throwing hand behind their back.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Eyes, Hands, Squeeze, Pull. The throwing hand is gone today.</li>\n<li>Throw 5 balls right at their chest. They catch with the glove only. The throwing hand stays behind the back.</li>\n<li>After 5, throw 5 balls slightly to their glove side. Same one-hand catch.</li>\n<li>Throw 5 balls slightly to their throwing-hand side. They have to reach across.</li>\n<li>Last round: 5 balls high. They catch above the head with one hand.</li>\n</ol>\n<p><strong>What to watch:</strong> Are they squeezing the glove shut on every catch? One-hand catches require a hard squeeze. If the glove stays half-open, the ball pops out.</p>\n<p><strong>If they’re struggling:</strong> Move closer. Throw softer.</p>\n<p><strong>If they’ve got it:</strong> Move back to 25 feet. Or throw harder. Or have them do this drill with a tennis ball that’s</p>";

				const frontmatter = {"title":"Glove Side Only","summary":"Build glove-hand confidence by catching with one hand. 10 minutes. Ages 8-10 and 11-12.","sport":"baseball","ages":["8-10","11-12"],"fundamental":"catching","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A child catching a ball with only the glove hand, the throwing hand held behind the back.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-glove-side-only-catch.md";
				const url = undefined;
				function rawContent() {
					return "\nTwo hands is the rule for game catches. But the glove hand alone has to be strong enough to hold a ball when reaching, diving, or catching off-balance. This drill builds that hand without letting the kid cheat by snapping with the throwing hand.\n\n**What you need:** A [glove](/go/baseball-glove-9in-youth/). 5 baseballs or tennis balls.\n\n**Setup:** Stand 15 feet apart. The kid puts their throwing hand behind their back.\n\n**How to run it:**\n\n1. Cue: Eyes, Hands, Squeeze, Pull. The throwing hand is gone today.\n2. Throw 5 balls right at their chest. They catch with the glove only. The throwing hand stays behind the back.\n3. After 5, throw 5 balls slightly to their glove side. Same one-hand catch.\n4. Throw 5 balls slightly to their throwing-hand side. They have to reach across.\n5. Last round: 5 balls high. They catch above the head with one hand.\n\n**What to watch:** Are they squeezing the glove shut on every catch? One-hand catches require a hard squeeze. If the glove stays half-open, the ball pops out.\n\n**If they're struggling:** Move closer. Throw softer.\n\n**If they've got it:** Move back to 25 feet. Or throw harder. Or have them do this drill with a tennis ball that's ";
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
