globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Time-based intervals are simpler than distance-based for younger runners. 1 minute hard, 1 minute easy. Repeat. The body learns to handle the repeated effort, which builds the engine for longer races.</p>\n<p><strong>What you need:</strong> A track or open path, stopwatch.</p>\n<p><strong>Setup:</strong> Runner at the start of a flat 200-meter or longer area.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Warm up with 5 minutes of easy jogging.</li>\n<li>Run hard for 1 minute (fast but not all-out).</li>\n<li>Jog easy for 1 minute (recovery).</li>\n<li>Repeat: 8 rounds total. 16 minutes of work.</li>\n<li>Cool down with 5 minutes of easy jogging.</li>\n</ol>\n<p><strong>What to watch:</strong> Effort consistency. If the first 1-minute is much harder than the last, the runner started too fast. They should hit the same effort level on every interval.</p>\n<p><strong>If they’re struggling:</strong> 30 seconds on, 1 minute off. Build up.</p>\n<p><strong>If they’ve got it:</strong> 90 seconds on, 1 minute off. Or 6 rounds of 2 minutes on, 1 minute off.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/xc-trainers-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth running trainers →</a> — everyday training shoe for track and XC.</p>\n<p><a href=\"/what-to-buy/track-field/\">Full track field gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"1 Minute On, 1 Minute Off","summary":"Run hard for 1 minute, jog for 1 minute, repeat. 20 minutes. Ages 11-12.","sport":"track-field","ages":["11-12"],"fundamental":"intervals","progression":"refine","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Runner alternating between fast running and slow jogging on a track or open path, watch showing 1-minute intervals.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":true,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Time-based intervals; flag sensitive for distance-effort safety."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/track-1-minute-on-1-minute-off.md";
				const url = undefined;
				function rawContent() {
					return "\nTime-based intervals are simpler than distance-based for younger runners. 1 minute hard, 1 minute easy. Repeat. The body learns to handle the repeated effort, which builds the engine for longer races.\n\n**What you need:** A track or open path, stopwatch.\n\n**Setup:** Runner at the start of a flat 200-meter or longer area.\n\n**How to run it:**\n\n1. Warm up with 5 minutes of easy jogging.\n2. Run hard for 1 minute (fast but not all-out).\n3. Jog easy for 1 minute (recovery).\n4. Repeat: 8 rounds total. 16 minutes of work.\n5. Cool down with 5 minutes of easy jogging.\n\n**What to watch:** Effort consistency. If the first 1-minute is much harder than the last, the runner started too fast. They should hit the same effort level on every interval.\n\n**If they're struggling:** 30 seconds on, 1 minute off. Build up.\n\n**If they've got it:** 90 seconds on, 1 minute off. Or 6 rounds of 2 minutes on, 1 minute off.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth running trainers →](/go/xc-trainers-youth/) — everyday training shoe for track and XC.\n\n[Full track field gear guide →](/what-to-buy/track-field/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
