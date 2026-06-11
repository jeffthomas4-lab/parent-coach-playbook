globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Cross country is running over uneven ground. Uphills, downhills, roots, mud. Form has to adjust without breaking down. This drill puts the runner on real terrain and teaches them to keep the form even when the ground changes.</p>\n<p><strong>What you need:</strong> A trail or grass course with mixed terrain (uphill, downhill, flat). Running shoes appropriate for trail.</p>\n<p><strong>Setup:</strong> Runner at the start of a 1-mile loop.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: arms forward and back, knees up, eyes 10 feet ahead.</li>\n<li>Run at a comfortable pace. Mile time should be 1-2 minutes slower than the runner’s track mile.</li>\n<li>Uphill: lean slightly forward, shorten the stride, keep the arms moving.</li>\n<li>Downhill: lean slightly back, lengthen the stride, control the speed (don’t let gravity take over).</li>\n<li>Flat: full stride, full effort.</li>\n</ol>\n<p><strong>What to watch:</strong> Form breakdown on hills. Most kids hunch forward going uphill (good) but stay hunched after. Reset posture at the top.</p>\n<p><strong>If they’re struggling:</strong> Shorter loop. Or run a flat loop first, then add hills.</p>\n<p><strong>If they’ve got it:</strong> Add a tempo segment. Run the middle quarter mile at race pace, then ease back.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/xc-trainers-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth running trainers →</a> — everyday training shoe for road and trail.</p>\n<p><a href=\"/what-to-buy/cross-country/\">Full cross country gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Cross Country Form on Trail","summary":"Run trail terrain with proper form. 20 minutes. Ages 11-12.","sport":"cross-country","ages":["11-12"],"fundamental":"running-form","progression":"refine","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Runner on a dirt trail with mixed terrain (uphill, downhill, flat), maintaining upright posture and even arm swing throughout.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":true,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Trail form work with hill posture cues; sensitive flag for trail terrain."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/xc-form-on-trail.md";
				const url = undefined;
				function rawContent() {
					return "\nCross country is running over uneven ground. Uphills, downhills, roots, mud. Form has to adjust without breaking down. This drill puts the runner on real terrain and teaches them to keep the form even when the ground changes.\n\n**What you need:** A trail or grass course with mixed terrain (uphill, downhill, flat). Running shoes appropriate for trail.\n\n**Setup:** Runner at the start of a 1-mile loop.\n\n**How to run it:**\n\n1. Cue: arms forward and back, knees up, eyes 10 feet ahead.\n2. Run at a comfortable pace. Mile time should be 1-2 minutes slower than the runner's track mile.\n3. Uphill: lean slightly forward, shorten the stride, keep the arms moving.\n4. Downhill: lean slightly back, lengthen the stride, control the speed (don't let gravity take over).\n5. Flat: full stride, full effort.\n\n**What to watch:** Form breakdown on hills. Most kids hunch forward going uphill (good) but stay hunched after. Reset posture at the top.\n\n**If they're struggling:** Shorter loop. Or run a flat loop first, then add hills.\n\n**If they've got it:** Add a tempo segment. Run the middle quarter mile at race pace, then ease back.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth running trainers →](/go/xc-trainers-youth/) — everyday training shoe for road and trail.\n\n[Full cross country gear guide →](/what-to-buy/cross-country/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
