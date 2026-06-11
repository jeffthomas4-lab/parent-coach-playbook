globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "";

				const frontmatter = {"title":"After the *last game* of the season. Here's what to say.","seoTitle":"What to Say After the Last Game of the Season","seoDescription":"The season just ended and your kid is processing more than the score. The script for the drive that closes a chapter.","summary":"The season is over. Win or lose, the kid is processing more than the score. The script for the drive that closes a chapter.","moment":"after-the-last-game","publishedAt":"2026-04-26T00:00:00.000Z","featured":false,"whatTheyAreFeeling":["All of it at once.","Sad it's over, even if they wanted it to end.","Relieved, even if they loved it.","Wondering what next year looks like."],"whatToSay":["I loved watching you play this year.","Thanks for letting me come watch.","What was your favorite thing about this team?"],"whatNotToSay":["Now we need to talk about next year.","I think you should try out for the higher team.","There's always next year. (Sometimes there isn't.)"],"theRule":"Tonight is for the season that just ended. Next year is for next month.","ifTheyBringItUp":["If they bring up next year, listen, don't decide.","If they cry, let them cry. The end of seasons hits hard.","If they say I'm glad it's over, believe them."],"saveBlockTitle":"After the last game","saveBlockBullets":["One sentence about the kid, not the season.","Tonight is for tonight. Next year is for next month.","If they cry, let them. Endings hit harder than wins do."],"relatedScripts":["after-a-win","after-a-bad-game","kid-upset","after-a-game-13-14"],"sportTags":["multi-sport"],"ageBands":["all-ages"],"editorial":{"qualityGrade":9,"originalityGrade":9,"voiceGrade":10,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"affiliateDisclosurePresent":false,"claudeReviewedAt":"2026-05-03T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Pulled from the queued blog post."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/scripts/after-the-last-game.md";
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
