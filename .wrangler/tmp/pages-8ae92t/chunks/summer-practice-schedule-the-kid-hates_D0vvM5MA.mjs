globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>It’s July. The schedule said “summer optional” in May. By July it’s three nights a week and your kid is dragging.</p>\n<p>The first question is whether the kid is bored or whether the schedule is genuinely too much. Those look the same from the parent side and they require different fixes.</p>\n<h2 id=\"bored\">Bored</h2>\n<p>If the kid is bored, the practices are usually fine but the variety is gone. Same drills. Same teammates. No games. The remedy is talking to the coach about adding a small tournament or a different kind of practice (scrimmage day, parent-vs-kids game, anything).</p>\n<p>Some coaches will. Some won’t. If the coach won’t and the kid is bored for six more weeks, that’s not a kid problem. That’s a program problem.</p>\n<h2 id=\"too-much\">Too much</h2>\n<p>Too much is different. It looks like sleep changes, appetite changes, mood that follows the practice schedule. The kid isn’t bored, they’re depleted.</p>\n<p>The fix is usually subtraction, not negotiation. Drop a practice. Take a week off. The team will survive. The kid won’t if the load doesn’t come down.</p>\n<h2 id=\"the-one-conversation\">The one conversation</h2>\n<p>Sit down with the kid and ask one question. <em>What would you want this summer to feel like in three weeks?</em></p>\n<p>The answer is the diagnostic. If they say “I want to feel like I had fun and went to the lake a few times,” the schedule is too dense. If they say “I want to be ready for tryouts,” the schedule is right and they need encouragement to push through. If they say “I don’t know,” the next question is “Want to take a week off and see?”</p>\n<p>A week off is cheap. Burnout in November is expensive.</p>\n<p><a href=\"/decisions/should-my-kid-quit-sports/\">Should my kid quit sports?</a> is the deeper version of this conversation. <a href=\"/decisions/when-sports-stop-being-fun/\">When sports stop being fun</a> is the diagnostic.</p>";

				const frontmatter = {"title":"The summer practice schedule the *kid hates*","dek":"What's actually wrong, what isn't, and the one conversation that fixes it more often than not.","seoDescription":"It's July. The schedule said \"summer optional\" in May. By July it's three nights a week and your kid is dragging.","topic":"season-ops","format":"note","phase":"drive-there","sport":"multi-sport","age":"11-12","publishedAt":"2026-05-13T00:00:00.000Z","featured":false,"draft":false};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/articles/summer-practice-schedule-the-kid-hates.md";
				const url = undefined;
				function rawContent() {
					return "\nIt's July. The schedule said \"summer optional\" in May. By July it's three nights a week and your kid is dragging.\n\nThe first question is whether the kid is bored or whether the schedule is genuinely too much. Those look the same from the parent side and they require different fixes.\n\n## Bored\n\nIf the kid is bored, the practices are usually fine but the variety is gone. Same drills. Same teammates. No games. The remedy is talking to the coach about adding a small tournament or a different kind of practice (scrimmage day, parent-vs-kids game, anything).\n\nSome coaches will. Some won't. If the coach won't and the kid is bored for six more weeks, that's not a kid problem. That's a program problem.\n\n## Too much\n\nToo much is different. It looks like sleep changes, appetite changes, mood that follows the practice schedule. The kid isn't bored, they're depleted.\n\nThe fix is usually subtraction, not negotiation. Drop a practice. Take a week off. The team will survive. The kid won't if the load doesn't come down.\n\n## The one conversation\n\nSit down with the kid and ask one question. _What would you want this summer to feel like in three weeks?_\n\nThe answer is the diagnostic. If they say \"I want to feel like I had fun and went to the lake a few times,\" the schedule is too dense. If they say \"I want to be ready for tryouts,\" the schedule is right and they need encouragement to push through. If they say \"I don't know,\" the next question is \"Want to take a week off and see?\"\n\nA week off is cheap. Burnout in November is expensive.\n\n[Should my kid quit sports?](/decisions/should-my-kid-quit-sports/) is the deeper version of this conversation. [When sports stop being fun](/decisions/when-sports-stop-being-fun/) is the diagnostic.\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"bored","text":"Bored"},{"depth":2,"slug":"too-much","text":"Too much"},{"depth":2,"slug":"the-one-conversation","text":"The one conversation"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
