globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The jump serve is the highest-level serve. Higher contact, more power, harder to receive. It’s a hybrid of a spike and a serve. Hard to learn but worth introducing at 11-12 for the kids who are ready.</p>\n<p><strong>What you need:</strong> A volleyball, a net at regulation, open court.</p>\n<p><strong>Setup:</strong> Server starts 5 feet behind the back line.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Toss, Step, Reach, Snap.</li>\n<li>Toss the ball forward and high (more forward than a stationary serve).</li>\n<li>Take a three-step approach (like a spike).</li>\n<li>Plant and jump.</li>\n<li>Contact the ball above the head while in the air. Snap the wrist for power.</li>\n</ol>\n<p><strong>What to watch:</strong> The toss. Jump serve toss has to be forward enough that the player can run under it. Too short and they jump under it. Too far and they overrun it.</p>\n<p><strong>If they’re struggling:</strong> Stay with the stationary overhand serve. Build that to consistency before adding the jump.</p>\n<p><strong>If they’ve got it:</strong> Add target zones. Or move to a top-spin jump serve.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/volleyball-volley-lite/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Volley Lite training ball →</a> — lightweight ball for beginners learning to pass.</p>\n<p><a href=\"/go/volleyball-net/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Portable volleyball net →</a> — 32-ft set with adjustable steel poles.</p>\n<p><a href=\"/what-to-buy/volleyball/\">Full volleyball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Jump Serve Intro","summary":"First exposure to a jump serve. 12 minutes. Ages 11-12.","sport":"volleyball","ages":["11-12"],"fundamental":"serving","progression":"refine","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player tossing the ball forward and high, taking a three-step approach, jumping, and contacting the ball above the head while in the air.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":true,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Sensitive flag for jump landing risk. Drill correctly cautions to build stationary serve first."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/volleyball-jump-serve-intro.md";
				const url = undefined;
				function rawContent() {
					return "\nThe jump serve is the highest-level serve. Higher contact, more power, harder to receive. It's a hybrid of a spike and a serve. Hard to learn but worth introducing at 11-12 for the kids who are ready.\n\n**What you need:** A volleyball, a net at regulation, open court.\n\n**Setup:** Server starts 5 feet behind the back line.\n\n**How to run it:**\n\n1. Cue: Toss, Step, Reach, Snap.\n2. Toss the ball forward and high (more forward than a stationary serve).\n3. Take a three-step approach (like a spike).\n4. Plant and jump.\n5. Contact the ball above the head while in the air. Snap the wrist for power.\n\n**What to watch:** The toss. Jump serve toss has to be forward enough that the player can run under it. Too short and they jump under it. Too far and they overrun it.\n\n**If they're struggling:** Stay with the stationary overhand serve. Build that to consistency before adding the jump.\n\n**If they've got it:** Add target zones. Or move to a top-spin jump serve.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Volley Lite training ball →](/go/volleyball-volley-lite/) — lightweight ball for beginners learning to pass.\n\n[Portable volleyball net →](/go/volleyball-net/) — 32-ft set with adjustable steel poles.\n\n[Full volleyball gear guide →](/what-to-buy/volleyball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
