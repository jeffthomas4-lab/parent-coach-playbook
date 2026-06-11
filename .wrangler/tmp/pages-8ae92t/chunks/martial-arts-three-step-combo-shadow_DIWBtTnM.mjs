globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Combos are what separate trained fighters from kids who throw single punches. Shadow work builds the chain.</p>\n<p><strong>Equipment needed:</strong> Open mat space.</p>\n<p><strong>Setup:</strong> Student in fighting stance.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Combo is: jab, cross, lead-leg front kick.</li>\n<li>Throw the combo at half speed for the first five reps.</li>\n<li>Build to full speed for the next ten.</li>\n<li>Final five: throw the combo, then back up two steps and reset.</li>\n<li>Twenty total.</li>\n</ol>\n<p><strong>What to look for:</strong> Each strike returns to guard before the next starts. No floppy hands. The kick stays controlled — chamber the knee before extending.</p>\n<p><strong>Variation:</strong> Mirror combo — left side, then right side. Builds both-sided ability.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/resistance-bands-set/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Resistance band set →</a> — for flexibility, mobility, and conditioning work.</p>\n<p><a href=\"/what-to-buy/martial-arts/\">Full martial arts gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Three-Step Combo Shadow","summary":"Shadow-box a three-strike combination. Twenty reps. Ages 8-12.","sport":"martial-arts","age":"8-10","ages":["8-10","11-12"],"focus":"fundamentals","layer":"skills","fundamental":"footwork","progression":"build","illustrationBrief":"A young martial-arts student in a stance shadow-boxing through a three-strike combination.","publishedAt":"2026-05-12T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":6,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-12T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Generated as part of the per-sport content baseline. Voice may need a Jeff pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/martial-arts-three-step-combo-shadow.md";
				const url = undefined;
				function rawContent() {
					return "\nCombos are what separate trained fighters from kids who throw single punches. Shadow work builds the chain.\n\n**Equipment needed:** Open mat space.\n\n**Setup:** Student in fighting stance.\n\n**How to run it:**\n\n1. Combo is: jab, cross, lead-leg front kick.\n2. Throw the combo at half speed for the first five reps.\n3. Build to full speed for the next ten.\n4. Final five: throw the combo, then back up two steps and reset.\n5. Twenty total.\n\n**What to look for:** Each strike returns to guard before the next starts. No floppy hands. The kick stays controlled — chamber the knee before extending.\n\n**Variation:** Mirror combo — left side, then right side. Builds both-sided ability.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Resistance band set →](/go/resistance-bands-set/) — for flexibility, mobility, and conditioning work.\n\n[Full martial arts gear guide →](/what-to-buy/martial-arts/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
