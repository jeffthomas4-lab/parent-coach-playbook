globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Wall bump is the volleyball version of wall ball. The wall returns every bump. Hundreds of touches in 10 minutes. The kid can do this in a driveway or against any flat wall.</p>\n<p><strong>What you need:</strong> A <a href=\"/go/volleyball-volley-lite/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">volleyball</a>, a flat wall (brick, concrete, or fence with a tarp).</p>\n<p><strong>Setup:</strong> Kid stands 5 feet from the wall.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Ready, Platform, Angle, Push.</li>\n<li>Bump the ball against the wall.</li>\n<li>Catch the rebound (or bump it again).</li>\n<li>Goal: 10 bumps in a row without dropping.</li>\n<li>After 10 in a row, change the rule: every bump has to hit a target on the wall (a tape mark at chest height).</li>\n</ol>\n<p><strong>What to watch:</strong> Is the platform flat on every rep? At rep 1 it’s perfect. At rep 8 it’s bent. Check the platform every time.</p>\n<p><strong>If they’re struggling:</strong> Move closer to 3 feet. Use a softer ball.</p>\n<p><strong>If they’ve got it:</strong> Move back to 8 feet. Or bump-set-bump (alternate pl</p>";

				const frontmatter = {"title":"Bump Against the Wall","summary":"Bump the ball against a wall and catch the rebound. 10 minutes. Ages 8-10.","sport":"volleyball","ages":["8-10"],"fundamental":"passing","progression":"build","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player standing 5 feet from a brick wall, repeatedly bumping a volleyball against the wall and receiving the rebound.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Solo wall rep drill. High-volume touches in driveway setting."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/volleyball-bump-against-wall.md";
				const url = undefined;
				function rawContent() {
					return "\nWall bump is the volleyball version of wall ball. The wall returns every bump. Hundreds of touches in 10 minutes. The kid can do this in a driveway or against any flat wall.\n\n**What you need:** A [volleyball](/go/volleyball-volley-lite/), a flat wall (brick, concrete, or fence with a tarp).\n\n**Setup:** Kid stands 5 feet from the wall.\n\n**How to run it:**\n\n1. Cue: Ready, Platform, Angle, Push.\n2. Bump the ball against the wall.\n3. Catch the rebound (or bump it again).\n4. Goal: 10 bumps in a row without dropping.\n5. After 10 in a row, change the rule: every bump has to hit a target on the wall (a tape mark at chest height).\n\n**What to watch:** Is the platform flat on every rep? At rep 1 it's perfect. At rep 8 it's bent. Check the platform every time.\n\n**If they're struggling:** Move closer to 3 feet. Use a softer ball.\n\n**If they've got it:** Move back to 8 feet. Or bump-set-bump (alternate pl";
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
