globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The first parent meeting should answer four questions and then finish. Not four questions plus clarifications plus sidebar stories. Four questions. Done in fifteen minutes.</p>\n<p><strong>1. What happens at practice</strong>\n“We practice Tuesday and Thursday at four. Practice is sixty minutes. We warm up, we work technique, we play. Water and a snack in the car after. Practice gear is shoes, a shirt, and water. That’s all you need.”</p>\n<p>No explanation of the philosophy. No story about how you learned this method. The fact. Then move on.</p>\n<p><strong>2. What you expect from your parent</strong>\n“You pick up on time. You ask your kid what went well today, not why they didn’t play more. You sign the waiver and the code of conduct. You email me if something changes with your kid. That’s it.”</p>\n<p>Again. Fact. Not a lecture about team culture. The ask.</p>\n<p><strong>3. How communication works</strong>\n“I’ll email the team every Sunday with the week ahead. I’ll text you if something’s wrong with your kid. You text me if something’s wrong at home that affects practice.”</p>\n<p>Specific. Clear. Done.</p>\n<p><strong>4. What the season costs</strong>\nMoney. Jersey. Tournament if there is one. Number. Not a guess. Not “about sixty dollars.” “Sixty dollars for the jersey, hundred for the tournament, and you buy your kid’s own cleats.”</p>\n<p><strong>Then ask if there are questions</strong>\nThere will be. Answer the one about the weather or the game schedule. Answer the one about tryouts. Then say “I’ll email you with anything else” and walk out.</p>\n<p><strong>Why this works</strong>\nParents come to meetings anxious. They’re worried their kid won’t play. They’re worried about the time commitment. They’re worried about cost. You’re saying: here’s what this is, here’s what you do, here’s what it costs, here’s where I am if you need me.</p>\n<p>You’re not selling them. You’re showing them the door.</p>\n<p><strong>The close</strong>\n“Our first practice is Tuesday. See you then.” That’s all.</p>";

				const frontmatter = {"title":"The First Parent-Meeting Agenda (Every Age)","dek":"Fifteen minutes of clarity beats thirty minutes of noise.","seoDescription":"The first parent meeting should answer four questions and then finish. Not four questions plus clarifications plus sidebar stories. Four questions.","topic":"season-ops","format":"note","phase":"drive-there","sport":"multi-sport","age":"all-ages","publishedAt":"2026-03-03T00:00:00.000Z","featured":false,"editorial":{"claudeReviewedAt":"2026-05-14T00:00:00.000Z"}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/articles/first-parent-meeting.md";
				const url = undefined;
				function rawContent() {
					return "\nThe first parent meeting should answer four questions and then finish. Not four questions plus clarifications plus sidebar stories. Four questions. Done in fifteen minutes.\n\n**1. What happens at practice**\n\"We practice Tuesday and Thursday at four. Practice is sixty minutes. We warm up, we work technique, we play. Water and a snack in the car after. Practice gear is shoes, a shirt, and water. That's all you need.\"\n\nNo explanation of the philosophy. No story about how you learned this method. The fact. Then move on.\n\n**2. What you expect from your parent**\n\"You pick up on time. You ask your kid what went well today, not why they didn't play more. You sign the waiver and the code of conduct. You email me if something changes with your kid. That's it.\"\n\nAgain. Fact. Not a lecture about team culture. The ask.\n\n**3. How communication works**\n\"I'll email the team every Sunday with the week ahead. I'll text you if something's wrong with your kid. You text me if something's wrong at home that affects practice.\"\n\nSpecific. Clear. Done.\n\n**4. What the season costs**\nMoney. Jersey. Tournament if there is one. Number. Not a guess. Not \"about sixty dollars.\" \"Sixty dollars for the jersey, hundred for the tournament, and you buy your kid's own cleats.\"\n\n**Then ask if there are questions**\nThere will be. Answer the one about the weather or the game schedule. Answer the one about tryouts. Then say \"I'll email you with anything else\" and walk out.\n\n**Why this works**\nParents come to meetings anxious. They're worried their kid won't play. They're worried about the time commitment. They're worried about cost. You're saying: here's what this is, here's what you do, here's what it costs, here's where I am if you need me.\n\nYou're not selling them. You're showing them the door.\n\n**The close**\n\"Our first practice is Tuesday. See you then.\" That's all.\n";
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
