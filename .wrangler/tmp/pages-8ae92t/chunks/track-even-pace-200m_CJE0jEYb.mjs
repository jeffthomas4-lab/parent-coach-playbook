globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Most kids start too fast and die. Even pacing is the bedrock of distance running. This drill teaches the kid to feel the pace and hold it through both halves of the lap.</p>\n<p><strong>What you need:</strong> A 200-meter track or marked oval, a stopwatch.</p>\n<p><strong>Setup:</strong> Runner at the start. Coach with a stopwatch.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Coach times the runner’s typical 200m (their normal pace).</li>\n<li>Goal time: same time as the typical 200m, but split evenly. First 100m and second 100m within 2 seconds of each other.</li>\n<li>Runner runs the 200m. Coach calls split times at the 100m mark and finish.</li>\n<li>Compare splits. If first 100m was 10 seconds faster, the kid started too hard.</li>\n<li>Rest 3 minutes. Repeat. Goal: even splits within 2 seconds.</li>\n</ol>\n<p><strong>What to watch:</strong> Body language at 100m. If the kid looks fresh at 100m, they paced right. If they look gassed, they started too fast.</p>\n<p><strong>If they’re struggling:</strong> Run a 100m at an even pace first. Build to 200m.</p>\n<p><strong>If they’ve got it:</strong> 400m at even splits (two 200m at the same pace).</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/xc-trainers-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth running trainers →</a> — everyday training shoe for track and XC.</p>\n<p><a href=\"/what-to-buy/track-field/\">Full track field gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Even Pace 200 Meters","summary":"Run a 200m at an even pace, not a fast start and slow finish. 10 minutes. Ages 11-12.","sport":"track-field","ages":["11-12"],"fundamental":"pacing","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Runner on a 200m oval, splitting the run into two 100m segments, both run at the same pace with consistent stride.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Even-split pacing teach; clear specifics."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/track-even-pace-200m.md";
				const url = undefined;
				function rawContent() {
					return "\nMost kids start too fast and die. Even pacing is the bedrock of distance running. This drill teaches the kid to feel the pace and hold it through both halves of the lap.\n\n**What you need:** A 200-meter track or marked oval, a stopwatch.\n\n**Setup:** Runner at the start. Coach with a stopwatch.\n\n**How to run it:**\n\n1. Coach times the runner's typical 200m (their normal pace).\n2. Goal time: same time as the typical 200m, but split evenly. First 100m and second 100m within 2 seconds of each other.\n3. Runner runs the 200m. Coach calls split times at the 100m mark and finish.\n4. Compare splits. If first 100m was 10 seconds faster, the kid started too hard.\n5. Rest 3 minutes. Repeat. Goal: even splits within 2 seconds.\n\n**What to watch:** Body language at 100m. If the kid looks fresh at 100m, they paced right. If they look gassed, they started too fast.\n\n**If they're struggling:** Run a 100m at an even pace first. Build to 200m.\n\n**If they've got it:** 400m at even splits (two 200m at the same pace).\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth running trainers →](/go/xc-trainers-youth/) — everyday training shoe for track and XC.\n\n[Full track field gear guide →](/what-to-buy/track-field/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
