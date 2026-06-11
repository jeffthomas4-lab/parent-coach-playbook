globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Most kids hold their breath while swimming or come up to gasp. The right move is to breathe in a rhythm. Every two strokes (one side) or three strokes (both sides). The breath happens during the body rotation, not as a separate movement.</p>\n<p><strong>What you need:</strong> A pool.</p>\n<p><strong>Setup:</strong> Swimmer at one end of the pool.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Swim freestyle slowly.</li>\n<li>Every 2 strokes (or every other right-arm stroke), turn the head to one side and breathe.</li>\n<li>The breath happens during the body roll. Don’t lift the head.</li>\n<li>Exhale slowly underwater between breaths.</li>\n<li>Do 4 lengths. Focus on the rhythm, not speed.</li>\n</ol>\n<p><strong>What to watch:</strong> Head lift. If the swimmer lifts the head out of the water, the legs sink. The head turns with the body, not separately.</p>\n<p><strong>If they’re struggling:</strong> Practice in shallow water. Walk and breathe to feel the rotation.</p>\n<p><strong>If they’ve got it:</strong> Move to bilateral breathing (every 3 strokes, alternating sides).</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/swim-goggles-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth swim goggles →</a> — Speedo Hydrospex, no-fog, fits ages 6–14.</p>\n<p><a href=\"/what-to-buy/swimming/\">Full swimming gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Side Breathing Rhythm","summary":"Establish a consistent breathing pattern in freestyle. 10 minutes. Ages 8-10.","sport":"swimming","ages":["8-10"],"fundamental":"breathing","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Swimmer doing freestyle, turning the head to the side every two strokes to breathe, body rotating with the breath.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Side-breathing rhythm with body-roll cue."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/swimming-side-breathing-rhythm.md";
				const url = undefined;
				function rawContent() {
					return "\nMost kids hold their breath while swimming or come up to gasp. The right move is to breathe in a rhythm. Every two strokes (one side) or three strokes (both sides). The breath happens during the body rotation, not as a separate movement.\n\n**What you need:** A pool.\n\n**Setup:** Swimmer at one end of the pool.\n\n**How to run it:**\n\n1. Swim freestyle slowly.\n2. Every 2 strokes (or every other right-arm stroke), turn the head to one side and breathe.\n3. The breath happens during the body roll. Don't lift the head.\n4. Exhale slowly underwater between breaths.\n5. Do 4 lengths. Focus on the rhythm, not speed.\n\n**What to watch:** Head lift. If the swimmer lifts the head out of the water, the legs sink. The head turns with the body, not separately.\n\n**If they're struggling:** Practice in shallow water. Walk and breathe to feel the rotation.\n\n**If they've got it:** Move to bilateral breathing (every 3 strokes, alternating sides).\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth swim goggles →](/go/swim-goggles-youth/) — Speedo Hydrospex, no-fog, fits ages 6–14.\n\n[Full swimming gear guide →](/what-to-buy/swimming/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
