globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Track is the biggest roster in the school and the lowest barrier to entry. Most programs keep every kid who comes out, which makes it the best second sport in the building for football players, soccer players, and anyone who has never made a team.</p>\n<p>The sport hides eighteen sports inside one uniform. A sprinter, a two-miler, a pole vaulter, and a shot putter share a bus and almost nothing else, so ask which event group your kid landed in and who coaches it. Event-group coaching quality varies inside a single program.</p>\n<p>The spectating math is the adjustment for parents. Meets are long, your kid’s events are short, and the schedule slips. The parents who enjoy track are the ones who bring a chair and learn to read a heat sheet.</p>";

				const frontmatter = {"title":"HS track and field: spring season","sport":"track-field","level":"school","region":"National","durationLabel":"Mar–May, with state meets late May","summary":"High school outdoor track under NFHS rules. Practice opens late February or early March, dual meets and invitationals run March through April, league and district championships in May, state in late May. No tryout cuts at most schools: track keeps everyone.","publishedAt":"2026-06-10T00:00:00.000Z","featured":false,"months":[{"key":"jan","intensity":"build","events":["Indoor track season in states that run one","Winter conditioning elsewhere"]},{"key":"feb","intensity":"build","events":["Preseason conditioning","Practice opens late month in early-start states","Physical paperwork due"]},{"key":"mar","intensity":"peak","events":["Official practice opens (most states)","First dual meets late month","Event assignments sort out"],"note":"The first three weeks decide events. A kid who wants to try the 300 hurdles or triple jump should say so now, because mid-season switches rarely happen."},{"key":"apr","intensity":"peak","events":["Dual meets weekly","Saturday invitationals","Picture day"],"note":"Meets run four to five hours and your kid competes for a total of about 90 seconds. Find out the event schedule before you commit the whole afternoon."},{"key":"may","intensity":"peak","events":["League championships","District/regional qualifiers","State championships late month"]},{"key":"jun","intensity":"taper","events":["State meets spill into early June in some states","New Balance Nationals Outdoor for the qualified few","Banquet"]},{"key":"jul","intensity":"off","events":["Off","USATF and AAU summer track for kids who want more (Junior Olympics track runs late July)"],"note":"Summer club track is its own world with its own fees. A high schooler does not need it unless they love it."},{"key":"aug","intensity":"off","events":["Off","Most track kids report to a fall sport"]},{"key":"sep","intensity":"off","events":["Off","Distance runners are at cross country"]},{"key":"oct","intensity":"off","events":["Off"]},{"key":"nov","intensity":"off","events":["Off"]},{"key":"dec","intensity":"rest","events":["Winter conditioning begins at some programs","Indoor season opens in indoor states"]}]};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/seasonCalendars/hs-track-field-spring.md";
				const url = undefined;
				function rawContent() {
					return "\nTrack is the biggest roster in the school and the lowest barrier to entry. Most programs keep every kid who comes out, which makes it the best second sport in the building for football players, soccer players, and anyone who has never made a team.\n\nThe sport hides eighteen sports inside one uniform. A sprinter, a two-miler, a pole vaulter, and a shot putter share a bus and almost nothing else, so ask which event group your kid landed in and who coaches it. Event-group coaching quality varies inside a single program.\n\nThe spectating math is the adjustment for parents. Meets are long, your kid's events are short, and the schedule slips. The parents who enjoy track are the ones who bring a chair and learn to read a heat sheet.\n";
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
