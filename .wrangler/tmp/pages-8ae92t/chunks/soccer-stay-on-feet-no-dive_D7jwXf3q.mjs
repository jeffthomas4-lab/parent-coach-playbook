globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Young defenders want to dive and slide. That’s reckless. Good defending happens on your feet. The defender pokes the ball away with their foot while staying upright and balanced.</p>\n<p><strong>What you need:</strong> 1 soccer ball, 2 kids, 15x15 grid marked with cones.</p>\n<p><strong>Setup:</strong> Attacker has ball. Defender starts 5 feet away.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Attacker dribbles toward the defender using Touch, Look, Push, Go.</li>\n<li>When the defender is 3 feet away, they extend their leg and poke the ball away with their foot.</li>\n<li>Defender stays upright throughout. No diving. No sliding.</li>\n<li>If the defender wins the ball, they keep it. If the attacker goes around, they’ve won.</li>\n<li>4 attempts per player, then switch.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the defender extend their leg or dive their whole body? Leg poke only.</p>\n<p><strong>If they’re struggling:</strong> Move the starting distance to 8 feet. Less speed coming at them.</p>\n<p><strong>If they’ve got it:</strong> Attacker gets more dribble moves. Defender has to react faster.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size4/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 4 soccer ball →</a> — right size for ages 8–12.</p>\n<p><a href=\"/go/soccer-cones-12pk/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Disc cones (50-pack) →</a> — flat cones for gates, grids, and boundary markers.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Stay on Feet, No Dive","summary":"Defender tackles without diving or sliding. 8 minutes. Ages 8-10.","sport":"soccer","ages":["8-10"],"fundamental":"defending","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Defender with legs bent, reaching their foot out to poke the ball away while staying upright.","editorial":{"qualityGrade":8,"originalityGrade":8,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Strong on safety and technique; matches US Soccer guidance against slide tackles at this age."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-stay-on-feet-no-dive.md";
				const url = undefined;
				function rawContent() {
					return "\nYoung defenders want to dive and slide. That's reckless. Good defending happens on your feet. The defender pokes the ball away with their foot while staying upright and balanced.\n\n**What you need:** 1 soccer ball, 2 kids, 15x15 grid marked with cones.\n\n**Setup:** Attacker has ball. Defender starts 5 feet away.\n\n**How to run it:**\n\n1. Attacker dribbles toward the defender using Touch, Look, Push, Go.\n2. When the defender is 3 feet away, they extend their leg and poke the ball away with their foot.\n3. Defender stays upright throughout. No diving. No sliding.\n4. If the defender wins the ball, they keep it. If the attacker goes around, they've won.\n5. 4 attempts per player, then switch.\n\n**What to watch:** Does the defender extend their leg or dive their whole body? Leg poke only.\n\n**If they're struggling:** Move the starting distance to 8 feet. Less speed coming at them.\n\n**If they've got it:** Attacker gets more dribble moves. Defender has to react faster.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 4 soccer ball →](/go/soccer-ball-size4/) — right size for ages 8–12.\n\n[Disc cones (50-pack) →](/go/soccer-cones-12pk/) — flat cones for gates, grids, and boundary markers.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
