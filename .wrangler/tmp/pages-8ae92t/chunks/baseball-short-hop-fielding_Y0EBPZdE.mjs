globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Short hops are balls that bounce just before they reach the glove. The glove has to be down and angled forward so the ball doesn’t kick up into the chest. This is the play that separates good infielders from average ones.</p>\n<p><strong>What you need:</strong> A glove, 10 baseballs, a flat surface (paved or hard dirt is best for consistent bounces).</p>\n<p><strong>Setup:</strong> Kid in fielding position 12 feet from you. You have the bucket of balls.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Drop, Show, Funnel, Send. On a short hop, Show means glove low and angled forward, palm not flat.</li>\n<li>Throw 5 balls that bounce 6 inches in front of the glove. They have to keep the glove low through the hop.</li>\n<li>Reset and throw 5 from 15 feet, slightly faster.</li>\n<li>Last 5: throw harder one-hoppers from 18 feet. The hop is closer to the glove so the angle has to be right.</li>\n<li>Stop after each rep to check the glove angle.</li>\n</ol>\n<p><strong>What to watch:</strong> The glove angle. Glove face flat (palm up) means the ball bounces over the glove. Glove face angled forward (closing the gap between glove and ground) means the ball goes into the pocket.</p>\n<p><strong>If they’re struggling:</strong> Use tennis balls so the hops are softer. Or move closer so the hop is shorter and slower.</p>\n<p><strong>If they’ve got it:</strong> Use real baseballs at game speed. Or do this drill on uneven dirt so the hops are unpredictable.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Short Hop Fielding","summary":"Field balls that bounce just before the glove. 12 minutes. Ages 11-12.","sport":"baseball","ages":["11-12"],"fundamental":"fielding","progression":"refine","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A child fielding a baseball that bounces 6 inches in front of the glove, with the glove low and angled forward to scoop the ball off the short hop.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-short-hop-fielding.md";
				const url = undefined;
				function rawContent() {
					return "\nShort hops are balls that bounce just before they reach the glove. The glove has to be down and angled forward so the ball doesn't kick up into the chest. This is the play that separates good infielders from average ones.\n\n**What you need:** A glove, 10 baseballs, a flat surface (paved or hard dirt is best for consistent bounces).\n\n**Setup:** Kid in fielding position 12 feet from you. You have the bucket of balls.\n\n**How to run it:**\n\n1. Cue: Drop, Show, Funnel, Send. On a short hop, Show means glove low and angled forward, palm not flat.\n2. Throw 5 balls that bounce 6 inches in front of the glove. They have to keep the glove low through the hop.\n3. Reset and throw 5 from 15 feet, slightly faster.\n4. Last 5: throw harder one-hoppers from 18 feet. The hop is closer to the glove so the angle has to be right.\n5. Stop after each rep to check the glove angle.\n\n**What to watch:** The glove angle. Glove face flat (palm up) means the ball bounces over the glove. Glove face angled forward (closing the gap between glove and ground) means the ball goes into the pocket.\n\n**If they're struggling:** Use tennis balls so the hops are softer. Or move closer so the hop is shorter and slower.\n\n**If they've got it:** Use real baseballs at game speed. Or do this drill on uneven dirt so the hops are unpredictable.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
