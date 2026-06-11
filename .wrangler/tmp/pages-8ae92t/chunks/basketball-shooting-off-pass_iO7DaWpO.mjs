globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Game shots come off passes, not dribbles. This drill teaches the catch-and-shoot mechanics. The passer delivers the ball at chest height so the shooter can shoot immediately.</p>\n<p><strong>What you need:</strong> Basketball. Two kids per pair. Five-spot court.</p>\n<p><strong>Setup:</strong> One kid at each of the five spots. One passer in the middle near the foul line.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Passer throws a chest pass to the first shooter.</li>\n<li>Shooter catches at chest height and shoots immediately. No dribble.</li>\n<li>Passer retrieves the ball and passes to the next shooter.</li>\n<li>Passer hits all 5 spots with one pass each. That’s 5 shots. Rest. Rotate passer. Do 2 rounds.</li>\n</ol>\n<p><strong>What to watch:</strong> Do they catch and shoot right away or do they take a dribble? Catch-and-shoot means they’re ready to shoot as soon as the ball touches their hands.</p>\n<p><strong>If they’re struggling:</strong> Move spots closer to 10 feet. Have the passer pass slower or softer so the catch is easier. Reduce to 3 spots.</p>\n<p><strong>If they’ve got it:</strong> Add game speed. Passer throws quickly and the shooter shoots quickly. Adds game-like pace.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Shooting Off Pass","summary":"Catch and shoot immediately after receiving a pass. 10 minutes. Ages 8-10.","sport":"basketball","ages":["8-10"],"fundamental":"shooting","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A young player catching a chest pass and immediately moving into shooting form without a dribble.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean catch-and-shoot drill, correct sport language."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-shooting-off-pass.md";
				const url = undefined;
				function rawContent() {
					return "\nGame shots come off passes, not dribbles. This drill teaches the catch-and-shoot mechanics. The passer delivers the ball at chest height so the shooter can shoot immediately.\n\n**What you need:** Basketball. Two kids per pair. Five-spot court.\n\n**Setup:** One kid at each of the five spots. One passer in the middle near the foul line.\n\n**How to run it:**\n\n1. Passer throws a chest pass to the first shooter.\n2. Shooter catches at chest height and shoots immediately. No dribble.\n3. Passer retrieves the ball and passes to the next shooter.\n4. Passer hits all 5 spots with one pass each. That's 5 shots. Rest. Rotate passer. Do 2 rounds.\n\n**What to watch:** Do they catch and shoot right away or do they take a dribble? Catch-and-shoot means they're ready to shoot as soon as the ball touches their hands.\n\n**If they're struggling:** Move spots closer to 10 feet. Have the passer pass slower or softer so the catch is easier. Reduce to 3 spots.\n\n**If they've got it:** Add game speed. Passer throws quickly and the shooter shoots quickly. Adds game-like pace.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
