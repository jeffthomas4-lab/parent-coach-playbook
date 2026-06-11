globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Our 13-year-old came home on a Tuesday and said they wanted to quit. Right now. Today. Done. We took a breath.</p>\n<p>We said: “I hear you. You’re frustrated. We’re not making a decision today. Let’s talk about it this weekend.”</p>\n<p>We gave the emotion 48 hours to settle.</p>\n<h2 id=\"what-we-found-out\">What we found out</h2>\n<p>When we talked, we found out what was actually wrong. It’s usually not the sport. It’s playing time, or a conflict with a teammate, or feeling left out, or the coach’s style. Rarely is it “I don’t like this sport.” It’s “I don’t like my role on this team.”</p>\n<p>If it’s playing time, we already know the answer: they’re either going to earn it or accept the bench. That’s the deal.</p>\n<p>If it’s a teammate conflict, we help them work it out or accept it. Most people have to figure out how to be on teams with people they don’t like.</p>\n<p>If it’s the coach, we ask them what they’d need to stay. Sometimes they just need to be heard. Sometimes they realize the coach isn’t actually the problem.</p>\n<h2 id=\"what-ive-learned-they-actually-want\">What I’ve learned they actually want</h2>\n<p>My kid threatened to quit, and I realized they didn’t actually want to quit. They wanted things to change without having to do anything hard. That’s not how this works.</p>\n<p>We say: “This is a hard part of the season. Everyone feels like this. I’m not letting you quit because things got hard. You finish the season. Then, if you want to do a different sport next year, we’ll talk about it.”</p>\n<p>Most kids who stick it out are glad they did. Some quit after the season ends and that’s fine. But mid-season quitting is about avoiding hard emotions, not about having a real choice.</p>";

				const frontmatter = {"title":"The 13-14 Quit-Mid-Season Call","dek":"They want out today. Don't let one hard week become a permanent decision.","seoDescription":"Our 13-year-old came home on a Tuesday and said they wanted to quit. Right now. Today. Done. We took a breath.","topic":"the-hard-stuff","format":"note","phase":"drive-home","sport":"multi-sport","age":"13-14","publishedAt":"2026-03-13T00:00:00.000Z","featured":false,"editorial":{"claudeReviewedAt":"2026-06-21T00:00:00.000Z"}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/articles/the-13-to-14-quit-mid-season-call.md";
				const url = undefined;
				function rawContent() {
					return "\nOur 13-year-old came home on a Tuesday and said they wanted to quit. Right now. Today. Done. We took a breath.\n\nWe said: \"I hear you. You're frustrated. We're not making a decision today. Let's talk about it this weekend.\"\n\nWe gave the emotion 48 hours to settle.\n\n## What we found out\n\nWhen we talked, we found out what was actually wrong. It's usually not the sport. It's playing time, or a conflict with a teammate, or feeling left out, or the coach's style. Rarely is it \"I don't like this sport.\" It's \"I don't like my role on this team.\"\n\nIf it's playing time, we already know the answer: they're either going to earn it or accept the bench. That's the deal.\n\nIf it's a teammate conflict, we help them work it out or accept it. Most people have to figure out how to be on teams with people they don't like.\n\nIf it's the coach, we ask them what they'd need to stay. Sometimes they just need to be heard. Sometimes they realize the coach isn't actually the problem.\n\n## What I've learned they actually want\n\nMy kid threatened to quit, and I realized they didn't actually want to quit. They wanted things to change without having to do anything hard. That's not how this works.\n\nWe say: \"This is a hard part of the season. Everyone feels like this. I'm not letting you quit because things got hard. You finish the season. Then, if you want to do a different sport next year, we'll talk about it.\"\n\nMost kids who stick it out are glad they did. Some quit after the season ends and that's fine. But mid-season quitting is about avoiding hard emotions, not about having a real choice.\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"what-we-found-out","text":"What we found out"},{"depth":2,"slug":"what-ive-learned-they-actually-want","text":"What I’ve learned they actually want"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
