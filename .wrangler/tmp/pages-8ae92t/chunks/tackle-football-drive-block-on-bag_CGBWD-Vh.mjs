globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A blocking bag gives kids something solid to push. They get to feel what it’s like to plant, punch, and drive with real resistance. The goal is to move the bag 5 yards upfield.</p>\n<p><strong>What you need:</strong> One blocking bag. Mark start and finish lines 5 yards apart.</p>\n<p><strong>Setup:</strong> Place the bag on the start line. Line the kids up 3 yards behind it.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Plant, Punch, Drive, Finish.</li>\n<li>The first kid sprints toward the bag. Plant the front foot when they reach it.</li>\n<li>Punch both hands into the bag. Elbows tight, hands shoulder-width apart.</li>\n<li>Drive the legs. Keep the feet moving. The goal is to move the bag 5 yards forward.</li>\n<li>They’ve finished when the bag crosses the finish line.</li>\n<li>Do 5 reps. Rotate the line.</li>\n</ol>\n<p><strong>What to watch:</strong> Are the knees bent and driving or are they standing up? Bent knees with driving legs means they have power.</p>\n<p><strong>If they’re struggling:</strong> Let them take two steps before they punch. That gives them momentum.</p>\n<p><strong>If they’ve got it:</strong> Do the same thing but now they have to move the bag 7 yards. Or add a second blocker to help push the bag.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/football-rubber-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber football →</a> — Wilson youth rubber ball for rec and practice.</p>\n<p><a href=\"/what-to-buy/football/\">Full football gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Drive Block on Bag","summary":"Drive a blocking bag upfield. 12 minutes. Ages 8-10 and 11-12.","sport":"football","ages":["8-10","11-12"],"fundamental":"blocking","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A young blocker pushing a heavy bag backward with hands in the chest and legs driving.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":true,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Bag-only blocking; sensitive flagged for blocking instruction with bag impact."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/tackle-football-drive-block-on-bag.md";
				const url = undefined;
				function rawContent() {
					return "\nA blocking bag gives kids something solid to push. They get to feel what it's like to plant, punch, and drive with real resistance. The goal is to move the bag 5 yards upfield.\n\n**What you need:** One blocking bag. Mark start and finish lines 5 yards apart.\n\n**Setup:** Place the bag on the start line. Line the kids up 3 yards behind it.\n\n**How to run it:**\n\n1. Cue: Plant, Punch, Drive, Finish.\n2. The first kid sprints toward the bag. Plant the front foot when they reach it.\n3. Punch both hands into the bag. Elbows tight, hands shoulder-width apart.\n4. Drive the legs. Keep the feet moving. The goal is to move the bag 5 yards forward.\n5. They've finished when the bag crosses the finish line.\n6. Do 5 reps. Rotate the line.\n\n**What to watch:** Are the knees bent and driving or are they standing up? Bent knees with driving legs means they have power.\n\n**If they're struggling:** Let them take two steps before they punch. That gives them momentum.\n\n**If they've got it:** Do the same thing but now they have to move the bag 7 yards. Or add a second blocker to help push the bag.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber football →](/go/football-rubber-youth/) — Wilson youth rubber ball for rec and practice.\n\n[Full football gear guide →](/what-to-buy/football/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
