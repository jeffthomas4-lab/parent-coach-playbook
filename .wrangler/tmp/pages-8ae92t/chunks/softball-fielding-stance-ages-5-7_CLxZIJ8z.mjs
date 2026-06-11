globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Fielding in softball starts with the feet and the glove down. Young kids want to keep their hands high and reach for the ball. This drill forces the stance first.</p>\n<p><strong>Equipment needed:</strong> 12 softballs, a bucket, open space.</p>\n<p><strong>Setup:</strong> Line four kids up facing you, 12 feet away. You have the bucket.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Call out the stance: “Feet wide, knees bent, glove down.”</li>\n<li>Have them hold that position while you roll a ball slowly at them.</li>\n<li>They field it with the glove staying low.</li>\n<li>You call out the stance again. They reset.</li>\n<li>Do three reps per kid, then rotate. Twelve total reps across all four kids.</li>\n</ol>\n<p><strong>What to look for:</strong> The glove on the ground first, not the hands. Kids who reach up with their hands will miss balls they could have caught.</p>\n<p><strong>Variation:</strong> For kids who catch cleanly, roll the ball slightly to the side so they have to shuffle their feet. For younger kids, just do the stance without rolling the ball, so they build the habit.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/softball-glove-11in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth softball glove →</a> — 11-inch fielder’s glove for new players.</p>\n<p><a href=\"/what-to-buy/softball/\">Full softball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Fielding Stance","summary":"Teach the athletic ready position with ground ball practice. 15 minutes. Ages 5-7.","sport":"softball","ages":["5-7"],"focus":"fundamentals","layer":"foundations","fundamental":"fielding","progression":"intro","illustrationBrief":"Ready position for ground ball reception","publishedAt":"2026-01-09T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Stance teaching for 5-7; concrete cues."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/softball-fielding-stance-ages-5-7.md";
				const url = undefined;
				function rawContent() {
					return "\nFielding in softball starts with the feet and the glove down. Young kids want to keep their hands high and reach for the ball. This drill forces the stance first.\n\n**Equipment needed:** 12 softballs, a bucket, open space.\n\n**Setup:** Line four kids up facing you, 12 feet away. You have the bucket.\n\n**How to run it:**\n\n1. Call out the stance: \"Feet wide, knees bent, glove down.\"\n2. Have them hold that position while you roll a ball slowly at them.\n3. They field it with the glove staying low.\n4. You call out the stance again. They reset.\n5. Do three reps per kid, then rotate. Twelve total reps across all four kids.\n\n**What to look for:** The glove on the ground first, not the hands. Kids who reach up with their hands will miss balls they could have caught.\n\n**Variation:** For kids who catch cleanly, roll the ball slightly to the side so they have to shuffle their feet. For younger kids, just do the stance without rolling the ball, so they build the habit.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth softball glove →](/go/softball-glove-11in/) — 11-inch fielder's glove for new players.\n\n[Full softball gear guide →](/what-to-buy/softball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
