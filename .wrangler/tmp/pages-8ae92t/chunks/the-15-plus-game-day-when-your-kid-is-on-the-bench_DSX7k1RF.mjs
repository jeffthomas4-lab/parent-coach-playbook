globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Our 15-year-old wasn’t starting. They came home frustrated and angry. Our instinct was to advocate for them. Text the coach. Tell them they were wrong. Tell our kid they’re better than the starter.</p>\n<p>We didn’t do any of that.</p>\n<p>Instead we said: “Tough position. What are you going to do about it?”</p>\n<p>We made them own the situation. That’s more valuable than any argument we could have with the coach.</p>\n<h2 id=\"the-hard-truth\">The hard truth</h2>\n<p>If they’re better than the starter, they’ll play. If they’re not playing, they’re either not better, not ready, or not the right fit for the system. Arguing won’t change any of those things.</p>\n<p>What will change things: improving in a specific area the coach identified, or finding a team where they fit better.</p>\n<h2 id=\"if-its-unclear\">If it’s unclear</h2>\n<p>If the coach has never told them why they’re not starting, that’s different. That’s worth asking. “Can I get feedback on what I need to work on?” But that question comes from our kid, not from us.</p>\n<h2 id=\"what-were-actually-teaching\">What we’re actually teaching</h2>\n<p>At 15-plus, we’re raising someone who can handle disappointment, work within a system even when it’s hard, and make decisions about their future. Bench time teaches all three if we don’t rescue them from it.</p>\n<p>We watch the game. We cheer when they go in. We don’t spend four quarters thinking about how the coach is wrong. Our kid will pick up that energy. It’ll make them bitter instead of better.</p>";

				const frontmatter = {"title":"Game Day When Your Kid Is on the Bench","dek":"They know they're not starting. Your job is to support what they can control.","seoDescription":"Our 15-year-old wasn't starting. They came home frustrated and angry. Our instinct was to advocate for them. Text the coach. Tell them they were wrong.","topic":"game-day","format":"note","phase":"game","sport":"multi-sport","age":"15-plus","publishedAt":"2026-04-25T00:00:00.000Z","featured":false,"hero":"/illustrations/bench-moment-during-game.webp","heroAlt":"A high school athlete sitting on the team bench during a game, fully suited, watching teammates play."};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/articles/the-15-plus-game-day-when-your-kid-is-on-the-bench.md";
				const url = undefined;
				function rawContent() {
					return "\nOur 15-year-old wasn't starting. They came home frustrated and angry. Our instinct was to advocate for them. Text the coach. Tell them they were wrong. Tell our kid they're better than the starter.\n\nWe didn't do any of that.\n\nInstead we said: \"Tough position. What are you going to do about it?\"\n\nWe made them own the situation. That's more valuable than any argument we could have with the coach.\n\n## The hard truth\n\nIf they're better than the starter, they'll play. If they're not playing, they're either not better, not ready, or not the right fit for the system. Arguing won't change any of those things.\n\nWhat will change things: improving in a specific area the coach identified, or finding a team where they fit better.\n\n## If it's unclear\n\nIf the coach has never told them why they're not starting, that's different. That's worth asking. \"Can I get feedback on what I need to work on?\" But that question comes from our kid, not from us.\n\n## What we're actually teaching\n\nAt 15-plus, we're raising someone who can handle disappointment, work within a system even when it's hard, and make decisions about their future. Bench time teaches all three if we don't rescue them from it.\n\nWe watch the game. We cheer when they go in. We don't spend four quarters thinking about how the coach is wrong. Our kid will pick up that energy. It'll make them bitter instead of better.\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"the-hard-truth","text":"The hard truth"},{"depth":2,"slug":"if-its-unclear","text":"If it’s unclear"},{"depth":2,"slug":"what-were-actually-teaching","text":"What we’re actually teaching"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
