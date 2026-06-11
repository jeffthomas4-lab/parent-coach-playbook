globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Choir looks like the lightest line on the activities list until December, when an active program performs more in three weeks than the rest of the year combined. The winter concert, community holiday events, and assembly performances stack up, and every one has a call time well before the listed start.</p>\n<p>The competitive layer runs through auditions rather than games. All-state and honor choir auditions land in early fall in most states, judged on prepared music and sight-reading, with results that mean a winter trip to the all-state event for the kids who make it. Making all-state is the varsity letter of this activity.</p>\n<p>Spring belongs to the contest circuit: solo and ensemble for individuals and small groups, large-group festival for the full choir, both scored on state rating scales. Costs stay low all year (attire, accompanist fees, a trip if your kid makes all-state), which makes choir one of the best value-per-hour activities a school offers.</p>";

				const frontmatter = {"title":"HS choir: school-year concert and contest cycle","sport":"choir","level":"school","region":"National","durationLabel":"Sep–May school year","summary":"The high school choir year: fall concert in October, honor choir and all-state auditions in early fall, a December packed with holiday performances, all-state event in winter, then solo and ensemble and large-group festival in spring. December is the peak month and nobody warns you.","publishedAt":"2026-06-10T00:00:00.000Z","featured":false,"months":[{"key":"jan","intensity":"build","events":["All-state results and music prep for selected singers","Solo and ensemble repertoire assigned"]},{"key":"feb","intensity":"peak","events":["All-state conference and performance (many states)","Contest prep intensifies"]},{"key":"mar","intensity":"peak","events":["Solo and ensemble contest","Large-group festival (state ratings) in many states"],"note":"Solo and ensemble means your kid performs alone for a judge, possibly for the first time ever. The accompanist fee ($25–75) is on you and booking one late is a scramble."},{"key":"apr","intensity":"build","events":["Festival season wraps","Spring concert and musical-pit obligations collide for crossover kids"]},{"key":"may","intensity":"taper","events":["Spring concert","Senior recognition","Banquet","Auditions for next year's select ensembles"]},{"key":"jun","intensity":"off","events":["Off","Summer honor choir camps for kids who want them"]},{"key":"jul","intensity":"off","events":["Off"]},{"key":"aug","intensity":"build","events":["School starts, ensemble placements settle","All-state audition music released or already in practice"],"note":"All-state audition prep starts now even though the audition is weeks away. A kid who opens the music in late September already lost."},{"key":"sep","intensity":"build","events":["Regular rehearsals","All-state and honor choir first-round auditions in many states","Concert attire orders (dress or tux rental)"]},{"key":"oct","intensity":"peak","events":["Fall concert","Audition results and second rounds where applicable"]},{"key":"nov","intensity":"build","events":["Holiday repertoire in rehearsal","Extra sectionals appear on the calendar"]},{"key":"dec","intensity":"peak","events":["Winter concert","Holiday performances: community events, assemblies, the occasional paid gig","Caroling season"],"note":"December is choir's playoff month. Three to six performances in three weeks is normal at an active program, and they all involve call times an hour early."}]};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/seasonCalendars/hs-choir-school-year.md";
				const url = undefined;
				function rawContent() {
					return "\nChoir looks like the lightest line on the activities list until December, when an active program performs more in three weeks than the rest of the year combined. The winter concert, community holiday events, and assembly performances stack up, and every one has a call time well before the listed start.\n\nThe competitive layer runs through auditions rather than games. All-state and honor choir auditions land in early fall in most states, judged on prepared music and sight-reading, with results that mean a winter trip to the all-state event for the kids who make it. Making all-state is the varsity letter of this activity.\n\nSpring belongs to the contest circuit: solo and ensemble for individuals and small groups, large-group festival for the full choir, both scored on state rating scales. Costs stay low all year (attire, accompanist fees, a trip if your kid makes all-state), which makes choir one of the best value-per-hour activities a school offers.\n";
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
