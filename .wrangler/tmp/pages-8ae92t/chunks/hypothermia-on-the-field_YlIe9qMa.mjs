globalThis.process ??= {}; globalThis.process.env ??= {};
async function getMod() {
						return import('./hypothermia-on-the-field_D9HHDwRW.mjs');
					}
					const collectedLinks = [];
					const collectedStyles = [];
					const collectedScripts = [];
					const defaultMod = { __astroPropagation: true, getMod, collectedLinks, collectedStyles, collectedScripts };

export { defaultMod as default };
