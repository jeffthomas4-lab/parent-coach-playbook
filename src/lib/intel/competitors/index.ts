// Registry of every competitor fingerprint definition. Adding a competitor
// (TeamSnap, SportsEngine, LeagueApps, Crossbar, Jersey Watch, SportsPlus,
// Stack Team App, TeamLinkt, ...) is one new file under this directory plus
// one import and one array entry here — nothing else in the engine changes.

import type { CompetitorDefinition } from '../fingerprints';
import { sportsGravy } from './sportsgravy';

export const COMPETITOR_DEFINITIONS: CompetitorDefinition[] = [sportsGravy];

export function getDefinition(id: string): CompetitorDefinition | undefined {
  return COMPETITOR_DEFINITIONS.find((definition) => definition.id === id);
}
