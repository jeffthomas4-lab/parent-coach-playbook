globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A few specifics.</p>\n<p><strong>Equipment differs significantly from boys.</strong> Goggles required (not full helmet, except goalie). Mouthguard required. Stick. Cleats. No shoulder pads, arm pads, or rib pads, the no-contact rules don’t require them.</p>\n<p><strong>Field positions.</strong> 12 players per side: 1 goalie, 4 attack, 5 midfield, 3 defense (spelled out as 4-5-3 + goalie). The field is bigger and more spread out than boys’ 10v10.</p>\n<p><strong>Draw to start.</strong> Like a faceoff but standing, two players hold sticks together and the ball is set between them. Whistle releases. The midfielders battle for possession.</p>\n<p><strong>Rules vary at youth.</strong> US Lacrosse publishes age-appropriate modifications for U13 and below. Younger ages may use modified field sizes and stick-check restrictions.</p>\n<p><strong>Concussion rules apply.</strong> Even though girls lacrosse is non-contact in concept, head injuries happen (incidental stick contact, ground contact). Same protocols as other contact sports.</p>";

				const frontmatter = {"sport":"lacrosse-girls","title":"Girls lacrosse: rules at-a-glance","summary":"Stick and ball, mostly no contact, four quarters. The rules of girls lacrosse in five minutes.","fieldSetup":"Rectangular field with goals at each end. 110 × 60 yards at HS+ (full size). Restraining lines mid-field. Goal arc (the 'fan') around each goal. Wing line at midfield for draws.","gameLength":"Four quarters. 8-10 minutes per quarter at youth, 12 at HS, 15 in college. Stop time on whistles. Halftime in the middle.","scoringBasics":["Goal: ball fully crosses the goal line between the posts and under the crossbar. 1 point.","Free position shots awarded for fouls inside the 8-meter arc."],"commonCalls":["Free position: foul committed inside the 8-meter arc gives the offensive player a free shot at goal.","Shooting space: defender steps into the path of the shooter's stick. Free position to attack.","3-second violation: defender within a stick's length of an attacker without engaging. Possession to attack.","Slashing: stick contact across an opponent's body or head. Major foul, free position.","Cross-check: contact with stick across an opponent. Major foul.","Empty stick check: checking when the opposing player doesn't have the ball. Foul.","Crease violation: offensive player enters the goal crease. Loss of possession."],"thingsParentsGetWrong":["Girls lacrosse is fundamentally different from boys lacrosse. No body checking. Less protective equipment. Stick checking limited.","The 8-meter arc is the high-action zone. Most fouls happen inside it and result in free position shots.","Goggles are required (not helmets, except goalie). The eye protection equipment is the central safety piece."],"governingBody":{"name":"USA Lacrosse","url":"https://www.usalacrosse.com/"},"ruleBookUrl":"https://www.usalacrosse.com/rules","publishedAt":"2026-04-30T00:00:00.000Z","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"affiliateDisclosurePresent":false,"claudeReviewedAt":"2026-05-04T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Companion to lacrosse-boys rules page. Boys-vs-girls lacrosse rule difference is the most-confused thing for parents."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/rules/lacrosse-girls.md";
				const url = undefined;
				function rawContent() {
					return "\nA few specifics.\n\n**Equipment differs significantly from boys.** Goggles required (not full helmet, except goalie). Mouthguard required. Stick. Cleats. No shoulder pads, arm pads, or rib pads, the no-contact rules don't require them.\n\n**Field positions.** 12 players per side: 1 goalie, 4 attack, 5 midfield, 3 defense (spelled out as 4-5-3 + goalie). The field is bigger and more spread out than boys' 10v10.\n\n**Draw to start.** Like a faceoff but standing, two players hold sticks together and the ball is set between them. Whistle releases. The midfielders battle for possession.\n\n**Rules vary at youth.** US Lacrosse publishes age-appropriate modifications for U13 and below. Younger ages may use modified field sizes and stick-check restrictions.\n\n**Concussion rules apply.** Even though girls lacrosse is non-contact in concept, head injuries happen (incidental stick contact, ground contact). Same protocols as other contact sports.\n";
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
