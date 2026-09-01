export interface RouteDefinition {
  number: number | string;
  name: string;
  nameFi: string;
  depth: string;
  breakDirection: 'Inside' | 'Outside' | 'Vertical' | 'Comeback' | 'Behind LOS';
  description: string;
  descriptionFi: string;
  technique: string;
  beaterAgainst: string;
  color: string;
}

export const ROUTE_TREE: RouteDefinition[] = [
  {
    number: 0,
    name: 'Hitch / Smoke / Bubble',
    nameFi: 'Pysähdys / Bubble-kuvio',
    depth: '0-5 yds',
    breakDirection: 'Inside',
    description: 'Immediate quick step back towards quarterback or fast turnaround behind the line of scrimmage.',
    descriptionFi: 'Välitön nopea kääntyminen rintamasuunta kohti pelinrakentajaa aloituslinjan takana tai 4-5 jaardissa.',
    technique: 'Catch ball on the turn, immediately tuck and turn upfield outside.',
    beaterAgainst: 'Off-coverage corners with soft cushions.',
    color: '#38bdf8', // light sky
  },
  {
    number: 1,
    name: 'Flat / Quick Out',
    nameFi: 'Sivurakukuvio (Flat)',
    depth: '3-5 yds',
    breakDirection: 'Outside',
    description: 'Fast 3-step burst then an immediate 90-degree sprint toward the sideline into the flat.',
    descriptionFi: 'Nopea 3 askeleen ryntäys ja 90 asteen leikkaus sivurajalle venyttäen puolustuksen litteää aluetta.',
    technique: 'Push vertical to 3 yards, plant inside foot and sprint flat to the boundary.',
    beaterAgainst: 'Cover 3 deep drop, underneath vacated zones.',
    color: '#06b6d4', // cyan
  },
  {
    number: 2,
    name: 'Slant',
    nameFi: 'Viistokuvio (Slant)',
    depth: '3-5 yds',
    breakDirection: 'Inside',
    description: 'Hard 3-step vertical push followed by an aggressive 45-degree cut across the middle.',
    descriptionFi: 'Kolme voimakasta pystyaskelta ja terävä 45 asteen kulmaleikkaus kentän keskustaan.',
    technique: 'Drive through defender outside shoulder, hard plant on outside foot, flatten angle if zone.',
    beaterAgainst: 'Cover 1 Man, Cover 0 Blitz, inside leverage vacating linebackers.',
    color: '#10b981', // emerald
  },
  {
    number: 3,
    name: 'Comeback / Deep Out',
    nameFi: 'Paluukuvio sivurajalle (Comeback)',
    depth: '10-12 yds',
    breakDirection: 'Comeback',
    description: 'Drive hard vertical to 12-14 yards selling the Go route, sink hips and snap back 45 degrees toward sideline.',
    descriptionFi: 'Eteneminen syvälle uhaten pitkää pystykuviota, lantion pudotus ja 45 asteen paluu viistosti sivurajaa kohti.',
    technique: 'Violent hip drop, chop steps at 12 yards, come back down the stem towards the quarterback.',
    beaterAgainst: 'Deep-bailing cornerbacks respecting the deep ball in Cover 3 & Cover 4.',
    color: '#84cc16', // lime
  },
  {
    number: 4,
    name: 'Curl / Hitch',
    nameFi: 'Koukkukuvio (Curl / Hook)',
    depth: '10-12 yds',
    breakDirection: 'Comeback',
    description: 'Sprint 10-12 yards upfield, sink hips and turn directly back 180 degrees toward the quarterback.',
    descriptionFi: 'Juoksu 10-12 jaardiin ja täysi 180 asteen käännös suoraan pelinrakentajaa kohti heittoikkunaan.',
    technique: 'Push safety or corner deep, snap down, present chest and numbers to QB in window.',
    beaterAgainst: 'Zone coverage between linebackers and safeties.',
    color: '#eab308', // yellow
  },
  {
    number: 5,
    name: 'Out / Speed Out',
    nameFi: 'Ulkokuvio (Out)',
    depth: '10-12 yds',
    breakDirection: 'Outside',
    description: 'Drive 10-12 yards vertically, plant inside foot and make a crisp 90-degree lateral cut to the sideline.',
    descriptionFi: 'Suora juoksu 10-12 jaardiin ja puhdas 90 asteen leikkaus sivurajalle.',
    technique: 'Attack defender inside hip, sharp break to sideline, maintain flat angle without drifting backwards.',
    beaterAgainst: 'Cover 2 Soft Corner, Cover 4 Off-Man.',
    color: '#f97316', // orange
  },
  {
    number: 6,
    name: 'In / Dig',
    nameFi: 'Sisäkuvio (In / Dig)',
    depth: '10-12 yds',
    breakDirection: 'Inside',
    description: 'Drive 10-12 yards deep, plant outside foot and break 90 degrees square across the field over the middle.',
    descriptionFi: 'Syvä juoksu 10-12 jaardiin ja suorakulmainen 90 asteen leikkaus kentän poikki tukimiesten taakse.',
    technique: 'Sell vertical stem to push safety, square off break across the field, find soft spot vs zone.',
    beaterAgainst: 'Cover 3 seam void, Cover 2 middle hole.',
    color: '#ef4444', // red
  },
  {
    number: 7,
    name: 'Corner / Flag',
    nameFi: 'Kulmalippukuvio (Corner / Flag)',
    depth: '10-12 yds',
    breakDirection: 'Outside',
    description: 'Drive 10-12 yards, nod/fake inside toward post, then break at 45 degrees towards the back corner pylon.',
    descriptionFi: 'Eteneminen 10-12 jaardiin, nopea sisähämäys ja 45 asteen leikkaus kohti maalialueen takakulmaa.',
    technique: 'Head fake inside to freeze safety, explode outside at 45 degree angle to pylon.',
    beaterAgainst: 'Cover 2 (attacks hole between safety & corner), Cover 3 outside.',
    color: '#ec4899', // pink
  },
  {
    number: 8,
    name: 'Post',
    nameFi: 'Maalitolppakuvio (Post)',
    depth: '12-15 yds',
    breakDirection: 'Inside',
    description: 'Drive 12-15 yards deep, fake corner and break at 45 degrees across the deep middle toward the goalposts.',
    descriptionFi: 'Syvä rynnistys 12-15 jaardiin ja terävä 45 asteen leikkaus kohti kentän keskustan maalitolppia.',
    technique: 'Outside stem stem release, step on toes of safety, break inside crossing the safety face.',
    beaterAgainst: 'Cover 2 deep middle split, Cover 4 safety inside cushion.',
    color: '#a855f7', // purple
  },
  {
    number: 9,
    name: 'Go / Streak / Fly',
    nameFi: 'Syvä suora pystykuvio (Go / Streak)',
    depth: '15+ yds',
    breakDirection: 'Vertical',
    description: 'All-out vertical sprint up the sideline or slot seam stretching the defense to the endzone.',
    descriptionFi: 'Täyden vauhdin pystysuora sprintti syvälle kentän laitaa tai saumaa pitkin.',
    technique: 'Explode off line, stack on top of defender hip, track ball over outside shoulder.',
    beaterAgainst: 'Cover 0 blitz (no safety help), Cover 1 single high with outside leverage.',
    color: '#6366f1', // indigo
  },
];
