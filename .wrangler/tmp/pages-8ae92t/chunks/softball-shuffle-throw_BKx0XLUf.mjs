globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The shuffle is the heart of a strong throw. The back foot steps toward the front foot, which loads the hips and creates rotation. This is how kids build distance and accuracy at the same time.</p>\n<p><strong>What you need:</strong> 15 softballs (12” for 12U), a partner at 30 feet.</p>\n<p><strong>Setup:</strong> Stand 30 feet apart. Kid faces you in a ready position.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Turn, Shuffle, Point, Fire.</li>\n<li>They turn the shoulders (Turn), shuffle the back foot toward the front foot (Shuffle), point the glove (Point), and fire (Fire).</li>\n<li>Do 5 throws. After each throw, reset feet and repeat.</li>\n<li>Move back to 35 feet. Do 5 more.</li>\n<li>Move back to 40 feet. Do 5 more. Count accurate throws.</li>\n<li>Switch: you throw so they see the full motion.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the shuffle foot land in front of or beside the front foot? It should land in front for maximum hip rotation.</p>\n<p><strong>If they’re struggling:</strong> Slow it down. Have them shuffle twice before throwing. Stay at 30 feet.</p>\n<p><strong>If they’ve got it:</strong> Add movement. They shuffle while backing up or moving laterally, then throw on the move.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/softball-glove-11in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth softball glove →</a> — 11-inch fielder’s glove for new players.</p>\n<p><a href=\"/what-to-buy/softball/\">Full softball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Shuffle Throw","summary":"Master the shuffle for distance and accuracy. 12 minutes. Ages 8-10 and 11-12.","sport":"softball","ages":["8-10","11-12"],"fundamental":"throwing","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Child in throwing position with back foot stepping forward toward the glove-side foot, hips rotating, arm cocked.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Throw mechanics drill with the Turn-Shuffle-Point-Fire cue."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/softball-shuffle-throw.md";
				const url = undefined;
				function rawContent() {
					return "\nThe shuffle is the heart of a strong throw. The back foot steps toward the front foot, which loads the hips and creates rotation. This is how kids build distance and accuracy at the same time.\n\n**What you need:** 15 softballs (12\" for 12U), a partner at 30 feet.\n\n**Setup:** Stand 30 feet apart. Kid faces you in a ready position.\n\n**How to run it:**\n\n1. Cue: Turn, Shuffle, Point, Fire.\n2. They turn the shoulders (Turn), shuffle the back foot toward the front foot (Shuffle), point the glove (Point), and fire (Fire).\n3. Do 5 throws. After each throw, reset feet and repeat.\n4. Move back to 35 feet. Do 5 more.\n5. Move back to 40 feet. Do 5 more. Count accurate throws.\n6. Switch: you throw so they see the full motion.\n\n**What to watch:** Does the shuffle foot land in front of or beside the front foot? It should land in front for maximum hip rotation.\n\n**If they're struggling:** Slow it down. Have them shuffle twice before throwing. Stay at 30 feet.\n\n**If they've got it:** Add movement. They shuffle while backing up or moving laterally, then throw on the move.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth softball glove →](/go/softball-glove-11in/) — 11-inch fielder's glove for new players.\n\n[Full softball gear guide →](/what-to-buy/softball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
