globalThis.process ??= {}; globalThis.process.env ??= {};
async function getMod() {
						return import('./the-grandparent-who-pushes-too-hard_B3c8noBC.mjs');
					}
					const collectedLinks = [];
					const collectedStyles = [];
					const collectedScripts = [];
					const defaultMod = { __astroPropagation: true, getMod, collectedLinks, collectedStyles, collectedScripts };

export { defaultMod as default };
