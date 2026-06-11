globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>US Soccer guidelines limit heading before age 11-12. This is introductory heading at low volume and with soft balls. We use a beach-ball-style ball or oversized soft ball. Five reps, not twenty. This is about building the technique safely.</p>\n<p><strong>What you need:</strong> 1 soft ball (beach ball size or oversized soccer ball) per child. Open space.</p>\n<p><strong>Setup:</strong> Child stands alone with the soft ball.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Child tosses the ball underhand to themselves at forehead height.</li>\n<li>Child lets the ball drop in front of them, about 1 foot away.</li>\n<li>Child keeps their neck firm and their eyes open.</li>\n<li>Child leans forward and heads the ball down using the forehead, not the top of the head.</li>\n<li>Do 5 headers total.</li>\n</ol>\n<p><strong>What to watch:</strong> Do they keep their eyes open? Eyes closed means they flinch.</p>\n<p><strong>If they’re struggling:</strong> Use a softer ball. Reduce the toss height.</p>\n<p><strong>If they’ve got it:</strong> Head the ball back up instead of down.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size4/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 4 soccer ball →</a> — right size for ages 8–12.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Heading from Self Toss","summary":"Player tosses ball and heads it back down from a standing position. 6 minutes. Ages 11-12.","sport":"soccer","ages":["11-12"],"fundamental":"heading","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player tossing a soft ball to themselves and heading it down with a firm neck.","editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":true,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Heading at 11-12 with US Soccer rule note. Sensitive flag for head-injury topic."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-heading-from-self-toss.md";
				const url = undefined;
				function rawContent() {
					return "\nUS Soccer guidelines limit heading before age 11-12. This is introductory heading at low volume and with soft balls. We use a beach-ball-style ball or oversized soft ball. Five reps, not twenty. This is about building the technique safely.\n\n**What you need:** 1 soft ball (beach ball size or oversized soccer ball) per child. Open space.\n\n**Setup:** Child stands alone with the soft ball.\n\n**How to run it:**\n\n1. Child tosses the ball underhand to themselves at forehead height.\n2. Child lets the ball drop in front of them, about 1 foot away.\n3. Child keeps their neck firm and their eyes open.\n4. Child leans forward and heads the ball down using the forehead, not the top of the head.\n5. Do 5 headers total.\n\n**What to watch:** Do they keep their eyes open? Eyes closed means they flinch.\n\n**If they're struggling:** Use a softer ball. Reduce the toss height.\n\n**If they've got it:** Head the ball back up instead of down.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 4 soccer ball →](/go/soccer-ball-size4/) — right size for ages 8–12.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
