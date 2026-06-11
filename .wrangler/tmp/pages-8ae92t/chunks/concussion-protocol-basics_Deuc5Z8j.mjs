globalThis.process ??= {}; globalThis.process.env ??= {};
async function getMod() {
						return import('./concussion-protocol-basics_C4EYC7Ie.mjs');
					}
					const collectedLinks = [];
					const collectedStyles = [];
					const collectedScripts = [];
					const defaultMod = { __astroPropagation: true, getMod, collectedLinks, collectedStyles, collectedScripts };

export { defaultMod as default };
