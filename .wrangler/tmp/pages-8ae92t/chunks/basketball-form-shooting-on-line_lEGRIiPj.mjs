globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Shooting on a line teaches rhythm and consistency. The kid shoots from the same distance along a straight line. No movement yet, just form and repetition.</p>\n<p><strong>What you need:</strong> 8-foot basket. Youth ball. One per kid. Tape or chalk to mark a line.</p>\n<p><strong>Setup:</strong> Mark a baseline 8 feet from the basket (or use the actual baseline). Kids stand on this line at the center, on each side, and in the middle.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Set, Bend, Lift, Cookie.</li>\n<li>Shoot from the center spot. 3 shots. Move slightly left. 3 more shots. Move right. 3 more.</li>\n<li>That’s 9 shots. Rest 30 seconds.</li>\n<li>Do 2 rounds.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the form stay the same at each spot or does it change? Consistency is the goal. Same elbow position, same release height, same follow-through.</p>\n<p><strong>If they’re struggling:</strong> Move closer to 5 feet. Lower the hoop. Do 2 shots at each spot instead of 3.</p>\n<p><strong>If they’ve got it:</strong> Move back to 10 feet or add a dribble before each shot. Adds complexity.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Form Shooting On Line","summary":"Shoot from multiple spots in a line. 10 minutes. Ages 5-7.","sport":"basketball","ages":["5-7"],"fundamental":"shooting","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A young child shooting from the baseline with proper form, feet set and elbow under the ball.","editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Cookie cue is a recurring phrase across the shooting set; consistent."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-form-shooting-on-line.md";
				const url = undefined;
				function rawContent() {
					return "\nShooting on a line teaches rhythm and consistency. The kid shoots from the same distance along a straight line. No movement yet, just form and repetition.\n\n**What you need:** 8-foot basket. Youth ball. One per kid. Tape or chalk to mark a line.\n\n**Setup:** Mark a baseline 8 feet from the basket (or use the actual baseline). Kids stand on this line at the center, on each side, and in the middle.\n\n**How to run it:**\n\n1. Cue: Set, Bend, Lift, Cookie.\n2. Shoot from the center spot. 3 shots. Move slightly left. 3 more shots. Move right. 3 more.\n3. That's 9 shots. Rest 30 seconds.\n4. Do 2 rounds.\n\n**What to watch:** Does the form stay the same at each spot or does it change? Consistency is the goal. Same elbow position, same release height, same follow-through.\n\n**If they're struggling:** Move closer to 5 feet. Lower the hoop. Do 2 shots at each spot instead of 3.\n\n**If they've got it:** Move back to 10 feet or add a dribble before each shot. Adds complexity.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
