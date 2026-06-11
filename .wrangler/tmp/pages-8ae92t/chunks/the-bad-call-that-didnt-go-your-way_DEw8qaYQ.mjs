globalThis.process ??= {}; globalThis.process.env ??= {};
async function getMod() {
						return import('./the-bad-call-that-didnt-go-your-way_Bmq43pwb.mjs');
					}
					const collectedLinks = [];
					const collectedStyles = [];
					const collectedScripts = [];
					const defaultMod = { __astroPropagation: true, getMod, collectedLinks, collectedStyles, collectedScripts };

export { defaultMod as default };
