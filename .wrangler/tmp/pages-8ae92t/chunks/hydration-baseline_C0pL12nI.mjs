globalThis.process ??= {}; globalThis.process.env ??= {};
async function getMod() {
						return import('./hydration-baseline_C3lCgAwV.mjs');
					}
					const collectedLinks = [];
					const collectedStyles = [];
					const collectedScripts = [];
					const defaultMod = { __astroPropagation: true, getMod, collectedLinks, collectedStyles, collectedScripts };

export { defaultMod as default };
