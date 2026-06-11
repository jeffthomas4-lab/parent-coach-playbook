globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "";

				const frontmatter = {"title":"Should we hire a *private coach*?","summary":"Private lessons can fast-track skill. They can also turn a kid's sport into a job. The framework for deciding when it's worth it and when it backfires.","theQuestion":"My kid wants to get better, or we want them to. Is a private coach worth the money and time?","publishedAt":"2026-05-05T00:00:00.000Z","featured":false,"draft":false,"benefits":["Targeted feedback the team coach doesn't have time for.","Faster technical correction on the specific things the kid is working on.","Sometimes the kid feels seen in a way they don't on a team of 12.","For older kids, can be the difference between making the team and not at competitive levels."],"costs":["Money. Private lessons run $40-$150 per session. Most programs recommend weekly. Adds up fast.","Schedule pressure. Adds another evening or weekend slot to a calendar that's already full.","When the kid stops enjoying it, the parent has trouble pulling back because of the sunk cost.","Some private coaches build their business by selling more sessions, not by reading whether the kid actually needs them.","If the kid hates it, the message they're absorbing is that the parent thinks they're not good enough as-is."],"signsItsAGoodFit":["The kid is asking for more, not the parent.","There's a specific skill the team coach can't focus on (pitching mechanics, free throws, footwork).","The family budget supports it without straining other things.","The kid genuinely enjoys the sessions and looks forward to them.","The private coach is referred by someone you trust, not someone who advertised."],"signsItsNot":["The kid is going because the parent is frustrated they're not playing more.","The kid is fine and the parent is shopping for an edge.","The kid is showing burnout signs and adding load makes it worse.","The cost is real strain on the family.","The private coach pushes for more frequency every session."],"howToHandleIt":["Start with one session, not a package. See how the kid feels after.","Ask the team coach what they think first. Sometimes the team coach can give you the same correction for free.","Set a check-in with the kid every month. 'Is this still useful? Are you still enjoying it?'","If the kid says they want to stop, stop. Don't make them justify it.","Watch for the private coach who suggests adding sessions, recruits other family members, or makes you feel pressure to commit longer-term. Those signals are the warning."],"theRule":"Private coaching works when the kid is asking for it and the budget can absorb it. The minute either stops being true, it stops being a private lesson and becomes a problem.","relatedDecisions":["should-my-kid-play-travel-sports","when-to-specialize","financial-pressure-decisions"],"relatedScripts":["after-a-bad-game","kid-upset"],"sportTags":["multi-sport"],"ageBands":["11-12","13-14","15-plus"]};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/decisions/hire-a-private-coach.md";
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
