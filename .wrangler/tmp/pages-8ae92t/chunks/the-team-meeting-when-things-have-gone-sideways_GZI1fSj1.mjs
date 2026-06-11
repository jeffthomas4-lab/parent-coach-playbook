globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A clique forms. Someone is excluded. A kid made a mistake and got benched and now two parents are questioning your decisions. Or the team lost four straight and the energy is dead.</p>\n<p>Call a team meeting. Not a parent meeting. Just the kids.</p>\n<p>Stand up and say: “Something isn’t working. I feel it. You feel it. We’re not playing together. Playing together means you show up for each other, you don’t blame people, and you work through problems instead of around them. That’s not happening.”</p>\n<p>Then ask: “What’s broken?” Let the kids talk. They’ll name it. Someone is being excluded. Someone is angry. The team split into groups. They always know.</p>\n<p>Then you say: “Here’s what we’re fixing. Next practice, you’re sitting with someone you don’t normally sit with. You’re partnering with someone new for drills. You’re finding something you respect about someone you’ve been avoiding.”</p>\n<p>Don’t lecture on inclusion. Show them what to do.</p>\n<p>At this age, kids split because they’re figuring out who they are. That’s normal. Your job is to make sure the team is a place where different kids still have to work together. That builds respect across the cracks.</p>\n<p>Send a short email to parents after: “We had a team talk today about culture. Nothing’s wrong. Just making sure we’re one unit, not five.” You don’t need more than that.</p>";

				const frontmatter = {"title":"The 11-12 Ages: The Team Meeting When Things Have Gone Sideways","dek":"Something broke. Here's how to talk about it without pointing fingers.","seoDescription":"A clique forms. Someone is excluded. A kid made a mistake and got benched and now two parents are questioning your decisions.","topic":"communication","format":"note","phase":"game","sport":"multi-sport","age":"11-12","publishedAt":"2026-02-03T00:00:00.000Z","featured":false,"editorial":{"claudeReviewedAt":"2026-04-01T00:00:00.000Z"}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/articles/the-team-meeting-when-things-have-gone-sideways.md";
				const url = undefined;
				function rawContent() {
					return "\nA clique forms. Someone is excluded. A kid made a mistake and got benched and now two parents are questioning your decisions. Or the team lost four straight and the energy is dead.\n\nCall a team meeting. Not a parent meeting. Just the kids.\n\nStand up and say: \"Something isn't working. I feel it. You feel it. We're not playing together. Playing together means you show up for each other, you don't blame people, and you work through problems instead of around them. That's not happening.\"\n\nThen ask: \"What's broken?\" Let the kids talk. They'll name it. Someone is being excluded. Someone is angry. The team split into groups. They always know.\n\nThen you say: \"Here's what we're fixing. Next practice, you're sitting with someone you don't normally sit with. You're partnering with someone new for drills. You're finding something you respect about someone you've been avoiding.\"\n\nDon't lecture on inclusion. Show them what to do. \n\nAt this age, kids split because they're figuring out who they are. That's normal. Your job is to make sure the team is a place where different kids still have to work together. That builds respect across the cracks.\n\nSend a short email to parents after: \"We had a team talk today about culture. Nothing's wrong. Just making sure we're one unit, not five.\" You don't need more than that.\n";
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
