globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Fast base running is about straight lines and quick feet. This drill teaches both at once by turning base running into a race.</p>\n<p><strong>Equipment needed:</strong> Four cones (marking the bases), a stopwatch, open space.</p>\n<p><strong>Setup:</strong> Set up a diamond at 45-foot sides using cones. You stand at home plate with a stopwatch.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>First kid runs from home to first base as fast as they can. Time them.</li>\n<li>They walk back.</li>\n<li>Next kid runs the same path. Compare times.</li>\n<li>After all kids run once, they run again and try to beat their first time.</li>\n<li>Do two rounds. Six to eight kids means 12-16 total runs.</li>\n</ol>\n<p><strong>What to look for:</strong> Kids who run the baseline straight will be faster than kids who curve. Point it out. Show them the difference.</p>\n<p><strong>Variation:</strong> For older kids (7), have them run home to home (around all bases) and time them. For younger kids (5-6), reduce the base distance to 30 feet.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/softball-glove-11in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth softball glove →</a> — 11-inch fielder’s glove for new players.</p>\n<p><a href=\"/go/agility-cones/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Agility cones →</a> — for setup, base paths, and field drills.</p>\n<p><a href=\"/what-to-buy/softball/\">Full softball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Base Running","summary":"Run the bases fast and in a straight line. 12 minutes. Ages 5-7.","sport":"softball","ages":["5-7"],"focus":"fundamentals","layer":"foundations","fundamental":"base-running","progression":"intro","illustrationBrief":"Running bases in proper sequence","publishedAt":"2026-01-16T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Standard baserunning intro; works for ages 5-7."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/softball-base-running-ages-5-7.md";
				const url = undefined;
				function rawContent() {
					return "\nFast base running is about straight lines and quick feet. This drill teaches both at once by turning base running into a race.\n\n**Equipment needed:** Four cones (marking the bases), a stopwatch, open space.\n\n**Setup:** Set up a diamond at 45-foot sides using cones. You stand at home plate with a stopwatch.\n\n**How to run it:**\n\n1. First kid runs from home to first base as fast as they can. Time them.\n2. They walk back.\n3. Next kid runs the same path. Compare times.\n4. After all kids run once, they run again and try to beat their first time.\n5. Do two rounds. Six to eight kids means 12-16 total runs.\n\n**What to look for:** Kids who run the baseline straight will be faster than kids who curve. Point it out. Show them the difference.\n\n**Variation:** For older kids (7), have them run home to home (around all bases) and time them. For younger kids (5-6), reduce the base distance to 30 feet.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth softball glove →](/go/softball-glove-11in/) — 11-inch fielder's glove for new players.\n\n[Agility cones →](/go/agility-cones/) — for setup, base paths, and field drills.\n\n[Full softball gear guide →](/what-to-buy/softball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
