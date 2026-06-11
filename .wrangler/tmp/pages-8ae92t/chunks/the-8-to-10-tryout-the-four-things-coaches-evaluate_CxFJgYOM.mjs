globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>At 8-10, coaches are not evaluating soccer talent or baseball technique. We’re evaluating four things.</p>\n<h2 id=\"coachability\">Coachability</h2>\n<p>Does the kid listen to the instruction? Do they try it immediately? Do they ask questions when they don’t understand? Kids who nod and actually do what we say move up the list. Kids who nod and then do their own thing don’t.</p>\n<h2 id=\"effort\">Effort</h2>\n<p>Are they running hard on every play? Are they staying engaged when the ball isn’t near them? A kid who goes eighty percent hard the whole time beats a kid who goes 100 percent hard for thirty seconds then checks out.</p>\n<h2 id=\"ball-commitment\">Ball commitment</h2>\n<p>Do they stay with the ball? Do they chase it or wait for it to come to them? Do they try to win the play or hope someone else gets it? This tells us everything about whether they actually want to be there.</p>\n<h2 id=\"friendliness\">Friendliness</h2>\n<p>Do they talk to other kids? Do they seem like they’d be good in a group? Do they celebrate when teammates do something good? This matters way more than skill at 8-10. We’re building a team, not a traveling elite squad. We need kids who like being together.</p>\n<h2 id=\"the-order\">The order</h2>\n<p>Skill is last. The kid who can’t kick but is coachable, tries hard, and makes friends moves up a spot every month. The kid who can kick but ignores us? They’re stuck.</p>\n<p>Tell your kid before tryouts: “I want to see you try hard, listen to the coach, and have fun with the other kids. That’s what matters.” Then mean it when they come home.</p>";

				const frontmatter = {"title":"The 8-10 Tryout: What Coaches Actually Evaluate","dek":"Not skill. Coachability, effort, commitment, and friendliness.","seoDescription":"At 8-10, coaches are not evaluating soccer talent or baseball technique. We're evaluating four things.","topic":"tryouts","format":"note","phase":"drive-there","sport":"multi-sport","age":"8-10","publishedAt":"2026-02-24T00:00:00.000Z","featured":false,"editorial":{"claudeReviewedAt":"2026-05-05T00:00:00.000Z"}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/articles/the-8-to-10-tryout-the-four-things-coaches-evaluate.md";
				const url = undefined;
				function rawContent() {
					return "\nAt 8-10, coaches are not evaluating soccer talent or baseball technique. We're evaluating four things.\n\n## Coachability\n\nDoes the kid listen to the instruction? Do they try it immediately? Do they ask questions when they don't understand? Kids who nod and actually do what we say move up the list. Kids who nod and then do their own thing don't.\n\n## Effort\n\nAre they running hard on every play? Are they staying engaged when the ball isn't near them? A kid who goes eighty percent hard the whole time beats a kid who goes 100 percent hard for thirty seconds then checks out.\n\n## Ball commitment\n\nDo they stay with the ball? Do they chase it or wait for it to come to them? Do they try to win the play or hope someone else gets it? This tells us everything about whether they actually want to be there.\n\n## Friendliness\n\nDo they talk to other kids? Do they seem like they'd be good in a group? Do they celebrate when teammates do something good? This matters way more than skill at 8-10. We're building a team, not a traveling elite squad. We need kids who like being together.\n\n## The order\n\nSkill is last. The kid who can't kick but is coachable, tries hard, and makes friends moves up a spot every month. The kid who can kick but ignores us? They're stuck.\n\nTell your kid before tryouts: \"I want to see you try hard, listen to the coach, and have fun with the other kids. That's what matters.\" Then mean it when they come home.\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"coachability","text":"Coachability"},{"depth":2,"slug":"effort","text":"Effort"},{"depth":2,"slug":"ball-commitment","text":"Ball commitment"},{"depth":2,"slug":"friendliness","text":"Friendliness"},{"depth":2,"slug":"the-order","text":"The order"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
