globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "";

				const frontmatter = {"title":"What to say *after* a game at 13–14","seoTitle":"What to Say After a Game: Ages 13-14 Script","seoDescription":"What to say to a teenager after a game when they don't want to talk. The script for the silent ride and the moment they open up.","summary":"When they don't want to talk. The script for the silent ride. What you say. What you don't. When they finally do open up, what to say next.","moment":"other","publishedAt":"2026-07-01T00:00:00.000Z","featured":false,"draft":false,"whatTheyAreFeeling":["Tired of being asked how they did.","Embarrassed if it went badly. Embarrassed if it went well.","Sorting through middle-school dynamics that have nothing to do with the game.","Aware that the family wants to feel something with them, and not sure how much they want to give.","Watching their phone for the post-game group chat."],"whatToSay":["(Nothing for the first ten minutes.)","Eventually: 'You hungry?'","If they want to talk: 'I'm here.'"],"whatNotToSay":["How did it go?","What happened on that play?","I saw the coach pull you. Did he say why?","Anything you wouldn't say to a 25-year-old colleague after a hard meeting."],"theRule":"Be the safest car they get into. The safest car has music, has snacks, has a parent who is not running interview questions.","ifTheyBringItUp":["If they bring up the game, follow their lead. Match their energy. Don't escalate.","If they say it was bad, the right move is 'yeah, that looked tough.' Then quiet.","If they say it was good, 'I had fun watching you' is better than 'congratulations.'","If they bring up a teammate, listen. Don't ask follow-up questions unless they invite them."],"saveBlockTitle":"After a game at 13–14","saveBlockBullets":["Silence first. Earn the conversation, don't request it.","Match their volume and energy when they finally speak.","Don't review the game. Ever, mostly.","Be in the car. Be warm. Be uninterested in extracting anything."],"relatedScripts":["after-a-game-11-12","kid-silent","after-a-bad-game","after-no-playing-time"],"sportTags":["multi-sport"],"ageBands":["13-14","15-plus"]};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/scripts/after-a-game-13-14.md";
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
