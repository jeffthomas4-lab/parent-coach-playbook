globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Front toss is live pitching at a comfortable speed. The ball is still coming slow and straight, but now the kid has to time it and track it. This is the first step toward game-speed pitching.</p>\n<p><strong>What you need:</strong> 20 softballs (11”), coach position, an age-appropriate bat, a fence or net.</p>\n<p><strong>Setup:</strong> Coach stands 20 feet in front of the batter. Batter in Set position with bat ready.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Coach tosses the ball underhand at belt height, straight down the middle.</li>\n<li>Batter focuses on Set, Load, Step, Swing. One cue per round.</li>\n<li>Do 10 tosses. Round one focus on Step. Count how many swings hit the ball.</li>\n<li>Do 10 more. Round two focus on Swing. Does it feel smooth or jerky?</li>\n<li>Switch sides. Coach throws to the opposite side of the plate. Do 10 more.</li>\n</ol>\n<p><strong>What to watch:</strong> Is the batter swinging at all pitches or waiting? Waiting teaches discipline. Does the head stay still during the swing?</p>\n<p><strong>If they’re struggling:</strong> Stand 15 feet away. Toss softer. Move the ball to the middle of the plate.</p>\n<p><strong>If they’ve got it:</strong> Move to 25 feet. Toss slightly faster. Move the ball to different zones (high, low, inside, outside).</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/softball-glove-11in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth softball glove →</a> — 11-inch fielder’s glove for new players.</p>\n<p><a href=\"/what-to-buy/softball/\">Full softball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Coach Front Toss","summary":"Hit live tossed balls from 20 feet. 15 minutes. Ages 5-7 and 8-10.","sport":"softball","ages":["5-7","8-10"],"fundamental":"hitting","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Coach standing 20 feet in front of the batter tossing an underhand pitch, batter in ready position.","editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Front toss is age-appropriate; underhand toss is correct vocabulary. Changed soft baseballs to softballs."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/softball-coach-front-toss.md";
				const url = undefined;
				function rawContent() {
					return "\nFront toss is live pitching at a comfortable speed. The ball is still coming slow and straight, but now the kid has to time it and track it. This is the first step toward game-speed pitching.\n\n**What you need:** 20 softballs (11\"), coach position, an age-appropriate bat, a fence or net.\n\n**Setup:** Coach stands 20 feet in front of the batter. Batter in Set position with bat ready.\n\n**How to run it:**\n\n1. Coach tosses the ball underhand at belt height, straight down the middle.\n2. Batter focuses on Set, Load, Step, Swing. One cue per round.\n3. Do 10 tosses. Round one focus on Step. Count how many swings hit the ball.\n4. Do 10 more. Round two focus on Swing. Does it feel smooth or jerky?\n5. Switch sides. Coach throws to the opposite side of the plate. Do 10 more.\n\n**What to watch:** Is the batter swinging at all pitches or waiting? Waiting teaches discipline. Does the head stay still during the swing?\n\n**If they're struggling:** Stand 15 feet away. Toss softer. Move the ball to the middle of the plate.\n\n**If they've got it:** Move to 25 feet. Toss slightly faster. Move the ball to different zones (high, low, inside, outside).\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth softball glove →](/go/softball-glove-11in/) — 11-inch fielder's glove for new players.\n\n[Full softball gear guide →](/what-to-buy/softball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
