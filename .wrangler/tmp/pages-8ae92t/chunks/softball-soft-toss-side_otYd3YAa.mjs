globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Soft toss from the side simulates game pitching. The tosser is out of the batter’s direct line of sight. The batter has to find the ball and hit it with proper timing.</p>\n<p><strong>What you need:</strong> 25 softballs (12”), tosser, batter, an age-appropriate bat, a fence or net.</p>\n<p><strong>Setup:</strong> Tosser stands 10 feet to the side of the batter (between first base and the batter’s box). Batter in ready position.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Tosser throws the ball underhand into the strike zone.</li>\n<li>Batter focuses on Set, Load, Step, Swing. Eyes on the ball.</li>\n<li>Do 10 tosses. Count solid contact. Reload after each.</li>\n<li>Round two: tosser mixes zones. High, low, inside, outside. Do 10 more.</li>\n<li>Move tosser back to 15 feet. Do 10 more tosses.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the batter’s head stay on the ball? Or does it pull away? Head must follow the ball.</p>\n<p><strong>If they’re struggling:</strong> Stay at 10 feet. Toss slower. Throw strikes only.</p>\n<p><strong>If they’ve got it:</strong> Move to 20 feet. Toss faster. Mix fastballs with slower off-speed pitches. Vary the zones.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/softball-glove-11in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth softball glove →</a> — 11-inch fielder’s glove for new players.</p>\n<p><a href=\"/what-to-buy/softball/\">Full softball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Soft Toss from the Side","summary":"Hit pitches from the side at game speed. 15 minutes. Ages 8-10 and 11-12.","sport":"softball","ages":["8-10","11-12"],"fundamental":"hitting","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Tosser standing 10 feet to the side of the batter, tossing a ball underhand into the strike zone.","editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Side-toss for live timing; softball ball term fixed."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/softball-soft-toss-side.md";
				const url = undefined;
				function rawContent() {
					return "\nSoft toss from the side simulates game pitching. The tosser is out of the batter's direct line of sight. The batter has to find the ball and hit it with proper timing.\n\n**What you need:** 25 softballs (12\"), tosser, batter, an age-appropriate bat, a fence or net.\n\n**Setup:** Tosser stands 10 feet to the side of the batter (between first base and the batter's box). Batter in ready position.\n\n**How to run it:**\n\n1. Tosser throws the ball underhand into the strike zone.\n2. Batter focuses on Set, Load, Step, Swing. Eyes on the ball.\n3. Do 10 tosses. Count solid contact. Reload after each.\n4. Round two: tosser mixes zones. High, low, inside, outside. Do 10 more.\n5. Move tosser back to 15 feet. Do 10 more tosses.\n\n**What to watch:** Does the batter's head stay on the ball? Or does it pull away? Head must follow the ball.\n\n**If they're struggling:** Stay at 10 feet. Toss slower. Throw strikes only.\n\n**If they've got it:** Move to 20 feet. Toss faster. Mix fastballs with slower off-speed pitches. Vary the zones.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth softball glove →](/go/softball-glove-11in/) — 11-inch fielder's glove for new players.\n\n[Full softball gear guide →](/what-to-buy/softball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
