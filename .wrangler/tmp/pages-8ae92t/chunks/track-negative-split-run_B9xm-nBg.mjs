globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A negative split is when the second half of a run is faster than the first. It teaches the runner to hold back early and finish strong. This is how every great distance race is won. Kids who learn it crush their PRs.</p>\n<p><strong>What you need:</strong> A track or marked course, stopwatch.</p>\n<p><strong>Setup:</strong> Runner at the start of an 800m course (two laps of a 400m track).</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Set a target time for the 800m. Use the kid’s typical pace.</li>\n<li>Goal: first 400m at 5 seconds slower than typical pace.</li>\n<li>Goal: second 400m at typical pace or faster.</li>\n<li>Coach calls splits at 200m, 400m, 600m, finish.</li>\n<li>Rest 5 minutes. Discuss the splits. If the first half was too fast, repeat.</li>\n</ol>\n<p><strong>What to watch:</strong> Pace at 400m. If the runner has dropped the pace below target, they’re paced for a negative split. If they’re already at full speed, they can’t speed up.</p>\n<p><strong>If they’re struggling:</strong> Shorter distance (400m with 200m splits).</p>\n<p><strong>If they’ve got it:</strong> Run a 1600m with negative splits across all four 400m segments.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/xc-trainers-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth running trainers →</a> — everyday training shoe for track and XC.</p>\n<p><a href=\"/what-to-buy/track-field/\">Full track field gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Negative Split Run","summary":"Run the second half faster than the first half. 12 minutes. Ages 11-12.","sport":"track-field","ages":["11-12"],"fundamental":"pacing","progression":"refine","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Runner on a track with two halves marked, the second half labeled with a faster pace than the first half.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":true,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Negative-split workout; sensitive flag for distance-effort load."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/track-negative-split-run.md";
				const url = undefined;
				function rawContent() {
					return "\nA negative split is when the second half of a run is faster than the first. It teaches the runner to hold back early and finish strong. This is how every great distance race is won. Kids who learn it crush their PRs.\n\n**What you need:** A track or marked course, stopwatch.\n\n**Setup:** Runner at the start of an 800m course (two laps of a 400m track).\n\n**How to run it:**\n\n1. Set a target time for the 800m. Use the kid's typical pace.\n2. Goal: first 400m at 5 seconds slower than typical pace.\n3. Goal: second 400m at typical pace or faster.\n4. Coach calls splits at 200m, 400m, 600m, finish.\n5. Rest 5 minutes. Discuss the splits. If the first half was too fast, repeat.\n\n**What to watch:** Pace at 400m. If the runner has dropped the pace below target, they're paced for a negative split. If they're already at full speed, they can't speed up.\n\n**If they're struggling:** Shorter distance (400m with 200m splits).\n\n**If they've got it:** Run a 1600m with negative splits across all four 400m segments.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth running trainers →](/go/xc-trainers-youth/) — everyday training shoe for track and XC.\n\n[Full track field gear guide →](/what-to-buy/track-field/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
