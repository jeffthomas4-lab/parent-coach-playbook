globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "";

				const frontmatter = {"title":"Your kid had a *meltdown at practice*","seoTitle":"What to Say After a Meltdown at Practice","seoDescription":"Your kid melted down in front of the team. The script for the ride home that rebuilds dignity without ignoring what happened.","summary":"Tears, walking off, throwing equipment. The script for picking them up afterward without making it bigger or smaller than it is.","moment":"kid-upset","publishedAt":"2026-05-05T00:00:00.000Z","featured":false,"draft":false,"whatTheyAreFeeling":["Mortified.","Sometimes still in the moment, sometimes already shut down.","Watching to see if you're going to bring it up at home.","Sometimes physically hungry or tired in a way that built into a meltdown."],"whatToSay":["I'm here. Take whatever time.","When you're ready to eat, let me know.","We don't have to talk about practice tonight unless you want to."],"whatNotToSay":["What is wrong with you?","You can't do that in front of the team.","You embarrassed yourself.","We're going to have a talk when we get home. (Threat-shaped.)"],"theRule":"Regulate first. Evaluate later. Sometimes evaluation is the next day. Sometimes it's never.","ifTheyBringItUp":["If they explain, listen. Don't fix the explanation.","If they apologize, accept. 'I love you. Tough practice.' Move on.","If they bring up the coach's reaction, ask 'what did Coach say to you?' Listen first.","If a pattern emerges, the conversation about why practice keeps melting them down is its own conversation. Pick a calm moment. Not the car ride home."],"saveBlockTitle":"After a meltdown at practice","saveBlockBullets":["Regulate first. Don't lecture.","Food, water, quiet. The basics first.","Save the conversation for later. Or never.","Watch for patterns. Pattern means something else is going on."],"relatedScripts":["kid-upset","kid-silent","after-a-bad-game","after-a-mistake"],"sportTags":["multi-sport"],"ageBands":["5-7","8-10","11-12"]};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/scripts/meltdown-at-practice.md";
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
