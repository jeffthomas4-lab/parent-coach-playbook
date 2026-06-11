globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Dribbling through gates teaches kids to change direction while keeping the ball close. This is the foundation of all ball movement.</p>\n<p><strong>Equipment needed:</strong> 12 cones (creating 6 gates), 8-10 soccer balls, open space about 40 by 30 yards.</p>\n<p><strong>Setup:</strong> Arrange cones in a line 10 feet apart, creating six gates. Each gate is two cones 4 feet apart.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Kids dribble through the first gate with their right foot, then the next gate with their left foot, alternating all the way.</li>\n<li>First round: slow (just touch the ball between each gate).</li>\n<li>Second round: medium (move faster, touch twice per gate).</li>\n<li>Third round: fast (move as fast as possible, one touch per gate).</li>\n<li>Rotate kids through so each gets three rounds.</li>\n</ol>\n<p><strong>What to look for:</strong> Touch consistency and speed. The faster they dribble, the closer the touches need to be. Kids who lose the ball at speed are kicking it instead of pushing it. Watch the head; if they’re staring at the ball, they can’t see the next gate.</p>\n<p><strong>If they’re struggling:</strong> Cut to three gates and let them use one foot the whole way. Walk through it once before the first round.</p>\n<p><strong>If they’ve got it:</strong> Add a tag. A second kid follows 5 yards behind trying to catch up. The dribbler has to stay ahead through every gate.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-cones-12pk/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Agility cones (set of 12) →</a> — the set used in the diagram. Stackable, bright, holds up to wet grass.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Gates Dribbling","summary":"Dribble through pairs of cones at different speeds. 12 minutes. Ages 5-7.","sport":"soccer","ages":["5-7"],"focus":"fundamentals","layer":"foundations","fundamental":"dribbling","progression":"intro","illustrationBrief":"Young players dribbling a soccer ball through pairs of cones set up as 'gates' across the field at varying speeds.","publishedAt":"2026-01-10T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":7,"originalityGrade":7,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Body completed by editorial agent on 2026-05-09. Truncated original ended at 'the closer the touches nee' before the affiliate block. Affiliate disclosure remains present and FTC-compliant."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-gates-dribbling-ages-5-7.md";
				const url = undefined;
				function rawContent() {
					return "\nDribbling through gates teaches kids to change direction while keeping the ball close. This is the foundation of all ball movement.\n\n**Equipment needed:** 12 cones (creating 6 gates), 8-10 soccer balls, open space about 40 by 30 yards.\n\n**Setup:** Arrange cones in a line 10 feet apart, creating six gates. Each gate is two cones 4 feet apart.\n\n**How to run it:**\n\n1. Kids dribble through the first gate with their right foot, then the next gate with their left foot, alternating all the way.\n2. First round: slow (just touch the ball between each gate).\n3. Second round: medium (move faster, touch twice per gate).\n4. Third round: fast (move as fast as possible, one touch per gate).\n5. Rotate kids through so each gets three rounds.\n\n**What to look for:** Touch consistency and speed. The faster they dribble, the closer the touches need to be. Kids who lose the ball at speed are kicking it instead of pushing it. Watch the head; if they're staring at the ball, they can't see the next gate.\n\n**If they're struggling:** Cut to three gates and let them use one foot the whole way. Walk through it once before the first round.\n\n**If they've got it:** Add a tag. A second kid follows 5 yards behind trying to catch up. The dribbler has to stay ahead through every gate.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Agility cones (set of 12) →](/go/soccer-cones-12pk/) — the set used in the diagram. Stackable, bright, holds up to wet grass.\n\n*As an Amazon Associate we earn from qualifying purchases.*";
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
