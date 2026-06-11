globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>US Soccer guidelines limit heading before age 11-12. Defensive heading means clearing the ball away from goal. This is low-volume, soft-ball heading. Five reps per attempt. The header is under pressure to clear it, not score.</p>\n<p><strong>What you need:</strong> 1 soft ball, 2 kids (one attacker near goal, one defender), a goal marked with cones.</p>\n<p><strong>Setup:</strong> Goal is 8 feet away. Attacker stands near the goal. Defender lines up 5 feet away.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>You toss the ball high toward both kids.</li>\n<li>Defender jumps and heads the ball away from goal, clearing it to the side or back.</li>\n<li>Attacker also tries to head it. Defender wins and clears it.</li>\n<li>Do 5 header situations per defender.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the defender head it hard and far? Or weak and short?</p>\n<p><strong>If they’re struggling:</strong> Toss easier balls. Let the defender get clear heading opportunities.</p>\n<p><strong>If they’ve got it:</strong> Toss with more pace. Attacker actively challenges the header.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size4/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 4 soccer ball →</a> — right size for ages 8–12.</p>\n<p><a href=\"/go/soccer-cones-12pk/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Disc cones (50-pack) →</a> — flat cones for gates, grids, and boundary markers.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Defensive Heading","summary":"Header clears the ball away from goal under pressure. 10 minutes. Ages 11-12.","sport":"soccer","ages":["11-12"],"fundamental":"heading","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Defender heading the ball away from goal with power, using a firm neck and body.","editorial":{"qualityGrade":7,"originalityGrade":7,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":true,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Heading drill restricted to ages 11-12 with US Soccer rule note and 5-rep cap. Flagged sensitive due to heading injury concerns. Could cite US Soccer/NFHS heading guidance directly for stronger compliance."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-defensive-heading.md";
				const url = undefined;
				function rawContent() {
					return "\nUS Soccer guidelines limit heading before age 11-12. Defensive heading means clearing the ball away from goal. This is low-volume, soft-ball heading. Five reps per attempt. The header is under pressure to clear it, not score.\n\n**What you need:** 1 soft ball, 2 kids (one attacker near goal, one defender), a goal marked with cones.\n\n**Setup:** Goal is 8 feet away. Attacker stands near the goal. Defender lines up 5 feet away.\n\n**How to run it:**\n\n1. You toss the ball high toward both kids.\n2. Defender jumps and heads the ball away from goal, clearing it to the side or back.\n3. Attacker also tries to head it. Defender wins and clears it.\n4. Do 5 header situations per defender.\n\n**What to watch:** Does the defender head it hard and far? Or weak and short?\n\n**If they're struggling:** Toss easier balls. Let the defender get clear heading opportunities.\n\n**If they've got it:** Toss with more pace. Attacker actively challenges the header.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 4 soccer ball →](/go/soccer-ball-size4/) — right size for ages 8–12.\n\n[Disc cones (50-pack) →](/go/soccer-cones-12pk/) — flat cones for gates, grids, and boundary markers.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
