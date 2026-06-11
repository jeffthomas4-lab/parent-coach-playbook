globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The first hockey skill is balance. A kid who can glide on two feet is ready for everything else. Without that, every drill falls apart.</p>\n<p><strong>What you need:</strong> Full hockey gear (helmet, gloves, pads, skates), an ice rink, optionally a milk crate or “skate aid” for support.</p>\n<p><strong>Setup:</strong> Kid on the ice in a crouch position. Coach 10 feet away.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Show the position: feet shoulder-width apart, knees bent, hands on knees or holding a milk crate.</li>\n<li>Kid pushes off from the boards or with one foot, then glides on two feet.</li>\n<li>Hold the position until the glide stops.</li>\n<li>Push again. Glide again.</li>\n<li>Do 10 glides. Each one a little longer.</li>\n</ol>\n<p><strong>What to watch:</strong> Are the knees bent? Standing tall on skates is unstable. Knees bent is balance.</p>\n<p><strong>If they’re struggling:</strong> Use a milk crate or skate aid. Stay close to the boards.</p>\n<p><strong>If they’ve got it:</strong> Glide on one foot for a beat. Or glide and turn in a slight curve.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/hockey-puck/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Hockey pucks (6-pack) →</a> — regulation pucks for drills and scrimmage.</p>\n<p><a href=\"/go/hockey-helmet-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth hockey helmet →</a> — Bauer Lil Sport with cage.</p>\n<p><a href=\"/what-to-buy/hockey/\">Full hockey gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Glide on Two Feet","summary":"First time on the ice: glide forward on two feet without falling. 10 minutes. Ages 5-7.","sport":"hockey","ages":["5-7"],"fundamental":"skating","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A young child on hockey skates with knees bent, hands on a balance bar, gliding forward across the ice.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean intro skating drill, age-appropriate."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/hockey-glide-on-two-feet.md";
				const url = undefined;
				function rawContent() {
					return "\nThe first hockey skill is balance. A kid who can glide on two feet is ready for everything else. Without that, every drill falls apart.\n\n**What you need:** Full hockey gear (helmet, gloves, pads, skates), an ice rink, optionally a milk crate or \"skate aid\" for support.\n\n**Setup:** Kid on the ice in a crouch position. Coach 10 feet away.\n\n**How to run it:**\n\n1. Show the position: feet shoulder-width apart, knees bent, hands on knees or holding a milk crate.\n2. Kid pushes off from the boards or with one foot, then glides on two feet.\n3. Hold the position until the glide stops.\n4. Push again. Glide again.\n5. Do 10 glides. Each one a little longer.\n\n**What to watch:** Are the knees bent? Standing tall on skates is unstable. Knees bent is balance.\n\n**If they're struggling:** Use a milk crate or skate aid. Stay close to the boards.\n\n**If they've got it:** Glide on one foot for a beat. Or glide and turn in a slight curve.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Hockey pucks (6-pack) →](/go/hockey-puck/) — regulation pucks for drills and scrimmage.\n\n[Youth hockey helmet →](/go/hockey-helmet-youth/) — Bauer Lil Sport with cage.\n\n[Full hockey gear guide →](/what-to-buy/hockey/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
