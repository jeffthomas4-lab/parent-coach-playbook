globalThis.process ??= {}; globalThis.process.env ??= {};
async function getMod() {
						return import('./stop-the-bleed-basics_TK8Lxp5I.mjs');
					}
					const collectedLinks = [];
					const collectedStyles = [];
					const collectedScripts = [];
					const defaultMod = { __astroPropagation: true, getMod, collectedLinks, collectedStyles, collectedScripts };

export { defaultMod as default };
