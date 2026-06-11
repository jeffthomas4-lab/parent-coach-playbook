globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>STUNT strips the crowd-leading and the glitter out of cheer and keeps the athletics: a head-to-head game with quarters, possessions, and a scoreboard, played in a gym on weeknights. USA Cheer built it as a sport format, and it is the fastest-growing path for cheer athletes who want their skills scored like a game.</p>\n<p>For parents the format is the gift. Games run about 90 minutes on a school night, against one opponent, with a result. Compare that to a competition cheer weekend: a hotel, a convention center, and two and a half minutes of performance.</p>\n<p>The crossover load is the thing to watch. Most STUNT rosters are built from sideline and competitive cheer athletes, which means a kid can run August through May with no break across three versions of the same sport. The spring STUNT season is the third season, not the first.</p>";

				const frontmatter = {"title":"STUNT: spring season (HS)","sport":"stunt","level":"school","region":"National","durationLabel":"Feb–May","summary":"STUNT, the head-to-head game format built from cheer skills, governed by USA Cheer. High school season runs February through May: tryouts in winter, games in March and April, postseason and national championship in late April and May. Routines are standardized and released by USA Cheer each season.","publishedAt":"2026-06-10T00:00:00.000Z","featured":false,"months":[{"key":"jan","intensity":"build","events":["Interest meetings and tryout announcements","Conditioning for athletes not coming off winter cheer"]},{"key":"feb","intensity":"build","events":["Tryouts","USA Cheer releases the season's routines","Practices begin"],"note":"Every team in the country runs the same set of released routines. The sport is execution against a common standard, scored play by play."},{"key":"mar","intensity":"peak","events":["Game season begins","Weeknight duals against other schools"],"note":"A STUNT game has four quarters (partner stunts, pyramids and tosses, jumps and tumbling, team routine) and a scoreboard. It runs about 90 minutes and looks nothing like a cheer competition weekend."},{"key":"apr","intensity":"peak","events":["League play continues","League and regional postseason late month"]},{"key":"may","intensity":"taper","events":["State-level championships where sanctioned","USA Cheer national championship events","Banquet"]},{"key":"jun","intensity":"off","events":["Off"]},{"key":"jul","intensity":"off","events":["Off","Optional stunt and tumbling camps"]},{"key":"aug","intensity":"off","events":["Sideline cheer season starts for the many athletes who do both"]},{"key":"sep","intensity":"off","events":["Fall sideline cheer (different activity, same athletes)"]},{"key":"oct","intensity":"off","events":["Fall sideline cheer continues"]},{"key":"nov","intensity":"off","events":["Winter competitive cheer season for crossover athletes"]},{"key":"dec","intensity":"off","events":["Winter cheer continues","STUNT interest builds toward January meetings"],"note":"Many STUNT athletes are mid-cheer-season in December. The kid doing sideline, comp cheer, and STUNT has no off-season, and somebody should notice that."}]};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/seasonCalendars/hs-stunt-spring.md";
				const url = undefined;
				function rawContent() {
					return "\nSTUNT strips the crowd-leading and the glitter out of cheer and keeps the athletics: a head-to-head game with quarters, possessions, and a scoreboard, played in a gym on weeknights. USA Cheer built it as a sport format, and it is the fastest-growing path for cheer athletes who want their skills scored like a game.\n\nFor parents the format is the gift. Games run about 90 minutes on a school night, against one opponent, with a result. Compare that to a competition cheer weekend: a hotel, a convention center, and two and a half minutes of performance.\n\nThe crossover load is the thing to watch. Most STUNT rosters are built from sideline and competitive cheer athletes, which means a kid can run August through May with no break across three versions of the same sport. The spring STUNT season is the third season, not the first.\n";
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
