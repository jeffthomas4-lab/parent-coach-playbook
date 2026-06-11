globalThis.process ??= {}; globalThis.process.env ??= {};
async function getMod() {
						return import('./swimming-freestyle-arm-stroke_r2nLU_Mx.mjs');
					}
					const collectedLinks = [];
					const collectedStyles = [];
					const collectedScripts = [];
					const defaultMod = { __astroPropagation: true, getMod, collectedLinks, collectedStyles, collectedScripts };

export { defaultMod as default };
