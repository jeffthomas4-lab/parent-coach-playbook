globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "";

				const frontmatter = {"title":"What to say *after* a game at 11–12","seoTitle":"What to Say After a Game: Ages 11-12 Script","seoDescription":"What to say to an 11-or-12-year-old after a game. The question that opens them up, with less talking and more space.","summary":"The question that opens them up. A different cadence than the younger ages. Less talking. More space.","moment":"other","publishedAt":"2026-06-29T00:00:00.000Z","featured":false,"draft":false,"whatTheyAreFeeling":["Self-aware about how they played.","Tracking the social temperature in the dugout.","Comparing themselves to the kids who got more minutes.","Filtering what they tell you so you don't make a thing of it.","Hungry. Tired. Maybe a little fragile."],"whatToSay":["Good to see you out there.","Tell me when you want food.","(Then wait. Just drive.)"],"whatNotToSay":["How did it go? (Too broad. They'll shut down.)","I noticed in the third quarter you...","Coach left you in too long. Or pulled you too soon.","Anything that starts with 'next time.'"],"theRule":"At this age, you ask one question and then you stop. The next thing they say is the real conversation. Don't jump in to fill silence.","ifTheyBringItUp":["If they bring up a teammate, listen. Most of what's processing at 11–12 is social, not technical.","If they bring up playing time, ask what their read was. Their read might be more accurate than yours.","If they bring up the coach, listen carefully. 13 starts soon. The coach trust window is real."],"saveBlockTitle":"After a game at 11–12","saveBlockBullets":["One question. Then drive.","Don't fill the silence. They will.","Match their temperature when they finally talk."],"relatedScripts":["after-a-game-8-10","after-a-game-13-14","kid-silent","after-no-playing-time"],"sportTags":["multi-sport"],"ageBands":["11-12"]};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/scripts/after-a-game-11-12.md";
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
