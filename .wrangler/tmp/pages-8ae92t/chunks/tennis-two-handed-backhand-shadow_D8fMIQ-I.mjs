globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Two-handed backhand is the standard for kids. Both hands give support and consistency. The motion mirrors the forehand: turn, swing low to high, follow through. Shadow practice builds it before the ball complicates things.</p>\n<p><strong>What you need:</strong> Youth racquet, open space.</p>\n<p><strong>Setup:</strong> Kid in athletic stance, racquet held with both hands.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Turn, Drop, Lift, Follow (same as forehand, opposite side).</li>\n<li>Turn shoulders to the backhand side, racquet back with both hands.</li>\n<li>Drop the racquet head below the imaginary ball.</li>\n<li>Lift through, contacting the imaginary ball in front of the body.</li>\n<li>Follow through with both hands over the opposite shoulder.</li>\n</ol>\n<p><strong>What to watch:</strong> The grip. Both hands on the racquet, dominant hand below, non-dominant hand above. Many kids use only one hand.</p>\n<p><strong>If they’re struggling:</strong> Have them hold the racquet still in the contact position to feel the grip and body angle.</p>\n<p><strong>If they’ve got it:</strong> Add a balloon or beach ball to hit. Or move to a real ball at low speed.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/tennis-balls-orange/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Orange tennis balls (12-pack) →</a> — slower-bounce balls for learning groundstrokes.</p>\n<p><a href=\"/go/tennis-racquet-junior/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Junior tennis racquet →</a> — HEAD Speed, pre-strung for beginners.</p>\n<p><a href=\"/what-to-buy/tennis/\">Full tennis gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Two-Handed Backhand Shadow","summary":"Practice the two-handed backhand swing without a ball. 8 minutes. Ages 5-7 and 8-10.","sport":"tennis","ages":["5-7","8-10"],"fundamental":"backhand","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Young player holding the racquet with both hands, swinging from the backhand side with both hands following through over the opposite shoulder.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Two-handed backhand shadow swing for younger ages."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/tennis-two-handed-backhand-shadow.md";
				const url = undefined;
				function rawContent() {
					return "\nTwo-handed backhand is the standard for kids. Both hands give support and consistency. The motion mirrors the forehand: turn, swing low to high, follow through. Shadow practice builds it before the ball complicates things.\n\n**What you need:** Youth racquet, open space.\n\n**Setup:** Kid in athletic stance, racquet held with both hands.\n\n**How to run it:**\n\n1. Cue: Turn, Drop, Lift, Follow (same as forehand, opposite side).\n2. Turn shoulders to the backhand side, racquet back with both hands.\n3. Drop the racquet head below the imaginary ball.\n4. Lift through, contacting the imaginary ball in front of the body.\n5. Follow through with both hands over the opposite shoulder.\n\n**What to watch:** The grip. Both hands on the racquet, dominant hand below, non-dominant hand above. Many kids use only one hand.\n\n**If they're struggling:** Have them hold the racquet still in the contact position to feel the grip and body angle.\n\n**If they've got it:** Add a balloon or beach ball to hit. Or move to a real ball at low speed.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Orange tennis balls (12-pack) →](/go/tennis-balls-orange/) — slower-bounce balls for learning groundstrokes.\n\n[Junior tennis racquet →](/go/tennis-racquet-junior/) — HEAD Speed, pre-strung for beginners.\n\n[Full tennis gear guide →](/what-to-buy/tennis/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
