globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Adolescents need 9-10 hours of sleep. Most don’t get it. Summer is the one chance to fix that, and most families spend the summer at 7 a.m. practices.</p>\n<p>The math is real. A 13-year-old who consistently sleeps 7 hours instead of 9 is a kid with worse focus, worse mood, and a higher injury risk. The CDC and the American Academy of Sleep Medicine both publish on this.</p>\n<h2 id=\"when-to-let-them-sleep\">When to let them sleep</h2>\n<p>If the kid is averaging less than 8 hours a night for the week, the choice between an extra hour of sleep and a 7 a.m. practice is not a hard choice. The sleep wins.</p>\n<p>If the kid is averaging 8-9 hours and one specific practice matters because of an upcoming tryout or a tournament, get them up. They can absorb the loss.</p>\n<p>The long-term pattern matters more than any one practice. Six weeks of consistent sleep deprivation will hurt their season more than missing two summer practices ever will.</p>\n<h2 id=\"the-conversation-with-the-coach\">The conversation with the coach</h2>\n<p>Most coaches understand. The script is simple. <em>He’s been short on sleep this week. We’re going to skip Friday and have him fully rested for the weekend.</em> Most coaches will say thanks for letting them know.</p>\n<p>The coach who penalizes a kid for sleeping is the coach who has a different problem. Don’t escalate it during the summer. Note it for fall.</p>\n<h2 id=\"the-bigger-frame\">The bigger frame</h2>\n<p>The body grows in sleep. Bones, brain, immune system, muscle. A kid who is in a growth spurt and undersleeping is a kid whose body is borrowing from systems it shouldn’t be.</p>\n<p>You don’t have to choose between athlete and human. The athlete who sleeps is the better athlete by November.</p>\n<p><a href=\"/body/\">The body hub</a> has more on sleep, growth, and recovery for youth athletes.</p>";

				const frontmatter = {"title":"When to let them *sleep in*","dek":"Summer practice is at 7 a.m. They're 13 and exhausted. The honest math on sleep, growth, and when missing practice is the right call.","seoDescription":"Adolescents need 9-10 hours of sleep. Most don't get it. Summer is the one chance to fix that, and most families spend the summer at 7 a.m. practices.","topic":"the-hard-stuff","format":"note","phase":"drive-there","sport":"multi-sport","age":"13-14","publishedAt":"2026-05-13T00:00:00.000Z","featured":false,"draft":false};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/articles/when-to-let-them-sleep-in.md";
				const url = undefined;
				function rawContent() {
					return "\nAdolescents need 9-10 hours of sleep. Most don't get it. Summer is the one chance to fix that, and most families spend the summer at 7 a.m. practices.\n\nThe math is real. A 13-year-old who consistently sleeps 7 hours instead of 9 is a kid with worse focus, worse mood, and a higher injury risk. The CDC and the American Academy of Sleep Medicine both publish on this.\n\n## When to let them sleep\n\nIf the kid is averaging less than 8 hours a night for the week, the choice between an extra hour of sleep and a 7 a.m. practice is not a hard choice. The sleep wins.\n\nIf the kid is averaging 8-9 hours and one specific practice matters because of an upcoming tryout or a tournament, get them up. They can absorb the loss.\n\nThe long-term pattern matters more than any one practice. Six weeks of consistent sleep deprivation will hurt their season more than missing two summer practices ever will.\n\n## The conversation with the coach\n\nMost coaches understand. The script is simple. _He's been short on sleep this week. We're going to skip Friday and have him fully rested for the weekend._ Most coaches will say thanks for letting them know.\n\nThe coach who penalizes a kid for sleeping is the coach who has a different problem. Don't escalate it during the summer. Note it for fall.\n\n## The bigger frame\n\nThe body grows in sleep. Bones, brain, immune system, muscle. A kid who is in a growth spurt and undersleeping is a kid whose body is borrowing from systems it shouldn't be.\n\nYou don't have to choose between athlete and human. The athlete who sleeps is the better athlete by November.\n\n[The body hub](/body/) has more on sleep, growth, and recovery for youth athletes.\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"when-to-let-them-sleep","text":"When to let them sleep"},{"depth":2,"slug":"the-conversation-with-the-coach","text":"The conversation with the coach"},{"depth":2,"slug":"the-bigger-frame","text":"The bigger frame"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
