globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Cold muscles tear. Eight minutes of dynamic movement gets the body ready for cuts, jumps, and contact. Same routine before every practice. Kids learn it once and run it themselves.</p>\n<p><strong>What you need:</strong> A basketball court or open area, 30 feet long.</p>\n<p><strong>Setup:</strong> Kids start at one baseline. Cones at the far baseline.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>High knees (30 feet): bring the knee up to belt height each step. Walk back.</li>\n<li>Butt kicks (30 feet): heel touches the rear each step. Walk back.</li>\n<li>Side shuffles (30 feet each direction): face the same way both ways.</li>\n<li>Walking lunges (30 feet): deep lunge each step, knee just above the floor.</li>\n<li>Arm swings (in place, 20 reps): big circles forward, then backward.</li>\n</ol>\n<p><strong>What to watch:</strong> Are they doing the full motion? High knees should be HIGH. Butt kicks should hit the rear. Half-effort warm-ups don’t do the job.</p>\n<p><strong>If they’re struggling:</strong> Cut to 15 feet. Or do 3 of the 5 exercises.</p>\n<p><strong>If they’ve got it:</strong> Add a power skip or carioca step (legs crossing front and back while moving sideways).</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/go/agility-cones/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Agility cones →</a> — for lane markers, footwork guides, and drills.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Dynamic Stretch Circuit","summary":"Five movement exercises before practice or a game. 8 minutes. All ages.","sport":"basketball","ages":["5-7","8-10","11-12"],"fundamental":"warm-up","progression":"intro","focus":"warm-up","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Five small drawings showing high knees, butt kicks, side shuffles, walking lunges, and arm swings on a basketball court.","editorial":{"qualityGrade":8,"originalityGrade":6,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"'Cold muscles tear' opener has temperature without crossing into medical advice."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-dynamic-stretch-circuit.md";
				const url = undefined;
				function rawContent() {
					return "\nCold muscles tear. Eight minutes of dynamic movement gets the body ready for cuts, jumps, and contact. Same routine before every practice. Kids learn it once and run it themselves.\n\n**What you need:** A basketball court or open area, 30 feet long.\n\n**Setup:** Kids start at one baseline. Cones at the far baseline.\n\n**How to run it:**\n\n1. High knees (30 feet): bring the knee up to belt height each step. Walk back.\n2. Butt kicks (30 feet): heel touches the rear each step. Walk back.\n3. Side shuffles (30 feet each direction): face the same way both ways.\n4. Walking lunges (30 feet): deep lunge each step, knee just above the floor.\n5. Arm swings (in place, 20 reps): big circles forward, then backward.\n\n**What to watch:** Are they doing the full motion? High knees should be HIGH. Butt kicks should hit the rear. Half-effort warm-ups don't do the job.\n\n**If they're struggling:** Cut to 15 feet. Or do 3 of the 5 exercises.\n\n**If they've got it:** Add a power skip or carioca step (legs crossing front and back while moving sideways).\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Agility cones →](/go/agility-cones/) — for lane markers, footwork guides, and drills.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
