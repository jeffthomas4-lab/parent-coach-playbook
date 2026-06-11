globalThis.process ??= {}; globalThis.process.env ??= {};
async function getMod() {
						return import('./tennis-serve-full-motion_v1ArkX4T.mjs');
					}
					const collectedLinks = [];
					const collectedStyles = [];
					const collectedScripts = [];
					const defaultMod = { __astroPropagation: true, getMod, collectedLinks, collectedStyles, collectedScripts };

export { defaultMod as default };
