// Default cost line items for the Parent Coach Playbook cost calculator.
//
// Numbers are national medians as of 2026, sourced from Project Play, the Aspen
// Institute State of Play reports, and a synthesis of public registration fee
// data. Treat them as starting points — the calculator is editable inline so
// parents can dial in their actual numbers and share the result.
//
// Add more profiles by following the shape below. Calculator falls back to a
// generic rec/school/travel/elite profile if no specific sport+level entry exists.

export type CostLine = {
  key: string;            // stable id used by the form
  label: string;
  default: number;        // annual dollars
  hint?: string;
  hideable?: boolean;     // line items parents often forget — toggle on/off
};

export type CostProfile = {
  sport: string;          // SPORTS slug or 'generic'
  level: 'rec' | 'school' | 'travel' | 'elite';
  estimatedGames: number; // used for per-game math
  lines: CostLine[];
};

const REC: CostLine[] = [
  { key: 'registration',      label: 'League/club registration',     default: 175,  hint: 'Annual rec league fee, all-in.' },
  { key: 'equipment',         label: 'Equipment (initial + replacement)', default: 200,  hint: 'Cleats, gloves, bag, water bottle. Replacement averaged across years.' },
  { key: 'team-apparel',      label: 'Team apparel',                  default: 80,   hint: 'Spirit pack, second jersey, hoodie.' },
  { key: 'gas-local',         label: 'Gas (local practices/games)',   default: 200,  hint: 'About 30 trips × 10 miles each at IRS rate.', hideable: true },
  { key: 'snacks',            label: 'Snacks/team treats',            default: 60,   hideable: true },
  { key: 'banquet',           label: 'End-of-season banquet',         default: 30,   hideable: true },
  { key: 'photos',            label: 'Picture day package',           default: 45,   hideable: true },
];

const SCHOOL: CostLine[] = [
  { key: 'registration',      label: 'School athletic fee',           default: 200,  hint: 'Pay-to-play fee, varies by district.' },
  { key: 'equipment',         label: 'Equipment (initial + replacement)', default: 350,  hint: 'Beyond what the school provides.' },
  { key: 'team-apparel',      label: 'Team apparel',                  default: 175,  hint: 'Required spirit pack, sometimes mandatory.' },
  { key: 'private-lessons',   label: 'Private lessons',               default: 800,  hint: '$60-100/hr × ~10-12 sessions during season.', hideable: true },
  { key: 'gas-local',         label: 'Gas (practices/games)',         default: 350,  hideable: true },
  { key: 'team-meals',        label: 'Pre-game team meals (parents fund)', default: 100, hideable: true },
  { key: 'banquet',           label: 'End-of-season banquet',         default: 60,   hideable: true },
  { key: 'photos',            label: 'Picture day package',           default: 60,   hideable: true },
];

const TRAVEL: CostLine[] = [
  { key: 'club-fees',         label: 'Club/team annual fee',          default: 2400, hint: 'Includes practices, coaches, facility.' },
  { key: 'tournament-fees',   label: 'Tournament entry fees',         default: 1200, hint: '8-12 tournaments × $100-150 per kid.' },
  { key: 'travel-hotels',     label: 'Hotels for travel weekends',    default: 1800, hint: '8 nights × ~$225/night.' },
  { key: 'travel-gas',        label: 'Gas (travel weekends)',         default: 800,  hint: 'Add ~$100/weekend for road trips.' },
  { key: 'travel-food',       label: 'Food on the road',              default: 700,  hint: '~$90/weekend × 8 weekends.', hideable: true },
  { key: 'equipment',         label: 'Equipment (initial + replacement)', default: 700,  hint: 'Higher replacement rate at travel level.' },
  { key: 'team-apparel',      label: 'Team apparel/uniforms',         default: 400,  hint: 'Often mandatory full kit + warmups.' },
  { key: 'private-lessons',   label: 'Private lessons',               default: 1800, hint: '$75-100/hr × ~20-25 sessions/year.', hideable: true },
  { key: 'skills-camps',      label: 'Skills camps',                  default: 600,  hideable: true },
  { key: 'recovery-pt',       label: 'PT, trainers, recovery',        default: 300,  hideable: true },
  { key: 'banquet',           label: 'End-of-season banquet',         default: 100,  hideable: true },
];

const ELITE: CostLine[] = [
  { key: 'club-fees',         label: 'Elite club/team fee',           default: 4500, hint: 'National-level club, top travel team.' },
  { key: 'tournament-fees',   label: 'Tournament/showcase fees',      default: 2400, hint: '12-15 events including national showcases.' },
  { key: 'travel-hotels',     label: 'Hotels (incl. national travel)', default: 3500, hint: 'Often includes flights for national events.' },
  { key: 'travel-flights',    label: 'Flights for national events',   default: 1500, hint: 'Some clubs have 2-3 fly-in events/year.', hideable: true },
  { key: 'travel-gas',        label: 'Gas (drive-to events)',         default: 1200, hideable: true },
  { key: 'travel-food',       label: 'Food on the road',              default: 1100, hideable: true },
  { key: 'equipment',         label: 'Equipment (initial + replacement)', default: 1000 },
  { key: 'team-apparel',      label: 'Team apparel/uniforms',         default: 600 },
  { key: 'private-lessons',   label: 'Private lessons + S&C',         default: 3500, hint: '~50 sessions/year between skills + strength.' },
  { key: 'skills-camps',      label: 'Skills/showcase camps',         default: 1500 },
  { key: 'recovery-pt',       label: 'PT, trainers, recovery gear',   default: 800,  hideable: true },
  { key: 'recruiting-services', label: 'Recruiting services (NCSA, etc.)', default: 1500, hint: 'Usually not worth it. Most coaches find kids via film + camps.', hideable: true },
  { key: 'college-visits',    label: 'College visit travel',          default: 800,  hint: 'For 15+ athletes in active recruiting.', hideable: true },
];

// Sport-specific overrides go here. Anything not listed falls back to the generic
// profile for the chosen level above.
export const PROFILES: CostProfile[] = [
  { sport: 'generic', level: 'rec',    estimatedGames: 14, lines: REC },
  { sport: 'generic', level: 'school', estimatedGames: 18, lines: SCHOOL },
  { sport: 'generic', level: 'travel', estimatedGames: 50, lines: TRAVEL },
  { sport: 'generic', level: 'elite',  estimatedGames: 70, lines: ELITE },

  // Hockey: skates and goalie gear push equipment way up.
  { sport: 'hockey', level: 'rec',    estimatedGames: 16, lines: REC.map(l => l.key === 'equipment' ? { ...l, default: 600 } : l) },
  { sport: 'hockey', level: 'travel', estimatedGames: 60, lines: TRAVEL.map(l =>
    l.key === 'equipment' ? { ...l, default: 1400 } :
    l.key === 'club-fees' ? { ...l, default: 4500 } :
    l
  ) },

  // Football: school-only at the youth level matters; travel is rare. Equipment school-provided.
  { sport: 'football', level: 'school', estimatedGames: 10, lines: SCHOOL.map(l =>
    l.key === 'equipment' ? { ...l, default: 250, hint: 'Cleats, gloves, mouthpiece, undergarments. Pads come from the school.' } : l
  ) },

  // Basketball: AAU travel is high time but lower equipment than hockey or lacrosse.
  { sport: 'basketball', level: 'travel', estimatedGames: 60, lines: TRAVEL.map(l =>
    l.key === 'equipment' ? { ...l, default: 400 } : l
  ) },

  // Soccer ECNL: real elite tier with travel cost as the dominant line.
  { sport: 'soccer', level: 'elite', estimatedGames: 65, lines: ELITE },

  // Lacrosse: stick + helmet + pads, plus high travel exposure.
  { sport: 'lacrosse-boys', level: 'travel', estimatedGames: 45, lines: TRAVEL.map(l =>
    l.key === 'equipment' ? { ...l, default: 900 } : l
  ) },
];

export function getProfile(sport: string, level: CostProfile['level']): CostProfile {
  return (
    PROFILES.find(p => p.sport === sport && p.level === level) ??
    PROFILES.find(p => p.sport === 'generic' && p.level === level)!
  );
}
