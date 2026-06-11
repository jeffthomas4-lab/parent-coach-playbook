globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A hitter who swings at everything strikes out swinging. A hitter who knows the strike zone gets walks and good pitches to hit. This drill teaches the eye before the swing.</p>\n<p><strong>What you need:</strong> 15 baseballs, a tee or screen for the coach to pitch from, home plate.</p>\n<p><strong>Setup:</strong> Coach pitches from 35 feet behind a screen. Batter stands at home plate with the bat ready.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>The strike zone is the width of the plate, knee height to chest height.</li>\n<li>Coach throws 10 pitches. Some strikes, some balls. Mix them.</li>\n<li>Batter does NOT swing. They call out “ball” or “strike” as the pitch crosses the plate.</li>\n<li>Coach tells them right or wrong after each pitch.</li>\n<li>Last 5 pitches: they swing only at strikes.</li>\n</ol>\n<p><strong>What to watch:</strong> Are they calling pitches that are clearly out of the zone “strikes” because they want to swing? That’s a sign of being in attack mode without seeing the ball. The eye has to slow down.</p>\n<p><strong>If they’re struggling:</strong> Throw only obvious strikes and obvious balls. No close pitches.</p>\n<p><strong>If they’ve got it:</strong> Add the close pitches (just at the knees, just at the chest, just off the plate). Now they have to make hard calls.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/go/baseball-trainer/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Batting trainer →</a> — tee and trainer setup for solo swings.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Strike Zone Judgment","summary":"Take pitches and call them ball or strike before swinging. 12 minutes. Ages 8-10 and 11-12.","sport":"baseball","ages":["8-10","11-12"],"fundamental":"hitting","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A child standing in the batter's box with the bat on the shoulder, calling out 'ball' as a pitch crosses the plate at the knees.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-strike-zone-judgment.md";
				const url = undefined;
				function rawContent() {
					return "\nA hitter who swings at everything strikes out swinging. A hitter who knows the strike zone gets walks and good pitches to hit. This drill teaches the eye before the swing.\n\n**What you need:** 15 baseballs, a tee or screen for the coach to pitch from, home plate.\n\n**Setup:** Coach pitches from 35 feet behind a screen. Batter stands at home plate with the bat ready.\n\n**How to run it:**\n\n1. The strike zone is the width of the plate, knee height to chest height.\n2. Coach throws 10 pitches. Some strikes, some balls. Mix them.\n3. Batter does NOT swing. They call out \"ball\" or \"strike\" as the pitch crosses the plate.\n4. Coach tells them right or wrong after each pitch.\n5. Last 5 pitches: they swing only at strikes.\n\n**What to watch:** Are they calling pitches that are clearly out of the zone \"strikes\" because they want to swing? That's a sign of being in attack mode without seeing the ball. The eye has to slow down.\n\n**If they're struggling:** Throw only obvious strikes and obvious balls. No close pitches.\n\n**If they've got it:** Add the close pitches (just at the knees, just at the chest, just off the plate). Now they have to make hard calls.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[Batting trainer →](/go/baseball-trainer/) — tee and trainer setup for solo swings.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
