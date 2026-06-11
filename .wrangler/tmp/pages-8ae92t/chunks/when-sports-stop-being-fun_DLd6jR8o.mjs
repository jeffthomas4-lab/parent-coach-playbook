globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "";

				const frontmatter = {"title":"When *sports stop being fun*","summary":"How to tell the difference between burnout and a phase. The signals that tell you it's not the sport, it's the configuration. The diagnostic that gets you a real answer.","theQuestion":"My kid used to love this. Now they drag to practice and complain on the way home. Is this burnout, a phase, or the wrong fit?","publishedAt":"2026-06-20T00:00:00.000Z","featured":false,"draft":false,"benefits":["Catching a fun problem early prevents it from becoming a quitting problem.","Some 'I hate this' weeks are recoverable with one small change.","Sometimes the kid is telling you the truth and the right move is to step back.","Working through it once teaches the kid how to identify burnout in the rest of their life."],"costs":["If you push through and the situation is real burnout, you damage the long-term relationship with the sport.","If you let them quit on every bad week, they learn that the answer to discomfort is exit.","The wrong call costs the kid trust either way."],"signsItsAGoodFit":["The disinterest has lasted three weeks or more, not just a hard practice or a bad game.","Sleep is off. Appetite is off. They are quieter at school. The mood follows practice schedule.","They light up when there's a cancellation. They are visibly relieved when practice gets called.","Their identity is shrinking around the sport. They are not making space for friends, school, or other interests.","They have started making physical complaints (stomach hurts, headache) that conveniently appear before practice."],"signsItsNot":["It has been one bad week with one specific story. You can name what happened.","They had a fight with a teammate or a tough conversation with the coach yesterday.","They are tired because the calendar is too busy, not because the sport is wrong.","They still light up at the good moments, even if they grumble about the routine.","They are hitting a developmental wall and don't know how to talk about feeling stuck."],"howToHandleIt":["Ask the diagnostic: 'What would have to be true for you to want to keep playing?' The answer tells you everything.","Most kids who say they hate the sport actually hate the current configuration. Wrong team. Wrong schedule. Specific coach. Wrong level.","Try the smallest change first. Drop a level. Switch teams in the off-season. Take a single week off and see what they do with it.","Cut the cumulative load. Drop a sport. Cut a tournament. Make sure the calendar isn't the problem before deciding the sport is.","Listen for what they are not saying. Some kids are working through a coach situation, a teammate situation, or a body-image issue, and 'I hate this' is the cover.","If it's burnout, the answer is rest, not negotiation. Two weeks off the sport, no questions, no make-up plan. Watch what they choose to do."],"theRule":"When the answer to 'do you still want to play?' is silence, the answer is no. Don't make them justify the silence.","relatedScripts":["kid-upset","kid-silent","after-no-playing-time"],"relatedDecisions":["should-my-kid-quit-sports","leave-this-team","how-many-sports"],"sportTags":["multi-sport"],"ageBands":["8-10","11-12","13-14","15-plus"]};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/decisions/when-sports-stop-being-fun.md";
				const url = undefined;
				function rawContent() {
					return "";
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
