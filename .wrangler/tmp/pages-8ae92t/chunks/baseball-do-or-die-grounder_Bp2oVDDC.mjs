globalThis.process ??= {}; globalThis.process.env ??= {};
async function getMod() {
						return import('./baseball-do-or-die-grounder_D2NAmkiA.mjs');
					}
					const collectedLinks = [];
					const collectedStyles = [];
					const collectedScripts = [];
					const defaultMod = { __astroPropagation: true, getMod, collectedLinks, collectedStyles, collectedScripts };

export { defaultMod as default };
