globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>It was March and the roster list went up. Our kid made B team. Not A. We sat with the disappointment for a night, then watched what happened next.</p>\n<p>The A team at middle school is the best 12 kids. They’re going to win. There are always good kids who don’t make it. That might be our kid. And that’s actually okay. It might be good.</p>\n<p>I’ve seen this over and over. The kids who don’t make the top team get valuable minutes. They develop faster. They don’t sit on the bench watching. By freshman year, they catch up to the kids who made A. Then they pass them.</p>\n<p>The kids who make A? Half of them sit. They get frustrated. Some quit. Some play conservative because mistakes mean a shorter leash. That’s not development.</p>\n<h2 id=\"what-we-say\">What we say</h2>\n<p>If our kid doesn’t make the A team, we don’t treat it like failure. We treat it like placement. “You’re on the B team. That’s where you’re going to play the most and learn the fastest right now.”</p>\n<p>When they come home frustrated, we say: “I know you wanted A. I wanted that too. But let’s watch how this works. You’re going to get big minutes. You’re going to make mistakes and learn from them. That matters more than sitting on the best team.”</p>\n<p>This only works if we actually mean it. If we go home and complain to our spouse about the coach’s politics, our kid will hear it. Then they’ll think they didn’t make it because the system is unfair, not because they have room to grow.</p>\n<h2 id=\"what-we-dont-do\">What we don’t do</h2>\n<p>We don’t call the coach. We don’t suggest our kid should have made A. We don’t text other parents about the decision. We let it be.</p>\n<p>Some kids do belong on A. If ours is one of them, that will be clear next season when they move up. Until then, we focus on effort, not outcome.</p>";

				const frontmatter = {"title":"Middle-School Tryouts (13-14): When Not Making It Is the Best Thing","dek":"The A team has 12 spots. Your kid is not the worst kid who didn't get one.","seoDescription":"It was March and the roster list went up. Our kid made B team. Not A. We sat with the disappointment for a night, then watched what happened next.","topic":"tryouts","format":"note","phase":"drive-home","sport":"multi-sport","age":"13-14","publishedAt":"2026-03-10T00:00:00.000Z","featured":false,"editorial":{"claudeReviewedAt":"2026-05-28T00:00:00.000Z"}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/articles/middle-school-tryouts-when-not-making-it-is-best.md";
				const url = undefined;
				function rawContent() {
					return "\nIt was March and the roster list went up. Our kid made B team. Not A. We sat with the disappointment for a night, then watched what happened next.\n\nThe A team at middle school is the best 12 kids. They're going to win. There are always good kids who don't make it. That might be our kid. And that's actually okay. It might be good.\n\nI've seen this over and over. The kids who don't make the top team get valuable minutes. They develop faster. They don't sit on the bench watching. By freshman year, they catch up to the kids who made A. Then they pass them.\n\nThe kids who make A? Half of them sit. They get frustrated. Some quit. Some play conservative because mistakes mean a shorter leash. That's not development.\n\n## What we say\n\nIf our kid doesn't make the A team, we don't treat it like failure. We treat it like placement. \"You're on the B team. That's where you're going to play the most and learn the fastest right now.\"\n\nWhen they come home frustrated, we say: \"I know you wanted A. I wanted that too. But let's watch how this works. You're going to get big minutes. You're going to make mistakes and learn from them. That matters more than sitting on the best team.\"\n\nThis only works if we actually mean it. If we go home and complain to our spouse about the coach's politics, our kid will hear it. Then they'll think they didn't make it because the system is unfair, not because they have room to grow.\n\n## What we don't do\n\nWe don't call the coach. We don't suggest our kid should have made A. We don't text other parents about the decision. We let it be.\n\nSome kids do belong on A. If ours is one of them, that will be clear next season when they move up. Until then, we focus on effort, not outcome.\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"what-we-say","text":"What we say"},{"depth":2,"slug":"what-we-dont-do","text":"What we don’t do"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
