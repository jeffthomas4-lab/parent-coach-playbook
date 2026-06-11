globalThis.process ??= {}; globalThis.process.env ??= {};
async function getMod() {
						return import('./pre-game-routine_x81WRrqX.mjs');
					}
					const collectedLinks = [];
					const collectedStyles = [];
					const collectedScripts = [];
					const defaultMod = { __astroPropagation: true, getMod, collectedLinks, collectedStyles, collectedScripts };

export { defaultMod as default };
