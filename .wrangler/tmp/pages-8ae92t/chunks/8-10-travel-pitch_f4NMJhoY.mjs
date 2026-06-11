globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>At eight to ten, you’ll get the first pitch to move your kid to a travel team. A coach will tell you they’re special, they’re ready, the travel program is where the real development happens. Listen hard. Ask specific questions.</p>\n<p><strong>What to ask</strong>\n“What’s the practice schedule?” If it’s four days a week, that’s too much. Three is the max. “What’s the tournament schedule?” If there are tournaments every month from April through July, that’s consuming your summer.</p>\n<p>“What percentage of your kids play high school?” This matters. Some travel programs build players for the high school level. Some build players for the next travel program. They’re different missions.</p>\n<p>“What happens if my kid doesn’t make the elite team?” Travel programs often have A teams and B teams. Know where yours lands and whether movement is possible.</p>\n<p><strong>The hidden math</strong>\nTravel at this age costs two hundred to four hundred a month. Add the tournaments. Add the gas. Add the time. That’s a real commitment.</p>\n<p><strong>What you’re getting</strong>\nBetter coaches, probably. More competitive opponents, definitely. Better field conditions, maybe. Your kid playing with kids from five towns over instead of their neighborhood, yes.</p>\n<p><strong>What you’re losing</strong>\nOne evening a week free. Both weekend mornings free. Dinner at home. Friends who aren’t also playing competitive sports.</p>\n<p><strong>The test</strong>\nDoes your kid ask to go to practice? Do they care about the outcome? Do they talk about the other players on the team? If yes to all three, they’re ready. If they’re just going because you signed them up, they’re not ready.</p>\n<p><strong>The decision</strong>\nDon’t move because a coach told you they’re ready. Move because they want to and you can actually handle the schedule. Those two things together mean it’ll work.</p>\n<p>Some kids are ready at eight. Most aren’t ready until eleven. Don’t rush it because someone told you they’re special.</p>";

				const frontmatter = {"title":"The 8-10 First Travel-Team Pitch","dek":"What to listen for. What to ask.","seoDescription":"At eight to ten, you'll get the first pitch to move your kid to a travel team. A coach will tell you they're special, they're ready, the travel program is...","topic":"rec-vs-travel","format":"note","phase":"drive-there","sport":"multi-sport","age":"8-10","publishedAt":"2026-01-22T00:00:00.000Z","featured":false,"editorial":{"claudeReviewedAt":"2026-06-23T00:00:00.000Z"}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/articles/8-10-travel-pitch.md";
				const url = undefined;
				function rawContent() {
					return "\nAt eight to ten, you'll get the first pitch to move your kid to a travel team. A coach will tell you they're special, they're ready, the travel program is where the real development happens. Listen hard. Ask specific questions.\n\n**What to ask**\n\"What's the practice schedule?\" If it's four days a week, that's too much. Three is the max. \"What's the tournament schedule?\" If there are tournaments every month from April through July, that's consuming your summer.\n\n\"What percentage of your kids play high school?\" This matters. Some travel programs build players for the high school level. Some build players for the next travel program. They're different missions.\n\n\"What happens if my kid doesn't make the elite team?\" Travel programs often have A teams and B teams. Know where yours lands and whether movement is possible.\n\n**The hidden math**\nTravel at this age costs two hundred to four hundred a month. Add the tournaments. Add the gas. Add the time. That's a real commitment.\n\n**What you're getting**\nBetter coaches, probably. More competitive opponents, definitely. Better field conditions, maybe. Your kid playing with kids from five towns over instead of their neighborhood, yes.\n\n**What you're losing**\nOne evening a week free. Both weekend mornings free. Dinner at home. Friends who aren't also playing competitive sports.\n\n**The test**\nDoes your kid ask to go to practice? Do they care about the outcome? Do they talk about the other players on the team? If yes to all three, they're ready. If they're just going because you signed them up, they're not ready.\n\n**The decision**\nDon't move because a coach told you they're ready. Move because they want to and you can actually handle the schedule. Those two things together mean it'll work.\n\nSome kids are ready at eight. Most aren't ready until eleven. Don't rush it because someone told you they're special.\n";
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
