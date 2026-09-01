import { RosterPlayer } from '../types';

export const LOCAL_STORAGE_ROSTER_KEY = 'gridiron_7v7_team_roster';
export const LOCAL_STORAGE_TOKEN_MODE_KEY = 'gridiron_7v7_token_mode';
export const LOCAL_STORAGE_TEAM_INFO_KEY = 'gridiron_7v7_team_info';

export interface TeamInfo {
  teamName: string;
  headCoach: string;
  offensiveCoordinator: string;
  primaryColor: string;
  secondaryColor: string;
}

export const DEFAULT_TEAM_INFO: TeamInfo = {
  teamName: 'Apex 7v7 All-Stars',
  headCoach: 'Coach Miller',
  offensiveCoordinator: 'Coach Reynolds',
  primaryColor: '#2563eb',
  secondaryColor: '#f59e0b',
};

// 7 Offensive Field Slots standard for 7v7 football
export const OFFENSIVE_SLOTS: { id: string; name: string; shortDesc: string; recommendedPos: string[] }[] = [
  { id: 'QB', name: 'Quarterback', shortDesc: 'Field General & Distributor', recommendedPos: ['QB'] },
  { id: 'C', name: 'Center / Snapper', shortDesc: 'Snapper & Intermediate Outlet', recommendedPos: ['C', 'TE', 'WR'] },
  { id: 'X', name: 'Outside Receiver (X / Solo)', shortDesc: 'Boundary / Iso Deep Threat', recommendedPos: ['WR'] },
  { id: 'Z', name: 'Outside Receiver (Z / Flanker)', shortDesc: 'Field / Motion Receiver', recommendedPos: ['WR', 'SLOT'] },
  { id: 'H', name: 'Slot Receiver (H)', shortDesc: 'Inside Option / Whip Specialist', recommendedPos: ['SLOT', 'WR', 'RB'] },
  { id: 'Y', name: 'Slot Receiver / TE (Y)', shortDesc: 'Seam / Crosser / Big Body Target', recommendedPos: ['SLOT', 'TE', 'WR'] },
  { id: 'RB', name: 'Running Back / HB', shortDesc: 'Backfield Matchup & Checkdown', recommendedPos: ['RB', 'ATH'] },
];

export const DEFAULT_ROSTER: RosterPlayer[] = [
  {
    id: 'p-qb-15',
    name: 'Patrick Mahomes',
    jerseyNumber: '15',
    primaryPosition: 'QB',
    assignedSlot: 'QB',
    status: 'starter',
    speedRating: 88,
    handsRating: 95,
    notes: 'Elite field vision, sidearm releases, deep ball precision on 8 & 9 routes.',
    avatarColor: '#dc2626',
  },
  {
    id: 'p-c-52',
    name: 'Jason Kelce',
    jerseyNumber: '52',
    primaryPosition: 'C',
    assignedSlot: 'C',
    status: 'starter',
    speedRating: 84,
    handsRating: 88,
    notes: 'Fast shotgun snap release, reliable 5-yard delayed sit route.',
    avatarColor: '#475569',
  },
  {
    id: 'p-x-18',
    name: 'Justin Jefferson',
    jerseyNumber: '18',
    primaryPosition: 'WR',
    assignedSlot: 'X',
    status: 'starter',
    speedRating: 95,
    handsRating: 98,
    notes: 'Boundary technician. Master of the 7-corner and 8-post double move.',
    avatarColor: '#7c3aed',
  },
  {
    id: 'p-z-10',
    name: 'Tyreek Hill',
    jerseyNumber: '10',
    primaryPosition: 'WR',
    assignedSlot: 'Z',
    status: 'starter',
    speedRating: 99,
    handsRating: 93,
    notes: 'Speed burner. Highest win rate on 9-go streaks and jet sweep motions.',
    avatarColor: '#0284c7',
  },
  {
    id: 'p-h-1',
    name: "Ja'Marr Chase",
    jerseyNumber: '1',
    primaryPosition: 'SLOT',
    assignedSlot: 'H',
    status: 'starter',
    speedRating: 96,
    handsRating: 97,
    notes: 'Physical slot separator. Excels on quick slants, drags, and whip routes.',
    avatarColor: '#059669',
  },
  {
    id: 'p-y-87',
    name: 'Travis Kelce',
    jerseyNumber: '87',
    primaryPosition: 'TE',
    assignedSlot: 'Y',
    status: 'starter',
    speedRating: 89,
    handsRating: 98,
    notes: 'Mismatch vs Linebackers and Safeties. Zone-finder in Middle Hook areas.',
    avatarColor: '#ea580c',
  },
  {
    id: 'p-rb-23',
    name: 'Christian McCaffrey',
    jerseyNumber: '23',
    primaryPosition: 'RB',
    assignedSlot: 'RB',
    status: 'starter',
    speedRating: 94,
    handsRating: 96,
    notes: 'Elite route runner out of backfield. Angle, Texas, and Wheel route maestro.',
    avatarColor: '#9333ea',
  },
  // Reserves / Backups
  {
    id: 'p-qb-8',
    name: 'Lamar Jackson',
    jerseyNumber: '8',
    primaryPosition: 'QB',
    assignedSlot: null,
    status: 'substitute',
    speedRating: 97,
    handsRating: 90,
    notes: 'Dynamic rollout mobility and sudden sideline darts.',
    avatarColor: '#1d4ed8',
  },
  {
    id: 'p-wr-11',
    name: 'A.J. Brown',
    jerseyNumber: '11',
    primaryPosition: 'WR',
    assignedSlot: null,
    status: 'substitute',
    speedRating: 94,
    handsRating: 95,
    notes: 'YAC monster on mesh drags and quick slants.',
    avatarColor: '#0d9488',
  },
  {
    id: 'p-wr-14',
    name: 'Amon-Ra St. Brown',
    jerseyNumber: '14',
    primaryPosition: 'SLOT',
    assignedSlot: null,
    status: 'substitute',
    speedRating: 92,
    handsRating: 98,
    notes: 'Consistent 3rd-down chains mover on 5-out and curl sits.',
    avatarColor: '#0891b2',
  },
  {
    id: 'p-rb-24',
    name: 'Derrick Henry',
    jerseyNumber: '24',
    primaryPosition: 'RB',
    assignedSlot: null,
    status: 'substitute',
    speedRating: 90,
    handsRating: 85,
    notes: 'Power runner for redzone sprint draws and flat releases.',
    avatarColor: '#4f46e5',
  },
  {
    id: 'p-c-77',
    name: 'Creed Humphrey',
    jerseyNumber: '77',
    primaryPosition: 'C',
    assignedSlot: null,
    status: 'substitute',
    speedRating: 82,
    handsRating: 86,
    notes: 'Flawless snap accuracy and immediate pass pro anchor.',
    avatarColor: '#64748b',
  },
];

export const ROSTER_PRESETS: { name: string; description: string; roster: RosterPlayer[] }[] = [
  {
    name: 'NFL All-Pro 7v7',
    description: 'Premier pro stars with specialized route archetypes and attributes.',
    roster: DEFAULT_ROSTER,
  },
  {
    name: 'College Showcase Squad',
    description: 'High-octane collegiate roster emphasizing vertical speed and slot spacing.',
    roster: [
      {
        id: 'c-qb-7',
        name: 'Cam Ward',
        jerseyNumber: '7',
        primaryPosition: 'QB',
        assignedSlot: 'QB',
        status: 'starter',
        speedRating: 91,
        handsRating: 92,
        notes: 'Gunslinger arm with quick pocket escape.',
        avatarColor: '#dc2626',
      },
      {
        id: 'c-c-55',
        name: 'Tyler Booker',
        jerseyNumber: '55',
        primaryPosition: 'C',
        assignedSlot: 'C',
        status: 'starter',
        speedRating: 80,
        handsRating: 85,
        notes: 'Reliable pivot snap and quick check.',
        avatarColor: '#475569',
      },
      {
        id: 'c-x-2',
        name: 'Travis Hunter',
        jerseyNumber: '2',
        primaryPosition: 'WR',
        assignedSlot: 'X',
        status: 'starter',
        speedRating: 97,
        handsRating: 99,
        notes: 'Unstoppable 50/50 ball winner on boundary fades.',
        avatarColor: '#7c3aed',
      },
      {
        id: 'c-z-4',
        name: 'Tetairoa McMillan',
        jerseyNumber: '4',
        primaryPosition: 'WR',
        assignedSlot: 'Z',
        status: 'starter',
        speedRating: 93,
        handsRating: 97,
        notes: 'High-point catch radius on 8-post routes.',
        avatarColor: '#0284c7',
      },
      {
        id: 'c-h-3',
        name: 'Luther Burden III',
        jerseyNumber: '3',
        primaryPosition: 'SLOT',
        assignedSlot: 'H',
        status: 'starter',
        speedRating: 96,
        handsRating: 95,
        notes: 'Explosive separation off the line on tunnel screens and option routes.',
        avatarColor: '#059669',
      },
      {
        id: 'c-y-6',
        name: 'Colston Loveland',
        jerseyNumber: '6',
        primaryPosition: 'TE',
        assignedSlot: 'Y',
        status: 'starter',
        speedRating: 90,
        handsRating: 96,
        notes: 'Seam splitter with soft hands over linebackers.',
        avatarColor: '#ea580c',
      },
      {
        id: 'c-rb-0',
        name: 'Ashton Jeanty',
        jerseyNumber: '0',
        primaryPosition: 'RB',
        assignedSlot: 'RB',
        status: 'starter',
        speedRating: 96,
        handsRating: 94,
        notes: 'Unbelievable contact balance and wheel route acceleration.',
        avatarColor: '#9333ea',
      },
    ],
  },
  {
    name: 'Youth Flag Football Academy',
    description: 'Youth developmental 7v7 squad with simple numbering and balanced skillsets.',
    roster: [
      {
        id: 'y-qb-12',
        name: 'Mason Davis',
        jerseyNumber: '12',
        primaryPosition: 'QB',
        assignedSlot: 'QB',
        status: 'starter',
        speedRating: 85,
        handsRating: 88,
        notes: 'Consistent 1-step drops and quick delivery.',
        avatarColor: '#dc2626',
      },
      {
        id: 'y-c-50',
        name: 'Leo Chen',
        jerseyNumber: '50',
        primaryPosition: 'C',
        assignedSlot: 'C',
        status: 'starter',
        speedRating: 80,
        handsRating: 85,
        notes: 'Great snapping technique and immediate heads-up awareness.',
        avatarColor: '#475569',
      },
      {
        id: 'y-x-81',
        name: 'Alex Johnson',
        jerseyNumber: '81',
        primaryPosition: 'WR',
        assignedSlot: 'X',
        status: 'starter',
        speedRating: 90,
        handsRating: 89,
        notes: 'Runs crisp 5-yard out routes and comeback stems.',
        avatarColor: '#7c3aed',
      },
      {
        id: 'y-z-88',
        name: 'Jordan Brooks',
        jerseyNumber: '88',
        primaryPosition: 'WR',
        assignedSlot: 'Z',
        status: 'starter',
        speedRating: 92,
        handsRating: 88,
        notes: 'Go-route speed down the right sideline.',
        avatarColor: '#0284c7',
      },
      {
        id: 'y-h-13',
        name: 'Sammy Miller',
        jerseyNumber: '13',
        primaryPosition: 'SLOT',
        assignedSlot: 'H',
        status: 'starter',
        speedRating: 91,
        handsRating: 92,
        notes: 'Quick feet on shallow cross and drag routes.',
        avatarColor: '#059669',
      },
      {
        id: 'y-y-84',
        name: 'Ethan Wright',
        jerseyNumber: '84',
        primaryPosition: 'TE',
        assignedSlot: 'Y',
        status: 'starter',
        speedRating: 87,
        handsRating: 90,
        notes: 'Reliable target on curl routes over the middle.',
        avatarColor: '#ea580c',
      },
      {
        id: 'y-rb-22',
        name: 'Carter Hayes',
        jerseyNumber: '22',
        primaryPosition: 'RB',
        assignedSlot: 'RB',
        status: 'starter',
        speedRating: 91,
        handsRating: 89,
        notes: 'Quick swing and flat release out of backfield.',
        avatarColor: '#9333ea',
      },
    ],
  },
];

// Helper: load roster from localStorage or fallback to default
export function loadRosterFromStorage(): RosterPlayer[] {
  if (typeof window === 'undefined') return DEFAULT_ROSTER;
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_ROSTER_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load roster from storage', err);
  }
  return DEFAULT_ROSTER;
}

// Helper: save roster to localStorage
export function saveRosterToStorage(roster: RosterPlayer[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_ROSTER_KEY, JSON.stringify(roster));
  } catch (err) {
    console.error('Failed to save roster to storage', err);
  }
}

// Helper: load team info
export function loadTeamInfoFromStorage(): TeamInfo {
  if (typeof window === 'undefined') return DEFAULT_TEAM_INFO;
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_TEAM_INFO_KEY);
    if (saved) {
      return { ...DEFAULT_TEAM_INFO, ...JSON.parse(saved) };
    }
  } catch {
    // fallback
  }
  return DEFAULT_TEAM_INFO;
}

export function saveTeamInfoToStorage(info: TeamInfo): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_TEAM_INFO_KEY, JSON.stringify(info));
  } catch {
    // ignore
  }
}

// Helper: load token display mode
export function loadTokenModeFromStorage(): 'jersey' | 'name' | 'both' | 'position' {
  if (typeof window === 'undefined') return 'jersey';
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_TOKEN_MODE_KEY);
    if (saved && ['jersey', 'name', 'both', 'position'].includes(saved)) {
      return saved as 'jersey' | 'name' | 'both' | 'position';
    }
  } catch {
    // fallback
  }
  return 'jersey';
}

export function saveTokenModeToStorage(mode: 'jersey' | 'name' | 'both' | 'position'): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_TOKEN_MODE_KEY, mode);
  } catch {
    // ignore
  }
}

// Helper: map slot key (e.g. 'QB', 'X', 'Z', 'H', 'Y', 'C', 'RB') to assigned player
export function getPlayerAssignedToSlot(
  slotKey: string,
  roster: RosterPlayer[]
): RosterPlayer | undefined {
  // Normalize slotKey (e.g., 'HB' -> 'RB')
  const normalizedKey = slotKey === 'HB' ? 'RB' : slotKey;

  // 1. Direct match on assignedSlot
  const directMatch = roster.find((p) => p.assignedSlot === normalizedKey || p.assignedSlot === slotKey);
  if (directMatch) return directMatch;

  // 2. Fallback by position if starter
  const positionMatch = roster.find(
    (p) =>
      p.status === 'starter' &&
      ((normalizedKey === 'QB' && p.primaryPosition === 'QB') ||
        (normalizedKey === 'C' && p.primaryPosition === 'C') ||
        (normalizedKey === 'RB' && p.primaryPosition === 'RB') ||
        (normalizedKey === 'X' && p.primaryPosition === 'WR') ||
        (normalizedKey === 'Z' && p.primaryPosition === 'WR') ||
        (normalizedKey === 'H' && p.primaryPosition === 'SLOT') ||
        (normalizedKey === 'Y' && (p.primaryPosition === 'TE' || p.primaryPosition === 'SLOT')))
  );

  return positionMatch;
}
