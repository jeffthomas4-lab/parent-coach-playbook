globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "";

				const frontmatter = {"title":"Your kid *didn't play much*. Here's what to say.","seoTitle":"What to Say When Your Kid Didn't Play in the Game","seoDescription":"The hardest car ride of the season. The script that doesn't make the coach the enemy and doesn't make your kid feel small.","summary":"The hardest car ride of the season. The script that doesn't make the coach the enemy and doesn't make your kid feel small.","moment":"after-no-playing-time","publishedAt":"2026-04-26T00:00:00.000Z","featured":true,"whatTheyAreFeeling":["Overlooked.","Frustrated, sometimes ashamed.","Wondering if they're not good enough.","Watching whether you're going to make it about the coach."],"whatToSay":["I know that was hard.","I'm proud of how you stayed ready.","Do you want to vent, or do you want help thinking through it?"],"whatNotToSay":["That coach is terrible.","You're better than half those kids.","I'm going to talk to him."],"theRule":"Don't make the coach the enemy. Help your kid stay in control of what they can improve.","ifTheyBringItUp":["Let them vent first. Don't jump to fixing.","If they want help, focus on what's in their control: effort, attitude, asking the coach a real question.","Save the coach conversation for a Tuesday, not the car ride."],"saveBlockTitle":"After no playing time","saveBlockBullets":["Validate the frustration. Don't validate making the coach a villain.","Ask what they want from you: vent or strategy.","Coach conversation belongs to a Tuesday, not the car ride."],"relatedScripts":["after-a-bad-game","kid-upset","coach-conflict","after-a-game-11-12","after-a-game-13-14"],"sportTags":["multi-sport"],"ageBands":["11-12","13-14","15-plus"],"editorial":{"qualityGrade":9,"originalityGrade":9,"voiceGrade":9,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"affiliateDisclosurePresent":false,"claudeReviewedAt":"2026-05-03T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Vent or strategy question is the strongest practical move."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/scripts/after-no-playing-time.md";
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
