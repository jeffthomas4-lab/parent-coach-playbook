globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>I started a chat with three other moms from my kid’s team last April. It’s called the u8 girls soccer thread. We’re at thirty-seven hundred messages now.</p>\n<p>I can’t recommend this enough.</p>\n<p>You post the field change. You post photos of someone scoring. You post when you’re running late and need someone to let coach know. You post when your kid had a hard game and you need to vent for two minutes before you get back in the car.</p>\n<p>There’s a particular flavor of tired specific to the parent of an eight-year-old who plays soccer year-round. The group chat sees that tired and says <em>me too, want a Diet Coke.</em></p>\n<h2 id=\"what-i-learned\">What I learned</h2>\n<p>Things from the group chat that I would not have learned from the league email.</p>\n<p>The Sunday game last weekend was rescheduled and nobody got the email. The chat got it five minutes after one mom called the field directly.</p>\n<p>The new coach for u9 is good. Three moms had a kid go through her last year and they all said the same thing without coordinating.</p>\n<p>Snacks at the field next door are mid. Bring your own.</p>\n<p>The kid who is mean to my kid is going through something at home. The mom of that kid is in the chat and asked us to be patient. We are.</p>\n<h2 id=\"the-reality\">The reality</h2>\n<p>The group chat is the actual league. The official league is the bureaucracy that contains the league.</p>\n<h2 id=\"how-to-start\">How to start</h2>\n<p>If you’re at the start of a season and you don’t yet have a group chat, here’s the move. Pick the two parents who seem warmest. Add their numbers. Send the first message. “Hey: wanted a smaller chat for the parents who are juggling. Carpool, snacks, vent. We can keep it tight.”</p>\n<p>That message has never not worked.</p>";

				const frontmatter = {"title":"The Group Chat That Saved My Season","dek":"Three parents. One thread. Thirty-seven hundred messages of actual help.","seoDescription":"I started a chat with three other moms from my kid's team last April. It's called the u8 girls soccer thread. We're at thirty-seven hundred messages now.","format":"note","topic":"communication","phase":"game","sport":"multi-sport","age":"8-10","publishedAt":"2026-04-23T00:00:00.000Z","featured":false};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/articles/the-group-chat-that-saved-me.md";
				const url = undefined;
				function rawContent() {
					return "\nI started a chat with three other moms from my kid's team last April. It's called the u8 girls soccer thread. We're at thirty-seven hundred messages now.\n\nI can't recommend this enough.\n\nYou post the field change. You post photos of someone scoring. You post when you're running late and need someone to let coach know. You post when your kid had a hard game and you need to vent for two minutes before you get back in the car.\n\nThere's a particular flavor of tired specific to the parent of an eight-year-old who plays soccer year-round. The group chat sees that tired and says *me too, want a Diet Coke.*\n\n## What I learned\n\nThings from the group chat that I would not have learned from the league email.\n\nThe Sunday game last weekend was rescheduled and nobody got the email. The chat got it five minutes after one mom called the field directly.\n\nThe new coach for u9 is good. Three moms had a kid go through her last year and they all said the same thing without coordinating.\n\nSnacks at the field next door are mid. Bring your own.\n\nThe kid who is mean to my kid is going through something at home. The mom of that kid is in the chat and asked us to be patient. We are.\n\n## The reality\n\nThe group chat is the actual league. The official league is the bureaucracy that contains the league.\n\n## How to start\n\nIf you're at the start of a season and you don't yet have a group chat, here's the move. Pick the two parents who seem warmest. Add their numbers. Send the first message. \"Hey: wanted a smaller chat for the parents who are juggling. Carpool, snacks, vent. We can keep it tight.\"\n\nThat message has never not worked. ";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"what-i-learned","text":"What I learned"},{"depth":2,"slug":"the-reality","text":"The reality"},{"depth":2,"slug":"how-to-start","text":"How to start"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
