globalThis.process ??= {}; globalThis.process.env ??= {};
async function getMod() {
						return import('./stunt-extension-prep_DjXH6K9P.mjs');
					}
					const collectedLinks = [];
					const collectedStyles = [];
					const collectedScripts = [];
					const defaultMod = { __astroPropagation: true, getMod, collectedLinks, collectedStyles, collectedScripts };

export { defaultMod as default };
