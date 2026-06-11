globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>At fifteen and up, some kids walk away from travel ball. They’re burned out or ready to do something else. This is normal. Treating it like a failure is the mistake.</p>\n<p><strong>Why they leave</strong>\nFour years of three-to-five-days-a-week practice builds fatigue. Fatigue builds resentment. Some kids want their weekends back. Some want to try other sports. Some want to focus on school. All of these are legitimate reasons.</p>\n<p><strong>What you say to coaches</strong>\n“They’re done.” You don’t owe an explanation. You don’t need to schedule a meeting. You don’t need to justify your kid’s decision to an adult. Send an email. Done.</p>\n<p><strong>What you say to your kid</strong>\n“This is your call. You understand this changes things, and that’s okay.” If they’ve been all-in for four years and now want to stop, they understand the cost. Respect it.</p>\n<p><strong>What doesn’t happen</strong>\nYou don’t convince them to stay one more season. You don’t promise them they’ll be on the elite team if they stick it out. You don’t use guilt or obligation. They’re fifteen. They get to decide.</p>\n<p><strong>The pivot</strong>\nSome kids move to club teams (less practice, same competition level). Some move to school sports. Some quit competitive play and join the gym instead. All of those are wins. The goal was to give them an experience, not to own their life.</p>\n<p><strong>The talk with them</strong>\n“You gave this four years. You learned things you wouldn’t have otherwise. You made friends. That’s done now. What do you want to do next?” Then listen.</p>\n<p><strong>What not to do</strong>\nIt’s best to avoid treating this like a betrayal. Skip bringing it up five years from now. Don’t tell them they should have pushed through. They made their call. Let it be.</p>\n<p><strong>The bigger picture</strong>\nThey’re learning that their preferences matter. That their energy is their own. That quitting something doesn’t make them weak. Those are lessons they need.</p>\n<p>If they’re done, they’re done. Let them be done. That’s actually winning.</p>";

				const frontmatter = {"title":"The 15-Plus Walking-Away Decision","dek":"How to quit without it being a failure.","seoDescription":"At fifteen and up, some kids walk away from travel ball. They're burned out or ready to do something else. This is normal.","topic":"rec-vs-travel","format":"note","phase":"drive-home","sport":"multi-sport","age":"15-plus","publishedAt":"2026-03-10T00:00:00.000Z","featured":false,"editorial":{"claudeReviewedAt":"2026-05-26T00:00:00.000Z"}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/articles/15-plus-walking-away.md";
				const url = undefined;
				function rawContent() {
					return "\nAt fifteen and up, some kids walk away from travel ball. They're burned out or ready to do something else. This is normal. Treating it like a failure is the mistake.\n\n**Why they leave**\nFour years of three-to-five-days-a-week practice builds fatigue. Fatigue builds resentment. Some kids want their weekends back. Some want to try other sports. Some want to focus on school. All of these are legitimate reasons.\n\n**What you say to coaches**\n\"They're done.\" You don't owe an explanation. You don't need to schedule a meeting. You don't need to justify your kid's decision to an adult. Send an email. Done.\n\n**What you say to your kid**\n\"This is your call. You understand this changes things, and that's okay.\" If they've been all-in for four years and now want to stop, they understand the cost. Respect it.\n\n**What doesn't happen**\nYou don't convince them to stay one more season. You don't promise them they'll be on the elite team if they stick it out. You don't use guilt or obligation. They're fifteen. They get to decide.\n\n**The pivot**\nSome kids move to club teams (less practice, same competition level). Some move to school sports. Some quit competitive play and join the gym instead. All of those are wins. The goal was to give them an experience, not to own their life.\n\n**The talk with them**\n\"You gave this four years. You learned things you wouldn't have otherwise. You made friends. That's done now. What do you want to do next?\" Then listen.\n\n**What not to do**\nIt's best to avoid treating this like a betrayal. Skip bringing it up five years from now. Don't tell them they should have pushed through. They made their call. Let it be.\n\n**The bigger picture**\nThey're learning that their preferences matter. That their energy is their own. That quitting something doesn't make them weak. Those are lessons they need.\n\nIf they're done, they're done. Let them be done. That's actually winning.\n";
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
