globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Form shooting teaches the mechanics early. The closer the shot, the easier it is to focus on form instead of result. This drill is all about repetition and habit.</p>\n<p><strong>Equipment needed:</strong> One hoop (lowered if possible to 8 feet), 10-12 basketballs, a bucket.</p>\n<p><strong>Setup:</strong> Mark a line 6 feet from the basket. Kids shoot from this line.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Kid steps to the line with a ball.</li>\n<li>You call “Shoot.” They shoot with proper form: feet shoulder-width, knees bent, elbows in, release high.</li>\n<li>They retrieve the rebound and pass it back to you.</li>\n<li>Repeat. Do 10 shots per kid.</li>\n<li>Count makes.</li>\n</ol>\n<p><strong>What to look for:</strong> Consistent mechanics, not result. The feet, knees, and elbows in the same position every shot. Makes will follow once the form locks in.</p>\n<p><strong>If they’re struggling:</strong> Lower the hoop to 7 feet. Move them to 4 feet. Use a smaller youth ball.</p>\n<p><strong>If they’ve got it:</strong> Step back to 8 feet. Add a one-dribble approach before the shot.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Form Shooting Close","summary":"Shoot from 6 feet with proper form. 15 minutes. Ages 5-7.","sport":"basketball","ages":["5-7"],"focus":"fundamentals","layer":"foundations","fundamental":"shooting","progression":"intro","illustrationBrief":"A young child shooting a basketball from 6 feet away, with hands positioned in shooting form and following through upward.","publishedAt":"2026-01-06T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Body was truncated mid-sentence; completed the close with adjustments."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-form-shooting-close-ages-5-7.md";
				const url = undefined;
				function rawContent() {
					return "\nForm shooting teaches the mechanics early. The closer the shot, the easier it is to focus on form instead of result. This drill is all about repetition and habit.\n\n**Equipment needed:** One hoop (lowered if possible to 8 feet), 10-12 basketballs, a bucket.\n\n**Setup:** Mark a line 6 feet from the basket. Kids shoot from this line.\n\n**How to run it:**\n\n1. Kid steps to the line with a ball.\n2. You call \"Shoot.\" They shoot with proper form: feet shoulder-width, knees bent, elbows in, release high.\n3. They retrieve the rebound and pass it back to you.\n4. Repeat. Do 10 shots per kid.\n5. Count makes.\n\n**What to look for:** Consistent mechanics, not result. The feet, knees, and elbows in the same position every shot. Makes will follow once the form locks in.\n\n**If they're struggling:** Lower the hoop to 7 feet. Move them to 4 feet. Use a smaller youth ball.\n\n**If they've got it:** Step back to 8 feet. Add a one-dribble approach before the shot.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
