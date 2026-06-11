globalThis.process ??= {}; globalThis.process.env ??= {};
async function getMod() {
						return import('./first-aid-kit_6_PR4UJW.mjs');
					}
					const collectedLinks = [];
					const collectedStyles = [];
					const collectedScripts = [];
					const defaultMod = { __astroPropagation: true, getMod, collectedLinks, collectedStyles, collectedScripts };

export { defaultMod as default };
