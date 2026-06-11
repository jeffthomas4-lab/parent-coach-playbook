globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The floater is a touch shot between a layup and a jump shot. It’s used when the defender is too tall for a normal layup. This drill teaches the soft touch needed for the floater.</p>\n<p><strong>What you need:</strong> Basketball. Half-court. Open paint area.</p>\n<p><strong>Setup:</strong> Kid starts on the wing, about 15 feet from the basket.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Dribble toward the basket at controlled speed.</li>\n<li>At about 10-12 feet from the basket, pick up the dribble.</li>\n<li>Take one more step and shoot a soft floater. The ball has a high arc and soft touch.</li>\n<li>The ball should float over defenders and fall gently into the basket.</li>\n<li>Do 8 reps from different angles. Rest.</li>\n</ol>\n<p><strong>What to watch:</strong> Is the floater soft or is it hard? The floater needs touch. It’s not a hard shot.</p>\n<p><strong>If they’re struggling:</strong> Move closer (8 feet). Reduce the speed of the dribble. Practice just the floater release without the approach.</p>\n<p><strong>If they’ve got it:</strong> Add a tall defender with hands up. The floater must go over the defender.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Runner Floater Shot","summary":"Shoot a soft floater on the move. 10 minutes. Ages 11-12.","sport":"basketball","ages":["11-12"],"fundamental":"finishing","progression":"refine","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A young player running toward the basket and shooting a soft floater over an outstretched defender.","editorial":{"qualityGrade":7,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Title uses runner as a shot-name synonym for floater; body stays in basketball vocab."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-runner-floater-shot.md";
				const url = undefined;
				function rawContent() {
					return "\nThe floater is a touch shot between a layup and a jump shot. It's used when the defender is too tall for a normal layup. This drill teaches the soft touch needed for the floater.\n\n**What you need:** Basketball. Half-court. Open paint area.\n\n**Setup:** Kid starts on the wing, about 15 feet from the basket.\n\n**How to run it:**\n\n1. Dribble toward the basket at controlled speed.\n2. At about 10-12 feet from the basket, pick up the dribble.\n3. Take one more step and shoot a soft floater. The ball has a high arc and soft touch.\n4. The ball should float over defenders and fall gently into the basket.\n5. Do 8 reps from different angles. Rest.\n\n**What to watch:** Is the floater soft or is it hard? The floater needs touch. It's not a hard shot.\n\n**If they're struggling:** Move closer (8 feet). Reduce the speed of the dribble. Practice just the floater release without the approach.\n\n**If they've got it:** Add a tall defender with hands up. The floater must go over the defender.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
