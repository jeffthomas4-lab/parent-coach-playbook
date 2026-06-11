globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "";

				const frontmatter = {"title":"Should we *report another parent's* behavior?","summary":"The yelling parent, the post-game tirade, the parent who singled out a kid. The framework for when to escalate and when to let the league handle it on their own timeline.","theQuestion":"We saw something at the field that wasn't okay. Is reporting it the right move, or do we let it go?","publishedAt":"2026-05-05T00:00:00.000Z","featured":false,"draft":false,"benefits":["Reporting gives the league the information they need to enforce their own conduct rules.","Sometimes the parent's own family or coach has wanted to address it but couldn't on their own.","Other parents who saw the same thing are watching whether it gets addressed.","Your kid sees that adults you respect take this seriously."],"costs":["Some leagues do nothing. The report goes nowhere and the parent stays.","If it gets back to the parent who you reported, the social fallout can be ugly.","Reporting can feel like crossing a line in a community where everyone knows everyone.","If it's not airtight, you can come across as the problem."],"signsItsAGoodFit":["The behavior was directed at a child, including verbal abuse, physical aggression, or singling out.","It wasn't a one-time outburst. There's a pattern.","Other parents saw it too and would back you up if asked.","The behavior crossed clear conduct rules the league has in writing.","A child is being affected (the offender's own kid, or another)."],"signsItsNot":["The parent yelled at a ref once and you found it embarrassing.","You disagree with how the parent talks to their own kid in the parking lot but no rule was broken.","Your motivation is partly that you and this parent have a history.","You don't know enough to say what actually happened."],"howToHandleIt":["Document. Date, time, what was said, what you saw, who else witnessed it. Write it down that night.","Check the league's code of conduct first. Most leagues publish them. Match your description to specific rule violations.","Talk to the head coach or league director directly, in writing. Email is best because it creates a record.","Don't go to the league president before going to the level below them. Skipping levels is taken as overreach unless required by the situation.","If a child is in danger, skip the league chain entirely and call the police or appropriate authority.","Don't broadcast on social media. Don't recruit other parents to complain. Stay narrow and on the record."],"theRule":"Report when the behavior crosses clear lines and you have witnesses. Let it go when it's just bad vibes you don't like.","relatedDecisions":["leave-this-team","when-sports-stop-being-fun"],"relatedScripts":["kid-upset","after-a-bad-game"],"sportTags":["multi-sport"],"ageBands":["5-7","8-10","11-12","13-14","15-plus"]};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/decisions/report-another-parents-behavior.md";
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
