globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A clean jump comes from the approach, not the air. Three steps build it.</p>\n<p><strong>Equipment needed:</strong> Mat space.</p>\n<p><strong>Setup:</strong> Cheerleader in a starting stance.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li><strong>Step 1 — Arms.</strong> Practice the arm motion alone: clasp at chest, swing down and around, finish in T position. Five reps.</li>\n<li><strong>Step 2 — Prep dip.</strong> Add a knee bend (the dip) before the jump. Don’t actually jump yet. Five reps of dip + arm swing.</li>\n<li><strong>Step 3 — Full jump.</strong> Dip, swing arms, jump, toe-touch in the air. Land in a clean stance. Five reps.</li>\n</ol>\n<p><strong>What to look for:</strong> Arms hit T at the peak of the jump, not before or after. Knees lock in the toe-touch position — no soft legs.</p>\n<p><strong>Variation:</strong> Film the jump from the side and review with the kid. Most flaws (early arms, soft toes) only show on tape.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/cheer-shoes-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth cheer shoes →</a> — lightweight split-sole shoes for stunts and tumbling.</p>\n<p><a href=\"/what-to-buy/cheer/\">Full cheer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Jump Approach Progression","summary":"Three steps to build a clean toe-touch. Ages 8-12.","sport":"cheer","age":"8-10","ages":["8-10","11-12"],"focus":"fundamentals","layer":"skills","fundamental":"jumping","progression":"build","illustrationBrief":"A young cheerleader in mid-air during a toe-touch jump, legs out at horizontal, hands reaching.","publishedAt":"2026-05-12T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":6,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-12T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Generated as part of the per-sport content baseline. Voice may need a Jeff pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/cheer-jump-approach-progression.md";
				const url = undefined;
				function rawContent() {
					return "\nA clean jump comes from the approach, not the air. Three steps build it.\n\n**Equipment needed:** Mat space.\n\n**Setup:** Cheerleader in a starting stance.\n\n**How to run it:**\n\n1. **Step 1 — Arms.** Practice the arm motion alone: clasp at chest, swing down and around, finish in T position. Five reps.\n2. **Step 2 — Prep dip.** Add a knee bend (the dip) before the jump. Don't actually jump yet. Five reps of dip + arm swing.\n3. **Step 3 — Full jump.** Dip, swing arms, jump, toe-touch in the air. Land in a clean stance. Five reps.\n\n**What to look for:** Arms hit T at the peak of the jump, not before or after. Knees lock in the toe-touch position — no soft legs.\n\n**Variation:** Film the jump from the side and review with the kid. Most flaws (early arms, soft toes) only show on tape.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth cheer shoes →](/go/cheer-shoes-youth/) — lightweight split-sole shoes for stunts and tumbling.\n\n[Full cheer gear guide →](/what-to-buy/cheer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
