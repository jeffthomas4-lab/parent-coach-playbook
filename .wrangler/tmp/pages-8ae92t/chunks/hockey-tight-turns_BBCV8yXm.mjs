globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A tight turn changes direction without slowing down. The body leans into the turn like a motorcycle. The inside skate edge holds the curve. Players who can do this beat opponents to loose pucks and shake defenders in tight spaces.</p>\n<p><strong>What you need:</strong> Full gear, ice rink, four cones.</p>\n<p><strong>Setup:</strong> Cones at four spots forming a 10-foot square at center ice.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Skater starts at one cone, sprints forward.</li>\n<li>At the next cone, executes a tight 180-degree turn. Body leans, inside edge holds.</li>\n<li>Sprints to the next cone. Tight turn the other direction.</li>\n<li>Continue around the square. Do 3 laps.</li>\n<li>Last lap at full speed.</li>\n</ol>\n<p><strong>What to watch:</strong> The lean. Without a lean, the turn is wide. With a lean, the turn is sharp. Tell them: “Drop your inside shoulder toward the ice.”</p>\n<p><strong>If they’re struggling:</strong> Bigger square (15 feet). More room for the turn.</p>\n<p><strong>If they’ve got it:</strong> Add a puck. Tight turn while controlling the puck. Or shrink the square to 8 feet.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/hockey-puck/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Hockey pucks (6-pack) →</a> — regulation pucks for drills and scrimmage.</p>\n<p><a href=\"/go/agility-cones/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Agility cones →</a> — for stickhandling courses and skating drills.</p>\n<p><a href=\"/what-to-buy/hockey/\">Full hockey gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Tight Turns","summary":"Turn 180 degrees in a small space without losing speed. 12 minutes. Ages 11-12.","sport":"hockey","ages":["11-12"],"fundamental":"skating","progression":"refine","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Skater leaning into a tight turn, inside leg bent deep, outside leg trailing, body angled into the turn like a motorcycle taking a corner.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Drop-the-shoulder cue is a concrete fix, lean is the whole skill."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/hockey-tight-turns.md";
				const url = undefined;
				function rawContent() {
					return "\nA tight turn changes direction without slowing down. The body leans into the turn like a motorcycle. The inside skate edge holds the curve. Players who can do this beat opponents to loose pucks and shake defenders in tight spaces.\n\n**What you need:** Full gear, ice rink, four cones.\n\n**Setup:** Cones at four spots forming a 10-foot square at center ice.\n\n**How to run it:**\n\n1. Skater starts at one cone, sprints forward.\n2. At the next cone, executes a tight 180-degree turn. Body leans, inside edge holds.\n3. Sprints to the next cone. Tight turn the other direction.\n4. Continue around the square. Do 3 laps.\n5. Last lap at full speed.\n\n**What to watch:** The lean. Without a lean, the turn is wide. With a lean, the turn is sharp. Tell them: \"Drop your inside shoulder toward the ice.\"\n\n**If they're struggling:** Bigger square (15 feet). More room for the turn.\n\n**If they've got it:** Add a puck. Tight turn while controlling the puck. Or shrink the square to 8 feet.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Hockey pucks (6-pack) →](/go/hockey-puck/) — regulation pucks for drills and scrimmage.\n\n[Agility cones →](/go/agility-cones/) — for stickhandling courses and skating drills.\n\n[Full hockey gear guide →](/what-to-buy/hockey/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
