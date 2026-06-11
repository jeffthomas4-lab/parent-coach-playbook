globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The last game of a season is not the end of the season. The end of the season is the following Tuesday, when there is no practice, the gear bag is by the door, and nobody knows what to do with the suddenly empty 5pm hour.</p>\n<p>For some kids that’s relief. For most it’s a small grief they don’t have words for. The team they saw three times a week for four months is gone. The coach who was a daily fixture in their life is now somebody they might see once at a banquet.</p>\n<p>The first week off is the week to notice this. Don’t rush to fill it. Don’t sign up for the next thing on the way home from the last game.</p>\n<p>Sit in the empty week. Have one extra family dinner. Go to a movie on what would have been a practice night. Let the kid feel what it feels like to have a Tuesday back. Some kids will hate it and ask for the next thing immediately. That’s information. Some will quietly love it. That’s also information.</p>\n<p>The second week, ask. Not “what’s next?” but “did you miss it?” If they did, find a low-key way to keep some piece of it going (a friend’s backyard, a clinic, free play). If they didn’t, that’s permission to let the off-season be off.</p>\n<p>The off-season is not lost time. It’s the part where kids find out who they are when nobody is keeping score.</p>";

				const frontmatter = {"title":"When the season really ends","dek":"It's not the last game. It's the week after, when the schedule disappears and the family suddenly has nothing to do at 5pm on a Tuesday.","seoDescription":"The last game of a season is not the end of the season. The end of the season is the following Tuesday, when there is no practice, the gear bag is by the door...","topic":"the-hard-stuff","format":"note","phase":"drive-home","sport":"multi-sport","age":"all-ages","publishedAt":"2026-05-13T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":8,"originalityGrade":9,"voiceGrade":9,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"affiliateDisclosurePresent":false,"claudeReviewedAt":"2026-03-27T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Useful and rare angle: the post-season void rather than the last game itself."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/articles/when-the-season-really-ends.md";
				const url = undefined;
				function rawContent() {
					return "\nThe last game of a season is not the end of the season. The end of the season is the following Tuesday, when there is no practice, the gear bag is by the door, and nobody knows what to do with the suddenly empty 5pm hour.\n\nFor some kids that's relief. For most it's a small grief they don't have words for. The team they saw three times a week for four months is gone. The coach who was a daily fixture in their life is now somebody they might see once at a banquet.\n\nThe first week off is the week to notice this. Don't rush to fill it. Don't sign up for the next thing on the way home from the last game.\n\nSit in the empty week. Have one extra family dinner. Go to a movie on what would have been a practice night. Let the kid feel what it feels like to have a Tuesday back. Some kids will hate it and ask for the next thing immediately. That's information. Some will quietly love it. That's also information.\n\nThe second week, ask. Not \"what's next?\" but \"did you miss it?\" If they did, find a low-key way to keep some piece of it going (a friend's backyard, a clinic, free play). If they didn't, that's permission to let the off-season be off.\n\nThe off-season is not lost time. It's the part where kids find out who they are when nobody is keeping score.\n";
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
