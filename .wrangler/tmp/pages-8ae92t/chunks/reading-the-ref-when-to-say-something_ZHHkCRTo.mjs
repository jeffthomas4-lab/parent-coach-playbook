globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>It was a Saturday in April and we were down three. A call went against our team. The whole sideline erupted. We felt the rush too, the certainty that the ref had just changed the game. Then we sat with a question: does yelling at the ref change anything?</p>\n<p>A call goes against our team. Our instinct is to yell at the ref.</p>\n<p>Here’s the filter: is the ref going to change their mind if we say something? The answer is almost always no. So why say it?</p>\n<h2 id=\"when-we-might-say-something\">When we might say something</h2>\n<p>Sometimes a ref makes a mistake on a rule interpretation. If it’s the kind of mistake that will happen again in the next two minutes (a throw-in taken from the wrong spot, an off-side call that’s clearly wrong), a quick “That spot?” or a calm question can get corrected. But we have to be respectful about it. We’re asking for clarification, not demanding a reversal.</p>\n<h2 id=\"what-we-dont-do\">What we don’t do</h2>\n<p>Personal insults. Never. Yelling about a call after it’s made. Wasted energy. The ref has moved on. Our team is behind. We just gave everyone permission to get emotional instead of focused.</p>\n<p>The worst behavior is a parent screaming from the stands. It teaches our kid two things: first, that it’s the ref’s fault when things go wrong, and second, that yelling at authority makes problems better. Both are lies.</p>\n<h2 id=\"the-control-shift\">The control shift</h2>\n<p>Bad refs exist. Some games will have one. That’s the variable we can’t control. We control everything else: our composure, our team’s composure, our focus on the next play.</p>\n<p>A team that stays focused through bad calls and keeps fighting wins more games than a team that spends three minutes upset about the last call.</p>\n<h2 id=\"the-long-view\">The long view</h2>\n<p>We’ll lose a game to a bad call eventually. That’s sports. The way we handle it is more important than the call itself.</p>";

				const frontmatter = {"title":"Reading the Ref: When to Say Something, When to Shut Up","dek":"One bad call doesn't lose the game. Your reaction to it does.","seoDescription":"It was a Saturday in April and we were down three. A call went against our team. The whole sideline erupted.","topic":"game-day","format":"note","phase":"game","sport":"multi-sport","age":"all-ages","publishedAt":"2026-04-27T00:00:00.000Z","featured":false};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/articles/reading-the-ref-when-to-say-something.md";
				const url = undefined;
				function rawContent() {
					return "\nIt was a Saturday in April and we were down three. A call went against our team. The whole sideline erupted. We felt the rush too, the certainty that the ref had just changed the game. Then we sat with a question: does yelling at the ref change anything?\n\nA call goes against our team. Our instinct is to yell at the ref.\n\nHere's the filter: is the ref going to change their mind if we say something? The answer is almost always no. So why say it?\n\n## When we might say something\n\nSometimes a ref makes a mistake on a rule interpretation. If it's the kind of mistake that will happen again in the next two minutes (a throw-in taken from the wrong spot, an off-side call that's clearly wrong), a quick \"That spot?\" or a calm question can get corrected. But we have to be respectful about it. We're asking for clarification, not demanding a reversal.\n\n## What we don't do\n\nPersonal insults. Never. Yelling about a call after it's made. Wasted energy. The ref has moved on. Our team is behind. We just gave everyone permission to get emotional instead of focused.\n\nThe worst behavior is a parent screaming from the stands. It teaches our kid two things: first, that it's the ref's fault when things go wrong, and second, that yelling at authority makes problems better. Both are lies.\n\n## The control shift\n\nBad refs exist. Some games will have one. That's the variable we can't control. We control everything else: our composure, our team's composure, our focus on the next play.\n\nA team that stays focused through bad calls and keeps fighting wins more games than a team that spends three minutes upset about the last call.\n\n## The long view\n\nWe'll lose a game to a bad call eventually. That's sports. The way we handle it is more important than the call itself.\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"when-we-might-say-something","text":"When we might say something"},{"depth":2,"slug":"what-we-dont-do","text":"What we don’t do"},{"depth":2,"slug":"the-control-shift","text":"The control shift"},{"depth":2,"slug":"the-long-view","text":"The long view"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
