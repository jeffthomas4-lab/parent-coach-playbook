globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "";

				const frontmatter = {"title":"Before *summer tryouts*. Here's what to say.","seoTitle":"What to Say the Night Before Tryouts: A Script","seoDescription":"The night-before-tryouts conversation, scripted. What to say at dinner, what to skip, and the one line for the morning of.","summary":"The tryout that doesn't have a season behind it. Higher stakes, less context. The script for the morning of.","moment":"tryouts-week","publishedAt":"2026-05-10T00:00:00.000Z","featured":false,"whatTheyAreFeeling":["Stomach-in-knots nervous, often more than season tryouts.","Aware that summer tryouts feel like an audition with no warm-up.","Worried about who else is trying out."],"whatToSay":["Just play your game today.","Whatever happens, we go get food after.","Tell me one thing you're going to focus on."],"whatNotToSay":["You have to make it.","Don't blow this.","Coach said he was looking for you."],"theRule":"Tryouts are an audition for one day. Not a verdict on the kid.","ifTheyBringItUp":["If they want to walk through their plan, listen. Don't add.","If they go silent, let them. Quiet is part of pre-game.","If they cry, sit in it. The car can wait one more minute."],"saveBlockTitle":"Before summer tryouts","saveBlockBullets":["One thing to focus on. That's it.","Promise food after, not a result.","Whatever happens, the kid is the same kid."],"relatedScripts":["before-game-nerves","kid-upset","after-a-bad-game","before-a-game-11-12","before-a-game-13-14"],"sportTags":["multi-sport"],"ageBands":["8-10","11-12","13-14"],"editorial":{"qualityGrade":8,"originalityGrade":8,"voiceGrade":9,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":true,"citationCheckPassed":true,"affiliateDisclosurePresent":false,"claudeReviewedAt":"2026-05-03T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Distinct from before-game-nerves script."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/scripts/before-summer-tryouts.md";
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
