globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Corner kicks are set-piece scoring opportunities. The near-post corner is the simplest: kick it to the near post, attacker finishes. This teaches timing and finishing under pressure.</p>\n<p><strong>What you need:</strong> 1 ball, 3 kids (corner kicker, finisher, goalkeeper or defender), a goal.</p>\n<p><strong>Setup:</strong> Corner is marked. Kicker has the ball at the corner. Attacker is at the near post. Keeper is in goal.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Kicker delivers the ball to the near post using Plant, Open, Strike, Follow. Inswinging curve is best.</li>\n<li>Attacker watches the ball come and times their run.</li>\n<li>Attacker heads or volley-shoots using Plant, Lock, Strike, Finish.</li>\n<li>Ball goes in or gets saved.</li>\n<li>Do 5 corner attempts.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the kicker deliver it to the right spot? Near post is tight.</p>\n<p><strong>If they’re struggling:</strong> Kicker passes instead of kicks. Easier control.</p>\n<p><strong>If they’ve got it:</strong> Add a defender who marks the attacker. Now it’s contested.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size4/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 4 soccer ball →</a> — right size for ages 8–12.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Corner Kick Near Post","summary":"Attacker scores on a near-post corner kick delivery. 10 minutes. Ages 11-12.","sport":"soccer","ages":["11-12"],"fundamental":"set-pieces","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Kicker driving the ball to the near post where an attacker is positioned to head or volley it in.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":true,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Drill mentions heading or volley as finishing options at 11-12 (compliant with US Soccer 11+ heading guidance), but doesn't include rule note about heading restrictions. Volley is the safer default for younger groups."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-corner-kick-near-post.md";
				const url = undefined;
				function rawContent() {
					return "\nCorner kicks are set-piece scoring opportunities. The near-post corner is the simplest: kick it to the near post, attacker finishes. This teaches timing and finishing under pressure.\n\n**What you need:** 1 ball, 3 kids (corner kicker, finisher, goalkeeper or defender), a goal.\n\n**Setup:** Corner is marked. Kicker has the ball at the corner. Attacker is at the near post. Keeper is in goal.\n\n**How to run it:**\n\n1. Kicker delivers the ball to the near post using Plant, Open, Strike, Follow. Inswinging curve is best.\n2. Attacker watches the ball come and times their run.\n3. Attacker heads or volley-shoots using Plant, Lock, Strike, Finish.\n4. Ball goes in or gets saved.\n5. Do 5 corner attempts.\n\n**What to watch:** Does the kicker deliver it to the right spot? Near post is tight.\n\n**If they're struggling:** Kicker passes instead of kicks. Easier control.\n\n**If they've got it:** Add a defender who marks the attacker. Now it's contested.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 4 soccer ball →](/go/soccer-ball-size4/) — right size for ages 8–12.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
