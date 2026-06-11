globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The defensive stance is the foundation. This drill teaches the position without the ball. Feet wide, knees bent, hands active. Just stance and simple movement.</p>\n<p><strong>What you need:</strong> Open space. No ball needed. Two kids per pair.</p>\n<p><strong>Setup:</strong> Partners face each other about 4 feet apart.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Stance, Slide, Mirror, Hands. Get in an athletic stance. Feet wider than shoulder-width. Knees bent. Hands up and active.</li>\n<li>Partner A moves slowly side to side. Partner B mirrors the movement, staying in stance and facing A.</li>\n<li>Do 20 seconds of mirroring. Then switch. A mirrors while B moves.</li>\n<li>Do 2 rounds of 20 seconds each.</li>\n</ol>\n<p><strong>What to watch:</strong> Are their knees staying bent or are they standing upright? Bend those knees. Low stance = better defense.</p>\n<p><strong>If they’re struggling:</strong> Move even slower. Do 15 seconds instead of 20. Let them stand more upright while they learn the movement.</p>\n<p><strong>If they’ve got it:</strong> Increase to 30 seconds. The offensive player moves faster.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Defensive Stance Mirror","summary":"Stand in defensive stance and mirror a partner's movement. 7 minutes. Ages 5-7.","sport":"basketball","ages":["5-7"],"fundamental":"defending","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Two young children facing each other in defensive stances, one moving slowly while the other mirrors the movement.","editorial":{"qualityGrade":8,"originalityGrade":6,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"No-ball start for ages 5-7 is the right call. Stance/Slide/Mirror/Hands cue is consistent."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-defensive-stance-mirror.md";
				const url = undefined;
				function rawContent() {
					return "\nThe defensive stance is the foundation. This drill teaches the position without the ball. Feet wide, knees bent, hands active. Just stance and simple movement.\n\n**What you need:** Open space. No ball needed. Two kids per pair.\n\n**Setup:** Partners face each other about 4 feet apart.\n\n**How to run it:**\n\n1. Cue: Stance, Slide, Mirror, Hands. Get in an athletic stance. Feet wider than shoulder-width. Knees bent. Hands up and active.\n2. Partner A moves slowly side to side. Partner B mirrors the movement, staying in stance and facing A.\n3. Do 20 seconds of mirroring. Then switch. A mirrors while B moves.\n4. Do 2 rounds of 20 seconds each.\n\n**What to watch:** Are their knees staying bent or are they standing upright? Bend those knees. Low stance = better defense.\n\n**If they're struggling:** Move even slower. Do 15 seconds instead of 20. Let them stand more upright while they learn the movement.\n\n**If they've got it:** Increase to 30 seconds. The offensive player moves faster.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
