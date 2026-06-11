globalThis.process ??= {}; globalThis.process.env ??= {};
async function getMod() {
						return import('./growth-plates-basics_BxOuOfZU.mjs');
					}
					const collectedLinks = [];
					const collectedStyles = [];
					const collectedScripts = [];
					const defaultMod = { __astroPropagation: true, getMod, collectedLinks, collectedStyles, collectedScripts };

export { defaultMod as default };
