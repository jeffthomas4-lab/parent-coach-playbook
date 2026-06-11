globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A triangle teaches kids to field from their right, left, and straight ahead. It simulates game situations where the ball doesn’t always come directly at you.</p>\n<p><strong>What you need:</strong> 10 softballs (11”), three kids in a triangle formation 15 feet apart.</p>\n<p><strong>Setup:</strong> Three kids stand in a triangle, each 15 feet from the other two. They all have gloves.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Kid A rolls a grounder to Kid B straight ahead.</li>\n<li>Kid B fields using Drop, Show, Funnel, Send and rolls it to Kid C.</li>\n<li>Kid C fields and rolls to Kid A.</li>\n<li>Do 10 rounds of rolls. Then rotate so everyone plays each position.</li>\n<li>Move to 20 feet apart. Do 10 more rounds.</li>\n</ol>\n<p><strong>What to watch:</strong> On rolls to the side, do their feet move? Or do they just reach? Feet first, then hands.</p>\n<p><strong>If they’re struggling:</strong> Keep it at 12 feet. Roll slower. Use underhand rolls instead of ground balls.</p>\n<p><strong>If they’ve got it:</strong> Move to 25 feet. Add a fourth player and make a square. Roll at different speeds.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/softball-glove-11in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth softball glove →</a> — 11-inch fielder’s glove for new players.</p>\n<p><a href=\"/what-to-buy/softball/\">Full softball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Triangle Grounder","summary":"Field ground balls from multiple angles. 12 minutes. Ages 5-7 and 8-10.","sport":"softball","ages":["5-7","8-10"],"fundamental":"fielding","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Three kids positioned in a triangle, rolling ground balls to each other. One rolls, two wait in ready position.","editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Multi-angle ground-ball formation; ball term fixed."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/softball-triangle-grounder.md";
				const url = undefined;
				function rawContent() {
					return "\nA triangle teaches kids to field from their right, left, and straight ahead. It simulates game situations where the ball doesn't always come directly at you.\n\n**What you need:** 10 softballs (11\"), three kids in a triangle formation 15 feet apart.\n\n**Setup:** Three kids stand in a triangle, each 15 feet from the other two. They all have gloves.\n\n**How to run it:**\n\n1. Kid A rolls a grounder to Kid B straight ahead.\n2. Kid B fields using Drop, Show, Funnel, Send and rolls it to Kid C.\n3. Kid C fields and rolls to Kid A.\n4. Do 10 rounds of rolls. Then rotate so everyone plays each position.\n5. Move to 20 feet apart. Do 10 more rounds.\n\n**What to watch:** On rolls to the side, do their feet move? Or do they just reach? Feet first, then hands.\n\n**If they're struggling:** Keep it at 12 feet. Roll slower. Use underhand rolls instead of ground balls.\n\n**If they've got it:** Move to 25 feet. Add a fourth player and make a square. Roll at different speeds.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth softball glove →](/go/softball-glove-11in/) — 11-inch fielder's glove for new players.\n\n[Full softball gear guide →](/what-to-buy/softball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
