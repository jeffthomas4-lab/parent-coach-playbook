globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Martial arts has no season. Classes run all year, progress is measured in belts instead of games, and the testing windows (roughly quarterly at most schools) are the only dates that behave like a calendar. That makes it the easiest activity to fit around a sibling’s travel team.</p>\n<p>The thing to scrutinize is the business model, because most dojos are small businesses selling contracts. Twelve-month agreements, separate testing fees, mandatory sparring gear bought in-house, and black belt club upsells are all standard. None of that is a scam by itself, but get every number in writing on day one.</p>\n<p>Belt pace tells you about the school. A school where every kid tests every cycle and nobody ever fails is selling belts. A reasonable path to black belt takes four to six years, and a school that quotes two should explain itself.</p>";

				const frontmatter = {"title":"Martial arts: year-round belt cycle","sport":"martial-arts","level":"rec","region":"National","durationLabel":"Year-round, with testing windows roughly quarterly","summary":"The standard commercial dojo calendar: classes two to three times a week all year, belt testing in quarterly windows, optional tournaments a few times a year. No season, no tryouts, no bench. The schedule risk is the contract, not the calendar.","publishedAt":"2026-06-10T00:00:00.000Z","featured":false,"months":[{"key":"jan","intensity":"build","events":["New-student enrollment wave (resolution season)","Regular classes resume after holiday break"]},{"key":"feb","intensity":"build","events":["Pre-test review classes","Testing eligibility lists posted"]},{"key":"mar","intensity":"peak","events":["Belt testing window","Testing fees due","Spring tournament season opens (optional)"],"note":"Testing fees run $40–100 per belt at most schools, on top of tuition. Ask for the full fee schedule through black belt before signing anything."},{"key":"apr","intensity":"build","events":["New curriculum cycle begins for the new belt level"]},{"key":"may","intensity":"build","events":["Regular classes","Local tournaments for kids who compete"]},{"key":"jun","intensity":"peak","events":["Belt testing window","Summer camp registration (day camps at the dojo)"]},{"key":"jul","intensity":"build","events":["Summer schedule (lighter attendance, same classes)","Dojo day camps"],"note":"Summer is when kids quietly stop coming and tuition quietly keeps drafting. Decide on pause-or-continue before vacation season, not after."},{"key":"aug","intensity":"build","events":["Back-to-school enrollment wave","Regular schedule resumes"]},{"key":"sep","intensity":"peak","events":["Belt testing window","Fall tournament season (optional)"]},{"key":"oct","intensity":"build","events":["Regular classes","Buddy weeks and bring-a-friend promotions"]},{"key":"nov","intensity":"build","events":["Pre-test review","Holiday schedule posted"]},{"key":"dec","intensity":"peak","events":["Belt testing window (early month, before break)","Holiday demo or showcase","Dojo closes between Christmas and New Year's"]}]};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/seasonCalendars/year-round-martial-arts-belts.md";
				const url = undefined;
				function rawContent() {
					return "\nMartial arts has no season. Classes run all year, progress is measured in belts instead of games, and the testing windows (roughly quarterly at most schools) are the only dates that behave like a calendar. That makes it the easiest activity to fit around a sibling's travel team.\n\nThe thing to scrutinize is the business model, because most dojos are small businesses selling contracts. Twelve-month agreements, separate testing fees, mandatory sparring gear bought in-house, and black belt club upsells are all standard. None of that is a scam by itself, but get every number in writing on day one.\n\nBelt pace tells you about the school. A school where every kid tests every cycle and nobody ever fails is selling belts. A reasonable path to black belt takes four to six years, and a school that quotes two should explain itself.\n";
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
