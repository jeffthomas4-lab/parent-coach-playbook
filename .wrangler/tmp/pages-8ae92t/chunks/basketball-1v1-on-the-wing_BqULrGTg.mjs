globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>One-on-one on the wing teaches individual defense under game conditions. The offensive player has the ball and can score. The defender must stop them or force a turnover.</p>\n<p><strong>What you need:</strong> Basketball. Half-court. Two players per matchup.</p>\n<p><strong>Setup:</strong> Offensive player at the wing with the ball. Defensive player guarding them.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Offense attacks the wing. Tries to score (drive or shoot).</li>\n<li>Defense uses Stance, Slide, Mirror, Hands to stay in front.</li>\n<li>30 seconds on. Count the number of stops (turnovers or defensive stops) vs. offensive makes.</li>\n<li>Switch roles. Do 2 possessions per player. Rest.</li>\n</ol>\n<p><strong>What to watch:</strong> Can the defender stay in front without fouling? That’s the job. Stay low, stay between ball and basket, active hands.</p>\n<p><strong>If they’re struggling:</strong> Reduce to 20 seconds. Offense doesn’t try as hard (60% effort). Give the defense a chance to build confidence.</p>\n<p><strong>If they’ve got it:</strong> Offense plays 100% effort. Defender must be excellent.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"1v1 On the Wing","summary":"One-on-one defense game on the wing. 10 minutes. Ages 11-12.","sport":"basketball","ages":["11-12"],"fundamental":"defending","progression":"refine","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Two young players, one dribbling while the other defends tight on the wing, both competing for the ball.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean. Stance/Slide/Mirror/Hands cue is consistent with the defensive series."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-1v1-on-the-wing.md";
				const url = undefined;
				function rawContent() {
					return "\nOne-on-one on the wing teaches individual defense under game conditions. The offensive player has the ball and can score. The defender must stop them or force a turnover.\n\n**What you need:** Basketball. Half-court. Two players per matchup.\n\n**Setup:** Offensive player at the wing with the ball. Defensive player guarding them.\n\n**How to run it:**\n\n1. Offense attacks the wing. Tries to score (drive or shoot).\n2. Defense uses Stance, Slide, Mirror, Hands to stay in front.\n3. 30 seconds on. Count the number of stops (turnovers or defensive stops) vs. offensive makes.\n4. Switch roles. Do 2 possessions per player. Rest.\n\n**What to watch:** Can the defender stay in front without fouling? That's the job. Stay low, stay between ball and basket, active hands.\n\n**If they're struggling:** Reduce to 20 seconds. Offense doesn't try as hard (60% effort). Give the defense a chance to build confidence.\n\n**If they've got it:** Offense plays 100% effort. Defender must be excellent.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
