globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Twenty-five minutes is your window. Longer and you lose them to fatigue and distraction. Shorter and the practice feels incomplete. Here’s what fits into that time.</p>\n<p><strong>Minutes 0-3: Gathering</strong>\nKids arrive at different times. Don’t wait for everyone. Start moving them into a circle or a line the moment they show up. The ritual of “we’re here now” matters more than perfect attendance before the clock runs.</p>\n<p><strong>Minutes 3-8: One ball, one skill</strong>\nPick one thing. One. Not three variations of the same thing. If it’s baseball, it’s ground balls or catching. Not both. If it’s soccer, it’s passing or kicking toward a target. At this age, the brain can hold exactly one instruction. Give them five reps minimum, ten if you can.</p>\n<p><strong>Minutes 8-18: Small-sided game</strong>\nThis is the engine of practice. Four kids on a side, two baselines, one simple rule. The game teaches more than the drill because it forces them to solve problems at real game speed. Let them play. Don’t stop every thirty seconds to correct their stance.</p>\n<p><strong>Minutes 18-23: Wind-down drill</strong>\nSomething easy. Something they’ve done before. Success matters here. End on a good rep, not a mistake. This is where they leave with momentum.</p>\n<p><strong>Minutes 23-25: Dismiss and hydrate</strong>\nSame time every practice. This is not optional. Kids as young as five understand routine, and routine builds trust in your program.</p>\n<p><strong>The principle</strong>\nAt this age, you’re not teaching sport. You’re teaching presence and joy. If a kid dreads coming to practice, you’ve failed. If they come home tired but happy, you’ve succeeded. The technical work will happen. But right now, the first practice job is to make them want to come back.</p>\n<p>Don’t overcomplicate. Don’t show them a PowerPoint or a lengthy explanation. Show them what to do. Show them again. Let them play. That’s the whole system.</p>";

				const frontmatter = {"title":"The First Practice Plan (5-7 Years Old)","dek":"Twenty-five minutes that work for this age group.","seoDescription":"Twenty-five minutes is your window. Longer and you lose them to fatigue and distraction. Shorter and the practice feels incomplete.","topic":"season-ops","format":"note","phase":"game","sport":"multi-sport","age":"5-7","publishedAt":"2026-01-05T00:00:00.000Z","featured":false,"editorial":{"claudeReviewedAt":"2026-06-10T00:00:00.000Z"}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/articles/first-practice-plan.md";
				const url = undefined;
				function rawContent() {
					return "\nTwenty-five minutes is your window. Longer and you lose them to fatigue and distraction. Shorter and the practice feels incomplete. Here's what fits into that time.\n\n**Minutes 0-3: Gathering**\nKids arrive at different times. Don't wait for everyone. Start moving them into a circle or a line the moment they show up. The ritual of \"we're here now\" matters more than perfect attendance before the clock runs.\n\n**Minutes 3-8: One ball, one skill**\nPick one thing. One. Not three variations of the same thing. If it's baseball, it's ground balls or catching. Not both. If it's soccer, it's passing or kicking toward a target. At this age, the brain can hold exactly one instruction. Give them five reps minimum, ten if you can.\n\n**Minutes 8-18: Small-sided game**\nThis is the engine of practice. Four kids on a side, two baselines, one simple rule. The game teaches more than the drill because it forces them to solve problems at real game speed. Let them play. Don't stop every thirty seconds to correct their stance.\n\n**Minutes 18-23: Wind-down drill**\nSomething easy. Something they've done before. Success matters here. End on a good rep, not a mistake. This is where they leave with momentum.\n\n**Minutes 23-25: Dismiss and hydrate**\nSame time every practice. This is not optional. Kids as young as five understand routine, and routine builds trust in your program.\n\n**The principle**\nAt this age, you're not teaching sport. You're teaching presence and joy. If a kid dreads coming to practice, you've failed. If they come home tired but happy, you've succeeded. The technical work will happen. But right now, the first practice job is to make them want to come back.\n\nDon't overcomplicate. Don't show them a PowerPoint or a lengthy explanation. Show them what to do. Show them again. Let them play. That's the whole system.\n";
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
