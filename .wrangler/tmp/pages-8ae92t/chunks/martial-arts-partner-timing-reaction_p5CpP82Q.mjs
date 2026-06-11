globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Reaction is the hardest skill to teach. This drill compresses the reaction window.</p>\n<p><strong>Equipment needed:</strong> Open mat space. Two students.</p>\n<p><strong>Setup:</strong> Both in fighting stance, hands up, facing each other at striking distance.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Attacker throws a slow jab — full extension, slow speed.</li>\n<li>Defender slips outside (head moves off line) and throws a counter cross to the open shoulder.</li>\n<li>Both reset.</li>\n<li>Ten reps. Switch roles.</li>\n<li>Round two: attacker speeds up the jab to full speed.</li>\n</ol>\n<p><strong>What to look for:</strong> The defender moves WITH the jab, not after. The slip and counter are one motion. If they’re two motions, the defender is too slow.</p>\n<p><strong>Variation:</strong> Attacker varies between jab, cross, and lead hook. Defender has to read which strike is coming.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/resistance-bands-set/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Resistance band set →</a> — for flexibility, mobility, and conditioning work.</p>\n<p><a href=\"/what-to-buy/martial-arts/\">Full martial arts gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Partner Timing Reaction","summary":"Counter the partner's jab the moment it starts. Ten reps. Ages 11-14.","sport":"martial-arts","age":"11-12","ages":["11-12","13-14"],"focus":"situational","layer":"skills","fundamental":"footwork","progression":"build","illustrationBrief":"Two young students in fighting stance, one mid-jab, the other slipping the punch with a counter cross.","publishedAt":"2026-05-12T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":6,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-12T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Generated as part of the per-sport content baseline. Voice may need a Jeff pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/martial-arts-partner-timing-reaction.md";
				const url = undefined;
				function rawContent() {
					return "\nReaction is the hardest skill to teach. This drill compresses the reaction window.\n\n**Equipment needed:** Open mat space. Two students.\n\n**Setup:** Both in fighting stance, hands up, facing each other at striking distance.\n\n**How to run it:**\n\n1. Attacker throws a slow jab — full extension, slow speed.\n2. Defender slips outside (head moves off line) and throws a counter cross to the open shoulder.\n3. Both reset.\n4. Ten reps. Switch roles.\n5. Round two: attacker speeds up the jab to full speed.\n\n**What to look for:** The defender moves WITH the jab, not after. The slip and counter are one motion. If they're two motions, the defender is too slow.\n\n**Variation:** Attacker varies between jab, cross, and lead hook. Defender has to read which strike is coming.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Resistance band set →](/go/resistance-bands-set/) — for flexibility, mobility, and conditioning work.\n\n[Full martial arts gear guide →](/what-to-buy/martial-arts/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
