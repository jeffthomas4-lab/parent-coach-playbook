globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>May to August. The kid grew. The sport got harder, not easier.</p>\n<p>Most parents don’t connect the dots. The kid is suddenly clumsy at practice, slower to react, missing shots that were routine in April. The coach is patient or impatient depending on the coach. The kid is frustrated.</p>\n<p>The body is rebuilding the kid in real time. The proprioception (the body’s sense of where it is in space) goes through a recalibration when limbs grow. A kid whose arms got two inches longer has to relearn the timing of every throw, swing, or pass. This takes weeks to months.</p>\n<h2 id=\"what-works\">What works</h2>\n<p>Tell the coach. <em>Hey, just a heads-up. He’s grown four inches since April. We’re seeing some clumsiness. Probably a recalibration. Should pass.</em> Most coaches will be patient with that context. The good ones will adjust drills to help.</p>\n<p>Replace the gear. Cleats that were broken in are now too small. Helmets are tight. Bats are too short. The kid playing in gear that doesn’t fit is the kid who quietly hates practice.</p>\n<p>Reduce expectations through the rough patch. Skill plateaus during a growth spurt are normal. The kid who was hitting .350 in May is hitting .220 in July. The kid is fine. The body is doing something else right now.</p>\n<h2 id=\"what-to-watch\">What to watch</h2>\n<p>Knee and ankle pain. Growth-plate issues are real during fast-growth periods. Osgood-Schlatter (knee), Sever’s disease (heel), and stress fractures show up in this window. If the kid is limping or complaining of joint pain that doesn’t go away, it’s a doctor visit.</p>\n<p>Mood. The kid who feels uncoordinated suddenly is a kid whose self-image is taking a hit. Don’t pretend it isn’t happening. Name it. <em>The body is growing fast. Your brain is catching up. This is temporary.</em></p>\n<p><a href=\"/body/\">The body hub</a> covers growth plates and pediatric overuse injuries with sources. The doctor visit is the right call for joint pain that lingers.</p>";

				const frontmatter = {"title":"The summer the kid *grew four inches*","dek":"Cleats don't fit. Coordination is gone. Confidence took a hit. The growth-spurt season nobody warns you about.","seoDescription":"May to August. The kid grew. The sport got harder, not easier.","topic":"the-hard-stuff","format":"note","phase":"drive-there","sport":"multi-sport","age":"13-14","publishedAt":"2026-05-13T00:00:00.000Z","featured":false,"draft":false};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/articles/summer-the-kid-grew-four-inches.md";
				const url = undefined;
				function rawContent() {
					return "\nMay to August. The kid grew. The sport got harder, not easier.\n\nMost parents don't connect the dots. The kid is suddenly clumsy at practice, slower to react, missing shots that were routine in April. The coach is patient or impatient depending on the coach. The kid is frustrated.\n\nThe body is rebuilding the kid in real time. The proprioception (the body's sense of where it is in space) goes through a recalibration when limbs grow. A kid whose arms got two inches longer has to relearn the timing of every throw, swing, or pass. This takes weeks to months.\n\n## What works\n\nTell the coach. _Hey, just a heads-up. He's grown four inches since April. We're seeing some clumsiness. Probably a recalibration. Should pass._ Most coaches will be patient with that context. The good ones will adjust drills to help.\n\nReplace the gear. Cleats that were broken in are now too small. Helmets are tight. Bats are too short. The kid playing in gear that doesn't fit is the kid who quietly hates practice.\n\nReduce expectations through the rough patch. Skill plateaus during a growth spurt are normal. The kid who was hitting .350 in May is hitting .220 in July. The kid is fine. The body is doing something else right now.\n\n## What to watch\n\nKnee and ankle pain. Growth-plate issues are real during fast-growth periods. Osgood-Schlatter (knee), Sever's disease (heel), and stress fractures show up in this window. If the kid is limping or complaining of joint pain that doesn't go away, it's a doctor visit.\n\nMood. The kid who feels uncoordinated suddenly is a kid whose self-image is taking a hit. Don't pretend it isn't happening. Name it. _The body is growing fast. Your brain is catching up. This is temporary._\n\n[The body hub](/body/) covers growth plates and pediatric overuse injuries with sources. The doctor visit is the right call for joint pain that lingers.\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"what-works","text":"What works"},{"depth":2,"slug":"what-to-watch","text":"What to watch"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
