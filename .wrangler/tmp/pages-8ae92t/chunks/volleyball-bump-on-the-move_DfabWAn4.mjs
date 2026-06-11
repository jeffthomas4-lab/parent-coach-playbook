globalThis.process ??= {}; globalThis.process.env ??= {};
async function getMod() {
						return import('./volleyball-bump-on-the-move_DinA2QUi.mjs');
					}
					const collectedLinks = [];
					const collectedStyles = [];
					const collectedScripts = [];
					const defaultMod = { __astroPropagation: true, getMod, collectedLinks, collectedStyles, collectedScripts };

export { defaultMod as default };
