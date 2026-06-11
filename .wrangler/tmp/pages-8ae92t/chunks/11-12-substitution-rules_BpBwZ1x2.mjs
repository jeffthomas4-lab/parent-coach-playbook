globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>At eleven to twelve, different leagues have different rules about substitutions. I didn’t know what the rule was for years. I just got mad when my kid didn’t play.</p>\n<p><strong>The rotation rule</strong>\nSome leagues mandate that every kid plays equal time. Not equal playing time in the game. Equal time on the field. If you play six kids a side and there are three rotations, everyone plays two rotations.</p>\n<p>This means your kid plays, gets pulled, sits, plays again. It’s not the same as being a starter. It’s equal time.</p>\n<p><strong>The starters rule</strong>\nSome leagues have no substitution rules. The coach picks a starting lineup and can sub at will. If your kid is not a starter, they might play four minutes. They might play thirty. It depends on the game.</p>\n<p><strong>What to ask the coach</strong>\n“What’s the substitution rule for this league?” Most coaches will tell you. Some won’t. If they won’t, email the league. The rule exists. You’re allowed to know it.</p>\n<p><strong>The playing-time conversation</strong>\nDon’t have it after week one. Have it after four weeks. By then you know if the coach is building something or just playing favorites.</p>\n<p>The right question: “What does she need to work on to play more?” Not: “Why isn’t she playing?” The first gets you information. The second gets you defensive answers.</p>\n<p><strong>What not to do</strong>\nDon’t email the coach after every game about playing time. Skip the halftime conversation. Don’t tell your kid the coach is unfair. Those approaches make things harder.</p>\n<p><strong>The bigger picture</strong>\nAt this age, kids are learning about competition. Some kids are ready. Some aren’t. Some coaches are developing players. Some are just trying to win games.</p>\n<p>The rule is the rule. The coach’s decision is within that rule. Your job is to understand the rule and let the coach do their job.</p>\n<p>Ask once. Accept the answer. Watch your kid improve or don’t. Then decide whether this team is the right fit.</p>";

				const frontmatter = {"title":"The 11-12 Substitution Rules Every Parent Should Know","dek":"How playing time actually works at this age.","seoDescription":"At eleven to twelve, different leagues have different rules about substitutions. I didn't know what the rule was for years.","topic":"rules-of-play","format":"note","phase":"game","sport":"multi-sport","age":"11-12","publishedAt":"2026-02-04T00:00:00.000Z","featured":false,"editorial":{"claudeReviewedAt":"2026-04-02T00:00:00.000Z"}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/articles/11-12-substitution-rules.md";
				const url = undefined;
				function rawContent() {
					return "\nAt eleven to twelve, different leagues have different rules about substitutions. I didn't know what the rule was for years. I just got mad when my kid didn't play.\n\n**The rotation rule**\nSome leagues mandate that every kid plays equal time. Not equal playing time in the game. Equal time on the field. If you play six kids a side and there are three rotations, everyone plays two rotations.\n\nThis means your kid plays, gets pulled, sits, plays again. It's not the same as being a starter. It's equal time.\n\n**The starters rule**\nSome leagues have no substitution rules. The coach picks a starting lineup and can sub at will. If your kid is not a starter, they might play four minutes. They might play thirty. It depends on the game.\n\n**What to ask the coach**\n\"What's the substitution rule for this league?\" Most coaches will tell you. Some won't. If they won't, email the league. The rule exists. You're allowed to know it.\n\n**The playing-time conversation**\nDon't have it after week one. Have it after four weeks. By then you know if the coach is building something or just playing favorites.\n\nThe right question: \"What does she need to work on to play more?\" Not: \"Why isn't she playing?\" The first gets you information. The second gets you defensive answers.\n\n**What not to do**\nDon't email the coach after every game about playing time. Skip the halftime conversation. Don't tell your kid the coach is unfair. Those approaches make things harder.\n\n**The bigger picture**\nAt this age, kids are learning about competition. Some kids are ready. Some aren't. Some coaches are developing players. Some are just trying to win games.\n\nThe rule is the rule. The coach's decision is within that rule. Your job is to understand the rule and let the coach do their job.\n\nAsk once. Accept the answer. Watch your kid improve or don't. Then decide whether this team is the right fit.\n";
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
