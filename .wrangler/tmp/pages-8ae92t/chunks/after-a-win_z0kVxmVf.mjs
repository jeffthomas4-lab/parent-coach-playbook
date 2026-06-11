globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "";

				const frontmatter = {"title":"Your kid *won*. Here's what to say.","seoTitle":"What to Say to Your Kid After a Win","seoDescription":"Wins matter too. What to say after a good game so they enjoy it, without moving the goalposts in the same sentence.","summary":"Wins matter too. The script that lets them enjoy it without you immediately moving the goalpost.","moment":"after-a-win","publishedAt":"2026-04-26T00:00:00.000Z","featured":true,"whatTheyAreFeeling":["Proud.","Sometimes relieved.","Watching to see if you'll be excited with them, or if you'll start coaching."],"whatToSay":["That was fun to watch.","I loved your energy today.","Tell me about the play you liked best."],"whatNotToSay":["Now next week we have to...","Imagine if you'd done that all year...","You almost had another one."],"theRule":"Let them enjoy it before you move the goalpost.","ifTheyBringItUp":["If they want to break down the game with you, do it. Their lead, their pace.","Skip the next-game framing. Tonight is for tonight.","Don't compare to the kid who scored more."],"saveBlockTitle":"After a win","saveBlockBullets":["Match their energy, don't manage it.","Specific moment, not generic praise.","Don't pivot to next week. Not yet."],"relatedScripts":["after-a-bad-game","kid-silent","after-the-last-game","after-a-game-8-10","after-a-game-11-12"],"sportTags":["multi-sport"],"ageBands":["all-ages"],"editorial":{"qualityGrade":8,"originalityGrade":8,"voiceGrade":9,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"affiliateDisclosurePresent":false,"claudeReviewedAt":"2026-05-03T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Don't move the goalpost frame is the original beat."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/scripts/after-a-win.md";
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
