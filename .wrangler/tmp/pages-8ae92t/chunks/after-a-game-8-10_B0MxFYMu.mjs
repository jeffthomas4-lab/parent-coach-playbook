globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "";

				const frontmatter = {"title":"What to say *after* a game at 8–10","seoTitle":"What to Say After a Game: Ages 8-10 Script","seoDescription":"What to say to an 8-to-10-year-old after a game. The 90-second rule, the opening line, and what to skip on the ride home.","summary":"The 90-second rule applied. The post-game window here decides what the rest of the week feels like.","moment":"other","publishedAt":"2026-06-26T00:00:00.000Z","featured":false,"draft":false,"whatTheyAreFeeling":["Aware of the score.","Replaying their best play and their worst play.","Watching to see how you're going to react.","Hungry. Tired. Maybe holding tears.","Wondering whether their effort showed."],"whatToSay":["I'm glad I got to watch you play.","What did you like about it?","Want to grab something to eat?"],"whatNotToSay":["Why didn't you...","You should have...","Coach should have...","If you'd just listened in practice last week..."],"theRule":"The first 90 seconds are not for review. They are for rejoining. Lead with warmth. Save the tape for later. Mostly, never.","ifTheyBringItUp":["If they bring up a mistake, listen first. Reflect what they said before adding anything.","If they bring up a teammate's mistake, the answer is 'that's tough.' Don't pile on. Don't defend.","If they bring up the coach, listen. Don't co-sign and don't dismiss. 'What did he say to you about it?' is enough."],"saveBlockTitle":"After a game at 8–10","saveBlockBullets":["First sentence is not about the game. 'I'm glad I got to watch you' beats 'good game.'","One question, max. 'What did you like about it?' opens the door without forcing it.","Skip the score. Skip the breakdown."],"relatedScripts":["after-a-bad-game","after-a-win","after-a-loss","after-a-game-11-12"],"sportTags":["multi-sport"],"ageBands":["8-10"]};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/scripts/after-a-game-8-10.md";
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
