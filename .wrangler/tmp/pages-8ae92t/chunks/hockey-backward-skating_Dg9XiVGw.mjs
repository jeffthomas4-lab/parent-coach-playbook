globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Defensemen skate backward most of the time. Forwards do too when they’re tracking play. Backward skating uses the same C-cut motion as forward, just inverted. Hard at first, fast once it clicks.</p>\n<p><strong>What you need:</strong> Full gear, ice rink.</p>\n<p><strong>Setup:</strong> Skater at one blue line. Open lane behind them.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: knees bent, weight on the heels, hips low.</li>\n<li>Inside edges push out and forward, tracing an inverted C.</li>\n<li>The body moves backward as the feet push.</li>\n<li>Skate backward to the other blue line.</li>\n<li>Stop. Skate backward to the start. Do 5 trips.</li>\n</ol>\n<p><strong>What to watch:</strong> Are they leaning forward? Backward skating with the chest up makes the skater fall. Lean slightly back, weight on the heels.</p>\n<p><strong>If they’re struggling:</strong> Hold a stick across the ice for balance. Or just glide backward on two feet (no push) until it feels safe.</p>\n<p><strong>If they’ve got it:</strong> Add a defender shape: chest up, hands on the stick, eyes scanning. Now they’re a real defender.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/hockey-puck/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Hockey pucks (6-pack) →</a> — regulation pucks for drills and scrimmage.</p>\n<p><a href=\"/go/hockey-stick-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth hockey stick →</a> — Franklin Ripper, flex rated for young players.</p>\n<p><a href=\"/what-to-buy/hockey/\">Full hockey gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Backward Skating","summary":"Skate backward using inverted C-cuts. 12 minutes. Ages 8-10 and 11-12.","sport":"hockey","ages":["8-10","11-12"],"fundamental":"skating","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Skater facing forward but moving backward, weight on the heels, each foot tracing an inverted C as it pushes.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Inverted C-cut framing connects forward and backward skating cleanly."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/hockey-backward-skating.md";
				const url = undefined;
				function rawContent() {
					return "\nDefensemen skate backward most of the time. Forwards do too when they're tracking play. Backward skating uses the same C-cut motion as forward, just inverted. Hard at first, fast once it clicks.\n\n**What you need:** Full gear, ice rink.\n\n**Setup:** Skater at one blue line. Open lane behind them.\n\n**How to run it:**\n\n1. Cue: knees bent, weight on the heels, hips low.\n2. Inside edges push out and forward, tracing an inverted C.\n3. The body moves backward as the feet push.\n4. Skate backward to the other blue line.\n5. Stop. Skate backward to the start. Do 5 trips.\n\n**What to watch:** Are they leaning forward? Backward skating with the chest up makes the skater fall. Lean slightly back, weight on the heels.\n\n**If they're struggling:** Hold a stick across the ice for balance. Or just glide backward on two feet (no push) until it feels safe.\n\n**If they've got it:** Add a defender shape: chest up, hands on the stick, eyes scanning. Now they're a real defender.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Hockey pucks (6-pack) →](/go/hockey-puck/) — regulation pucks for drills and scrimmage.\n\n[Youth hockey stick →](/go/hockey-stick-youth/) — Franklin Ripper, flex rated for young players.\n\n[Full hockey gear guide →](/what-to-buy/hockey/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
