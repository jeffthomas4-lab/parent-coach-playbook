globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>We call a timeout when: a kid is hurt or upset and needs a minute to recover, our team hasn’t touched the ball in five minutes and they need a reset, or we see something happening that’s going to escalate. Kids getting frustrated. Someone being excluded on the sideline.</p>\n<p>We don’t call timeouts to yell at them. We don’t call them to choreograph plays. We don’t call them because we’re losing.</p>\n<p>At 8-10, the game is supposed to be about doing things. Timeouts break momentum. Kids get bored. The game stops being play and starts being stop-start.</p>\n<h2 id=\"when-we-do-call-one\">When we do call one</h2>\n<p>We keep it to thirty seconds. “Remember the spacing we talked about. Look left. Then look right. Then pass it.” We show them with our hands, not a diagram. Go.</p>\n<p>We use timeouts at the end of a half too. Five kids collapsed on the ball in midfield? “Everyone spread out. Don’t all chase it. Let three people go, the rest cover space.” That’s real coaching.</p>\n<h2 id=\"what-we-dont-do\">What we don’t do</h2>\n<p>At this age, we don’t need complex formations, criticism of individual mistakes in public, or dramatic speeches about digging deeper. Our job is to help them see the field better for a few seconds, then get out of the way.</p>\n<p>A team that plays for forty minutes without stops learns more than a team that plays fifteen minutes with constant interruption. We keep timeouts rare. Kids will respect our voice when we actually use it.</p>";

				const frontmatter = {"title":"Game Day: When to Call a Timeout","dek":"Three reasons. Everything else is coaching theater.","seoDescription":"We call a timeout when: a kid is hurt or upset and needs a minute to recover, our team hasn't touched the ball in five minutes and they need a reset, or we see...","topic":"game-day","format":"note","phase":"game","sport":"multi-sport","age":"8-10","publishedAt":"2026-04-07T00:00:00.000Z","featured":false};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/articles/the-8-to-10-game-day-when-to-call-timeout.md";
				const url = undefined;
				function rawContent() {
					return "\nWe call a timeout when: a kid is hurt or upset and needs a minute to recover, our team hasn't touched the ball in five minutes and they need a reset, or we see something happening that's going to escalate. Kids getting frustrated. Someone being excluded on the sideline.\n\nWe don't call timeouts to yell at them. We don't call them to choreograph plays. We don't call them because we're losing.\n\nAt 8-10, the game is supposed to be about doing things. Timeouts break momentum. Kids get bored. The game stops being play and starts being stop-start.\n\n## When we do call one\n\nWe keep it to thirty seconds. \"Remember the spacing we talked about. Look left. Then look right. Then pass it.\" We show them with our hands, not a diagram. Go.\n\nWe use timeouts at the end of a half too. Five kids collapsed on the ball in midfield? \"Everyone spread out. Don't all chase it. Let three people go, the rest cover space.\" That's real coaching.\n\n## What we don't do\n\nAt this age, we don't need complex formations, criticism of individual mistakes in public, or dramatic speeches about digging deeper. Our job is to help them see the field better for a few seconds, then get out of the way.\n\nA team that plays for forty minutes without stops learns more than a team that plays fifteen minutes with constant interruption. We keep timeouts rare. Kids will respect our voice when we actually use it.\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"when-we-do-call-one","text":"When we do call one"},{"depth":2,"slug":"what-we-dont-do","text":"What we don’t do"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
