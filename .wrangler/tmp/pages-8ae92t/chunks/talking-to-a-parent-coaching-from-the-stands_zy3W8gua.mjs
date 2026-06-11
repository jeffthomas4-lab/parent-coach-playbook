globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>It was mid-season. One parent kept yelling coaching cues from the stands. “Keep your feet moving!” “Talk to each other!” We could feel the kids’ attention split between the field and the bleachers. So we had a conversation.</p>\n<p>At 5-7, parents are louder than the kids. One parent stands up and yells a coaching cue. The kid hears it. Every other kid hears it. Everyone looks at their parents instead of the field.</p>\n<h2 id=\"how-we-do-it\">How we do it</h2>\n<p>We catch this parent after the game, not during halftime. Private conversation only.</p>\n<p>We say: “I noticed you calling coaching cues from the stands on Saturday. I know you’re trying to help. Here’s what happens: your kid listens to you instead of me, and the other kids look at their parents instead of the field. For this age, I need them focused in one direction.”</p>\n<p>Then: “If you want to help your kid improve, we can give you three things to work on at home. That’s where the coaching happens.”</p>\n<h2 id=\"what-happens-next\">What happens next</h2>\n<p>Most parents stop immediately. They didn’t realize they were doing it. They thought the team was theirs to develop, not just their child. At this age, that’s an honest mistake.</p>\n<p>A few won’t listen. Then we’re friendly but firm: “I need you to watch from the bleachers like everyone else. That’s the rule.”</p>\n<h2 id=\"the-tone\">The tone</h2>\n<p>We don’t shame them. We don’t make it personal. They’re invested in their kid’s success. That’s not a bad thing. It’s just misdirected. We’re not asking them to care less. We’re asking them to care in a way that actually helps.</p>";

				const frontmatter = {"title":"Talking to a Parent Who's Coaching From the Stands","dek":"They're trying to help. They don't see what they're actually doing.","seoDescription":"It was mid-season. One parent kept yelling coaching cues from the stands. \"Keep your feet moving!\" \"Talk to each other!\" We could feel the kids' attention...","topic":"communication","format":"note","phase":"game","sport":"multi-sport","age":"5-7","publishedAt":"2026-01-20T00:00:00.000Z","featured":false,"editorial":{"claudeReviewedAt":"2026-06-20T00:00:00.000Z"}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/articles/talking-to-a-parent-coaching-from-the-stands.md";
				const url = undefined;
				function rawContent() {
					return "\nIt was mid-season. One parent kept yelling coaching cues from the stands. \"Keep your feet moving!\" \"Talk to each other!\" We could feel the kids' attention split between the field and the bleachers. So we had a conversation.\n\nAt 5-7, parents are louder than the kids. One parent stands up and yells a coaching cue. The kid hears it. Every other kid hears it. Everyone looks at their parents instead of the field.\n\n## How we do it\n\nWe catch this parent after the game, not during halftime. Private conversation only.\n\nWe say: \"I noticed you calling coaching cues from the stands on Saturday. I know you're trying to help. Here's what happens: your kid listens to you instead of me, and the other kids look at their parents instead of the field. For this age, I need them focused in one direction.\"\n\nThen: \"If you want to help your kid improve, we can give you three things to work on at home. That's where the coaching happens.\"\n\n## What happens next\n\nMost parents stop immediately. They didn't realize they were doing it. They thought the team was theirs to develop, not just their child. At this age, that's an honest mistake.\n\nA few won't listen. Then we're friendly but firm: \"I need you to watch from the bleachers like everyone else. That's the rule.\"\n\n## The tone\n\nWe don't shame them. We don't make it personal. They're invested in their kid's success. That's not a bad thing. It's just misdirected. We're not asking them to care less. We're asking them to care in a way that actually helps.\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"how-we-do-it","text":"How we do it"},{"depth":2,"slug":"what-happens-next","text":"What happens next"},{"depth":2,"slug":"the-tone","text":"The tone"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
