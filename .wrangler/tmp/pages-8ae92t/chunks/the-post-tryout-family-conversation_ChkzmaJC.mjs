globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Tryout results come in. We don’t lead with congratulations or sympathy. We lead with curiosity.</p>\n<p>“Tell me about the tryout. What happened?” We listen. We let them talk. We don’t interrupt to celebrate or console.</p>\n<p>When they’re done, we ask: “What did you notice about the other kids?” We make them analyze the pool. If they made it: “They looked good, right? That’s what the next level looks like.” If they didn’t: “They had some good players. What was different about the way they played?”</p>\n<p>Then: “What’s next?” This is the only question that matters.</p>\n<h2 id=\"if-they-made-it\">If they made it</h2>\n<p>“The real work starts now. Training camp is in three weeks. What are you going to work on before camp?” We put them in charge of preparation.</p>\n<h2 id=\"if-they-didnt-make-it\">If they didn’t make it</h2>\n<p>“Do you want to try out again? Do you want to play somewhere else? Do you want to take a break?” We let them decide. Kids who are forced back into a sport they just got rejected from don’t suddenly love it. But kids who decide to come back in the offseason often come back stronger.</p>\n<h2 id=\"either-way\">Either way</h2>\n<p>The message is: “I’m proud of you for trying. Results don’t change that. What matters is what you do next.”</p>\n<p>Then we actually let it go. We don’t bring it up at dinner. We don’t text the coach. We don’t post about it on social media. We don’t tell relatives the story. We move on. Our kid will too, unless we keep the wound open.</p>";

				const frontmatter = {"title":"The Post-Tryout Family Conversation","dek":"Same structure works whether they made it or didn't. Start with curiosity.","seoDescription":"Tryout results come in. We don't lead with congratulations or sympathy. We lead with curiosity.","topic":"tryouts","format":"note","phase":"drive-home","sport":"multi-sport","age":"all-ages","publishedAt":"2026-03-24T00:00:00.000Z","featured":false};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/articles/the-post-tryout-family-conversation.md";
				const url = undefined;
				function rawContent() {
					return "\nTryout results come in. We don't lead with congratulations or sympathy. We lead with curiosity.\n\n\"Tell me about the tryout. What happened?\" We listen. We let them talk. We don't interrupt to celebrate or console.\n\nWhen they're done, we ask: \"What did you notice about the other kids?\" We make them analyze the pool. If they made it: \"They looked good, right? That's what the next level looks like.\" If they didn't: \"They had some good players. What was different about the way they played?\"\n\nThen: \"What's next?\" This is the only question that matters.\n\n## If they made it\n\n\"The real work starts now. Training camp is in three weeks. What are you going to work on before camp?\" We put them in charge of preparation.\n\n## If they didn't make it\n\n\"Do you want to try out again? Do you want to play somewhere else? Do you want to take a break?\" We let them decide. Kids who are forced back into a sport they just got rejected from don't suddenly love it. But kids who decide to come back in the offseason often come back stronger.\n\n## Either way\n\nThe message is: \"I'm proud of you for trying. Results don't change that. What matters is what you do next.\"\n\nThen we actually let it go. We don't bring it up at dinner. We don't text the coach. We don't post about it on social media. We don't tell relatives the story. We move on. Our kid will too, unless we keep the wound open.\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"if-they-made-it","text":"If they made it"},{"depth":2,"slug":"if-they-didnt-make-it","text":"If they didn’t make it"},{"depth":2,"slug":"either-way","text":"Either way"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
