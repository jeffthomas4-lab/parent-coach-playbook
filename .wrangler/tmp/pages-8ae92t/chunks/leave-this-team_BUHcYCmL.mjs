globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "";

				const frontmatter = {"title":"Should we *leave this team*?","summary":"Mid-season exits are real. They are also a real obligation. The framework that helps you tell the difference between a hard week and a wrong fit, and the right way to leave when it's time.","theQuestion":"We're considering pulling our kid from the team mid-season. Is this the right call, and how do we do it without hurting them or the team?","publishedAt":"2026-06-08T00:00:00.000Z","featured":false,"draft":false,"benefits":["Pulling out of a wrong-fit team protects the kid's relationship with the sport long-term.","Sometimes a wrong-fit team is teaching them the wrong thing about effort, teammates, or coaches.","If the situation is unsafe or abusive, leaving is the only right call, regardless of timing.","Removing a load from the family schedule can rescue the rest of the season for everyone."],"costs":["Mid-season exits leave teammates short. Other kids' minutes change. Coaches scramble.","Your kid may carry the social weight of being the one who left.","The next team you join may treat the exit as a flag, fairly or not.","Some leagues hold registration fees. The money does not always come back."],"signsItsAGoodFit":["The dread is steady, not just a bad week. Three weeks running, the kid is unhappy at practice.","There is conduct from the coach you've already addressed and it has not changed.","Your kid has lost weight, sleep, or appetite in a way you can connect to the team.","The team culture is teaching something you do not want your kid to learn.","The travel, money, or time commitment was misrepresented and is now affecting the family."],"signsItsNot":["Your kid had a bad game and wants out for 48 hours.","The coach made one decision you disagreed with and you are reactive.","Another team or club has been recruiting your kid and the offer is glossier.","You are upset about playing time and have not had the conversation with the coach yet.","Your kid is on the bench more than you expected and is otherwise fine."],"howToHandleIt":["Talk to the coach first, in private, before you decide. Some situations are fixable in one conversation.","If the situation involves safety, conduct, or abuse, escalate to the league or governing body. Do not try to fix it yourself.","Tell your kid the decision is being made, not that they are the one making it. Kids 12 and under are not equipped to weigh team obligations.","Write the email or call the head coach personally. Not a text. Not a forwarded email. A real message.","Be specific in the reason without trashing anyone. 'The fit is not working for us this year' is enough.","Don't recruit other parents to leave with you. The drama costs more than it saves.","Pay the season fee if the league policy says so. Pay it without arguing. The exit is on you, not them."],"theRule":"Leave when leaving protects the kid. Stay when leaving is just the easier way out of a hard week.","relatedScripts":["kid-upset","after-a-bad-game"],"relatedDecisions":["should-my-kid-quit-sports"],"sportTags":["multi-sport"],"ageBands":["8-10","11-12","13-14","15-plus"]};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/decisions/leave-this-team.md";
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
