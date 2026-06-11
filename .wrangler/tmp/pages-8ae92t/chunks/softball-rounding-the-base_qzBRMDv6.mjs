globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Rounding is the next step. The runner takes a wider path around the base than through it. This saves time by keeping momentum and speed.</p>\n<p><strong>What you need:</strong> Home plate, bases at 60 feet, 10 kids.</p>\n<p><strong>Setup:</strong> Kids at home. Bases set at regulation distance.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Eyes, Drive, Touch, Brake (then around the next base).</li>\n<li>Kid hits a ball (or is given one) and runs full speed.</li>\n<li>They Touch the inside corner of first, then immediately attack the path to second.</li>\n<li>They round second by taking a wider arc (3 feet outside the base), looking at third.</li>\n<li>Do 5 reps from home. Walk back. Focus on rounding second smooth, not sharp.</li>\n</ol>\n<p><strong>What to watch:</strong> Do they slow down when rounding? Or keep momentum? Momentum is key. Do their eyes move to third as they round?</p>\n<p><strong>If they’re struggling:</strong> Have them jog, not sprint. Walk through the rounding arc first. Then jog.</p>\n<p><strong>If they’ve got it:</strong> Add a cutoff throw. Coach throws to a relay at third. Runner has to decide to go home or pull up.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/softball-glove-11in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth softball glove →</a> — 11-inch fielder’s glove for new players.</p>\n<p><a href=\"/what-to-buy/softball/\">Full softball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Rounding the Base","summary":"Round second and third without losing speed. 15 minutes. Ages 8-10 and 11-12.","sport":"softball","ages":["8-10","11-12"],"fundamental":"base-running","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Runner taking a wide angle around second base, eyes on third, arm pumping.","editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Rounding cues are concrete; correct base-path distances."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/softball-rounding-the-base.md";
				const url = undefined;
				function rawContent() {
					return "\nRounding is the next step. The runner takes a wider path around the base than through it. This saves time by keeping momentum and speed.\n\n**What you need:** Home plate, bases at 60 feet, 10 kids.\n\n**Setup:** Kids at home. Bases set at regulation distance.\n\n**How to run it:**\n\n1. Cue: Eyes, Drive, Touch, Brake (then around the next base).\n2. Kid hits a ball (or is given one) and runs full speed.\n3. They Touch the inside corner of first, then immediately attack the path to second.\n4. They round second by taking a wider arc (3 feet outside the base), looking at third.\n5. Do 5 reps from home. Walk back. Focus on rounding second smooth, not sharp.\n\n**What to watch:** Do they slow down when rounding? Or keep momentum? Momentum is key. Do their eyes move to third as they round?\n\n**If they're struggling:** Have them jog, not sprint. Walk through the rounding arc first. Then jog.\n\n**If they've got it:** Add a cutoff throw. Coach throws to a relay at third. Runner has to decide to go home or pull up.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth softball glove →](/go/softball-glove-11in/) — 11-inch fielder's glove for new players.\n\n[Full softball gear guide →](/what-to-buy/softball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
