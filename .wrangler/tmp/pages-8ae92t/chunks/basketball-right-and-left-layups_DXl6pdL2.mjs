globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Game layups come from both sides. This drill teaches left-hand layups and right-hand layups. Balance in finishing is key.</p>\n<p><strong>What you need:</strong> Basketball. One per kid. 8-foot basket. Flat court.</p>\n<p><strong>Setup:</strong> Line up on the right wing about 12 feet from the basket.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Plant, Up, Lay, Land.</li>\n<li>Dribble hard toward the basket from the right side.</li>\n<li>Plant your inside foot (left foot), step up with outside foot (right foot), lay with right hand.</li>\n<li>Do 5 right-side layups. Walk back to the line. Rest.</li>\n<li>Now from the left side. Do 5 left-side layups with left hand.</li>\n<li>Do 2 rounds of each side.</li>\n</ol>\n<p><strong>What to watch:</strong> Do they use both hands or just one? They should finish with the hand on the side they’re approaching from.</p>\n<p><strong>If they’re struggling:</strong> Slow the approach. Walk instead of dribble. Move closer. Reduce to 3 layups per side.</p>\n<p><strong>If they’ve got it:</strong> Add a defender playing soft pressure on the dribble drive. Shooter must still finish clean.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Right and Left Layups","summary":"Layups approaching from right and left sides of the basket. 10 minutes. Ages 8-10.","sport":"basketball","ages":["8-10"],"fundamental":"finishing","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Two young players making layups from opposite sides of the basket, one from the right and one from the left.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Both-handed finishing emphasis is right for U10."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-right-and-left-layups.md";
				const url = undefined;
				function rawContent() {
					return "\nGame layups come from both sides. This drill teaches left-hand layups and right-hand layups. Balance in finishing is key.\n\n**What you need:** Basketball. One per kid. 8-foot basket. Flat court.\n\n**Setup:** Line up on the right wing about 12 feet from the basket.\n\n**How to run it:**\n\n1. Cue: Plant, Up, Lay, Land.\n2. Dribble hard toward the basket from the right side.\n3. Plant your inside foot (left foot), step up with outside foot (right foot), lay with right hand.\n4. Do 5 right-side layups. Walk back to the line. Rest.\n5. Now from the left side. Do 5 left-side layups with left hand.\n6. Do 2 rounds of each side.\n\n**What to watch:** Do they use both hands or just one? They should finish with the hand on the side they're approaching from.\n\n**If they're struggling:** Slow the approach. Walk instead of dribble. Move closer. Reduce to 3 layups per side.\n\n**If they've got it:** Add a defender playing soft pressure on the dribble drive. Shooter must still finish clean.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
