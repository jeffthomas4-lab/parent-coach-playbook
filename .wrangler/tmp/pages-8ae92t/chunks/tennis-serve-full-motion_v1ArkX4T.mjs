globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The full serve has four phases. Toss, bend, reach, snap. Each phase builds on the last. This drill puts them all together.</p>\n<p><strong>What you need:</strong> Tennis balls, full racquet, tennis court.</p>\n<p><strong>Setup:</strong> Player on the baseline ready to serve. Service box on the other side as the target.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Toss, Bend, Reach, Snap.</li>\n<li>Toss the ball straight up, slightly in front of the body.</li>\n<li>Bend the back leg as the toss rises.</li>\n<li>Reach up with the racquet, fully extended at contact.</li>\n<li>Snap the wrist forward at contact for power and topspin.</li>\n</ol>\n<p><strong>What to watch:</strong> Reach height. Most kids contact the ball at face height. The right contact is fully extended above the head. The taller the contact, the better the serve angle.</p>\n<p><strong>If they’re struggling:</strong> Drop the toss. Practice the swing motion only first.</p>\n<p><strong>If they’ve got it:</strong> Add target zones (deuce side body, deuce side T, ad side T). Aim for specific spots.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/tennis-balls-orange/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Orange tennis balls (12-pack) →</a> — slower-bounce balls for learning groundstrokes.</p>\n<p><a href=\"/go/tennis-racquet-junior/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Junior tennis racquet →</a> — HEAD Speed, pre-strung for beginners.</p>\n<p><a href=\"/what-to-buy/tennis/\">Full tennis gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Serve Full Motion","summary":"Full serve from the baseline including toss and contact. 15 minutes. Ages 11-12.","sport":"tennis","ages":["11-12"],"fundamental":"serving","progression":"refine","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player tossing the ball, bending the knees, reaching up with the racquet, and snapping the wrist at contact above the head.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean four-phase serve drill."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/tennis-serve-full-motion.md";
				const url = undefined;
				function rawContent() {
					return "\nThe full serve has four phases. Toss, bend, reach, snap. Each phase builds on the last. This drill puts them all together.\n\n**What you need:** Tennis balls, full racquet, tennis court.\n\n**Setup:** Player on the baseline ready to serve. Service box on the other side as the target.\n\n**How to run it:**\n\n1. Cue: Toss, Bend, Reach, Snap.\n2. Toss the ball straight up, slightly in front of the body.\n3. Bend the back leg as the toss rises.\n4. Reach up with the racquet, fully extended at contact.\n5. Snap the wrist forward at contact for power and topspin.\n\n**What to watch:** Reach height. Most kids contact the ball at face height. The right contact is fully extended above the head. The taller the contact, the better the serve angle.\n\n**If they're struggling:** Drop the toss. Practice the swing motion only first.\n\n**If they've got it:** Add target zones (deuce side body, deuce side T, ad side T). Aim for specific spots.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Orange tennis balls (12-pack) →](/go/tennis-balls-orange/) — slower-bounce balls for learning groundstrokes.\n\n[Junior tennis racquet →](/go/tennis-racquet-junior/) — HEAD Speed, pre-strung for beginners.\n\n[Full tennis gear guide →](/what-to-buy/tennis/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
