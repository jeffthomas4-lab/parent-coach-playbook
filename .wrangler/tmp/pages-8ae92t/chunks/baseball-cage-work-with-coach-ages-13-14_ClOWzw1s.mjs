globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A batting cage is the only place a 13-year-old can face live pitching safely and get 40+ swings in 30 minutes. Cage time builds confidence and teaches pitch recognition.</p>\n<p><strong>Equipment needed:</strong> A batting cage, a pitching machine or a coach who can throw strikes, 50-60 baseballs, <a href=\"/go/baseball-helmet-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">helmets</a>, bats.</p>\n<p><strong>Setup:</strong> Hitter at the plate in cage. Pitcher (machine or coach) at 50 feet (Little League distance). Balls cycle automatically or a feeder loads between pitches.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Hitter faces 10 fastballs down the middle at 45-50 mph. Focus: contact and line drives.</li>\n<li>Rest and regroup. Next 10: mix fastballs and changeups. Focus: adjusting to different speeds.</li>\n<li>Next 10: pitches in and out. Focus: staying balanced and hitting it where it’s pitched.</li>\n<li>Final 10: your choice (fastballs up, changeups down, whatever they struggled with).</li>\n</ol>\n<p><strong>What to look for:</strong> Swing path consistency and decision-making. Do they chase pitches out of the zone? Do they adjust when the pitch is faster or slower? The cage reveals pattern recognition problems tha</p>";

				const frontmatter = {"title":"Cage Work with a Coach","summary":"Live pitching in a controlled environment. 30 minutes. Ages 13-14+.","sport":"baseball","ages":["13-14"],"focus":"situational","layer":"skills","fundamental":"hitting","progression":"refine","illustrationBrief":"A teenager in a batter's box facing a coach or pitching machine at 50 feet, with a net cage surrounding the batting area.","publishedAt":"2026-03-30T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-cage-work-with-coach-ages-13-14.md";
				const url = undefined;
				function rawContent() {
					return "\nA batting cage is the only place a 13-year-old can face live pitching safely and get 40+ swings in 30 minutes. Cage time builds confidence and teaches pitch recognition.\n\n**Equipment needed:** A batting cage, a pitching machine or a coach who can throw strikes, 50-60 baseballs, [helmets](/go/baseball-helmet-youth/), bats.\n\n**Setup:** Hitter at the plate in cage. Pitcher (machine or coach) at 50 feet (Little League distance). Balls cycle automatically or a feeder loads between pitches.\n\n**How to run it:**\n\n1. Hitter faces 10 fastballs down the middle at 45-50 mph. Focus: contact and line drives.\n2. Rest and regroup. Next 10: mix fastballs and changeups. Focus: adjusting to different speeds.\n3. Next 10: pitches in and out. Focus: staying balanced and hitting it where it's pitched.\n4. Final 10: your choice (fastballs up, changeups down, whatever they struggled with).\n\n**What to look for:** Swing path consistency and decision-making. Do they chase pitches out of the zone? Do they adjust when the pitch is faster or slower? The cage reveals pattern recognition problems tha";
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
