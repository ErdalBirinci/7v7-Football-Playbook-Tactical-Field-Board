export type FormationCategory =
  | 'TRIPS PASS'
  | 'TRIPS RUN'
  | 'TWINS PASS'
  | 'TWINS RUN'
  | 'EMPTY PASS'
  | 'EMPTY RUN'
  | '2 LINE PASS'
  | '2 LINE RUN'
  | '1 LINE PASS'
  | '1 LINE RUN'
  | 'SPLIT PASS'
  | 'SPLIT RUN';

export type PlayType = 'PASS' | 'RUN' | 'SCREEN' | 'PLAY_ACTION' | 'RPO' | 'REVERSE';

export type Direction = 'RIGHT' | 'LEFT' | 'BALANCED';

export interface RoutePoint {
  x: number; // 0 (left sideline) to 100 (right sideline)
  y: number; // 0 (endzone top) to 100 (back of backfield). Line of Scrimmage is at y = 65
  type?: 'snap' | 'stem' | 'break' | 'target' | 'block' | 'motion' | 'handicap' | 'fake';
  label?: string;
}

export interface PlayerRoute {
  name: string; // e.g. "9 - Go / Streak", "Quick Slant", "Wheel", "Dual Slot Block", "Lead Block"
  routeNumber?: number | string;
  points: RoutePoint[];
  color?: string;
  isPrimary?: boolean;
  isSecondary?: boolean;
  isCheckdown?: boolean;
  isBlocking?: boolean;
  isBallCarrier?: boolean;
  isFake?: boolean;
  notes?: string;
}

export interface PlayerAssignment {
  id: string; // 'QB', 'C', 'X', 'Z', 'H', 'Y', 'RB', 'HB'
  label: string; // e.g. 'QB', 'X (SOLO)', 'Z (WR)', 'H (SLOT)', 'Y (SLOT)', 'RB'
  positionName: string; // 'Quarterback', 'Outside Receiver', 'Slot Receiver', 'Running Back'
  initialPos: { x: number; y: number };
  motion?: {
    startPos: { x: number; y: number };
    endPos: { x: number; y: number };
    type: 'orbit' | 'jet' | 'across' | 'shift' | 'return';
    fakeAction?: string;
  };
  route: PlayerRoute;
  roleDescription: string;
}

export interface ProgressionRead {
  order: number; // 1, 2, 3, 4
  playerId: string;
  concept: string; // e.g. "Primary deep post read vs high safety"
  cue: string; // e.g. "If Corner bites on Flat, hit 8 Post behind him"
}

export interface Play {
  id: string;
  playNumber: string | number;
  code: string; // Original code from playbook, e.g. "97. TRIPS RIGHT 1 7 8"
  englishName: string; // e.g. "Trips Right - Out / Corner / Post (Smash-Post Concept)"
  originalTurkishCode: string;
  category: FormationCategory;
  playType: PlayType;
  direction: Direction;
  formationName: string;
  conceptName: string;
  tags: string[];
  description: string;
  coachingPoints: string[];
  progressionReads: ProgressionRead[];
  qbDrop: 'Shotgun 3-Step' | 'Shotgun 5-Step' | 'Quick 1-Step' | 'Rollout Right' | 'Rollout Left' | 'Play Action Mesh' | 'QB Keep';
  players: Record<string, PlayerAssignment>;
}

export interface DefensivePlayer {
  id: string;
  label: string;
  name: string;
  initialPos: { x: number; y: number };
  coverageType: 'man' | 'deep_third' | 'deep_half' | 'flat' | 'hook_curl' | 'blitz' | 'spy';
  targetOffensivePlayerId?: string;
  zoneArea?: {
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
  };
}

export interface DefenseScheme {
  id: string;
  name: string;
  shortName: string;
  description: string;
  weakness: string;
  strength: string;
  players: DefensivePlayer[];
}
