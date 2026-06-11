globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>You drove four hours. You’re at a tournament hotel. Your kid spent two hours in the pool with three teammates who also spent two hours in the pool. Everyone is fried. Tomorrow’s first game is at 8 a.m.</p>\n<p>The math you didn’t do: pool play counts. Sunburn, dehydration, and the kind of full-body fatigue that comes from a kid swimming and screaming for two hours all hit the next morning. You’d be surprised how often the team that loses the early Saturday game lost it in the pool Friday night.</p>\n<h2 id=\"what-the-kid-actually-needs\">What the kid actually needs</h2>\n<p>The kid wants to be in the pool with their friends. The kid is right. That’s a real part of the tournament weekend, and over-policing it is its own mistake.</p>\n<p>The job is the cap, not the prohibition. Forty-five minutes in the pool, then snacks, then quiet time before dinner. Sunscreen earlier than you think. Water before, during, and after. Don’t skip dinner.</p>\n<p>The team that handles tournaments well has parents who are quietly running the schedule together. A WhatsApp thread. A 6:30 p.m. dinner reservation that everyone agrees to. A 9:30 p.m. lights-out the kids actually respect.</p>\n<h2 id=\"the-thing-nobody-talks-about\">The thing nobody talks about</h2>\n<p>The other variable is that the parent who lets their kid stay in the pool longest is sometimes the parent who wants their kid to lose tomorrow. That sounds harsh. Watch for it. Some parents are exhausted by the season and a Saturday morning loss means an early drive home.</p>\n<p>Don’t be that parent. The kids are watching how you handle the trade-off.</p>\n<p><a href=\"/drive-home/the-tournament-weekend-that-ate-the-family/\">The tournament weekend that ate the family</a> covers the bigger version of this. <a href=\"/drive-there/packing-for-a-long-tournament-weekend/\">Packing for a long tournament weekend</a> is on the queue for next month.</p>";

				const frontmatter = {"title":"The hotel pool *is the practice*","dek":"Three days at a tournament, two pool sessions, one kid who doesn't want to play tomorrow's game. The trade nobody talks about.","seoDescription":"You drove four hours. You're at a tournament hotel. Your kid spent two hours in the pool with three teammates who also spent two hours in the pool.","topic":"season-ops","format":"note","phase":"game","sport":"multi-sport","age":"8-10","publishedAt":"2026-05-13T00:00:00.000Z","featured":false,"draft":false};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/articles/the-hotel-pool-is-the-practice.md";
				const url = undefined;
				function rawContent() {
					return "\nYou drove four hours. You're at a tournament hotel. Your kid spent two hours in the pool with three teammates who also spent two hours in the pool. Everyone is fried. Tomorrow's first game is at 8 a.m.\n\nThe math you didn't do: pool play counts. Sunburn, dehydration, and the kind of full-body fatigue that comes from a kid swimming and screaming for two hours all hit the next morning. You'd be surprised how often the team that loses the early Saturday game lost it in the pool Friday night.\n\n## What the kid actually needs\n\nThe kid wants to be in the pool with their friends. The kid is right. That's a real part of the tournament weekend, and over-policing it is its own mistake.\n\nThe job is the cap, not the prohibition. Forty-five minutes in the pool, then snacks, then quiet time before dinner. Sunscreen earlier than you think. Water before, during, and after. Don't skip dinner.\n\nThe team that handles tournaments well has parents who are quietly running the schedule together. A WhatsApp thread. A 6:30 p.m. dinner reservation that everyone agrees to. A 9:30 p.m. lights-out the kids actually respect.\n\n## The thing nobody talks about\n\nThe other variable is that the parent who lets their kid stay in the pool longest is sometimes the parent who wants their kid to lose tomorrow. That sounds harsh. Watch for it. Some parents are exhausted by the season and a Saturday morning loss means an early drive home.\n\nDon't be that parent. The kids are watching how you handle the trade-off.\n\n[The tournament weekend that ate the family](/drive-home/the-tournament-weekend-that-ate-the-family/) covers the bigger version of this. [Packing for a long tournament weekend](/drive-there/packing-for-a-long-tournament-weekend/) is on the queue for next month.\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"what-the-kid-actually-needs","text":"What the kid actually needs"},{"depth":2,"slug":"the-thing-nobody-talks-about","text":"The thing nobody talks about"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
