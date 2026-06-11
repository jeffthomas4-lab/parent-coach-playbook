globalThis.process ??= {}; globalThis.process.env ??= {};
async function getMod() {
						return import('./baseball-bunt-square-around_CIrS_S-B.mjs');
					}
					const collectedLinks = [];
					const collectedStyles = [];
					const collectedScripts = [];
					const defaultMod = { __astroPropagation: true, getMod, collectedLinks, collectedStyles, collectedScripts };

export { defaultMod as default };
