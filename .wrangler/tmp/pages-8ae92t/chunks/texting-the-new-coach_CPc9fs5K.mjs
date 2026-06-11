globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The team-formation email lands with the new head coach’s contact info. The temptation is to send a thoughtful introduction text laying out your kid’s history, what worked last season, what didn’t, and how you’re hoping things go.</p>\n<p>Don’t.</p>\n<p>The two-sentence text always wins.</p>\n<p><strong>Bad:</strong> “Hi Coach Sarah, this is Mike, Jamie’s dad. Just wanted to introduce myself before the season. Jamie loved playing for Coach Tom last year and we’re excited about this season. Quick background, Jamie is mostly a midfielder but played some forward last year and is comfortable in either spot. She had some confidence issues mid-season after she missed a couple of breakaways but came back strong. Anyway, looking forward to meeting you, let us know what we can do to help!”</p>\n<p><strong>Good:</strong> “Hi Coach Sarah, this is Mike, Jamie’s dad. Looking forward to the season. Let us know if you need anything from us.”</p>\n<p>The good text does three things. It identifies who you are. It signals support without micromanaging. It opens the door without forcing a conversation about your kid’s history before the coach has even seen her play.</p>\n<p>The bad text plants three seeds you didn’t mean to plant. The new coach now knows that midfielder/forward is a question, that there’s a confidence-issues story, and that you’re a parent who manages by email. None of that helps your kid.</p>\n<p>If the coach wants to know about Jamie’s history, they will ask the previous coach or watch her at the first practice. They have other ways to get the information that don’t involve your characterization of it.</p>\n<p>The two-sentence text is restraint. Restraint is the most valuable parent-to-coach communication trait that exists.</p>";

				const frontmatter = {"title":"The text to the new coach for next season","dek":"First impressions get set in the first text. The two-sentence version that lands well, and the seven-sentence version that doesn't.","seoDescription":"The team-formation email lands with the new head coach's contact info. The temptation is to send a thoughtful introduction text laying out your kid's history...","topic":"communication","format":"note","phase":"team-parent","teamParentTopic":"communication","sport":"multi-sport","age":"all-ages","publishedAt":"2026-05-13T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":8,"originalityGrade":8,"voiceGrade":9,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"affiliateDisclosurePresent":false,"claudeReviewedAt":"2026-04-24T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Specific text examples make it actionable."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/articles/texting-the-new-coach.md";
				const url = undefined;
				function rawContent() {
					return "\nThe team-formation email lands with the new head coach's contact info. The temptation is to send a thoughtful introduction text laying out your kid's history, what worked last season, what didn't, and how you're hoping things go.\n\nDon't.\n\nThe two-sentence text always wins.\n\n**Bad:** \"Hi Coach Sarah, this is Mike, Jamie's dad. Just wanted to introduce myself before the season. Jamie loved playing for Coach Tom last year and we're excited about this season. Quick background, Jamie is mostly a midfielder but played some forward last year and is comfortable in either spot. She had some confidence issues mid-season after she missed a couple of breakaways but came back strong. Anyway, looking forward to meeting you, let us know what we can do to help!\"\n\n**Good:** \"Hi Coach Sarah, this is Mike, Jamie's dad. Looking forward to the season. Let us know if you need anything from us.\"\n\nThe good text does three things. It identifies who you are. It signals support without micromanaging. It opens the door without forcing a conversation about your kid's history before the coach has even seen her play.\n\nThe bad text plants three seeds you didn't mean to plant. The new coach now knows that midfielder/forward is a question, that there's a confidence-issues story, and that you're a parent who manages by email. None of that helps your kid.\n\nIf the coach wants to know about Jamie's history, they will ask the previous coach or watch her at the first practice. They have other ways to get the information that don't involve your characterization of it.\n\nThe two-sentence text is restraint. Restraint is the most valuable parent-to-coach communication trait that exists.\n";
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
