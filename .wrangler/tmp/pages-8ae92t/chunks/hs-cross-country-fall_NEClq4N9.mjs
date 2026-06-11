globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Cross country has the most honest cause-and-effect calendar in high school sports. Summer miles in, fall race times out. A freshman who runs 150 easy miles over June and July arrives at August practice ahead of half the returning roster.</p>\n<p>The race-day rhythm is kind to families. Meets are Saturday mornings, a race lasts under 25 minutes, and the whole event including warmups fits before lunch. Bring layers, because every cross country course is ten degrees colder than the parking lot.</p>\n<p>Watch the mileage conversation, not the meet results. Shin pain that changes a kid’s gait, a missed period, or a runner getting visibly smaller mid-season are stop signs in a sport with a documented relationship to overtraining and underfueling. Fast and unhealthy is a coaching failure, not a triumph.</p>";

				const frontmatter = {"title":"HS cross country: fall season","sport":"cross-country","level":"school","region":"National","durationLabel":"Aug–Nov, with summer base miles Jun–Jul","summary":"High school cross country under NFHS rules. Official practice opens in August, invitationals run September and October, league and district meets in late October, state in early November. The season is won with summer miles in June and July.","publishedAt":"2026-06-10T00:00:00.000Z","featured":false,"months":[{"key":"jan","intensity":"rest","events":["Off or indoor track in states that offer it"]},{"key":"feb","intensity":"off","events":["Off","Many runners roll into track season prep"]},{"key":"mar","intensity":"off","events":["Spring track season for most XC runners (same legs, different sport)"]},{"key":"apr","intensity":"off","events":["Track season continues"]},{"key":"may","intensity":"off","events":["Track season ends","XC coach hands out the summer running plan"]},{"key":"jun","intensity":"build","events":["Summer base mileage begins","Captain-led morning runs at most programs"],"note":"Summer running is voluntary on paper and decisive in practice. The kids who run in June and July are the varsity in October."},{"key":"jul","intensity":"build","events":["Base mileage continues","Team running camp at many programs","New shoes: start the season on fresh ones"]},{"key":"aug","intensity":"build","events":["Official practice opens","Physical paperwork due","Time trial to seed the roster"],"note":"Heat rules apply to August practices. A program with no heat protocol in writing deserves a question, not benefit of the doubt."},{"key":"sep","intensity":"peak","events":["Invitationals begin (Saturday mornings)","First league meets","Picture day"]},{"key":"oct","intensity":"peak","events":["Big invitationals","League championships","District/regional qualifiers late month"]},{"key":"nov","intensity":"taper","events":["State championships early-to-mid month","Banquet","Nike Cross Regionals and Foot Locker regionals for the postseason chasers"],"note":"The postseason club races in late November are for a thin slice of the state. For everyone else the season ends at state, and that's a full season."},{"key":"dec","intensity":"rest","events":["Full rest weeks","National finals (NXN, Foot Locker) for the very few"]}]};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/seasonCalendars/hs-cross-country-fall.md";
				const url = undefined;
				function rawContent() {
					return "\nCross country has the most honest cause-and-effect calendar in high school sports. Summer miles in, fall race times out. A freshman who runs 150 easy miles over June and July arrives at August practice ahead of half the returning roster.\n\nThe race-day rhythm is kind to families. Meets are Saturday mornings, a race lasts under 25 minutes, and the whole event including warmups fits before lunch. Bring layers, because every cross country course is ten degrees colder than the parking lot.\n\nWatch the mileage conversation, not the meet results. Shin pain that changes a kid's gait, a missed period, or a runner getting visibly smaller mid-season are stop signs in a sport with a documented relationship to overtraining and underfueling. Fast and unhealthy is a coaching failure, not a triumph.\n";
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
