globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "";

				const frontmatter = {"title":"What to say *before* a game at 8–10","seoTitle":"What to Say Before a Game: Ages 8-10 Script","seoDescription":"They're starting to care about winning. The effort-not-outcome script for before a game at 8 to 10, in three sentences.","summary":"The effort-not-outcome script. They're starting to care about winning. Don't build the conditional love around it.","moment":"before-a-game","publishedAt":"2026-06-10T00:00:00.000Z","featured":false,"draft":false,"whatTheyAreFeeling":["Aware that some kids are better than others.","Watching to see who their friends are passing to.","Wanting to do well in front of you.","Not yet sure what to do with nerves."],"whatToSay":["I love watching you play.","Try one thing you've been working on.","Have fun out there."],"whatNotToSay":["Just don't strike out.","Coach said you'd start. Make sure he keeps you in.","We need a win today.","Remember, scouts are watching. (No, they're not. They are nine.)"],"theRule":"Reinforce the part they can control. Effort. Attempt. Whatever they've been working on. Skip outcomes.","ifTheyBringItUp":["If they ask whether they'll start, say what you know. 'I think so' is honest. 'I don't know' is too. 'Definitely' is not yours to give.","If they say they're nervous, ask what they're nervous about. Listen first. Don't fix it.","If they want a pep talk, give them a real one in five words. 'You've worked. Go play. Have fun.'"],"saveBlockTitle":"Before a game at 8–10","saveBlockBullets":["Affirm one specific thing they've been working on.","Skip the win/loss frame entirely.","End with something concrete and short."],"relatedScripts":["before-a-game-5-7","before-a-game-11-12","before-game-nerves"],"sportTags":["multi-sport"],"ageBands":["8-10"]};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/scripts/before-a-game-8-10.md";
				const url = undefined;
				function rawContent() {
					return "";
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
