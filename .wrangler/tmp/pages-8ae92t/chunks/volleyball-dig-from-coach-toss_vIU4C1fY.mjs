globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A dig is a defensive bump on a hard incoming ball. The platform is the same as the pass, but the timing is faster and the ball is harder. Coach toss is the bridge between drills and live attacks.</p>\n<p><strong>What you need:</strong> A volleyball, two players (coach + defender), a setter target.</p>\n<p><strong>Setup:</strong> Defender in low defensive stance in the back court. Coach 15 feet away with a ball. Setter target 8 feet from the net.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Ready, Platform, Angle, Push.</li>\n<li>Coach throws the ball hard at the defender’s chest, hips, or feet.</li>\n<li>Defender stays low, gets behind the ball, forms the platform.</li>\n<li>Digs the ball up high (10-15 feet) toward the setter target.</li>\n<li>Do 10 reps mixing locations.</li>\n</ol>\n<p><strong>What to watch:</strong> Height of the dig. A flat dig that goes back over the net is wasted. Dig high enough that a setter can play it.</p>\n<p><strong>If they’re struggling:</strong> Slower throws. Closer distance.</p>\n<p><strong>If they’ve got it:</strong> Add real attacks (a hitter on the other side spiking).</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/volleyball-volley-lite/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Volley Lite training ball →</a> — lightweight ball for beginners learning to pass.</p>\n<p><a href=\"/go/volleyball-net/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Portable volleyball net →</a> — 32-ft set with adjustable steel poles.</p>\n<p><a href=\"/what-to-buy/volleyball/\">Full volleyball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Dig from a Coach Toss","summary":"Defender digs a hard tossed ball back to a target. 12 minutes. Ages 11-12.","sport":"volleyball","ages":["11-12"],"fundamental":"defending","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Coach throwing a hard ball at a player in low defensive stance, the player digging the ball up with a flat platform back to a setter target.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Bridge from passing drill to live attack. Dig vocabulary used correctly."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/volleyball-dig-from-coach-toss.md";
				const url = undefined;
				function rawContent() {
					return "\nA dig is a defensive bump on a hard incoming ball. The platform is the same as the pass, but the timing is faster and the ball is harder. Coach toss is the bridge between drills and live attacks.\n\n**What you need:** A volleyball, two players (coach + defender), a setter target.\n\n**Setup:** Defender in low defensive stance in the back court. Coach 15 feet away with a ball. Setter target 8 feet from the net.\n\n**How to run it:**\n\n1. Cue: Ready, Platform, Angle, Push.\n2. Coach throws the ball hard at the defender's chest, hips, or feet.\n3. Defender stays low, gets behind the ball, forms the platform.\n4. Digs the ball up high (10-15 feet) toward the setter target.\n5. Do 10 reps mixing locations.\n\n**What to watch:** Height of the dig. A flat dig that goes back over the net is wasted. Dig high enough that a setter can play it.\n\n**If they're struggling:** Slower throws. Closer distance.\n\n**If they've got it:** Add real attacks (a hitter on the other side spiking).\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Volley Lite training ball →](/go/volleyball-volley-lite/) — lightweight ball for beginners learning to pass.\n\n[Portable volleyball net →](/go/volleyball-net/) — 32-ft set with adjustable steel poles.\n\n[Full volleyball gear guide →](/what-to-buy/volleyball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
