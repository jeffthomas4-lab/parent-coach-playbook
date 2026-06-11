globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The carpool you and another family ran for four months is one of the under-thanked relationships in youth sports. Whoever picked your kid up on the rainy Tuesday in March did you a real favor.</p>\n<p>Two short conversations close the season cleanly.</p>\n<p><strong>The thank-you.</strong> Not a card. A specific, in-person thank-you that names the actual drives. “Thank you for picking Jamie up on those Tuesdays. You saved our spring.” Or a small thing: a coffee gift card with a handwritten note. The economy of carpool is reciprocity, and the easiest way to keep it healthy is to acknowledge it explicitly when it ends.</p>\n<p><strong>The honest accounting.</strong> If the carpool was lopsided (one family drove much more), name it now while it’s fresh. “We probably owe you twenty drives. Let us pay for it next season, or buy you dinner this summer.” Don’t let the imbalance carry into a new season as silent resentment.</p>\n<p>If you’re planning to carpool with the same family next season, talk about that now too. “Are you in for fall? Same setup?” Confirming early lets both families plan summer travel and fall registration around it.</p>\n<p>If you’re not continuing the carpool (different team, different schedule, kid quit, your family is taking a break), say that too. “Just so you know, we’re not signing up for fall. The Tuesday-Thursday rotation worked great this year. Thank you.” Don’t ghost the family that drove your kid all season.</p>\n<p>The carpool is its own small contract. Closing it well makes the next one possible.</p>";

				const frontmatter = {"title":"The end-of-season carpool conversation","dek":"How to thank the carpool partner without making it weird, and how to talk about next season's logistics before everyone forgets who drove who in May.","seoDescription":"The carpool you and another family ran for four months is one of the under-thanked relationships in youth sports.","topic":"communication","format":"note","phase":"team-parent","sport":"multi-sport","age":"all-ages","publishedAt":"2026-05-13T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":8,"originalityGrade":8,"voiceGrade":9,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"affiliateDisclosurePresent":false,"claudeReviewedAt":"2026-04-19T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Quietly important season-ops piece."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/articles/the-end-of-season-carpool-conversation.md";
				const url = undefined;
				function rawContent() {
					return "\nThe carpool you and another family ran for four months is one of the under-thanked relationships in youth sports. Whoever picked your kid up on the rainy Tuesday in March did you a real favor.\n\nTwo short conversations close the season cleanly.\n\n**The thank-you.** Not a card. A specific, in-person thank-you that names the actual drives. \"Thank you for picking Jamie up on those Tuesdays. You saved our spring.\" Or a small thing: a coffee gift card with a handwritten note. The economy of carpool is reciprocity, and the easiest way to keep it healthy is to acknowledge it explicitly when it ends.\n\n**The honest accounting.** If the carpool was lopsided (one family drove much more), name it now while it's fresh. \"We probably owe you twenty drives. Let us pay for it next season, or buy you dinner this summer.\" Don't let the imbalance carry into a new season as silent resentment.\n\nIf you're planning to carpool with the same family next season, talk about that now too. \"Are you in for fall? Same setup?\" Confirming early lets both families plan summer travel and fall registration around it.\n\nIf you're not continuing the carpool (different team, different schedule, kid quit, your family is taking a break), say that too. \"Just so you know, we're not signing up for fall. The Tuesday-Thursday rotation worked great this year. Thank you.\" Don't ghost the family that drove your kid all season.\n\nThe carpool is its own small contract. Closing it well makes the next one possible.\n";
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
