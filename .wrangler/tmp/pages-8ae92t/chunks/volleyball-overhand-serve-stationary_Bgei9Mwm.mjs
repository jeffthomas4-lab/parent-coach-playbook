globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The overhand serve is the next step up. Harder, faster, more aggressive. Toss the ball up, contact above the head, hit through the ball with the heel of the hand. This is the serve that scores aces.</p>\n<p><strong>What you need:</strong> A volleyball, a net at regulation height, open court.</p>\n<p><strong>Setup:</strong> Server 30 feet from the net at the back line.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Toss, Step, Reach, Snap.</li>\n<li>Toss: ball goes straight up about 3 feet above the head, slightly in front of the body.</li>\n<li>Step: step forward with the non-hitting side foot.</li>\n<li>Reach: hitting arm extends up and back, then comes forward.</li>\n<li>Snap: contact the ball with the heel of the hand at the highest point. Hand snaps through.</li>\n</ol>\n<p><strong>What to watch:</strong> The toss. A bad toss kills the serve. Toss should be straight up, consistent every time. If the toss is bad, catch it and re-toss.</p>\n<p><strong>If they’re struggling:</strong> Drop to underhand. Build consistency before moving back.</p>\n<p><strong>If they’ve got it:</strong> Add target zones. Or move to a topspin serve (snap the wrist forward at contact for spin).</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/volleyball-volley-lite/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Volley Lite training ball →</a> — lightweight ball for beginners learning to pass.</p>\n<p><a href=\"/go/volleyball-net/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Portable volleyball net →</a> — 32-ft set with adjustable steel poles.</p>\n<p><a href=\"/what-to-buy/volleyball/\">Full volleyball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Overhand Serve Stationary","summary":"Toss and contact above the head for an overhand serve. 12 minutes. Ages 8-10 and 11-12.","sport":"volleyball","ages":["8-10","11-12"],"fundamental":"serving","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player tossing a ball straight up with the non-hitting hand, then contacting the ball above the head with the heel of the hitting hand.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Standard overhand serve build. Toss-fix instruction is correct."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/volleyball-overhand-serve-stationary.md";
				const url = undefined;
				function rawContent() {
					return "\nThe overhand serve is the next step up. Harder, faster, more aggressive. Toss the ball up, contact above the head, hit through the ball with the heel of the hand. This is the serve that scores aces.\n\n**What you need:** A volleyball, a net at regulation height, open court.\n\n**Setup:** Server 30 feet from the net at the back line.\n\n**How to run it:**\n\n1. Cue: Toss, Step, Reach, Snap.\n2. Toss: ball goes straight up about 3 feet above the head, slightly in front of the body.\n3. Step: step forward with the non-hitting side foot.\n4. Reach: hitting arm extends up and back, then comes forward.\n5. Snap: contact the ball with the heel of the hand at the highest point. Hand snaps through.\n\n**What to watch:** The toss. A bad toss kills the serve. Toss should be straight up, consistent every time. If the toss is bad, catch it and re-toss.\n\n**If they're struggling:** Drop to underhand. Build consistency before moving back.\n\n**If they've got it:** Add target zones. Or move to a topspin serve (snap the wrist forward at contact for spin).\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Volley Lite training ball →](/go/volleyball-volley-lite/) — lightweight ball for beginners learning to pass.\n\n[Portable volleyball net →](/go/volleyball-net/) — 32-ft set with adjustable steel poles.\n\n[Full volleyball gear guide →](/what-to-buy/volleyball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
