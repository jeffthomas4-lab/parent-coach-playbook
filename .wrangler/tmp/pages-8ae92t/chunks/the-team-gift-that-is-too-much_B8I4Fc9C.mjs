globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The end-of-season group text from the team mom: “We were thinking everyone chip in $80 for the coach’s gift. Sound good?”</p>\n<p>It does not sound good. Eighty dollars times twelve families is $960 for one coach who already got paid by the league. Your family already paid $400 to play in this league. The question feels like a test, and saying “no” looks cheap.</p>\n<p>Three things to know.</p>\n<p><strong>You are not the only family thinking this.</strong> The 30-second silence after a high-dollar gift proposal in a group chat is everyone waiting to see who pushes back first. Be the one. Most of the families on the chat will quietly thank you afterward.</p>\n<p><strong>Push back on the dollar amount, not on the gift.</strong> “I love the idea of a coach gift. Could we do $20 a family and still do something nice? Or a card with a contribution from each kid?” That reframes from “you’re cheap” to “you’re cost-conscious.” Most team moms will adjust.</p>\n<p><strong>Suggest a different shape.</strong> A meaningful card with notes from each kid is more valued by most coaches than an expensive watch. Coaches who have been doing this a while have a closet of generic gifts. The signed ball, the team picture in a frame, the kid-written notes, those land. The expensive watch sits in a drawer.</p>\n<p>If the team mom won’t budge, you don’t have to participate. “We’re going to do something separately. Thank you for organizing.” Done. You’re not in conflict, you’re not a freeloader, you’re handling your own family.</p>\n<p>The coach got paid for the season. The gift is gratitude, not a tip. The amount should reflect what your family can afford, not what one family on the chat thinks the coach deserves.</p>";

				const frontmatter = {"title":"The team gift that's too much","dek":"When the team-mom proposal lands at $80 a family for the coach's gift, and you don't know how to push back without looking cheap.","seoDescription":"The end-of-season group text from the team mom: \"We were thinking everyone chip in $80 for the coach's gift. Sound good?\"","topic":"season-ops","format":"note","phase":"team-parent","teamParentTopic":"money","sport":"multi-sport","age":"all-ages","publishedAt":"2026-05-13T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":8,"originalityGrade":9,"voiceGrade":9,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"affiliateDisclosurePresent":false,"claudeReviewedAt":"2026-04-08T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Surfaces a real and under-discussed money tension."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/articles/the-team-gift-that-is-too-much.md";
				const url = undefined;
				function rawContent() {
					return "\nThe end-of-season group text from the team mom: \"We were thinking everyone chip in $80 for the coach's gift. Sound good?\"\n\nIt does not sound good. Eighty dollars times twelve families is $960 for one coach who already got paid by the league. Your family already paid $400 to play in this league. The question feels like a test, and saying \"no\" looks cheap.\n\nThree things to know.\n\n**You are not the only family thinking this.** The 30-second silence after a high-dollar gift proposal in a group chat is everyone waiting to see who pushes back first. Be the one. Most of the families on the chat will quietly thank you afterward.\n\n**Push back on the dollar amount, not on the gift.** \"I love the idea of a coach gift. Could we do $20 a family and still do something nice? Or a card with a contribution from each kid?\" That reframes from \"you're cheap\" to \"you're cost-conscious.\" Most team moms will adjust.\n\n**Suggest a different shape.** A meaningful card with notes from each kid is more valued by most coaches than an expensive watch. Coaches who have been doing this a while have a closet of generic gifts. The signed ball, the team picture in a frame, the kid-written notes, those land. The expensive watch sits in a drawer.\n\nIf the team mom won't budge, you don't have to participate. \"We're going to do something separately. Thank you for organizing.\" Done. You're not in conflict, you're not a freeloader, you're handling your own family.\n\nThe coach got paid for the season. The gift is gratitude, not a tip. The amount should reflect what your family can afford, not what one family on the chat thinks the coach deserves.\n";
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
