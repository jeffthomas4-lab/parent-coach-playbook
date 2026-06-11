globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The dip-pop is the engine of every stunt. Bases get it right, the stunt goes up. Bases get it wrong, the stunt collapses.</p>\n<p><strong>Equipment needed:</strong> Mat space. Two bases.</p>\n<p><strong>Setup:</strong> Two bases face each other, slightly closer than shoulder-width apart.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Both bases bend the knees into a quarter squat — the “dip.”</li>\n<li>On a sharp “POP,” both extend the knees fully and arms reach overhead.</li>\n<li>Reset.</li>\n<li>Ten reps. Bases sync their dip and pop exactly.</li>\n</ol>\n<p><strong>What to look for:</strong> Both bases dip at the same depth and same time. Pop is explosive — no soft extension. Arms reach straight up, not forward.</p>\n<p><strong>Variation:</strong> Add a coach calling “one, two, dip, POP” so bases learn to respond to a cue. Builds rhythm without a flyer.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/cheer-shoes-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth cheer shoes →</a> — lightweight split-sole shoes for stunts and tumbling.</p>\n<p><a href=\"/what-to-buy/cheer/\">Full cheer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Stunt Prep: Dip-Pop","summary":"Bases practice the dip-pop motion without a flyer. Ten reps. Ages 11-14.","sport":"cheer","age":"11-12","ages":["11-12","13-14"],"focus":"situational","layer":"skills","fundamental":"positioning","progression":"build","illustrationBrief":"Two cheer bases facing each other in a dip position, arms ready to pop a stunt upward.","publishedAt":"2026-05-12T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":6,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-12T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Generated as part of the per-sport content baseline. Voice may need a Jeff pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/cheer-stunt-prep-dip-pop.md";
				const url = undefined;
				function rawContent() {
					return "\nThe dip-pop is the engine of every stunt. Bases get it right, the stunt goes up. Bases get it wrong, the stunt collapses.\n\n**Equipment needed:** Mat space. Two bases.\n\n**Setup:** Two bases face each other, slightly closer than shoulder-width apart.\n\n**How to run it:**\n\n1. Both bases bend the knees into a quarter squat — the \"dip.\"\n2. On a sharp \"POP,\" both extend the knees fully and arms reach overhead.\n3. Reset.\n4. Ten reps. Bases sync their dip and pop exactly.\n\n**What to look for:** Both bases dip at the same depth and same time. Pop is explosive — no soft extension. Arms reach straight up, not forward.\n\n**Variation:** Add a coach calling \"one, two, dip, POP\" so bases learn to respond to a cue. Builds rhythm without a flyer.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth cheer shoes →](/go/cheer-shoes-youth/) — lightweight split-sole shoes for stunts and tumbling.\n\n[Full cheer gear guide →](/what-to-buy/cheer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
