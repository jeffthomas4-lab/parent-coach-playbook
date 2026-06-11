globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>It was opening day. We had 13 kids and a field. At this age, every kid should play half the game. Period. That’s the deal. So we built the lineup card the night before and posted it at the field.</p>\n<h2 id=\"the-system\">The system</h2>\n<p>We write down 12 kids, maybe 14. We divide our fielders into two rotations. One group plays the first three innings, the other plays the second three. With outfielders especially, five kids means two rotations of play time, not one kid sitting the whole game.</p>\n<p>We assign positions by capability, not by favoritism. The most advanced kid plays shortstop in rotation one. The next kid plays shortstop in rotation two. This teaches everyone the position and gives everyone playing time.</p>\n<p>For batting, we alternate: kid one bats first inning, gets subbed out bottom of second, comes back in fourth inning. It’s not elegant, but every kid gets three to five at-bats.</p>\n<h2 id=\"the-cost\">The cost</h2>\n<p>Yes, we’ll probably lose some games. We might lose the playoff game with this system. That’s the cost of coaching 5-7.</p>\n<h2 id=\"the-communication\">The communication</h2>\n<p>We post the rotation before the game so parents know what to expect. “Emma plays the first three innings in left field, then moves to first base in the second half.” No surprises. No angry parents wondering why their kid was on the bench.</p>\n<p>This system takes ten minutes to build and saves us from an entire season of parent anger. We do it the night before every game.</p>\n<hr>\n<p><strong>Gear mentioned in this article</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — a solid pick for youth baseball players.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full Baseball gear guide →</a> — all picks by age and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"The 5-7 Lineup Card: A Fair Rotation in Three Minutes","dek":"Every kid plays half the game. Build it the night before. Post it before first pitch.","seoDescription":"It was opening day. We had 13 kids and a field. At this age, every kid should play half the game. Period. That's the deal.","topic":"game-day","format":"note","phase":"game","sport":"baseball","age":"5-7","publishedAt":"2026-03-31T00:00:00.000Z","featured":false};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/articles/the-5-to-7-lineup-card-fair-rotation-in-three-minutes.md";
				const url = undefined;
				function rawContent() {
					return "\nIt was opening day. We had 13 kids and a field. At this age, every kid should play half the game. Period. That's the deal. So we built the lineup card the night before and posted it at the field.\n\n## The system\n\nWe write down 12 kids, maybe 14. We divide our fielders into two rotations. One group plays the first three innings, the other plays the second three. With outfielders especially, five kids means two rotations of play time, not one kid sitting the whole game.\n\nWe assign positions by capability, not by favoritism. The most advanced kid plays shortstop in rotation one. The next kid plays shortstop in rotation two. This teaches everyone the position and gives everyone playing time.\n\nFor batting, we alternate: kid one bats first inning, gets subbed out bottom of second, comes back in fourth inning. It's not elegant, but every kid gets three to five at-bats.\n\n## The cost\n\nYes, we'll probably lose some games. We might lose the playoff game with this system. That's the cost of coaching 5-7.\n\n## The communication\n\nWe post the rotation before the game so parents know what to expect. \"Emma plays the first three innings in left field, then moves to first base in the second half.\" No surprises. No angry parents wondering why their kid was on the bench.\n\nThis system takes ten minutes to build and saves us from an entire season of parent anger. We do it the night before every game.\n\n---\n\n**Gear mentioned in this article** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — a solid pick for youth baseball players.\n\n[Full Baseball gear guide →](/what-to-buy/baseball/) — all picks by age and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"the-system","text":"The system"},{"depth":2,"slug":"the-cost","text":"The cost"},{"depth":2,"slug":"the-communication","text":"The communication"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
