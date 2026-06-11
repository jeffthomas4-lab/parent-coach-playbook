globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Six-year-olds don’t need a sophisticated warm-up. They need movement, attention, and three minutes of energy burn before practice starts. This is that simple version.</p>\n<p><strong>What you need:</strong> Open field. Enough space for a 30-yard line.</p>\n<p><strong>Setup:</strong> Kids in a line at one end of a 30-yard area.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Easy jog from one cone to the other. Walk back. 2 reps.</li>\n<li>Toe touches: 10 reps. Reach down and try to touch toes, hold 1 second, stand up.</li>\n<li>Arm circles: 10 forward, 10 backward.</li>\n<li>High knees in place: 10 each leg.</li>\n<li>One sprint, end to end. Then walk back.</li>\n</ol>\n<p><strong>What to watch:</strong> Are they paying attention? Five-year-olds wander. Keep the warm-up moving fast and they’ll stay with it.</p>\n<p><strong>If they’re struggling:</strong> Cut to 3 exercises. Add fun: “Run like a giraffe.” “Stretch like a tree.”</p>\n<p><strong>If they’ve got it:</strong> Add the dynamic warm-up circuit drill instead. They’ve outgrown the simple version.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/go/agility-cones/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Agility cones →</a> — for setup, base paths, and field drills.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Jog and Stretch Line","summary":"Easy jog plus simple stretches. The youngest kids' warm-up. 6 minutes. T-ball and ages 5-7.","sport":"baseball","ages":["t-ball","5-7"],"fundamental":"warm-up","progression":"intro","focus":"warm-up","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Five young children jogging in a line on a field, then stopping to do simple toe touches and arm circles.","editorial":{"qualityGrade":7,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Note uses 'yard' for a baseball field distance; that's standard plain English here, not a wrong-sport flag."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-jog-and-stretch-line.md";
				const url = undefined;
				function rawContent() {
					return "\nSix-year-olds don't need a sophisticated warm-up. They need movement, attention, and three minutes of energy burn before practice starts. This is that simple version.\n\n**What you need:** Open field. Enough space for a 30-yard line.\n\n**Setup:** Kids in a line at one end of a 30-yard area.\n\n**How to run it:**\n\n1. Easy jog from one cone to the other. Walk back. 2 reps.\n2. Toe touches: 10 reps. Reach down and try to touch toes, hold 1 second, stand up.\n3. Arm circles: 10 forward, 10 backward.\n4. High knees in place: 10 each leg.\n5. One sprint, end to end. Then walk back.\n\n**What to watch:** Are they paying attention? Five-year-olds wander. Keep the warm-up moving fast and they'll stay with it.\n\n**If they're struggling:** Cut to 3 exercises. Add fun: \"Run like a giraffe.\" \"Stretch like a tree.\"\n\n**If they've got it:** Add the dynamic warm-up circuit drill instead. They've outgrown the simple version.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[Agility cones →](/go/agility-cones/) — for setup, base paths, and field drills.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
