globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>You’re driving home from practice. Your kid is in the back seat, helmet of hair smashed to one side, picking at a hole in his sock.</p>\n<p>He says <em>Dad. I don’t think I’m a good soccer player.</em></p>\n<p>You don’t have a script for this. Here’s what sounds right but isn’t, and what actually works.</p>\n<p>The wrong move: <em>Of course you are! You’re great! You scored a goal last week!</em> That sentence is a lie that closes the conversation. He knows the goal was deflected off another kid’s leg. If you tell him he’s great, he stops trusting your read on him.</p>\n<p>Another wrong move: <em>What makes you say that?</em> That sounds therapeutic. He’s eight. He doesn’t want a therapist. He wants his dad. That question turns the car into an interview.</p>\n<p>What works, after a longer pause than felt comfortable: <em>Yeah. There are a few things you’re still working on. I think you’re getting better at them. You want to talk about which ones?</em></p>\n<p>He says <em>yeah I think my left foot is bad.</em></p>\n<p>You talk about his left foot for three minutes. He feels better. You feel better. The conversation ends on him saying he wants to work on it at practice next week.</p>\n<p>The insight we heard later was the one that should have come first: <em>He didn’t need you to disagree. He needed you to take him seriously.</em></p>\n<hr>\n<p><strong>Gear mentioned in this article</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size4/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth soccer ball (size 4) →</a> — a solid pick for youth soccer players.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full Soccer gear guide →</a> — all picks by age and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"What my eight-year-old said in *the car last week*","seoDescription":"You're driving home from practice. Your kid is in the back seat, helmet of hair smashed to one side, picking at a hole in his sock.","format":"note","issue":8,"phase":"drive-home","sport":"soccer","age":"8-10","seasonPhase":"early","publishedAt":"2026-02-05T00:00:00.000Z","hero":"/illustrations/what-my-kid-said-in-the-car.webp","heroAlt":"Backseat of car view from back-passenger window. Nine-year-old looks out window in profile, breath fogging glass slightly, mid-thought expression.","editorial":{"claudeReviewedAt":"2026-04-05T00:00:00.000Z"}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/articles/what-my-kid-said-in-the-car.md";
				const url = undefined;
				function rawContent() {
					return "\nYou're driving home from practice. Your kid is in the back seat, helmet of hair smashed to one side, picking at a hole in his sock.\n\nHe says *Dad. I don't think I'm a good soccer player.*\n\nYou don't have a script for this. Here's what sounds right but isn't, and what actually works.\n\nThe wrong move: *Of course you are! You're great! You scored a goal last week!* That sentence is a lie that closes the conversation. He knows the goal was deflected off another kid's leg. If you tell him he's great, he stops trusting your read on him.\n\nAnother wrong move: *What makes you say that?* That sounds therapeutic. He's eight. He doesn't want a therapist. He wants his dad. That question turns the car into an interview.\n\nWhat works, after a longer pause than felt comfortable: *Yeah. There are a few things you're still working on. I think you're getting better at them. You want to talk about which ones?*\n\nHe says *yeah I think my left foot is bad.*\n\nYou talk about his left foot for three minutes. He feels better. You feel better. The conversation ends on him saying he wants to work on it at practice next week.\n\nThe insight we heard later was the one that should have come first: *He didn't need you to disagree. He needed you to take him seriously.*\n\n---\n\n**Gear mentioned in this article** (affiliate)\n\n[Youth soccer ball (size 4) →](/go/soccer-ball-size4/) — a solid pick for youth soccer players.\n\n[Full Soccer gear guide →](/what-to-buy/soccer/) — all picks by age and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
