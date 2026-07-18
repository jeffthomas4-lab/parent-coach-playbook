export interface CampDemandState {
  search: string;
  sport: string;
  ageMin: number | null;
  ageMax: number | null;
  dateStart: string;
  dateEnd: string;
  dayOvernight: string;
  state: string;
  zipLat: number | null;
  zipLon: number | null;
  zipRadius: number;
  showLeagues: boolean;
  showFull: boolean;
  verifiedOnly: boolean;
  openOnly: boolean;
}

export interface CampDemandPayload {
  query: string;
  eventType: 'search' | 'filter';
  resultCount: number;
  surface: 'camp_directory';
  collection: 'camps';
  sport?: string;
  age?: string;
}

const hasNonTextFilter = (state: CampDemandState) => Boolean(
  state.sport || state.ageMin !== null || state.ageMax !== null
  || state.dateStart || state.dateEnd || state.dayOvernight !== 'all'
  || state.state || state.zipLat !== null || state.showLeagues || state.showFull
  || state.verifiedOnly || state.openOnly,
);

/**
 * Builds the deliberately minimized camp-directory demand event. Location
 * filters affect whether an event exists but are never copied into its payload.
 */
export function buildCampDemandPayload(state: CampDemandState, resultCount: number): CampDemandPayload | null {
  const search = state.search.trim();
  if (!search && !hasNonTextFilter(state)) return null;
  const age = state.ageMin !== null || state.ageMax !== null
    ? `${state.ageMin ?? 'any'}-${state.ageMax ?? 'any'}`
    : undefined;
  return {
    query: search || 'camp directory filters',
    eventType: search ? 'search' : 'filter',
    resultCount,
    surface: 'camp_directory',
    collection: 'camps',
    ...(state.sport ? { sport: state.sport } : {}),
    ...(age ? { age } : {}),
  };
}
