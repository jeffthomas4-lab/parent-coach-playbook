globalThis.process ??= {}; globalThis.process.env ??= {};
async function getMod() {
						return import('./sideline-kit_DZPS8WR9.mjs');
					}
					const collectedLinks = [];
					const collectedStyles = [];
					const collectedScripts = [];
					const defaultMod = { __astroPropagation: true, getMod, collectedLinks, collectedStyles, collectedScripts };

export { defaultMod as default };
