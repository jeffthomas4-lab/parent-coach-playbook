globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The figure 8 forces the puck to move both directions. Forehand on one side of the cone, backhand on the other. This is how kids learn to handle on both sides of the body without thinking about it.</p>\n<p><strong>What you need:</strong> Stick, puck (or street hockey ball), two cones, off-ice or on-ice space.</p>\n<p><strong>Setup:</strong> Two cones placed 4 feet apart on the ice or floor.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Player stands at one end of the cones with the puck.</li>\n<li>Stick handle the puck around the first cone (forehand side).</li>\n<li>Continue around the second cone (backhand side).</li>\n<li>Continue the figure 8 pattern, switching sides at each cone.</li>\n<li>Do 30 seconds. Rest. 4 rounds total.</li>\n</ol>\n<p><strong>What to watch:</strong> Is the puck staying close to the stick? Or is it bouncing 2 feet away? Soft hands keep the puck on the blade. Hard hands send it everywhere.</p>\n<p><strong>If they’re struggling:</strong> Wider cones (6 feet apart). Slower tempo. Use a street hockey ball.</p>\n<p><strong>If they’ve got it:</strong> Tighter cones (3 feet). Or do the figure 8 with eyes up, looking at a target on the wall.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/hockey-puck/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Hockey pucks (6-pack) →</a> — regulation pucks for drills and scrimmage.</p>\n<p><a href=\"/go/hockey-stick-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth hockey stick →</a> — Franklin Ripper, flex rated for young players.</p>\n<p><a href=\"/what-to-buy/hockey/\">Full hockey gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Figure Eight Cones","summary":"Stick handle a puck around two cones in a figure 8 pattern. 10 minutes. Ages 5-7 and 8-10.","sport":"hockey","ages":["5-7","8-10"],"fundamental":"stick-handling","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Two cones placed 4 feet apart with a player handling a puck in a figure-8 pattern around them, stick switching between forehand and backhand.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Off-ice with street hockey ball is a useful path for new players."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/hockey-figure-eight-cones.md";
				const url = undefined;
				function rawContent() {
					return "\nThe figure 8 forces the puck to move both directions. Forehand on one side of the cone, backhand on the other. This is how kids learn to handle on both sides of the body without thinking about it.\n\n**What you need:** Stick, puck (or street hockey ball), two cones, off-ice or on-ice space.\n\n**Setup:** Two cones placed 4 feet apart on the ice or floor.\n\n**How to run it:**\n\n1. Player stands at one end of the cones with the puck.\n2. Stick handle the puck around the first cone (forehand side).\n3. Continue around the second cone (backhand side).\n4. Continue the figure 8 pattern, switching sides at each cone.\n5. Do 30 seconds. Rest. 4 rounds total.\n\n**What to watch:** Is the puck staying close to the stick? Or is it bouncing 2 feet away? Soft hands keep the puck on the blade. Hard hands send it everywhere.\n\n**If they're struggling:** Wider cones (6 feet apart). Slower tempo. Use a street hockey ball.\n\n**If they've got it:** Tighter cones (3 feet). Or do the figure 8 with eyes up, looking at a target on the wall.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Hockey pucks (6-pack) →](/go/hockey-puck/) — regulation pucks for drills and scrimmage.\n\n[Youth hockey stick →](/go/hockey-stick-youth/) — Franklin Ripper, flex rated for young players.\n\n[Full hockey gear guide →](/what-to-buy/hockey/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
