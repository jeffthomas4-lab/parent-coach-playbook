globalThis.process ??= {}; globalThis.process.env ??= {};
async function getMod() {
						return import('./hs-marching-band-fall_BZoJnSJI.mjs');
					}
					const collectedLinks = [];
					const collectedStyles = [];
					const collectedScripts = [];
					const defaultMod = { __astroPropagation: true, getMod, collectedLinks, collectedStyles, collectedScripts };

export { defaultMod as default };
