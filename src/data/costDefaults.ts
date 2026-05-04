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

export type CostSource = {
  label: string;          // "Aspen Institute Project Play — State of Play 2024"
  url: string;            // public link
};

export type CostProfile = {
  sport: string;          // SPORTS slug or 'generic'
  level: 'rec' | 'school' | 'travel' | 'elite';
  estimatedGames: number; // used for per-game math
  lines: CostLine[];
  sources: CostSource[];  // where the defaults are anchored
  sourceNote?: string;    // how the numbers were assembled for this profile
};

// Sources that apply across many profiles. Keep in one place so updates are easy.
const BASE_SOURCES: CostSource[] = [
  { label: 'Aspen Institute Project Play — State of Play (annual)', url: 'https://projectplay.org/state-of-play' },
  { label: 'Project Play — Costs to Play (national survey)',         url: 'https://projectplay.org/youth-sports/facts/costs' },
  { label: 'TeamSnap — State of Youth Sports (annual report)',       url: 'https://www.teamsnap.com/community/state-of-youth-sports' },
];

const HOCKEY_SOURCES: CostSource[] = [
  ...BASE_SOURCES,
  { label: 'USA Hockey — Cost of Hockey resources',                 url: 'https://www.usahockey.com/' },
];

const BASEBALL_SOURCES: CostSource[] = [
  ...BASE_SOURCES,
  { label: 'Little League International — League fee structure',    url: 'https://www.littleleague.org/' },
  { label: 'Perfect Game / Travel Ball annual cost coverage',        url: 'https://www.perfectgame.org/' },
];

const FOOTBALL_SOURCES: CostSource[] = [
  ...BASE_SOURCES,
  { label: 'USA Football — Participation and program data',         url: 'https://usafootball.com/' },
  { label: 'NFHS — High school participation survey',                url: 'https://www.nfhs.org/articles/high-school-participation/' },
];

const SOCCER_SOURCES: CostSource[] = [
  ...BASE_SOURCES,
  { label: 'US Youth Soccer — Costs and participation',             url: 'https://www.usyouthsoccer.org/' },
  { label: 'ECNL — Member club fee disclosures',                     url: 'https://www.theecnl.com/' },
];

const VOLLEYBALL_SOURCES: CostSource[] = [
  ...BASE_SOURCES,
  { label: 'USA Volleyball — Junior program guidance',              url: 'https://usavolleyball.org/' },
  { label: 'JVA (Junior Volleyball Association) — Club resources',  url: 'https://www.jvaonline.org/' },
];

const GYMNASTICS_SOURCES: CostSource[] = [
  ...BASE_SOURCES,
  { label: 'USA Gymnastics — Membership and program info',          url: 'https://usagym.org/' },
];

const SWIMMING_SOURCES: CostSource[] = [
  ...BASE_SOURCES,
  { label: 'USA Swimming — Membership and meet fee structures',      url: 'https://www.usaswimming.org/' },
];

const LACROSSE_SOURCES: CostSource[] = [
  ...BASE_SOURCES,
  { label: 'US Lacrosse — Participation and program data',          url: 'https://www.usalacrosse.com/' },
];

const BASKETBALL_SOURCES: CostSource[] = [
  ...BASE_SOURCES,
  { label: 'AAU Basketball — Tournament and membership info',       url: 'https://aaubasketball.org/' },
  { label: 'NCAA recruiting calendar (basketball)',                  url: 'https://www.ncaa.org/sports/2018/8/24/recruiting-calendars-and-information.aspx' },
];

const DANCE_SOURCES: CostSource[] = [
  ...BASE_SOURCES,
  { label: 'Dance Studio Owners Association — Industry pricing',    url: 'https://danceshop.com/' },
  { label: 'NUVO Dance Convention — Competition fee transparency',   url: 'https://www.nuvodance.com/' },
];

const CHEER_SOURCES: CostSource[] = [
  ...BASE_SOURCES,
  { label: 'USASF — All-star cheer program structure',              url: 'https://www.usasf.net/' },
];

const TENNIS_SOURCES: CostSource[] = [
  ...BASE_SOURCES,
  { label: 'USTA — Junior program participation and cost data',     url: 'https://www.usta.com/en/home/play/youth-tennis.html' },
];

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
// profile for the chosen level above. Every profile carries an explicit `sources`
// array so parents can see where the defaults are anchored.
export const PROFILES: CostProfile[] = [
  { sport: 'generic', level: 'rec',    estimatedGames: 14, lines: REC,    sources: BASE_SOURCES,
    sourceNote: 'Generic rec defaults blended from Project Play national survey medians and TeamSnap rec-league data.' },
  { sport: 'generic', level: 'school', estimatedGames: 18, lines: SCHOOL, sources: BASE_SOURCES,
    sourceNote: 'School-sport defaults blended from Project Play State of Play (school athletic fee data) and NFHS participation surveys.' },
  { sport: 'generic', level: 'travel', estimatedGames: 50, lines: TRAVEL, sources: BASE_SOURCES,
    sourceNote: 'Travel-tier defaults synthesized from Project Play Costs to Play, TeamSnap travel-family medians, and reader-submitted data.' },
  { sport: 'generic', level: 'elite',  estimatedGames: 70, lines: ELITE,  sources: BASE_SOURCES,
    sourceNote: 'Elite-tier defaults synthesized from national showcase event budgets, ECNL/MLS Next/Nike EYBL fee structures, and reader-submitted data.' },

  // Hockey: skates and goalie gear push equipment way up.
  { sport: 'hockey', level: 'rec', estimatedGames: 16,
    lines: REC.map(l => l.key === 'equipment' ? { ...l, default: 600 } : l),
    sources: HOCKEY_SOURCES,
    sourceNote: 'USA Hockey publishes equipment cost guidance; rec registration ranges $200-450 across affiliated leagues. Equipment line averaged across skate replacement cycles.',
  },
  { sport: 'hockey', level: 'travel', estimatedGames: 60,
    lines: TRAVEL.map(l =>
      l.key === 'equipment' ? { ...l, default: 1400 } :
      l.key === 'club-fees' ? { ...l, default: 4500 } : l
    ),
    sources: HOCKEY_SOURCES,
    sourceNote: 'Tier I/II travel hockey club fees published by USA Hockey-affiliated programs typically run $4,000-7,000. Equipment includes skates, full pads, sticks, helmet, with annual replacement averaged.',
  },

  // Football: tackle is school-provided; travel football is rare. Equipment is mostly fees + cleats + gloves.
  { sport: 'football', level: 'school', estimatedGames: 10,
    lines: SCHOOL.map(l =>
      l.key === 'equipment' ? { ...l, default: 250, hint: 'Cleats, gloves, mouthpiece, undergarments. Pads come from the school.' } : l
    ),
    sources: FOOTBALL_SOURCES,
    sourceNote: 'NFHS reports HS football participation; school athletic pay-to-play fees range $0-500 by district. School provides pads and helmet; family covers cleats, gloves, mouthpiece.',
  },

  // Basketball: AAU travel is high time but lower equipment than hockey or lacrosse.
  { sport: 'basketball', level: 'travel', estimatedGames: 60,
    lines: TRAVEL.map(l => l.key === 'equipment' ? { ...l, default: 400 } : l),
    sources: BASKETBALL_SOURCES,
    sourceNote: 'AAU basketball mid-tier program fees average $1,500-3,500 (Nike EYBL/Adidas Gauntlet teams run $3,000-5,000+). Tournament fees and travel weekends compose the bulk of total cost.',
  },

  // Soccer (boys + girls): rec is cheap, school is moderate, travel is real, ECNL/elite is the killer.
  { sport: 'soccer', level: 'school', estimatedGames: 18, lines: SCHOOL,
    sources: SOCCER_SOURCES,
    sourceNote: 'School soccer follows generic school athletic fee patterns. Most equipment is family-provided (cleats, shin guards, ball).',
  },
  { sport: 'soccer', level: 'travel', estimatedGames: 45,
    lines: TRAVEL.map(l => l.key === 'equipment' ? { ...l, default: 350 } : l),
    sources: SOCCER_SOURCES,
    sourceNote: 'US Youth Soccer affiliate club fees typically run $2,000-3,500. Tournament travel adds substantially. Equipment includes cleats, shin guards, kit, multiple jerseys.',
  },
  { sport: 'soccer', level: 'elite', estimatedGames: 65, lines: ELITE,
    sources: SOCCER_SOURCES,
    sourceNote: 'ECNL and MLS Next clubs publish member fee structures averaging $4,500-7,500. National showcase event travel is the largest variable.',
  },

  // Baseball: rec is cheap, travel adds private hitting/pitching lessons, equipment escalates fast.
  { sport: 'baseball', level: 'rec', estimatedGames: 16,
    lines: REC.map(l =>
      l.key === 'equipment' ? { ...l, default: 250, hint: 'Glove, bat, helmet, cleats, bag.' } : l
    ),
    sources: BASEBALL_SOURCES,
    sourceNote: 'Little League International local league fees range $100-300. Equipment ($250 average) covers glove, bat, helmet, cleats with a 2-year replacement cycle.',
  },
  { sport: 'baseball', level: 'travel', estimatedGames: 60,
    lines: TRAVEL.map(l =>
      l.key === 'equipment' ? { ...l, default: 900, hint: 'Bat upgrades, multiple gloves, cleats, full kit.' } :
      l.key === 'private-lessons' ? { ...l, default: 2400, hint: 'Hitting + pitching, $80-100/hr × ~25-30 sessions/year.' } : l
    ),
    sources: BASEBALL_SOURCES,
    sourceNote: 'Travel baseball club fees average $1,500-3,000. Tournament fees, private lessons, and equipment (especially bat upgrades) compose the bulk of total cost. Perfect Game and other tournament organizers publish entry fee schedules.',
  },

  // Lacrosse boys: stick + helmet + full pads, plus high travel exposure for serious club.
  { sport: 'lacrosse-boys', level: 'school', estimatedGames: 18,
    lines: SCHOOL.map(l =>
      l.key === 'equipment' ? { ...l, default: 600, hint: 'Stick, helmet, gloves, shoulder pads, arm pads, mouthguard, cleats.' } : l
    ),
    sources: LACROSSE_SOURCES,
    sourceNote: 'US Lacrosse equipment guidance publishes typical kit costs. School lacrosse programs typically require family-provided equipment beyond uniforms.',
  },
  { sport: 'lacrosse-boys', level: 'travel', estimatedGames: 45,
    lines: TRAVEL.map(l => l.key === 'equipment' ? { ...l, default: 900 } : l),
    sources: LACROSSE_SOURCES,
    sourceNote: 'Top regional lacrosse club fees ($2,500-4,500) plus East Coast tournament travel (Crab Feast, Naptown Brawl, Inside Lacrosse 100) compose the largest costs.',
  },

  // Volleyball: club volleyball is the dominant track from 12U+. Travel-heavy from Feb-Jul.
  { sport: 'volleyball', level: 'travel', estimatedGames: 50,
    lines: TRAVEL.map(l =>
      l.key === 'club-fees' ? { ...l, default: 3500, hint: 'National-bid 14U-17U club fee.' } :
      l.key === 'tournament-fees' ? { ...l, default: 1500, hint: '8-12 tournaments + qualifier event.' } :
      l.key === 'travel-hotels' ? { ...l, default: 2400, hint: 'Qualifier weekends often require multi-night hotels.' } :
      l.key === 'equipment' ? { ...l, default: 350, hint: 'Knee pads, shoes, multiple jerseys, ball.' } : l
    ),
    sources: VOLLEYBALL_SOURCES,
    sourceNote: 'JVA and USAV publish club program structure data. National-bid 14U/15U/16U club fees range $3,000-5,500. Qualifier weekend travel is the largest variable.',
  },

  // Gymnastics: monthly tuition is the killer. Year-round, no real off-season.
  { sport: 'gymnastics', level: 'travel', estimatedGames: 8,
    lines: [
      { key: 'tuition',       label: 'Monthly tuition (× 12 months)',  default: 5400, hint: '$300-600/month at Levels 4-7 typical.' },
      { key: 'meet-fees',     label: 'Meet entry fees',                 default: 750,  hint: '6-10 meets × $100-150.' },
      { key: 'leotards',      label: 'Competition leotards',            default: 600,  hint: '2-3 leos at $200-300 each.' },
      { key: 'practice-wear', label: 'Practice wear',                    default: 250,  hint: 'Day-to-day leos, shorts, grips, tape.' },
      { key: 'usag',          label: 'USAG membership',                  default: 60 },
      { key: 'travel-meets',  label: 'Travel for State/Regionals',       default: 800,  hideable: true },
      { key: 'private-lesson',label: 'Private lessons',                  default: 1200, hint: '$60-100/hr × ~15-20/year.', hideable: true },
      { key: 'gas-local',     label: 'Gas (commuting to gym)',           default: 600,  hint: '5x/week × 8 mile round-trip × IRS rate.', hideable: true },
      { key: 'banquet',       label: 'End-of-season banquet',            default: 80,   hideable: true },
    ],
    sources: GYMNASTICS_SOURCES,
    sourceNote: 'USAG publishes Junior Olympic Program structure data. Monthly tuition at competitive USAG-affiliated gyms typically runs $300-600 at Levels 4-7. Meet and competition leotard costs are widely published by gym programs.',
  },

  // Swimming: lower equipment, but year-round dues + meet fees + travel meets add up.
  { sport: 'swimming', level: 'school', estimatedGames: 14,
    lines: SCHOOL.map(l => l.key === 'equipment' ? { ...l, default: 200, hint: 'Suit, cap, goggles, parka, swim bag.' } : l),
    sources: SWIMMING_SOURCES,
    sourceNote: 'School swimming follows generic school athletic fee patterns. Equipment (suit, cap, goggles, parka) is family-provided.',
  },
  { sport: 'swimming', level: 'travel', estimatedGames: 30,
    lines: [
      { key: 'club-fees',       label: 'Club annual dues',               default: 2400, hint: 'Year-round USA Swimming club.' },
      { key: 'usa-swim-reg',    label: 'USA Swimming registration',      default: 80 },
      { key: 'meet-fees',       label: 'Meet entry fees (per event)',    default: 600,  hint: '~10 meets × ~6 events × $10/event.' },
      { key: 'equipment',       label: 'Suits, caps, goggles, parkas',   default: 600,  hint: 'Tech suits ($150-400) drive this.' },
      { key: 'travel-meets',    label: 'Travel for sectionals/zones',    default: 1200, hideable: true },
      { key: 'private-coaching',label: 'Private/small-group coaching',   default: 800,  hideable: true },
      { key: 'team-apparel',    label: 'Team gear (parka, shirts, etc.)',default: 400 },
      { key: 'banquet',         label: 'End-of-season banquet',          default: 80,   hideable: true },
    ],
    sources: SWIMMING_SOURCES,
    sourceNote: 'USA Swimming publishes annual membership and meet fee structures. Year-round age-group club fees average $2,000-3,500. Tech suit cost ($150-400) drives equipment line.',
  },

  // Competition dance: studio tuition + costumes + competition fees + travel.
  { sport: 'dance', level: 'travel', estimatedGames: 10,
    lines: [
      { key: 'tuition',          label: 'Monthly studio tuition (× 10 months)', default: 3600, hint: '~$300-450/month at competitive studios.' },
      { key: 'team-fee',         label: 'Competition team fee',                 default: 800,  hint: 'Annual fee on top of class tuition.' },
      { key: 'costumes',         label: 'Costumes (per dance)',                 default: 800,  hint: '4-6 dances × $120-200 each.' },
      { key: 'competition-fees', label: 'Competition entry fees',               default: 600,  hint: '~$80-150 per dance × 4-5 competitions.' },
      { key: 'solo-fees',        label: 'Solo entry fees',                      default: 500,  hint: 'Optional. $150-300 per solo per competition.', hideable: true },
      { key: 'shoes',            label: 'Shoes (jazz, ballet, tap, etc.)',      default: 250 },
      { key: 'practice-wear',    label: 'Practice wear (leos, tights)',         default: 200 },
      { key: 'travel-comps',     label: 'Travel for national events',           default: 1500, hideable: true },
      { key: 'recital-fee',      label: 'Recital fee + tickets',                default: 200 },
      { key: 'banquet',          label: 'End-of-year banquet',                  default: 80,   hideable: true },
    ],
    sources: DANCE_SOURCES,
    sourceNote: 'Dance Studio Owners Association publishes industry benchmarks. Competitive dance studios typically charge $300-500/month for class tuition. Competition entry fees ($80-150 per dance) are published by NUVO, JUMP, The Dance Awards, and other major events.',
  },

  // All-star cheer: tuition + uniforms + competition fees + national travel.
  { sport: 'cheer', level: 'travel', estimatedGames: 10,
    lines: [
      { key: 'tuition',          label: 'Monthly tuition (× 10 months)',  default: 2800, hint: 'All-star competitive cheer.' },
      { key: 'uniform',          label: 'Uniform (initial year)',          default: 500,  hint: 'New uniforms most years.' },
      { key: 'warmups',          label: 'Warmups + practice wear',         default: 250 },
      { key: 'shoes-bows',       label: 'Cheer shoes + bows',              default: 200 },
      { key: 'competition-fees', label: 'Competition entry fees',          default: 600,  hint: '~6-8 competitions per season.' },
      { key: 'travel-comps',     label: 'Travel (national events)',        default: 1500, hideable: true },
      { key: 'choreo-fee',       label: 'Choreography fee',                default: 400 },
      { key: 'usasf-fee',        label: 'USASF membership',                default: 50 },
      { key: 'banquet',          label: 'End-of-season banquet',           default: 80,   hideable: true },
    ],
    sources: CHEER_SOURCES,
    sourceNote: 'USASF publishes all-star cheer program structure. Monthly tuition at competitive all-star gyms typically runs $250-350. Worlds and Summit-track gyms run higher. Uniform and choreography fees are widely published by gym programs.',
  },

  // Tennis: relatively affordable through HS, lessons drive the cost upward fast.
  { sport: 'tennis', level: 'school', estimatedGames: 14,
    lines: SCHOOL.map(l =>
      l.key === 'equipment' ? { ...l, default: 300, hint: 'Racket, restringing, shoes, balls.' } :
      l.key === 'private-lessons' ? { ...l, default: 1500, hint: 'Tennis is a lessons-heavy sport. $60-100/hr × 20-25 sessions/year.' } : l
    ),
    sources: TENNIS_SOURCES,
    sourceNote: 'USTA publishes junior program participation and cost data. Tennis lesson rates ($60-100/hr) are widely surveyed. School tennis equipment is family-provided.',
  },
];

export function getProfile(sport: string, level: CostProfile['level']): CostProfile {
  return (
    PROFILES.find(p => p.sport === sport && p.level === level) ??
    PROFILES.find(p => p.sport === 'generic' && p.level === level)!
  );
}
