globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Marching on skates teaches kids to pick up the feet, not shuffle. A shuffler stays in one place. A marcher moves. This drill is the bridge from glide to stride.</p>\n<p><strong>What you need:</strong> Full hockey gear, an ice rink.</p>\n<p><strong>Setup:</strong> Kid at one end of the ice. Cone or marker at the other end (about 20 feet away).</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: knees up like you’re marching in a parade.</li>\n<li>Kid lifts one knee to belt height, plants the foot back down on the ice.</li>\n<li>Lifts the other knee. Plant.</li>\n<li>Continue marching across to the cone.</li>\n<li>Walk back to the start. Do 4 trips.</li>\n</ol>\n<p><strong>What to watch:</strong> Are the knees actually lifting? Some kids will fake it and just shuffle. Tell them: “Your knee should touch your hand.”</p>\n<p><strong>If they’re struggling:</strong> Slow it down. Or hold a milk crate for balance.</p>\n<p><strong>If they’ve got it:</strong> March faster. Or add a glide between each march step (march, march, glide, march, march, glide).</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/hockey-puck/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Hockey pucks (6-pack) →</a> — regulation pucks for drills and scrimmage.</p>\n<p><a href=\"/go/agility-cones/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Agility cones →</a> — for stickhandling courses and skating drills.</p>\n<p><a href=\"/what-to-buy/hockey/\">Full hockey gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"March on Skates","summary":"Lift the knees high to march forward on the ice. 8 minutes. Ages 5-7.","sport":"hockey","ages":["5-7"],"fundamental":"skating","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A child marching with high knees across the ice, knees lifted to belt height with each step, body upright but knees bent.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Solid early skating drill. Knee-to-hand cue is concrete."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/hockey-march-on-skates.md";
				const url = undefined;
				function rawContent() {
					return "\nMarching on skates teaches kids to pick up the feet, not shuffle. A shuffler stays in one place. A marcher moves. This drill is the bridge from glide to stride.\n\n**What you need:** Full hockey gear, an ice rink.\n\n**Setup:** Kid at one end of the ice. Cone or marker at the other end (about 20 feet away).\n\n**How to run it:**\n\n1. Cue: knees up like you're marching in a parade.\n2. Kid lifts one knee to belt height, plants the foot back down on the ice.\n3. Lifts the other knee. Plant.\n4. Continue marching across to the cone.\n5. Walk back to the start. Do 4 trips.\n\n**What to watch:** Are the knees actually lifting? Some kids will fake it and just shuffle. Tell them: \"Your knee should touch your hand.\"\n\n**If they're struggling:** Slow it down. Or hold a milk crate for balance.\n\n**If they've got it:** March faster. Or add a glide between each march step (march, march, glide, march, march, glide).\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Hockey pucks (6-pack) →](/go/hockey-puck/) — regulation pucks for drills and scrimmage.\n\n[Agility cones →](/go/agility-cones/) — for stickhandling courses and skating drills.\n\n[Full hockey gear guide →](/what-to-buy/hockey/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
