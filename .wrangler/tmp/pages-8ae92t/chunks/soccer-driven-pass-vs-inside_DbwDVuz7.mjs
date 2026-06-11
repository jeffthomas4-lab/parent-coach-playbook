globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Passing has two speeds. Inside foot passes are slow and accurate. Driven passes use the outside or laces and travel fast over distance. Kids need to know which to use when.</p>\n<p><strong>What you need:</strong> 1 soccer ball, 2 kids, a wall or fence, 20 feet of space.</p>\n<p><strong>Setup:</strong> Two kids 20 feet apart. One has the ball.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>First 5 passes: use the inside foot only. Plant, Open, Strike, Follow. Slow and accurate.</li>\n<li>Count the successful passes.</li>\n<li>Next 5 passes: use the outside of the foot for a driven pass. Same Plant, Open, Strike, Follow, but with the outside of the foot and more speed.</li>\n<li>Count the successful driven passes.</li>\n<li>Now do 5 mixed. Passer decides which to use based on distance and pressure.</li>\n</ol>\n<p><strong>What to watch:</strong> Which style has more errors? At this age, inside foot should be more consistent.</p>\n<p><strong>If they’re struggling:</strong> Reduce distance to 15 feet for driven passes. They’re harder over distance.</p>\n<p><strong>If they’ve got it:</strong> Increase distance to 25 feet. Driven passes are necessary at that distance.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size4/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 4 soccer ball →</a> — right size for ages 8–12.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Driven Pass vs Inside Pass","summary":"Compare two passing styles and when to use each one. 10 minutes. Ages 11-12.","sport":"soccer","ages":["11-12"],"fundamental":"passing","progression":"refine","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Two players demonstrating a hard driven pass with the outside of the foot versus a controlled inside-foot pass.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-driven-pass-vs-inside.md";
				const url = undefined;
				function rawContent() {
					return "\nPassing has two speeds. Inside foot passes are slow and accurate. Driven passes use the outside or laces and travel fast over distance. Kids need to know which to use when.\n\n**What you need:** 1 soccer ball, 2 kids, a wall or fence, 20 feet of space.\n\n**Setup:** Two kids 20 feet apart. One has the ball.\n\n**How to run it:**\n\n1. First 5 passes: use the inside foot only. Plant, Open, Strike, Follow. Slow and accurate.\n2. Count the successful passes.\n3. Next 5 passes: use the outside of the foot for a driven pass. Same Plant, Open, Strike, Follow, but with the outside of the foot and more speed.\n4. Count the successful driven passes.\n5. Now do 5 mixed. Passer decides which to use based on distance and pressure.\n\n**What to watch:** Which style has more errors? At this age, inside foot should be more consistent.\n\n**If they're struggling:** Reduce distance to 15 feet for driven passes. They're harder over distance.\n\n**If they've got it:** Increase distance to 25 feet. Driven passes are necessary at that distance.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 4 soccer ball →](/go/soccer-ball-size4/) — right size for ages 8–12.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
