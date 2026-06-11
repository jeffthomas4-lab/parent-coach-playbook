globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Interval training builds speed and stamina at the same time. 200m repeats are the workhorse interval. Run 200m hard, recover by walking 200m, repeat. Six rounds and the kid is faster.</p>\n<p><strong>What you need:</strong> A 400m track, stopwatch.</p>\n<p><strong>Setup:</strong> Runner at the 200m start.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Set a target 200m time (10% slower than the kid’s all-out 200m).</li>\n<li>Run the 200m at target pace.</li>\n<li>Walk the next 200m as recovery. Try to keep moving.</li>\n<li>Run another 200m at target pace.</li>\n<li>Continue: 6 total reps. Track each 200m time.</li>\n</ol>\n<p><strong>What to watch:</strong> Pace consistency. If the first 200m is way faster than the last, the kid is doing all-out sprints, not intervals. Intervals are about repeated effort at a sustainable pace.</p>\n<p><strong>If they’re struggling:</strong> Cut to 4 reps. Or longer recovery (walk 400m between).</p>\n<p><strong>If they’ve got it:</strong> 8 reps. Or shorter recovery (jog the recovery instead of walking).</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/xc-trainers-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth running trainers →</a> — everyday training shoe for track and XC.</p>\n<p><a href=\"/what-to-buy/track-field/\">Full track field gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"200m Repeats","summary":"Run multiple 200m intervals with rest between. 20 minutes. Ages 11-12.","sport":"track-field","ages":["11-12"],"fundamental":"intervals","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Runner sprinting a 200m on a track, then walking the next 200m as recovery, repeating the pattern.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":true,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Standard 200m repeat workout; sensitive due to high-effort intervals."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/track-200m-repeats.md";
				const url = undefined;
				function rawContent() {
					return "\nInterval training builds speed and stamina at the same time. 200m repeats are the workhorse interval. Run 200m hard, recover by walking 200m, repeat. Six rounds and the kid is faster.\n\n**What you need:** A 400m track, stopwatch.\n\n**Setup:** Runner at the 200m start.\n\n**How to run it:**\n\n1. Set a target 200m time (10% slower than the kid's all-out 200m).\n2. Run the 200m at target pace.\n3. Walk the next 200m as recovery. Try to keep moving.\n4. Run another 200m at target pace.\n5. Continue: 6 total reps. Track each 200m time.\n\n**What to watch:** Pace consistency. If the first 200m is way faster than the last, the kid is doing all-out sprints, not intervals. Intervals are about repeated effort at a sustainable pace.\n\n**If they're struggling:** Cut to 4 reps. Or longer recovery (walk 400m between).\n\n**If they've got it:** 8 reps. Or shorter recovery (jog the recovery instead of walking).\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth running trainers →](/go/xc-trainers-youth/) — everyday training shoe for track and XC.\n\n[Full track field gear guide →](/what-to-buy/track-field/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
