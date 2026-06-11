globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The glove and blocker are the goalie’s two upper-body tools. Glove catches and holds the puck. Blocker deflects it away. Most goalies favor one and miss with the other. This drill builds both.</p>\n<p><strong>What you need:</strong> Full goalie gear, full hockey gear for shooter, pucks, ice rink with net.</p>\n<p><strong>Setup:</strong> Goalie in net. Shooter 20 feet away with a pile of pucks.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Goalie sets the stance.</li>\n<li>Shooter takes 5 wrist shots aimed at the glove side (high right for a right-catching goalie).</li>\n<li>Goalie catches each one with the glove. Hold the catch.</li>\n<li>Shooter takes 5 wrist shots aimed at the blocker side.</li>\n<li>Goalie deflects each one away from the body, away from the net.</li>\n</ol>\n<p><strong>What to watch:</strong> Glove position. Some goalies hold the glove low (waist height). Saves above the chest require the glove up. Tell them: “Glove up to the shoulder.”</p>\n<p><strong>If they’re struggling:</strong> Slow shots. Closer distance (12 feet). Fewer pucks per round.</p>\n<p><strong>If they’ve got it:</strong> Add movement. Shooter moves before each shot. Goalie has to track and shuffle before saving.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/hockey-puck/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Hockey pucks (6-pack) →</a> — regulation pucks for drills and scrimmage.</p>\n<p><a href=\"/what-to-buy/hockey/\">Full hockey gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Goalie Glove and Blocker Saves","summary":"Goalie makes saves with the glove and the blocker. 12 minutes. Ages 11-12.","sport":"hockey","ages":["11-12"],"fundamental":"goaltending","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Goalie reaching out with the glove hand to catch a puck heading for the upper corner, body square to the shooter.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Glove side and blocker side framing maps to right- vs left-catching goalies cleanly."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/hockey-goalie-glove-and-blocker-saves.md";
				const url = undefined;
				function rawContent() {
					return "\nThe glove and blocker are the goalie's two upper-body tools. Glove catches and holds the puck. Blocker deflects it away. Most goalies favor one and miss with the other. This drill builds both.\n\n**What you need:** Full goalie gear, full hockey gear for shooter, pucks, ice rink with net.\n\n**Setup:** Goalie in net. Shooter 20 feet away with a pile of pucks.\n\n**How to run it:**\n\n1. Goalie sets the stance.\n2. Shooter takes 5 wrist shots aimed at the glove side (high right for a right-catching goalie).\n3. Goalie catches each one with the glove. Hold the catch.\n4. Shooter takes 5 wrist shots aimed at the blocker side.\n5. Goalie deflects each one away from the body, away from the net.\n\n**What to watch:** Glove position. Some goalies hold the glove low (waist height). Saves above the chest require the glove up. Tell them: \"Glove up to the shoulder.\"\n\n**If they're struggling:** Slow shots. Closer distance (12 feet). Fewer pucks per round.\n\n**If they've got it:** Add movement. Shooter moves before each shot. Goalie has to track and shuffle before saving.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Hockey pucks (6-pack) →](/go/hockey-puck/) — regulation pucks for drills and scrimmage.\n\n[Full hockey gear guide →](/what-to-buy/hockey/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
