type CampEventInput = {
  name?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  description?: string | null;
  hero_photo_key?: string | null;
  age_known?: number | null;
  age_min?: number | null;
  age_max?: number | null;
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const validDate = (value: unknown): value is string => {
  if (typeof value !== 'string' || !ISO_DATE.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
};
const clean = (value: unknown) => typeof value === 'string' ? value.trim() : '';

export function buildCampEventSchema(camp: CampEventInput, options: { siteUrl: string; sportLabel: string }) {
  const name = clean(camp.name);
  const address = clean(camp.address);
  const city = clean(camp.city);
  const state = clean(camp.state);
  const zip = clean(camp.zip);
  if (!name || !validDate(camp.start_date) || !validDate(camp.end_date) || camp.end_date < camp.start_date) return null;
  if (!address || !city || !/^[A-Z]{2}$/.test(state) || !/^\d{5}(?:-\d{4})?$/.test(zip)) return null;
  const fallback = `${options.sportLabel} camp${camp.age_known === 1 ? ` for ages ${camp.age_min}-${camp.age_max}` : ''} in ${city}, ${state}.`;
  const description = clean(camp.description).slice(0, 500) || fallback;
  const photoKey = clean(camp.hero_photo_key);
  const safePhotoKey = photoKey && !photoKey.includes('..') && /^[A-Za-z0-9._/-]+$/.test(photoKey) ? photoKey : null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    startDate: camp.start_date,
    endDate: camp.end_date,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    description,
    location: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        streetAddress: address,
        addressLocality: city,
        addressRegion: state,
        postalCode: zip,
        addressCountry: 'US',
      },
    },
    ...(safePhotoKey ? { image: [`${options.siteUrl}/camp-photos/${safePhotoKey}`] } : {}),
  };
}
