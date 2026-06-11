// Default cost line items for the Parent Coach Desk cost calculator.
//
// Numbers are national medians as of 2026, sourced from Project Play, the Aspen
// Institute State of Play reports, and a synthesis of public registration fee
// data. Treat them as starting points: the calculator is editable inline so
// parents can dial in their actual numbers and share the result.
//
// Add more profiles by following the shape below. Calculator falls back to a
// generic rec/school/travel/elite profile if no specific sport+level entry exists.

export type CostLine = {
  key: string;            // stable id used by the form
  label: string;
  default: number;        // annual dollars
  hint?: string;
  hideable?: boolean;     // line items parents often forget: toggle on/off
};

export type CostSource = {
  label: string;          // "Aspen Institute Project Play: State of Play 2024"
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
  { label: 'Aspen Institute Project Play: State of Play 2025',                  url: 'https://projectplay.org/state-of-play-2025/introduction' },
  { label: 'Project Play: National Youth Sports Parent Survey (cost data)',     url: 'https://projectplay.org/news/2025/2/24/project-play-survey-family-spending-on-youth-sports-rises-46-over-five-years' },
  { label: 'Project Play: Research index (State of Play archive)',              url: 'https://projectplay.org/research' },
];

const HOCKEY_SOURCES: CostSource[] = [
  ...BASE_SOURCES,
  { label: 'USA Hockey: Cost of Hockey resources',                 url: 'https://www.usahockey.com/' },
];

const BASEBALL_SOURCES: CostSource[] = [
  ...BASE_SOURCES,
  { label: 'Little League International: League fee structure',    url: 'https://www.littleleague.org/' },
];

const SOFTBALL_SOURCES: CostSource[] = [
  ...BASE_SOURCES,
  { label: 'USA Softball: League and program structure',           url: 'https://www.usasoftball.com/' },
  { label: 'Little League Softball: League fee structure',         url: 'https://www.littleleague.org/play-little-league/softball/' },
];

const FOOTBALL_SOURCES: CostSource[] = [
  ...BASE_SOURCES,
  { label: 'USA Football: Participation and program data',         url: 'https://usafootball.com/' },
  { label: 'NFHS: High school participation survey',                url: 'https://www.nfhs.org/articles/high-school-participation/' },
];

const SOCCER_SOURCES: CostSource[] = [
  ...BASE_SOURCES,
  { label: 'US Youth Soccer: Costs and participation',             url: 'https://www.usyouthsoccer.org/' },
  { label: 'ECNL: Member club fee disclosures',                     url: 'https://www.theecnl.com/' },
];

const VOLLEYBALL_SOURCES: CostSource[] = [
  ...BASE_SOURCES,
  { label: 'USA Volleyball: Junior program guidance',              url: 'https://usavolleyball.org/' },
  { label: 'JVA (Junior Volleyball Association): Club resources',  url: 'https://www.jvaonline.org/' },
];

const GYMNASTICS_SOURCES: CostSource[] = [
  ...BASE_SOURCES,
  { label: 'USA Gymnastics: Membership and program info',          url: 'https://usagym.org/' },
];

const SWIMMING_SOURCES: CostSource[] = [
  ...BASE_SOURCES,
  { label: 'USA Swimming: Membership and meet fee structures',      url: 'https://www.usaswimming.org/' },
];

const LACROSSE_SOURCES: CostSource[] = [
  ...BASE_SOURCES,
  { label: 'US Lacrosse: Participation and program data',          url: 'https://www.usalacrosse.com/' },
];

const BASKETBALL_SOURCES: CostSource[] = [
  ...BASE_SOURCES,
  { label: 'AAU Basketball: Tournament and membership info',       url: 'https://aau.com/sports/basketball' },
  { label: 'NCAA recruiting calendar (basketball)',                  url: 'https://www.ncaa.org/sports/2013/12/17/probability-of-competing-beyond-high-school.aspx' },
];

const DANCE_SOURCES: CostSource[] = [
  ...BASE_SOURCES,
  { label: 'Dance Studio Owners Association: Industry pricing',    url: 'https://danceshop.com/' },
  { label: 'NUVO Dance Convention: Competition fee transparency',   url: 'https://www.nuvodance.com/' },
];

const CHEER_SOURCES: CostSource[] = [
  ...BASE_SOURCES,
  { label: 'USASF: All-star cheer program structure',              url: 'https://www.usasf.net/' },
];

const TENNIS_SOURCES: CostSource[] = [
  ...BASE_SOURCES,
  { label: 'USTA: Junior program participation and cost data',     url: 'https://www.usta.com/en/home/play/youth-tennis.html' },
];

const FLAG_7V7_SOURCES: CostSource[] = [
  ...BASE_SOURCES,
  { label: 'USA Football: Flag and 7v7 program data',              url: 'https://usafootball.com/' },
  { label: 'NFL Flag: League registration structure',              url: 'https://nflflag.com/' },
];

const TRACK_XC_SOURCES: CostSource[] = [
  ...BASE_SOURCES,
  { label: 'NFHS: High school participation survey',               url: 'https://www.nfhs.org/articles/high-school-participation/' },
  { label: 'USATF: Youth membership and Junior Olympic structure', url: 'https://www.usatf.org/' },
];

const GOLF_SOURCES: CostSource[] = [
  ...BASE_SOURCES,
  { label: 'PGA Jr. League: Registration structure',               url: 'https://www.pgajrleague.com/' },
  { label: 'USGA: Junior golf programs',                           url: 'https://www.usga.org/' },
];

const CREW_SOURCES: CostSource[] = [
  ...BASE_SOURCES,
  { label: 'USRowing: Youth membership and regatta structure',     url: 'https://usrowing.org/' },
];

const MARTIAL_ARTS_SOURCES: CostSource[] = [
  ...BASE_SOURCES,
  { label: 'USA Taekwondo: Membership and event structure',        url: 'https://www.usatkd.org/' },
];

const STUNT_SOURCES: CostSource[] = [
  ...BASE_SOURCES,
  { label: 'USA Cheer: STUNT the Sport program structure',         url: 'https://www.usacheer.org/' },
];

const THEATER_SOURCES: CostSource[] = [
  ...BASE_SOURCES,
  { label: 'Educational Theatre Association: School theater programs', url: 'https://schooltheatre.org/' },
];

const MUSIC_SOURCES: CostSource[] = [
  ...BASE_SOURCES,
  { label: 'NAfME: Music education program data',                  url: 'https://nafme.org/' },
  { label: 'NFHS: Music and performing arts activities',           url: 'https://www.nfhs.org/activities-performing-arts/music/' },
];

const BALLET_SOURCES: CostSource[] = [
  ...BASE_SOURCES,
  { label: 'Dance Studio Owners Association: Industry pricing',    url: 'https://danceshop.com/' },
  { label: 'Youth America Grand Prix: Competition fee structure',  url: 'https://yagp.org/' },
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
    sourceNote: 'Generic rec defaults blended from Project Play National Youth Sports Parent Survey medians and reader-submitted data.' },
  { sport: 'generic', level: 'school', estimatedGames: 18, lines: SCHOOL, sources: BASE_SOURCES,
    sourceNote: 'School-sport defaults blended from Project Play State of Play (school athletic fee data) and NFHS participation surveys.' },
  { sport: 'generic', level: 'travel', estimatedGames: 50, lines: TRAVEL, sources: BASE_SOURCES,
    sourceNote: 'Travel-tier defaults synthesized from Project Play Costs to Play trends and reader-submitted data.' },
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

  // Baseball: rec is cheap, the middle layer (rec-plus / school) is where most families actually live,
  // travel adds private hitting/pitching lessons, equipment escalates fast.
  { sport: 'baseball', level: 'rec', estimatedGames: 16,
    lines: REC.map(l =>
      l.key === 'equipment' ? { ...l, default: 250, hint: 'Glove, bat, helmet, cleats, bag.' } : l
    ),
    sources: BASEBALL_SOURCES,
    sourceNote: 'Little League International local league fees range $100-300. Equipment ($250 average) covers glove, bat, helmet, cleats with a 2-year replacement cycle.',
  },
  { sport: 'baseball', level: 'school', estimatedGames: 30,
    lines: SCHOOL.map(l =>
      l.key === 'equipment' ? { ...l, default: 450, hint: 'Better glove, bat upgrade, helmet, cleats, gear bag, batting gloves.' } :
      l.key === 'fees' ? { ...l, default: 600, hint: 'Rec league + a fall ball season + a winter clinic. The "rec-plus" middle layer most families settle into around age 9-11.' } :
      l.key === 'private-lessons' ? { ...l, default: 600, hint: 'Occasional hitting lessons, $60-80/hr × ~8-10 sessions/year. Not weekly.' } : l
    ),
    sources: BASEBALL_SOURCES,
    sourceNote: 'The middle layer for baseball families: a rec season plus fall ball plus a winter clinic, with a few private hitting lessons per year. Sits between $1,200 and $2,500 annually depending on equipment cycle. Project Play data and reader surveys both put the median family in this band.',
  },
  { sport: 'baseball', level: 'travel', estimatedGames: 60,
    lines: TRAVEL.map(l =>
      l.key === 'equipment' ? { ...l, default: 900, hint: 'Bat upgrades, multiple gloves, cleats, full kit.' } :
      l.key === 'private-lessons' ? { ...l, default: 2400, hint: 'Hitting + pitching, $80-100/hr × ~25-30 sessions/year.' } : l
    ),
    sources: BASEBALL_SOURCES,
    sourceNote: 'Travel baseball club fees average $1,500-3,000. Tournament fees, private lessons, and equipment (especially bat upgrades) compose the bulk of total cost. Tournament organizers publish entry fee schedules; budget $200-600 per weekend tournament.',
  },

  // Softball (fastpitch): mirrors baseball's tiers, but pitching lessons arrive earlier
  // and dominate the travel budget once a kid enters the circle.
  { sport: 'softball', level: 'rec', estimatedGames: 16,
    lines: REC.map(l =>
      l.key === 'equipment' ? { ...l, default: 300, hint: 'Glove, bat, helmet with facemask, cleats, fielder mask, bag.' } : l
    ),
    sources: SOFTBALL_SOURCES,
    sourceNote: 'Little League Softball and USA Softball rec fees mirror baseball at $100-300. Equipment runs slightly higher than baseball because helmets with facemasks and infield fielder masks are standard in fastpitch.',
  },
  { sport: 'softball', level: 'school', estimatedGames: 30,
    lines: SCHOOL.map(l =>
      l.key === 'equipment' ? { ...l, default: 500, hint: 'Fastpitch bat, better glove, helmet with mask, cleats, bag.' } :
      l.key === 'private-lessons' ? { ...l, default: 900, hint: 'Pitching or hitting lessons, $50-80/hr. Pitcher families spend at the top of this range.' } : l
    ),
    sources: SOFTBALL_SOURCES,
    sourceNote: 'The softball middle layer: rec spring plus fall ball plus a winter clinic. Pitching lessons start earlier than the baseball equivalent because windmill mechanics are coach-taught, not playground-learned.',
  },
  { sport: 'softball', level: 'travel', estimatedGames: 60,
    lines: TRAVEL.map(l =>
      l.key === 'equipment' ? { ...l, default: 800, hint: 'Fastpitch bat upgrades, glove, helmet, cleats, full kit.' } :
      l.key === 'private-lessons' ? { ...l, default: 2600, hint: 'Pitching lessons are the engine of travel softball: $60-90/hr, weekly for pitchers. Hitters run less.' } : l
    ),
    sources: SOFTBALL_SOURCES,
    sourceNote: 'Travel fastpitch club fees average $1,500-3,000, in line with travel baseball. The differentiator is pitching instruction: windmill pitchers at the travel level typically take weekly lessons year-round, and tournament entries run $400-700 per team per event.',
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

  // Flag football: the cheapest entry point in football. One season, no pads, jersey included.
  { sport: 'flag-football', level: 'rec', estimatedGames: 10,
    lines: [
      { key: 'registration',  label: 'League registration',           default: 175,  hint: 'NFL Flag and local league fees run $120-250, jersey included.' },
      { key: 'equipment',     label: 'Cleats, mouthguard, gloves',     default: 90,   hint: 'No pads, no helmet. Cleats are most of the bill.' },
      { key: 'team-apparel',  label: 'Extra team apparel',             default: 40,   hideable: true },
      { key: 'gas-local',     label: 'Gas (practices/games)',          default: 120,  hideable: true },
      { key: 'snacks',        label: 'Snacks/team treats',             default: 40,   hideable: true },
      { key: 'photos',        label: 'Picture day package',            default: 40,   hideable: true },
    ],
    sources: FLAG_7V7_SOURCES,
    sourceNote: 'NFL Flag and USA Football affiliate leagues publish registration fees: $120-250 per season with the jersey included. Add cleats and a mouthguard and the season lands between $150 and $300 before extras.',
  },
  { sport: 'flag-football', level: 'travel', estimatedGames: 30,
    lines: [
      { key: 'club-fees',        label: 'Club/team annual fee',        default: 600,  hint: 'Tournament flag teams charge $400-900 for the year.' },
      { key: 'tournament-fees',  label: 'Tournament entry fees',       default: 450,  hint: '6-8 tournaments, entry split across the roster.' },
      { key: 'travel-hotels',    label: 'Hotels for travel weekends',  default: 600,  hint: '2-3 overnight events.', hideable: true },
      { key: 'travel-gas',       label: 'Gas (travel weekends)',       default: 300,  hideable: true },
      { key: 'travel-food',      label: 'Food on the road',            default: 250,  hideable: true },
      { key: 'equipment',        label: 'Cleats, gloves, mouthguard',  default: 150 },
      { key: 'team-apparel',     label: 'Team apparel/uniforms',       default: 150 },
    ],
    sources: FLAG_7V7_SOURCES,
    sourceNote: 'Tournament flag is growing fast and fees are settling around $400-900 per club plus entries. Cheaper than any other travel sport on this list. The hotel weekends arrive just the same.',
  },

  // 7v7: a circuit, not a season. School summer teams are cheap. Club 7v7 is travel ball in shorts.
  { sport: 'football-7v7', level: 'school', estimatedGames: 16,
    lines: [
      { key: 'team-fee',      label: 'Summer 7v7 team fee',            default: 150,  hint: 'Covers tournament entries, split across the roster.' },
      { key: 'equipment',     label: 'Cleats, gloves, mouthguard',     default: 130 },
      { key: 'soft-shell',    label: 'Soft-shell helmet',              default: 60,   hint: 'Some events require one. Check before you buy.', hideable: true },
      { key: 'team-apparel',  label: 'Team shirts/shorts',             default: 50 },
      { key: 'gas-local',     label: 'Gas (tournaments)',              default: 120,  hideable: true },
      { key: 'travel-food',   label: 'Food at all-day events',         default: 100,  hint: '7v7 days run six hours plus. The concession stand knows it.', hideable: true },
    ],
    sources: FLAG_7V7_SOURCES,
    sourceNote: 'School-team summer 7v7 stays cheap because the program pools tournament entries and the kid already owns cleats. Budget $300-500 all-in. The club circuit below is a different animal.',
  },
  { sport: 'football-7v7', level: 'travel', estimatedGames: 28,
    lines: [
      { key: 'club-fees',       label: 'Club 7v7 fee',                  default: 900,  hint: 'Regional and national-circuit teams run $500-1,500.' },
      { key: 'tournament-fees', label: 'Tournament/showcase fees',      default: 400 },
      { key: 'travel-hotels',   label: 'Hotels for travel weekends',    default: 900,  hint: '3-4 overnight events.' },
      { key: 'travel-gas',      label: 'Gas (travel weekends)',         default: 350,  hideable: true },
      { key: 'travel-food',     label: 'Food on the road',              default: 300,  hideable: true },
      { key: 'equipment',       label: 'Cleats, gloves, soft-shell helmet', default: 220 },
      { key: 'team-apparel',    label: 'Team apparel/uniforms',         default: 180 },
      { key: 'film-subs',       label: 'Film/highlight subscriptions',  default: 150,  hint: 'Hudl-type accounts. The circuit sells exposure, and film is the product.', hideable: true },
    ],
    sources: FLAG_7V7_SOURCES,
    sourceNote: 'Club 7v7 fees run $500-1,500 with national-circuit teams at the top. Hotels and showcase entries do the rest. College coaches still recruit off fall film first, so treat the exposure pitch with a flat eye.',
  },

  // Lacrosse girls: same field, different game. No pads, but goggles are mandatory and the stick is its own line.
  { sport: 'lacrosse-girls', level: 'school', estimatedGames: 18,
    lines: SCHOOL.map(l =>
      l.key === 'equipment' ? { ...l, default: 350, hint: 'Stick, goggles, mouthguard, cleats. No helmet or pads in the girls game.' } : l
    ),
    sources: LACROSSE_SOURCES,
    sourceNote: 'US Lacrosse equipment guidance puts a girls starter kit at roughly half the boys number: no helmet, no shoulder or arm pads. Goggles are mandatory and a legal women\'s stick with a real pocket runs $100-250.',
  },
  { sport: 'lacrosse-girls', level: 'travel', estimatedGames: 45,
    lines: TRAVEL.map(l =>
      l.key === 'equipment' ? { ...l, default: 550, hint: 'Stick upgrades, a backup stick, goggles, cleats.' } : l
    ),
    sources: LACROSSE_SOURCES,
    sourceNote: 'Girls club lacrosse fees match the boys side at $2,500-4,500, and the summer recruiting circuit drives the same hotel math. Equipment runs lower because the girls game has no pads. Stick upgrades close some of that gap.',
  },

  // Cross country: the cheapest varsity sport going. Shoes are the budget.
  { sport: 'cross-country', level: 'school', estimatedGames: 9,
    lines: [
      { key: 'registration',  label: 'School athletic fee',            default: 150,  hint: 'Pay-to-play fee, varies by district.' },
      { key: 'shoes',         label: 'Trainers + spikes',              default: 280,  hint: 'Trainers wear out around 400 miles. A varsity runner burns through two pairs plus spikes.' },
      { key: 'team-apparel',  label: 'Spirit pack',                    default: 100 },
      { key: 'summer-camp',   label: 'Summer running camp',            default: 300,  hint: 'Optional. Common for varsity hopefuls.', hideable: true },
      { key: 'watch',         label: 'GPS watch',                      default: 120,  hint: 'Not required. Half the team has one anyway.', hideable: true },
      { key: 'gas-local',     label: 'Gas (meets)',                    default: 100,  hideable: true },
      { key: 'banquet',       label: 'End-of-season banquet',          default: 40,   hideable: true },
    ],
    sources: TRACK_XC_SOURCES,
    sourceNote: 'NFHS counts cross country among the largest participation sports because the cost of entry is shoes. A school season runs $200-600 all-in: athletic fee, two pairs of trainers, spikes, spirit pack. Summer camp is the only line that moves the total much.',
  },
  { sport: 'cross-country', level: 'travel', estimatedGames: 12,
    lines: [
      { key: 'club-fees',     label: 'Club dues',                      default: 450,  hint: 'USATF youth clubs charge seasonal or annual dues.' },
      { key: 'usatf',         label: 'USATF membership',               default: 35 },
      { key: 'meet-fees',     label: 'Meet entry fees',                default: 150 },
      { key: 'shoes',         label: 'Trainers + spikes',              default: 300 },
      { key: 'team-apparel',  label: 'Club uniform/apparel',           default: 100 },
      { key: 'travel-meets',  label: 'Travel for JO regionals/nationals', default: 700, hint: 'Only if the kid qualifies. Then it is a plane ticket.', hideable: true },
      { key: 'gas-local',     label: 'Gas (practices/meets)',          default: 200,  hideable: true },
    ],
    sources: TRACK_XC_SOURCES,
    sourceNote: 'USATF youth clubs fill the fall for kids who want more than the school schedule. Dues and entries stay modest. The Junior Olympic championship path is what adds travel cost, and only for qualifiers.',
  },

  // Track and field: cheap at school, with one wrinkle. Spikes are event-specific.
  { sport: 'track-field', level: 'school', estimatedGames: 12,
    lines: [
      { key: 'registration',  label: 'School athletic fee',            default: 150,  hint: 'Pay-to-play fee, varies by district.' },
      { key: 'shoes',         label: 'Spikes + trainers',              default: 250,  hint: 'Sprint spikes, distance spikes, jump shoes, and throwing shoes are all different. Multi-event kids pay twice.' },
      { key: 'team-apparel',  label: 'Spirit pack',                    default: 100 },
      { key: 'implements',    label: 'Personal implements',            default: 80,   hint: 'Schools provide shots and discs. Serious throwers buy their own anyway.', hideable: true },
      { key: 'summer-camp',   label: 'Summer camp/clinic',             default: 250,  hideable: true },
      { key: 'gas-local',     label: 'Gas (meets)',                    default: 120,  hideable: true },
      { key: 'banquet',       label: 'End-of-season banquet',          default: 40,   hideable: true },
    ],
    sources: TRACK_XC_SOURCES,
    sourceNote: 'School track sits in the same $200-600 band as cross country. NFHS participation data backs the low barrier. The one trap: spikes are event-specific, so a kid who sprints and jumps owns two pairs.',
  },
  { sport: 'track-field', level: 'travel', estimatedGames: 14,
    lines: [
      { key: 'club-fees',     label: 'Club dues',                      default: 500,  hint: 'USATF youth clubs charge seasonal or annual dues.' },
      { key: 'usatf',         label: 'USATF membership',               default: 35 },
      { key: 'meet-fees',     label: 'Meet entry fees',                default: 200,  hint: 'Per-event entries add up for multi-event kids.' },
      { key: 'shoes',         label: 'Spikes + trainers',              default: 300 },
      { key: 'team-apparel',  label: 'Club uniform/apparel',           default: 100 },
      { key: 'travel-meets',  label: 'Travel for JO regionals/nationals', default: 800, hint: 'Only if the kid qualifies.', hideable: true },
      { key: 'gas-local',     label: 'Gas (practices/meets)',          default: 200,  hideable: true },
    ],
    sources: TRACK_XC_SOURCES,
    sourceNote: 'Summer USATF club track mirrors club cross country: low dues, per-event entries, and a Junior Olympic ladder that turns into real travel money for the handful who qualify out of regionals.',
  },

  // Golf: rec is friendly. The junior tournament circuit is where the wallet opens.
  { sport: 'golf', level: 'rec', estimatedGames: 8,
    lines: [
      { key: 'registration',  label: 'PGA Jr. League/program fee',     default: 280,  hint: 'Season fee, jersey included.' },
      { key: 'clubs',         label: 'Starter club set',               default: 250,  hint: 'A used set is fine. Kids outgrow clubs like cleats.' },
      { key: 'consumables',   label: 'Balls, glove, tees',             default: 80 },
      { key: 'range',         label: 'Range balls/practice',           default: 150,  hideable: true },
      { key: 'gas-local',     label: 'Gas (matches/practice)',         default: 100,  hideable: true },
      { key: 'snacks',        label: 'Snack bar money',                default: 60,   hideable: true },
    ],
    sources: GOLF_SOURCES,
    sourceNote: 'PGA Jr. League publishes registration at $200-350 with the jersey included. A used starter set keeps year one near $600 all-in. Green fees stay low because junior leagues play par-3 and scramble formats.',
  },
  { sport: 'golf', level: 'travel', estimatedGames: 14,
    lines: [
      { key: 'tour-fees',       label: 'Junior tour membership',       default: 300,  hint: 'Regional junior tours. National tours cost more.' },
      { key: 'tournament-fees', label: 'Tournament entry fees',        default: 1200, hint: '12-15 events × $75-125 each.' },
      { key: 'clubs',           label: 'Clubs (fitted, amortized)',    default: 600,  hint: 'A fitted set every 2-3 growth spurts, averaged annually.' },
      { key: 'lessons',         label: 'Swing lessons/coaching',       default: 1500, hint: '$80-120/hr. The biggest variable in junior golf.', hideable: true },
      { key: 'range',           label: 'Range and practice fees',      default: 500 },
      { key: 'travel-events',   label: 'Travel for away events',       default: 1000, hideable: true },
      { key: 'team-apparel',    label: 'Golf apparel',                 default: 200 },
    ],
    sources: GOLF_SOURCES,
    sourceNote: 'Regional junior tours publish entry fees at $75-125 per event. Coaching is the swing factor: families with weekly lessons double the budget of families without. National AJGA-level golf runs well past these defaults.',
  },

  // Crew: the boat costs more than your car, and the club fee reflects it.
  { sport: 'crew', level: 'school', estimatedGames: 8,
    lines: [
      { key: 'program-fee',   label: 'Rowing program fee',             default: 1200, hint: 'Boats and coaching launches cost real money even at school programs.' },
      { key: 'uniform',       label: 'Uni/trou + team kit',            default: 150 },
      { key: 'regatta-fees',  label: 'Regatta entry fees',             default: 200 },
      { key: 'gear',          label: 'Personal gear',                  default: 100,  hint: 'Water bottle, seat pad, layers for cold water mornings.' },
      { key: 'travel-regattas', label: 'Travel for away regattas',     default: 400,  hideable: true },
      { key: 'travel-food',   label: 'Food on regatta days',           default: 100,  hideable: true },
      { key: 'banquet',       label: 'End-of-season banquet',          default: 60,   hideable: true },
    ],
    sources: CREW_SOURCES,
    sourceNote: 'School rowing carries a higher fee than most school sports because shells, oars, and a coaching launch sit behind every seat. Program fees of $800-1,500 per season are normal and posted publicly by most scholastic programs.',
  },
  { sport: 'crew', level: 'travel', estimatedGames: 10,
    lines: [
      { key: 'club-fees',     label: 'Club annual dues',               default: 2500, hint: 'Year-round junior rowing club. $1,500-3,500 is the national band.' },
      { key: 'usrowing',      label: 'USRowing membership',            default: 50 },
      { key: 'regatta-fees',  label: 'Regatta entry fees',             default: 400 },
      { key: 'uniform',       label: 'Uni/trou + team kit',            default: 150 },
      { key: 'travel-regattas', label: 'Hotels for travel regattas',   default: 900,  hint: 'Youth Nationals and away regattas mean multi-night stays.' },
      { key: 'travel-gas',    label: 'Gas (regatta travel)',           default: 300,  hideable: true },
      { key: 'travel-food',   label: 'Food on the road',               default: 250,  hideable: true },
      { key: 'summer-camp',   label: 'Summer rowing camp',             default: 700,  hideable: true },
    ],
    sources: CREW_SOURCES,
    sourceNote: 'Junior club dues run $1,500-3,500 nationally, posted on most club sites. Regatta travel stacks on top: Youth Nationals qualifiers add a week of hotels. The dues look high until you price a single racing shell.',
  },

  // Martial arts: a monthly bill, not a season. Testing fees climb as the belt darkens.
  { sport: 'martial-arts', level: 'rec', estimatedGames: 4,
    lines: [
      { key: 'tuition',       label: 'Monthly tuition (× 12 months)',  default: 1800, hint: '$100-200/month at most studios. Year-round, no off-season.' },
      { key: 'gear',          label: 'Gi/uniform + sparring gear',     default: 200,  hint: 'Uniform plus pads, headgear, mouthguard as the kid advances.' },
      { key: 'testing-fees',  label: 'Belt testing fees',              default: 150,  hint: '$40-100 per test, 2-3 tests a year. The fee climbs with the belt.' },
      { key: 'tournament',    label: 'Local tournament entries',       default: 100,  hideable: true },
      { key: 'summer-camp',   label: 'Studio camps/clinics',           default: 200,  hideable: true },
      { key: 'gas-local',     label: 'Gas (classes)',                  default: 150,  hideable: true },
    ],
    sources: MARTIAL_ARTS_SOURCES,
    sourceNote: 'Martial arts bills monthly and never stops: $100-200/month is the national band across taekwondo, karate, and BJJ studios. Testing fees are the line parents miss when they sign the contract. Read the contract twice.',
  },
  { sport: 'martial-arts', level: 'travel', estimatedGames: 8,
    lines: [
      { key: 'tuition',       label: 'Monthly tuition (× 12 months)',  default: 2400, hint: 'Competition-team rates run above base tuition.' },
      { key: 'team-fee',      label: 'Competition team fee',           default: 300 },
      { key: 'tournament-fees', label: 'Tournament entry fees',        default: 500,  hint: '6-8 events × $60-90.' },
      { key: 'gear',          label: 'Gis, sparring kit, replacements', default: 350 },
      { key: 'testing-fees',  label: 'Belt testing fees',              default: 200,  hint: 'Black belt tests run $300-600 on their own.', hideable: true },
      { key: 'travel-events', label: 'Travel for regional/national events', default: 800, hideable: true },
      { key: 'private-lessons', label: 'Private lessons',              default: 600,  hideable: true },
    ],
    sources: MARTIAL_ARTS_SOURCES,
    sourceNote: 'Competition-track martial arts adds team fees, entries, and travel on top of the monthly bill. USA Taekwondo and tournament circuits publish entry fees in the $60-90 range. The black belt test, when it comes, is its own budget item.',
  },

  // Stunt: the school-sanctioned game version of cheer. The club tumbling track prices like all-star.
  { sport: 'stunt', level: 'school', estimatedGames: 12,
    lines: [
      { key: 'registration',  label: 'School athletic fee',            default: 200,  hint: 'Pay-to-play fee, varies by district.' },
      { key: 'shoes',         label: 'Mat shoes + practice wear',      default: 150 },
      { key: 'team-apparel',  label: 'Spirit pack',                    default: 150 },
      { key: 'summer-camp',   label: 'Summer camp',                    default: 300,  hideable: true },
      { key: 'gas-local',     label: 'Gas (games/practices)',          default: 150,  hideable: true },
      { key: 'banquet',       label: 'End-of-season banquet',          default: 60,   hideable: true },
    ],
    sources: STUNT_SOURCES,
    sourceNote: 'STUNT is the head-to-head game format USA Cheer built from cheer skills, and it prices like a school sport, not like all-star: athletic fee, shoes, spirit pack. No competition uniforms, no choreography fee, no Worlds trip.',
  },
  { sport: 'stunt', level: 'travel', estimatedGames: 8,
    lines: [
      { key: 'tuition',       label: 'Monthly gym tuition (× 10 months)', default: 2400, hint: 'Club stunt and tumbling programs price like all-star cheer.' },
      { key: 'competition-fees', label: 'Competition entry fees',      default: 500 },
      { key: 'uniform',       label: 'Uniform',                        default: 400 },
      { key: 'choreo-fee',    label: 'Choreography fee',               default: 300 },
      { key: 'shoes',         label: 'Mat shoes + practice wear',      default: 150 },
      { key: 'membership',    label: 'USA Cheer/USASF membership',     default: 50 },
      { key: 'travel-comps',  label: 'Travel (regional/national events)', default: 1200, hideable: true },
    ],
    sources: STUNT_SOURCES,
    sourceNote: 'Club-level stunt and tumbling runs on the all-star cheer fee model: monthly gym tuition, a uniform, a choreography fee, and competition travel. Budget against the cheer profile and you will land close.',
  },

  // Theater: cheap on paper. Then you buy tickets for everyone you have ever met.
  { sport: 'theater', level: 'school', estimatedGames: 8,
    lines: [
      { key: 'participation-fee', label: 'Production/participation fee', default: 100, hint: 'Per-show fee at many schools. Some charge nothing.' },
      { key: 'costume',       label: 'Costume pieces',                 default: 120,  hint: 'Character shoes, base layers, the specific black pants every show demands.' },
      { key: 'makeup',        label: 'Stage makeup kit',               default: 50 },
      { key: 'show-shirt',    label: 'Show shirt + cast dues',         default: 60 },
      { key: 'tickets',       label: 'Tickets for family',             default: 120,  hint: 'You will buy more tickets than you planned. Grandma counts.', hideable: true },
      { key: 'festival-trip', label: 'Thespian festival trip',         default: 300,  hideable: true },
      { key: 'flowers-gifts', label: 'Flowers, cast gifts, cast party', default: 40,  hideable: true },
    ],
    sources: THEATER_SOURCES,
    sourceNote: 'School theater runs $200-700 a year across two productions: participation fees, costume pieces the costumer asks families to cover, a makeup kit, and the ticket line nobody budgets. The state Thespian festival trip is the swing item.',
  },
  { sport: 'theater', level: 'travel', estimatedGames: 12,
    lines: [
      { key: 'production-fees', label: 'Production fees (per show)',   default: 700,  hint: 'Community and youth theater companies charge $250-450 per production.' },
      { key: 'costume',       label: 'Costume + shoes',                default: 200 },
      { key: 'makeup',        label: 'Stage makeup kit',               default: 75 },
      { key: 'voice-lessons', label: 'Voice/acting lessons',           default: 900,  hint: 'Voice lessons at $50-80 per half hour. The hidden line for musical theater kids.', hideable: true },
      { key: 'headshots',     label: 'Headshots',                      default: 150,  hideable: true },
      { key: 'travel-festival', label: 'Festival/competition travel',  default: 500,  hideable: true },
      { key: 'tickets',       label: 'Tickets for family',             default: 150,  hideable: true },
    ],
    sources: THEATER_SOURCES,
    sourceNote: 'Youth and community theater companies post production fees of $250-450 per show, and serious kids do two or three a year. Voice lessons are where the budget actually lives. EdTA festival travel adds on top for competitive troupes.',
  },

  // Band: the fair share fee is the headline. The spring trip is the ambush.
  { sport: 'band', level: 'school', estimatedGames: 15,
    lines: [
      { key: 'fair-share',    label: 'Band fair share fee',            default: 500,  hint: 'Covers uniforms, staff, show design. $300-1,500 depending on program size.' },
      { key: 'instrument',    label: 'Instrument rental/purchase (amortized)', default: 350, hint: 'Rent before you buy. School-owned tubas beat purchased ones.' },
      { key: 'supplies',      label: 'Reeds, oils, sticks, repairs',   default: 150,  hint: 'Reed players burn money monthly. Brass players smirk.' },
      { key: 'shoes-gloves',  label: 'Marching shoes + gloves',        default: 60 },
      { key: 'band-camp',     label: 'Band camp',                      default: 200 },
      { key: 'trip',          label: 'Big trip fund',                  default: 400,  hint: 'The every-other-year trip is its own budget. Disney does not discount for woodwinds.', hideable: true },
      { key: 'private-lessons', label: 'Private lessons',              default: 600,  hideable: true },
    ],
    sources: MUSIC_SOURCES,
    sourceNote: 'Marching band fair share fees are posted by most booster programs and run $300-1,500 by program size. Add instrument rental, reeds, shoes, and camp and the national middle sits between $500 and $1,500 before the big trip.',
  },
  { sport: 'band', level: 'travel', estimatedGames: 8,
    lines: [
      { key: 'participation-fee', label: 'Indoor/honor ensemble fee',  default: 1200, hint: 'WGI indoor percussion and winter guard fees run $800-2,000.' },
      { key: 'supplies',      label: 'Reeds, sticks, heads, repairs',  default: 200 },
      { key: 'uniform',       label: 'Uniform/costume + shoes',        default: 150 },
      { key: 'instrument-upkeep', label: 'Instrument upgrade/upkeep',  default: 300,  hideable: true },
      { key: 'travel-shows',  label: 'Travel for regionals/championships', default: 800, hideable: true },
      { key: 'private-lessons', label: 'Private lessons',              default: 900,  hint: 'Auditioned ensembles assume them.', hideable: true },
    ],
    sources: MUSIC_SOURCES,
    sourceNote: 'The competitive winter circuit (WGI indoor percussion, winter guard, auditioned honor ensembles) charges participation fees of $800-2,000 and travels to regionals. Private lessons stop being optional once the ensemble is auditioned.',
  },

  // Choir: the cheapest activity on this list until the spring tour bus pulls up.
  { sport: 'choir', level: 'school', estimatedGames: 8,
    lines: [
      { key: 'choir-fee',     label: 'Choir program fee',              default: 75 },
      { key: 'attire',        label: 'Concert dress or tux',           default: 150,  hint: 'Hemmed once, worn for years if the kid stops growing. They will not stop growing.' },
      { key: 'shoes',         label: 'Concert shoes',                  default: 50 },
      { key: 'folder-music',  label: 'Folder + music fee',             default: 30 },
      { key: 'tickets',       label: 'Concert tickets for family',     default: 60,   hideable: true },
      { key: 'tour',          label: 'Festival/tour trip',             default: 300,  hideable: true },
      { key: 'voice-lessons', label: 'Voice lessons',                  default: 500,  hideable: true },
    ],
    sources: MUSIC_SOURCES,
    sourceNote: 'School choir is $150-500 a year: a program fee, the concert dress or tux, shoes, and a folder fee. The festival or tour trip is the one line that can triple the total, and it shows up on a permission slip with three weeks notice.',
  },
  { sport: 'choir', level: 'travel', estimatedGames: 14,
    lines: [
      { key: 'tuition',       label: 'Auditioned choir tuition/fees',  default: 450,  hint: 'Community and honor choirs charge annual tuition.' },
      { key: 'tour',          label: 'Tour travel',                    default: 900,  hint: 'Spring tour is the budget item. Domestic one year, the rumored international trip the next.' },
      { key: 'attire',        label: 'Performance attire',             default: 200 },
      { key: 'voice-lessons', label: 'Voice lessons',                  default: 700,  hideable: true },
      { key: 'audition-fees', label: 'Honor choir audition fees',      default: 100,  hideable: true },
      { key: 'retreats',      label: 'Retreats/camps',                 default: 150,  hideable: true },
    ],
    sources: MUSIC_SOURCES,
    sourceNote: 'Auditioned community and honor choirs post tuition of $300-600 a year. Tour travel is the real number: a domestic spring tour runs $600-1,200 per singer and the international year doubles it. Ask about the tour cycle at the audition, not after.',
  },

  // Ballet: three different sports wearing the same shoes. The tier decides the bill.
  { sport: 'ballet', level: 'rec', estimatedGames: 3,
    lines: [
      { key: 'tuition',       label: 'Studio tuition (× 9 months)',    default: 1080, hint: 'One or two classes a week at $90-130/month.' },
      { key: 'shoes',         label: 'Ballet slippers',                default: 80,   hint: 'They wear out faster than sneakers.' },
      { key: 'dancewear',     label: 'Leotards + tights',              default: 120 },
      { key: 'costume',       label: 'Recital costume',                default: 90 },
      { key: 'recital-fee',   label: 'Recital fee + tickets',          default: 120,  hideable: true },
      { key: 'summer-camp',   label: 'Summer dance camp',              default: 200,  hideable: true },
    ],
    sources: BALLET_SOURCES,
    sourceNote: 'Rec ballet at a neighborhood studio runs $1,000-2,000 a year: monthly tuition for one or two classes, slippers, dancewear, and the recital package. Studio rate sheets are public and consistent nationally.',
  },
  { sport: 'ballet', level: 'travel', estimatedGames: 6,
    lines: [
      { key: 'tuition',       label: 'Studio tuition (× 10 months)',   default: 3600, hint: 'Serious-track students dance 4-6 days a week at $300-450/month.' },
      { key: 'pointe-shoes',  label: 'Pointe shoes',                   default: 600,  hint: '$90-120 a pair. A serious dancer goes through five or more a year.' },
      { key: 'dancewear',     label: 'Leotards, tights, warmups',      default: 250 },
      { key: 'production-fee', label: 'Nutcracker/production fees',    default: 400 },
      { key: 'costume',       label: 'Costumes',                       default: 200 },
      { key: 'summer-intensive', label: 'Summer intensive',            default: 1200, hint: 'Audition-based programs run $1,000-3,000 before housing.', hideable: true },
      { key: 'competition-fees', label: 'Competition fees (YAGP etc.)', default: 400, hideable: true },
      { key: 'travel-comps',  label: 'Travel for competitions/auditions', default: 500, hideable: true },
      { key: 'tickets',       label: 'Performance tickets for family', default: 100,  hideable: true },
    ],
    sources: BALLET_SOURCES,
    sourceNote: 'The serious-studio tier runs $3,000-6,000: tuition for 4-6 days a week, pointe shoes on a replacement cycle nobody warns you about, production fees, and the summer intensive audition season. YAGP posts competition fees publicly.',
  },
  { sport: 'ballet', level: 'elite', estimatedGames: 12,
    lines: [
      { key: 'tuition',       label: 'Pre-professional tuition',       default: 6500, hint: '15-25 hours a week in the studio. Company-school rates posted annually.' },
      { key: 'pointe-shoes',  label: 'Pointe shoes',                   default: 1500, hint: 'A pair every two to three weeks in heavy seasons. Some schools subsidize. Most do not.' },
      { key: 'summer-intensive', label: 'Summer intensive + housing',  default: 3500, hint: 'Five or six weeks at a company school. Tuition plus housing plus the flight.' },
      { key: 'dancewear',     label: 'Dancewear + warmups',            default: 400 },
      { key: 'production-fee', label: 'Production/performance fees',   default: 500 },
      { key: 'competition-fees', label: 'YAGP/competition fees',       default: 800,  hideable: true },
      { key: 'travel-auditions', label: 'Travel for auditions',        default: 900,  hint: 'Company and intensive auditions cluster in January. So does the travel.', hideable: true },
      { key: 'pt-bodywork',   label: 'PT and body work',               default: 600,  hideable: true },
      { key: 'private-coaching', label: 'Private coaching',            default: 1000, hideable: true },
    ],
    sources: BALLET_SOURCES,
    sourceNote: 'Pre-professional ballet is the most expensive activity in this calculator short of elite hockey: $8,000-15,000 a year between company-school tuition, a pointe shoe habit, and the mandatory summer intensive. The numbers come from posted company-school rate sheets and YAGP fee schedules.',
  },
];

export function getProfile(sport: string, level: CostProfile['level']): CostProfile {
  return (
    PROFILES.find(p => p.sport === sport && p.level === level) ??
    PROFILES.find(p => p.sport === 'generic' && p.level === level)!
  );
}
