globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A stunt group that doesn’t share a count doesn’t share a stunt. This drill is the metronome.</p>\n<p><strong>Equipment needed:</strong> Mat.</p>\n<p><strong>Setup:</strong> Stunt group of four — two bases, flyer, back spot.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Back spot calls “5, 6, 7, 8” out loud.</li>\n<li>On “8,” everyone hits a ready position.</li>\n<li>Then “1, 2, dip, UP” — on UP, the flyer goes airborne.</li>\n<li>Hold the stunt for the duration of a count: “1, 2, 3, 4.”</li>\n<li>“5, 6, down, CRADLE” — on CRADLE, the dismount happens.</li>\n<li>Five reps.</li>\n</ol>\n<p><strong>What to look for:</strong> Everyone hears the back spot. If a base or flyer needs to ask “wait, what count?” the cadence isn’t working.</p>\n<p><strong>Variation:</strong> Have the back spot use a clap on every beat instead of voice. Forces the group to lock in to a physical cue.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/multi-sport-mouthguard-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth mouthguard →</a> — required for most stunt and cheer programs.</p>\n<p><a href=\"/what-to-buy/stunt/\">Full stunt gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Count-Out Call","summary":"Group sets a count-out cadence so every stunt starts on the same beat. Ages 11-14.","sport":"stunt","age":"11-12","ages":["11-12","13-14"],"focus":"culture","layer":"skills","fundamental":"situational","progression":"build","illustrationBrief":"A stunt group huddling before a routine with the back spot calling out the count cadence.","publishedAt":"2026-05-12T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":6,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-12T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Generated as part of the per-sport content baseline. Voice may need a Jeff pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/stunt-count-out-call.md";
				const url = undefined;
				function rawContent() {
					return "\nA stunt group that doesn't share a count doesn't share a stunt. This drill is the metronome.\n\n**Equipment needed:** Mat.\n\n**Setup:** Stunt group of four — two bases, flyer, back spot.\n\n**How to run it:**\n\n1. Back spot calls \"5, 6, 7, 8\" out loud.\n2. On \"8,\" everyone hits a ready position.\n3. Then \"1, 2, dip, UP\" — on UP, the flyer goes airborne.\n4. Hold the stunt for the duration of a count: \"1, 2, 3, 4.\"\n5. \"5, 6, down, CRADLE\" — on CRADLE, the dismount happens.\n6. Five reps.\n\n**What to look for:** Everyone hears the back spot. If a base or flyer needs to ask \"wait, what count?\" the cadence isn't working.\n\n**Variation:** Have the back spot use a clap on every beat instead of voice. Forces the group to lock in to a physical cue.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth mouthguard →](/go/multi-sport-mouthguard-youth/) — required for most stunt and cheer programs.\n\n[Full stunt gear guide →](/what-to-buy/stunt/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
