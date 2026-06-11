globalThis.process ??= {}; globalThis.process.env ??= {};
async function getMod() {
						return import('./soccer-figure-eight-dribble_D9-I4-ps.mjs');
					}
					const collectedLinks = [];
					const collectedStyles = [];
					const collectedScripts = [];
					const defaultMod = { __astroPropagation: true, getMod, collectedLinks, collectedStyles, collectedScripts };

export { defaultMod as default };
