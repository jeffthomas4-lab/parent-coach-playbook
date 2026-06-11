globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The football grip is finger pads on the laces, thumb under the ball, ball held back behind the ear before the throw. Wrong grip and the throw wobbles or duck-flies short. Get the grip right and the throw improves immediately.</p>\n<p><strong>What you need:</strong> A youth-size football. Open grass.</p>\n<p><strong>Setup:</strong> Two kids 10 yards apart. Or kid + parent.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Show the grip: index, middle, ring fingers across the laces. Pinkie off the back. Thumb under the ball, opposite the index.</li>\n<li>Have the kid set the grip 5 times. Check it.</li>\n<li>Show the throw: ball back behind the ear, elbow up, throwing-side foot back. Step with front foot. Throw over the top.</li>\n<li>They throw 10 passes. Reset the grip after each.</li>\n<li>Last 5: focus on the spiral. A spiral means the grip and release are right.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the ball spiral? A wobble means the index finger isn’t the last finger off the ball. The release point is the index finger.</p>\n<p><strong>If they’re struggling:</strong> Use a smaller ball (Wee or Pee Wee size). Or shorten the distance to 5 yards.</p>\n<p><strong>If they’ve got it:</strong> Move back to 15 yards. Add a target on the wall. They have to hit the target with a spiral.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/flag-football-belt-set/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Flag football belt set →</a> — 14-player set for organized flag practice.</p>\n<p><a href=\"/what-to-buy/flag-football/\">Full flag football gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Grip and Throw","summary":"Grip the football and throw an overhand pass. 10 minutes. Ages 8-10.","sport":"flag-football","ages":["8-10"],"fundamental":"throwing","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Close-up of a child's hand gripping a football with three fingers across the laces, thumb underneath, ball held above the ear.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Grip-and-spiral fundamentals. Clean throwing vocabulary."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/flag-football-grip-and-throw.md";
				const url = undefined;
				function rawContent() {
					return "\nThe football grip is finger pads on the laces, thumb under the ball, ball held back behind the ear before the throw. Wrong grip and the throw wobbles or duck-flies short. Get the grip right and the throw improves immediately.\n\n**What you need:** A youth-size football. Open grass.\n\n**Setup:** Two kids 10 yards apart. Or kid + parent.\n\n**How to run it:**\n\n1. Show the grip: index, middle, ring fingers across the laces. Pinkie off the back. Thumb under the ball, opposite the index.\n2. Have the kid set the grip 5 times. Check it.\n3. Show the throw: ball back behind the ear, elbow up, throwing-side foot back. Step with front foot. Throw over the top.\n4. They throw 10 passes. Reset the grip after each.\n5. Last 5: focus on the spiral. A spiral means the grip and release are right.\n\n**What to watch:** Does the ball spiral? A wobble means the index finger isn't the last finger off the ball. The release point is the index finger.\n\n**If they're struggling:** Use a smaller ball (Wee or Pee Wee size). Or shorten the distance to 5 yards.\n\n**If they've got it:** Move back to 15 yards. Add a target on the wall. They have to hit the target with a spiral.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Flag football belt set →](/go/flag-football-belt-set/) — 14-player set for organized flag practice.\n\n[Full flag football gear guide →](/what-to-buy/flag-football/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
