globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Pro tennis players split-step before every opponent shot. Small hop, both feet off the ground, land in athletic stance. The split-step times the body to the ball and lets the player push off in any direction. Without it, the first step is slow.</p>\n<p><strong>What you need:</strong> Tennis racquet (no ball needed at first).</p>\n<p><strong>Setup:</strong> Player on the baseline in ready stance.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Coach calls “go.” Player does a small hop, both feet leave the ground.</li>\n<li>Land in athletic stance: feet shoulder-width, knees bent, weight on balls of feet.</li>\n<li>Coach calls a direction: “right” or “left.”</li>\n<li>Player pushes off the correct foot and shuffles 3 steps that direction.</li>\n<li>Reset. Do 10 reps mixing directions.</li>\n</ol>\n<p><strong>What to watch:</strong> Land position. The split-step landing should be soft and balanced, not stiff and tall. Knees bent on landing.</p>\n<p><strong>If they’re struggling:</strong> Slower calls. Shorter shuffles.</p>\n<p><strong>If they’ve got it:</strong> Add a fed ball. Player split-steps, reads the ball direction, shuffles to it, hits.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/tennis-balls-orange/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Orange tennis balls (12-pack) →</a> — slower-bounce balls for learning groundstrokes.</p>\n<p><a href=\"/go/tennis-racquet-junior/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Junior tennis racquet →</a> — HEAD Speed, pre-strung for beginners.</p>\n<p><a href=\"/what-to-buy/tennis/\">Full tennis gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Split Step Footwork","summary":"Small hop before each opponent shot to be ready. 8 minutes. Ages 8-10 and 11-12.","sport":"tennis","ages":["8-10","11-12"],"fundamental":"footwork","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player landing in athletic stance with feet shoulder-width apart after a small hop, ready to push off in any direction.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Split-step footwork with clear ready-position cues."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/tennis-split-step-footwork.md";
				const url = undefined;
				function rawContent() {
					return "\nPro tennis players split-step before every opponent shot. Small hop, both feet off the ground, land in athletic stance. The split-step times the body to the ball and lets the player push off in any direction. Without it, the first step is slow.\n\n**What you need:** Tennis racquet (no ball needed at first).\n\n**Setup:** Player on the baseline in ready stance.\n\n**How to run it:**\n\n1. Coach calls \"go.\" Player does a small hop, both feet leave the ground.\n2. Land in athletic stance: feet shoulder-width, knees bent, weight on balls of feet.\n3. Coach calls a direction: \"right\" or \"left.\"\n4. Player pushes off the correct foot and shuffles 3 steps that direction.\n5. Reset. Do 10 reps mixing directions.\n\n**What to watch:** Land position. The split-step landing should be soft and balanced, not stiff and tall. Knees bent on landing.\n\n**If they're struggling:** Slower calls. Shorter shuffles.\n\n**If they've got it:** Add a fed ball. Player split-steps, reads the ball direction, shuffles to it, hits.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Orange tennis balls (12-pack) →](/go/tennis-balls-orange/) — slower-bounce balls for learning groundstrokes.\n\n[Junior tennis racquet →](/go/tennis-racquet-junior/) — HEAD Speed, pre-strung for beginners.\n\n[Full tennis gear guide →](/what-to-buy/tennis/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
