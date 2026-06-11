globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A turn without crossovers loses speed. A turn with crossovers gains speed. Hockey players cross over on every curved path. This drill builds the pattern in a controlled circle.</p>\n<p><strong>What you need:</strong> Full gear, ice rink. The faceoff circle is built for this.</p>\n<p><strong>Setup:</strong> Skater starts at the top of a faceoff circle.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Push, Cross, Push, Cross.</li>\n<li>Skater goes around the circle clockwise. Inside foot pushes out; outside foot crosses in front.</li>\n<li>Each push generates speed. Each crossover keeps the curve.</li>\n<li>Five laps clockwise. Then five laps counter-clockwise (the harder direction for most kids).</li>\n<li>Last 2 laps each direction at full speed.</li>\n</ol>\n<p><strong>What to watch:</strong> The outside foot. Is it crossing in front or just stepping forward? The cross is the move that adds power.</p>\n<p><strong>If they’re struggling:</strong> Slow the speed. Or just walk through the footwork off the ice first (in shoes).</p>\n<p><strong>If they’ve got it:</strong> Add a stick and puck. Do the circles while controlling a puck on the inside hand.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/hockey-puck/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Hockey pucks (6-pack) →</a> — regulation pucks for drills and scrimmage.</p>\n<p><a href=\"/go/hockey-stick-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth hockey stick →</a> — Franklin Ripper, flex rated for young players.</p>\n<p><a href=\"/what-to-buy/hockey/\">Full hockey gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Crossovers Clockwise","summary":"Cross one foot over the other to turn while skating. 15 minutes. Ages 8-10 and 11-12.","sport":"hockey","ages":["8-10","11-12"],"fundamental":"skating","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Skater going around a circle on the ice, the outside foot crossing in front of the inside foot to maintain speed through the turn.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Faceoff circle as built-in track is a smart, real-rink detail."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/hockey-crossovers-clockwise.md";
				const url = undefined;
				function rawContent() {
					return "\nA turn without crossovers loses speed. A turn with crossovers gains speed. Hockey players cross over on every curved path. This drill builds the pattern in a controlled circle.\n\n**What you need:** Full gear, ice rink. The faceoff circle is built for this.\n\n**Setup:** Skater starts at the top of a faceoff circle.\n\n**How to run it:**\n\n1. Cue: Push, Cross, Push, Cross.\n2. Skater goes around the circle clockwise. Inside foot pushes out; outside foot crosses in front.\n3. Each push generates speed. Each crossover keeps the curve.\n4. Five laps clockwise. Then five laps counter-clockwise (the harder direction for most kids).\n5. Last 2 laps each direction at full speed.\n\n**What to watch:** The outside foot. Is it crossing in front or just stepping forward? The cross is the move that adds power.\n\n**If they're struggling:** Slow the speed. Or just walk through the footwork off the ice first (in shoes).\n\n**If they've got it:** Add a stick and puck. Do the circles while controlling a puck on the inside hand.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Hockey pucks (6-pack) →](/go/hockey-puck/) — regulation pucks for drills and scrimmage.\n\n[Youth hockey stick →](/go/hockey-stick-youth/) — Franklin Ripper, flex rated for young players.\n\n[Full hockey gear guide →](/what-to-buy/hockey/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
