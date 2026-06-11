globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Static stretching cold doesn’t help. Dynamic movement (moving while stretching) wakes the muscles up and prevents injury. Five exercises in a circuit gets the body ready for baseball without taking much time.</p>\n<p><strong>What you need:</strong> Open space, 30 yards long.</p>\n<p><strong>Setup:</strong> Set two cones 30 yards apart. Kids start at one cone.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>High knees (30 yards): bring the knee up to belt height with each step. Walk back to the start.</li>\n<li>Butt kicks (30 yards): heel comes up to touch the rear with each step. Walk back.</li>\n<li>Side shuffles (30 yards each direction): shuffle facing the same direction one way, then the other.</li>\n<li>Walking lunges (30 yards): step into a deep lunge each step.</li>\n<li>Arm swings (in place, 20 reps): big circles forward, then backward, then crosses.</li>\n</ol>\n<p><strong>What to watch:</strong> Are they actually doing the movements or shuffling through? High knees should be HIGH. Butt kicks should hit the rear. Half-effort warm-ups don’t do their job.</p>\n<p><strong>If they’re struggling:</strong> Cut the distance to 15 yards. Or do 3 of the 5 exercises.</p>\n<p><strong>If they’ve got it:</strong> Add a power skip or a carioca step (legs crossing in front and behind while moving sideways) for extra athleticism.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/go/agility-cones/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Agility cones →</a> — for setup, base paths, and field drills.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Dynamic Warm-Up Circuit","summary":"Five movement exercises before practice or a game. 10 minutes. Ages 5-7, 8-10, and 11-12.","sport":"baseball","ages":["5-7","8-10","11-12"],"fundamental":"warm-up","progression":"intro","focus":"warm-up","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Five small drawings of a child doing high knees, butt kicks, side shuffles, lunges, and arm swings.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-dynamic-warm-up-circuit.md";
				const url = undefined;
				function rawContent() {
					return "\nStatic stretching cold doesn't help. Dynamic movement (moving while stretching) wakes the muscles up and prevents injury. Five exercises in a circuit gets the body ready for baseball without taking much time.\n\n**What you need:** Open space, 30 yards long.\n\n**Setup:** Set two cones 30 yards apart. Kids start at one cone.\n\n**How to run it:**\n\n1. High knees (30 yards): bring the knee up to belt height with each step. Walk back to the start.\n2. Butt kicks (30 yards): heel comes up to touch the rear with each step. Walk back.\n3. Side shuffles (30 yards each direction): shuffle facing the same direction one way, then the other.\n4. Walking lunges (30 yards): step into a deep lunge each step.\n5. Arm swings (in place, 20 reps): big circles forward, then backward, then crosses.\n\n**What to watch:** Are they actually doing the movements or shuffling through? High knees should be HIGH. Butt kicks should hit the rear. Half-effort warm-ups don't do their job.\n\n**If they're struggling:** Cut the distance to 15 yards. Or do 3 of the 5 exercises.\n\n**If they've got it:** Add a power skip or a carioca step (legs crossing in front and behind while moving sideways) for extra athleticism.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[Agility cones →](/go/agility-cones/) — for setup, base paths, and field drills.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
