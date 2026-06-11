globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Most young kids try to catch the ball against their chest. The football bounces off. The right move is hands out front, thumbs together, eyes on the ball. Cue: See, Reach, Squeeze, Tuck.</p>\n<p><strong>What you need:</strong> A foam football. Open grass.</p>\n<p><strong>Setup:</strong> Kid stands 10 feet from you. Both hands ready in front of the chest.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: See, Reach, Squeeze, Tuck.</li>\n<li>Throw a soft underhand pass.</li>\n<li>Kid extends both hands forward, thumbs together for high catches (above chest), pinkies together for low catches (below waist).</li>\n<li>Squeeze the ball when it hits the hands. Pull (tuck) it tight to the chest.</li>\n<li>Do 10 reps. Mix high and low throws.</li>\n</ol>\n<p><strong>What to watch:</strong> Are the hands meeting the ball, or is the chest meeting the ball? Hands out front. The chest is the last resort.</p>\n<p><strong>If they’re struggling:</strong> Move closer. Use a softer ball. Throw lower so the ball is at chest height.</p>\n<p><strong>If they’ve got it:</strong> Move back to 15 feet. Add side-to-side throws so they have to step.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/flag-football-belt-set/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Flag football belt set →</a> — 14-player set for organized flag practice.</p>\n<p><a href=\"/what-to-buy/flag-football/\">Full flag football gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Stationary Catch","summary":"Catch the ball with two hands, hands away from the body. 8 minutes. Ages 5-7.","sport":"flag-football","ages":["5-7"],"fundamental":"catching","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A young child standing 10 feet from an adult, both hands extended forward with thumbs together, catching a foam football.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"See-Reach-Squeeze-Tuck cue. Solid for ages 5-7."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/flag-football-stationary-catch.md";
				const url = undefined;
				function rawContent() {
					return "\nMost young kids try to catch the ball against their chest. The football bounces off. The right move is hands out front, thumbs together, eyes on the ball. Cue: See, Reach, Squeeze, Tuck.\n\n**What you need:** A foam football. Open grass.\n\n**Setup:** Kid stands 10 feet from you. Both hands ready in front of the chest.\n\n**How to run it:**\n\n1. Cue: See, Reach, Squeeze, Tuck.\n2. Throw a soft underhand pass.\n3. Kid extends both hands forward, thumbs together for high catches (above chest), pinkies together for low catches (below waist).\n4. Squeeze the ball when it hits the hands. Pull (tuck) it tight to the chest.\n5. Do 10 reps. Mix high and low throws.\n\n**What to watch:** Are the hands meeting the ball, or is the chest meeting the ball? Hands out front. The chest is the last resort.\n\n**If they're struggling:** Move closer. Use a softer ball. Throw lower so the ball is at chest height.\n\n**If they've got it:** Move back to 15 feet. Add side-to-side throws so they have to step.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Flag football belt set →](/go/flag-football-belt-set/) — 14-player set for organized flag practice.\n\n[Full flag football gear guide →](/what-to-buy/flag-football/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
