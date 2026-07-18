import { describe, expect, it } from 'vitest';
import { buildCampDemandPayload, type CampDemandState } from '../src/lib/camp-demand';

const state = (overrides: Partial<CampDemandState> = {}): CampDemandState => ({
  search: '', sport: '', ageMin: null, ageMax: null, dateStart: '', dateEnd: '',
  dayOvernight: 'all', state: '', zipLat: null, zipLon: null, zipRadius: 10,
  showLeagues: false, showFull: false, verifiedOnly: false, openOnly: false,
  ...overrides,
});

describe('privacy-minimized camp demand payload', () => {
  it('does not emit an event for the unfiltered initial directory', () => {
    expect(buildCampDemandPayload(state(), 100)).toBeNull();
  });

  it('keeps useful broad search dimensions', () => {
    expect(buildCampDemandPayload(state({ search: 'soccer', sport: 'soccer', ageMin: 8, ageMax: 12 }), 4)).toEqual({
      query: 'soccer', eventType: 'search', resultCount: 4, surface: 'camp_directory',
      collection: 'camps', sport: 'soccer', age: '8-12',
    });
  });

  it('never copies precise location filters into the event', () => {
    const payload = buildCampDemandPayload(state({ state: 'WA', zipLat: 47.25, zipLon: -122.44, zipRadius: 25 }), 2);
    expect(payload).toEqual({
      query: 'camp directory filters', eventType: 'filter', resultCount: 2,
      surface: 'camp_directory', collection: 'camps',
    });
    expect(JSON.stringify(payload)).not.toMatch(/47\.25|122\.44|\bWA\b|zip|radius/i);
  });
});
