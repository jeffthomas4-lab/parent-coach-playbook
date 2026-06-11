globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>It was February and we had a kid who wasn’t playing. Not because they were bad. Because the matchup didn’t favor them. We could see the frustration building at practice. So we sat them down before the next game.</p>\n<p>At 13-14, we’re keeping kids on the bench because they need to earn minutes or because the matchup doesn’t favor them. Either way, they know they’re not playing. We don’t treat it like a mystery.</p>\n<h2 id=\"before-the-game\">Before the game</h2>\n<p>We tell them: “You’re starting the bench today. Here’s why: we need fresh legs coming in at halftime, and that’s your role right now.” Or: “Their post player is bigger. We’re going to start someone else and get you in later when the game opens up.”</p>\n<p>We tell them what they can do from the bench. “Watch how their point guard moves. Call out the pick-and-roll before it happens. That helps me coach.” We give them a job. Then we actually reward the job when they go in.</p>\n<p>A kid who spent the first half watching for pick-and-rolls is already in the game mentally. When we sub them in, they’re ready.</p>\n<h2 id=\"the-difference-kids-see\">The difference kids see</h2>\n<p>Subs that feel punitive don’t work. Subs that feel strategic do. If a kid isn’t playing because they’re still learning, we say it: “I know you want to play. You’re learning. We’re going to get you in the second half when it’s closer and you can impact it.”</p>\n<p>Kids can tell the difference between being benched and being developed. One makes them angry. The other makes them work.</p>\n<h2 id=\"the-planning-piece\">The planning piece</h2>\n<p>We change our rotation at halftime, not in the third quarter. We let kids know the plan before the game. They play better when they know when to expect to go in.</p>";

				const frontmatter = {"title":"Managing Substitutions Kids Actually Buy Into","dek":"You're not sneaking subs past them. You're explaining the decision before the game.","seoDescription":"It was February and we had a kid who wasn't playing. Not because they were bad. Because the matchup didn't favor them.","topic":"game-day","format":"note","phase":"game","sport":"multi-sport","age":"13-14","publishedAt":"2026-04-21T00:00:00.000Z","featured":false,"hero":"/illustrations/bench-moment-backlit-sunset.webp","heroAlt":"Backlit silhouettes of teenage athletes on a bench at sunset, one cleaning a glove, the others watching the field."};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/articles/the-13-to-14-bench-managing-substitutions-kids-buy-into.md";
				const url = undefined;
				function rawContent() {
					return "\nIt was February and we had a kid who wasn't playing. Not because they were bad. Because the matchup didn't favor them. We could see the frustration building at practice. So we sat them down before the next game.\n\nAt 13-14, we're keeping kids on the bench because they need to earn minutes or because the matchup doesn't favor them. Either way, they know they're not playing. We don't treat it like a mystery.\n\n## Before the game\n\nWe tell them: \"You're starting the bench today. Here's why: we need fresh legs coming in at halftime, and that's your role right now.\" Or: \"Their post player is bigger. We're going to start someone else and get you in later when the game opens up.\"\n\nWe tell them what they can do from the bench. \"Watch how their point guard moves. Call out the pick-and-roll before it happens. That helps me coach.\" We give them a job. Then we actually reward the job when they go in.\n\nA kid who spent the first half watching for pick-and-rolls is already in the game mentally. When we sub them in, they're ready.\n\n## The difference kids see\n\nSubs that feel punitive don't work. Subs that feel strategic do. If a kid isn't playing because they're still learning, we say it: \"I know you want to play. You're learning. We're going to get you in the second half when it's closer and you can impact it.\"\n\nKids can tell the difference between being benched and being developed. One makes them angry. The other makes them work.\n\n## The planning piece\n\nWe change our rotation at halftime, not in the third quarter. We let kids know the plan before the game. They play better when they know when to expect to go in.\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"before-the-game","text":"Before the game"},{"depth":2,"slug":"the-difference-kids-see","text":"The difference kids see"},{"depth":2,"slug":"the-planning-piece","text":"The planning piece"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
