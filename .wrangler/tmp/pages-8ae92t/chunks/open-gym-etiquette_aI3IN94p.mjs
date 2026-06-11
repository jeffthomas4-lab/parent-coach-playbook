globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Open gym at the local high school is one of the best off-season opportunities for a kid trying to level up. It’s also socially complicated for a 12-year-old walking into a gym full of 16-year-olds.</p>\n<p>The unspoken rules.</p>\n<p><strong>Show up early, leave on time.</strong> The 16-year-olds know the gym schedule. Being there before the run starts and being out when it ends signals you respect the space. Late arrivals get noticed. Lingering after gets noticed too.</p>\n<p><strong>Get on the smaller team first.</strong> When pickup teams form, take whoever still needs a player. Don’t wait to be picked. Don’t ask to switch teams to play with the older kids. Take the spot you’re given, play hard, and you’ll get picked next time.</p>\n<p><strong>Pass the ball more than you ask for it your first three games.</strong> The fastest way to get frozen out as a younger kid is to demand touches you haven’t earned. Set a screen. Make the extra pass. Play hard defense. The older kids will notice, and the ball will start coming to you.</p>\n<p><strong>Talk less than you would on your own team.</strong> First-time visitors don’t call out plays, don’t critique teammates, don’t argue calls. Listen. The vocabulary is different in older-kid runs and you’ll pick it up in two sessions.</p>\n<p><strong>Acknowledge the older kids who help you.</strong> When somebody passes you the ball or helps you with footwork, say thanks. The next time you show up, they’ll remember.</p>\n<p><strong>Don’t bring a parent into the gym.</strong> Drop off, leave, come back at the agreed time. The presence of a parent watching warps the social dynamic for everyone.</p>\n<p>The kids who establish themselves at high-school open gym at 12 or 13 often become the kids who walk into varsity tryouts at 14 already known. The game on the floor is the easy part. The unspoken stuff is what matters first.</p>";

				const frontmatter = {"title":"Open gym etiquette in the off-season","dek":"Showing up to a high-school open gym at 12. The unspoken rules nobody tells you, and how to help your kid not get frozen out.","seoDescription":"Open gym at the local high school is one of the best off-season opportunities for a kid trying to level up.","topic":"rules-of-play","format":"note","phase":"drive-there","sport":"multi-sport","age":"11-12","publishedAt":"2026-05-13T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":8,"originalityGrade":9,"voiceGrade":9,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"affiliateDisclosurePresent":false,"claudeReviewedAt":"2026-05-12T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Underdiscussed topic: the social rules of stepping up in age."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/articles/open-gym-etiquette.md";
				const url = undefined;
				function rawContent() {
					return "\nOpen gym at the local high school is one of the best off-season opportunities for a kid trying to level up. It's also socially complicated for a 12-year-old walking into a gym full of 16-year-olds.\n\nThe unspoken rules.\n\n**Show up early, leave on time.** The 16-year-olds know the gym schedule. Being there before the run starts and being out when it ends signals you respect the space. Late arrivals get noticed. Lingering after gets noticed too.\n\n**Get on the smaller team first.** When pickup teams form, take whoever still needs a player. Don't wait to be picked. Don't ask to switch teams to play with the older kids. Take the spot you're given, play hard, and you'll get picked next time.\n\n**Pass the ball more than you ask for it your first three games.** The fastest way to get frozen out as a younger kid is to demand touches you haven't earned. Set a screen. Make the extra pass. Play hard defense. The older kids will notice, and the ball will start coming to you.\n\n**Talk less than you would on your own team.** First-time visitors don't call out plays, don't critique teammates, don't argue calls. Listen. The vocabulary is different in older-kid runs and you'll pick it up in two sessions.\n\n**Acknowledge the older kids who help you.** When somebody passes you the ball or helps you with footwork, say thanks. The next time you show up, they'll remember.\n\n**Don't bring a parent into the gym.** Drop off, leave, come back at the agreed time. The presence of a parent watching warps the social dynamic for everyone.\n\nThe kids who establish themselves at high-school open gym at 12 or 13 often become the kids who walk into varsity tryouts at 14 already known. The game on the floor is the easy part. The unspoken stuff is what matters first.\n";
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
