globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>PGA Jr. League is the team-sport version of golf: jerseys, a coach, two-person scramble matches, and no individual score posted anywhere. League fees run $200–350 for the season including the jersey, which makes it one of the cheaper organized sports a kid can play.</p>\n<p>Tournament golf is the second track, and it escalates fast. Local junior tours (US Kids and regional equivalents) cost $30–60 an event and stay friendly. State junior championships and national junior circuits like AJGA are a different commitment in money, travel, and temperament, and a 10-year-old does not need them.</p>\n<p>Golf’s quiet advantage is the calendar. The season fills summer, conflicts with almost nothing in fall or winter, and a kid can practice alone. The quiet cost is time: a tournament round is five hours, and parents walk every hole.</p>";

				const frontmatter = {"title":"Junior golf: summer season (PGA Jr. League + tournaments)","sport":"golf","level":"rec","region":"National","durationLabel":"May–Aug, with PGA Jr. League postseason into Oct","summary":"The standard junior golf summer: PGA Jr. League team matches May through July, local junior tour and state junior events June through August. All-star postseason runs August through the national championship in October. Winter is lessons or nothing, depending on climate.","publishedAt":"2026-06-10T00:00:00.000Z","featured":false,"months":[{"key":"jan","intensity":"off","events":["PGA Jr. League registration opens","Indoor simulator lessons in cold climates"]},{"key":"feb","intensity":"off","events":["Registration continues","Club fitting if the kid grew (junior sets last about two seasons)"]},{"key":"mar","intensity":"build","events":["Spring lessons and range work","Local junior tour schedules publish"],"note":"Pick the summer tournament schedule now while the calendar is empty. Good events fill, and so do family weekends."},{"key":"apr","intensity":"build","events":["PGA Jr. League team practices begin","First local tour events in warm regions"]},{"key":"may","intensity":"peak","events":["PGA Jr. League matches begin (two-person scramble format)","Team jerseys arrive"],"note":"The scramble format means no kid posts an individual score. That is the point, and it is why this is the right entry league for a nervous 9-year-old."},{"key":"jun","intensity":"peak","events":["League matches continue","Local junior tour events","State junior championship qualifiers"]},{"key":"jul","intensity":"peak","events":["League regular season wraps","State junior championships","All-star team selections"]},{"key":"aug","intensity":"taper","events":["PGA Jr. League all-star postseason begins","Last local tour events"]},{"key":"sep","intensity":"taper","events":["Regional postseason for advancing all-star teams"],"note":"The postseason only exists for selected all-stars. For most kids the season ended in August, which nobody tells you at signup."},{"key":"oct","intensity":"off","events":["PGA Jr. League National Championship (the few)","Fall junior events in Sun Belt states"]},{"key":"nov","intensity":"off","events":["Off in most climates","Year-round golf continues in FL, TX, AZ, CA"]},{"key":"dec","intensity":"off","events":["Off","Holiday: used junior clubs are the right gift, full-price new sets are not"]}]};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/seasonCalendars/junior-golf-summer.md";
				const url = undefined;
				function rawContent() {
					return "\nPGA Jr. League is the team-sport version of golf: jerseys, a coach, two-person scramble matches, and no individual score posted anywhere. League fees run $200–350 for the season including the jersey, which makes it one of the cheaper organized sports a kid can play.\n\nTournament golf is the second track, and it escalates fast. Local junior tours (US Kids and regional equivalents) cost $30–60 an event and stay friendly. State junior championships and national junior circuits like AJGA are a different commitment in money, travel, and temperament, and a 10-year-old does not need them.\n\nGolf's quiet advantage is the calendar. The season fills summer, conflicts with almost nothing in fall or winter, and a kid can practice alone. The quiet cost is time: a tournament round is five hours, and parents walk every hole.\n";
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
