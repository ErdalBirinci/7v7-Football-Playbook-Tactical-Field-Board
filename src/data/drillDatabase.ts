import { Play, PlayerAssignment } from '../types';

export interface PracticeDrill {
  id: string;
  name: string;
  category: 'ROUTE_PRECISION' | 'COMBO_SKELETON' | 'QB_MECHANICS' | 'SCREEN_RUN' | 'SITUATIONAL_7V7';
  targetRoutes: string[]; // e.g. ['0', 'HITCH'], ['1', 'FLAT'], ['2', 'SLANT'], ['7', 'CORNER'], ['8', 'POST'], etc.
  targetPositions: ('QB' | 'WR' | 'SLOT' | 'RB' | 'TE' | 'C' | 'DB')[];
  difficulty: 'Youth / Novice' | 'High School / Varsity' | 'Advanced / Competitive';
  estimatedMinutes: number;
  repCount: string;
  equipment: string[];
  fieldSetup: string;
  objective: string;
  stepByStep: string[];
  qbCoachingKey: string;
  receiverCoachingKey: string;
  commonMistakes: string[];
  variations: string[];
  diagramType: 'single-route' | 'hi-lo-combo' | 'qb-drop' | 'mesh-cross' | 'screen-train' | 'rpo-box';
}

export const DRILL_DATABASE: PracticeDrill[] = [
  // 1. Slant (Route 2)
  {
    id: 'drill-slant-drive-plant',
    name: '3-Step Slant Drive & 45° Hard Plant Drill',
    category: 'ROUTE_PRECISION',
    targetRoutes: ['2', 'SLANT'],
    targetPositions: ['WR', 'SLOT', 'QB'],
    difficulty: 'High School / Varsity',
    estimatedMinutes: 8,
    repCount: '6 reps per receiver (3 left side, 3 right side)',
    equipment: ['4 Agility Cones', '4 Footballs', '1 Agile Hand Shield (optional)'],
    fieldSetup: 'Place Line of Scrimmage cone at Yard 20. Place a "Stem Cone" 4 yards downfield. Place a "Catch Cone" 8 yards inside at a 45-degree angle.',
    objective: 'Master violent 3-step vertical push to threaten outside defender leverage, execute an explosive outside-foot plant, and accelerate into the throwing window before linebackers can sink.',
    stepByStep: [
      'WR aligns in 2-point stance with inside foot up. QB takes 3-step shotgun drop.',
      'On "Set-Hut", WR fires off with low pad level, taking 3 aggressive steps directly at the defender\'s outside shoulder.',
      'On Step 3 (outside foot), stick foot firmly in ground with toes pointed at 45 degrees, sink hips 2 inches.',
      'Rip inside arm through defender\'s reach and cross face across field at 45 degrees without rounding.',
      'Catch ball in stride with diamond hands away from chest and tuck under outside arm immediately.',
    ],
    qbCoachingKey: 'Hit the 3rd step of your drop, plant back foot, and drive the ball on receiver\'s upfield chest number. Do not double-clutch.',
    receiverCoachingKey: 'Never round the break. Stick the outside cleat hard into the turf and snap your eyes immediately to the quarterback.',
    commonMistakes: [
      'Rounding the cut into a banana shape instead of a sharp 45° angle.',
      'Peeking at the quarterback before completing the break step.',
      'Slowing down approaching the break point instead of bursting through it.',
    ],
    variations: [
      'Add a coach holding an agile shield on the slant stem to simulate press contact.',
      'Instruct receiver to flatten angle if middle linebacker drops into zone hook window.',
    ],
    diagramType: 'single-route',
  },

  // 2. Smash Concept / Corner + Hitch/Flat (Routes 7, 0, 1)
  {
    id: 'drill-smash-hi-lo-timing',
    name: 'Smash Concept Hi-Lo Boundary Conflict Drill',
    category: 'COMBO_SKELETON',
    targetRoutes: ['7', 'CORNER', '0', 'HITCH', '1', 'FLAT'],
    targetPositions: ['WR', 'SLOT', 'QB', 'DB'],
    difficulty: 'High School / Varsity',
    estimatedMinutes: 10,
    repCount: '8 reps total (4 vs Cover 2, 4 vs Cover 3)',
    equipment: ['5 Cones', '6 Footballs', '1 Stand-in Cornerback / Defender'],
    fieldSetup: 'Align Outside WR at #1 and Slot WR at #2. Set a cone at 5 yards for the Hitch/Speed Out and a cone at 14 yards towards the sideline for the 7 Corner break.',
    objective: 'Train outside and inside receiver tandem to put the boundary cornerback in an impossible high-low dilemma while the QB reads the CB\'s hip orientation on the 3-step drop.',
    stepByStep: [
      'Outside WR runs 5-yard Hitch/Flat (Low read). Inside Slot WR pushes vertical to 10 yards, then breaks 45° to the corner pylon (High read).',
      'Coach/Defender plays Cornerback with variable coverage (squats on Hitch OR bails deep with Corner).',
      'QB takes 3-step drop, eyes locked onto the Cornerback\'s helmet/hips.',
      'If CB sinks deep with the 7 Corner -> QB instantly rips the 5-yard Hitch underneath.',
      'If CB bites on the Hitch -> QB throws firm touch pass over CB to the 7 Corner at 14-16 yards.',
    ],
    qbCoachingKey: 'Read the Cornerback\'s first 2 steps. If you see his back number (sinking), throw the underneath route immediately on time.',
    receiverCoachingKey: 'Slot receiver: Sell the deep post stem first with inside eyes before snapping outside to the corner at 10 yards.',
    commonMistakes: [
      'Slot running the corner too shallow (under 10 yards), making it easy for one defender to cover both.',
      'Hitch receiver drifting back instead of working back to the football.',
      'QB hesitating and letting safety arrive from middle of field.',
    ],
    variations: [
      'Add a deep half safety to contest the corner route.',
      'Switch the Hitch route to a 3-yard quick flat route against press coverage.',
    ],
    diagramType: 'hi-lo-combo',
  },

  // 3. Post & Seam Drill (Route 8 & Route 9)
  {
    id: 'drill-post-safety-split',
    name: 'Post-Seam Safety Separation & Deep Ball Tracking Drill',
    category: 'ROUTE_PRECISION',
    targetRoutes: ['8', 'POST', '9', 'GO', 'STREAK'],
    targetPositions: ['WR', 'SLOT', 'QB'],
    difficulty: 'Advanced / Competitive',
    estimatedMinutes: 10,
    repCount: '6 reps per receiver at game speed',
    equipment: ['6 Cones', '5 Footballs', '1 Safety Marker / Coach with pad'],
    fieldSetup: 'Set Line of Scrimmage at 25. Place a stem cone at 12 yards and an angle target cone aimed at the goalpost uprights at 20+ yards.',
    objective: 'Develop high-speed vertical stem discipline, aggressive 12-yard inside break across safety leverage, and over-the-shoulder tracking with late hands.',
    stepByStep: [
      'Receiver fires off LOS at 100% speed, maintaining a straight vertical line to 12 yards.',
      'At 12 yards, plant outside foot hard, dip inside shoulder, and angle directly towards the near goalpost upright.',
      'QB takes a rhythm 5-step drop (or 3-step from shotgun with hitch step) and launches with anticipation.',
      'Receiver flashes "late hands" (do not reach until ball is 1 foot away) to prevent defender from raking the catch.',
      'Secure catch, tuck, and finish through the end zone line.',
    ],
    qbCoachingKey: 'Throw the post to a spot 25 yards downfield before the receiver has made his break. Put air under it towards the goalpost.',
    receiverCoachingKey: 'Keep your stride cadence long and fast on the stem. Do not chop steps before the break.',
    commonMistakes: [
      'Breaking the post too flat across the field instead of driving deep towards the goalposts.',
      'Showing hands too early and alerting the trailing defensive back.',
      'Failing to stack the cornerback on the initial vertical stem.',
    ],
    variations: [
      'Skinny Post (Bang 8) vs Cover 2: Break angle adjusted to 25 degrees between the safeties.',
      'Deep Post vs Cover 3: Break angle flattened behind the underneath hook linebackers.',
    ],
    diagramType: 'single-route',
  },

  // 4. Out / Speed Out (Route 1, Route 5, Route 3)
  {
    id: 'drill-speed-out-sideline',
    name: 'Speed Out (5 / 10 Yard) Sideline Toe-Tap Drill',
    category: 'ROUTE_PRECISION',
    targetRoutes: ['1', '5', '3', 'OUT', 'SPEED_OUT', 'COMEBACK'],
    targetPositions: ['WR', 'SLOT', 'QB'],
    difficulty: 'High School / Varsity',
    estimatedMinutes: 8,
    repCount: '6 reps per receiver',
    equipment: ['4 Cones', '4 Footballs', 'Sideline Chalk / Boundary Line'],
    fieldSetup: 'Position receiver 4 yards inside the sideline. Place break cone at 5 yards (Quick Out) or 10 yards (Deep Out).',
    objective: 'Train receivers to execute a crisp 90-degree lateral break toward the sideline, attack the ball in flight, and drag back foot for clean in-bounds catches.',
    stepByStep: [
      'Receiver explodes off line, pushing vertical to the designated depth cone (5 or 10 yards).',
      'Plant inside foot sharply, turn hips violently 90 degrees directly at the sideline marker.',
      'Work 1 yard back downhill toward the line of scrimmage while extending hands.',
      'Catch the football with extended arms, drag trailing toe along boundary line, and secure with two hands.',
    ],
    qbCoachingKey: 'Ball must be thrown as the receiver\'s inside foot hits the turf. Aim at the sideline-facing shoulder.',
    receiverCoachingKey: 'Do not drift downfield on the break! Work flat or slightly back towards the quarterback to deny trailing defenders.',
    commonMistakes: [
      'Drifting upfield on the out route, allowing corner to undercut.',
      'Stepping out of bounds before securing possession of the football.',
      'Catching with body instead of extending hands toward the football.',
    ],
    variations: [
      'Comeback variation: Push to 12 yards, sink hips, and snap back to 10 yards at a 45-degree comeback angle.',
    ],
    diagramType: 'single-route',
  },

  // 5. Mesh / Shallow Cross Collision Avoidance Drill
  {
    id: 'drill-mesh-shallow-crossers',
    name: 'Mesh Concept Shallow Cross Spacing & Rub Drill',
    category: 'COMBO_SKELETON',
    targetRoutes: ['MESH', 'CROSS', 'DRAG', 'SHALLOW'],
    targetPositions: ['WR', 'SLOT', 'TE', 'QB'],
    difficulty: 'Advanced / Competitive',
    estimatedMinutes: 10,
    repCount: '8 reps with swapping inside/outside crossers',
    equipment: ['6 Cones', '5 Footballs', '2 Hand-held Dummy Shields'],
    fieldSetup: 'Align two slot receivers on opposite sides 16 yards apart. Place mesh crossover point cone exactly 5 yards deep over the center.',
    objective: 'Perfect the tight 6-inch rub between two crossing receivers at 5 yards depth, creating natural pick routes against man coverage while finding sitting zones against Cover 2/3.',
    stepByStep: [
      'Right Slot (Under Crosser) stems to 5 yards and crosses underneath the Left Slot.',
      'Left Slot (Over Crosser) stems to 6 yards and passes within high-five distance (6 inches) over the right crosser.',
      'Receivers create a natural rub that strips trailing man-to-man defenders.',
      'If Man Coverage -> Accelerate through the mesh point and sprint across the opposite sideline.',
      'If Zone Coverage -> Settle down in the open window between linebackers and present chest to QB.',
      'QB takes 3-step drop and reads the crossing lanes in rhythm (1st crosser -> 2nd crosser).',
    ],
    qbCoachingKey: 'Deliver a lead throw in front of the crossing receiver so he can catch and accelerate without breaking stride.',
    receiverCoachingKey: 'Give your mesh partner a verbal "Under" / "Over" cue. Touch shoulders as you cross to ensure zero defensive gap.',
    commonMistakes: [
      'Crossers running too far apart (more than 1 yard), allowing defenders to squeeze through.',
      'Running too deep (8+ yards) and drifting into linebacker zones.',
      'Sprinting past wide-open zone voids instead of settling down.',
    ],
    variations: [
      'Add a backside Wheel or Post route over top of the mesh to create a 3-level triangle stretch.',
    ],
    diagramType: 'mesh-cross',
  },

  // 6. WR Screen & Tunnel Screen Blocking Train Drill
  {
    id: 'drill-screen-blocking-train',
    name: 'Perimeter Screen Catch, Wall Setup & Lead Block Drill',
    category: 'SCREEN_RUN',
    targetRoutes: ['SCREEN', 'BUBBLE', 'SMOKE', 'BLOCK'],
    targetPositions: ['WR', 'SLOT', 'RB', 'QB'],
    difficulty: 'High School / Varsity',
    estimatedMinutes: 8,
    repCount: '6 reps per side',
    equipment: ['4 Cones', '4 Footballs', '2 Agile Shields / Stand-in DBs'],
    fieldSetup: 'Set up Trips formation. Outside WR takes screen catch stance. Slot #1 and Slot #2 align 1 yard off LOS. Place defensive shields at 6 yards.',
    objective: 'Synchronize the immediate catch-and-tuck with aggressive stalk/crack blocking by interior receivers to spring explosive perimeter yards.',
    stepByStep: [
      'QB catches snap and immediately opens hips to throw no-step rocket pass to Screen Receiver.',
      'Screen Receiver takes 2 steps back/sideways, catches with both eyes on ball, immediately tucks and follows blockers.',
      'Slot #1 fires out to crack-block the force defender / cornerback with wide base and active feet.',
      'Slot #2 climbs to the second level to seal the inside scraping linebacker or rolled safety.',
      'Screen receiver makes one decisive cut upfield off the inside hip of the lead blocker.',
    ],
    qbCoachingKey: 'No laces grip required. Catch and fire the ball directly into the receiver\'s chest in under 0.8 seconds.',
    receiverCoachingKey: 'Do not dance behind the line! Wait for the block to engage, then burst vertically up the seam.',
    commonMistakes: [
      'Blockers holding or lunging with head down instead of maintaining active feet and wide base.',
      'Screen receiver running sideways towards the boundary instead of getting north-south.',
      'QB throwing high or behind, killing receiver momentum.',
    ],
    variations: [
      'Fake screen and pump-and-go (Double move) down the sideline.',
    ],
    diagramType: 'screen-train',
  },

  // 7. RPO / Zone Read Mesh & Quick Throw Drill
  {
    id: 'drill-rpo-mesh-quick-trigger',
    name: 'RPO Conflict-Defender Read & Rapid Trigger Drill',
    category: 'SCREEN_RUN',
    targetRoutes: ['RPO', 'RUN', 'SLANT', 'GLANCE', 'FLAT'],
    targetPositions: ['QB', 'RB', 'WR', 'SLOT'],
    difficulty: 'Advanced / Competitive',
    estimatedMinutes: 10,
    repCount: '10 reps (5 give, 5 pull & throw)',
    equipment: ['4 Cones', '6 Footballs', '1 Coach / Player as Conflict LB'],
    fieldSetup: 'QB in shotgun at 5 yards depth. RB aligned next to QB. Single WR / Slot aligned at #1 running a 2 Slant / Glance. Coach stands at 5 yards as the Conflict Linebacker.',
    objective: 'Train QB to ride the running back mesh point while reading the conflict linebacker\'s shoulders, making split-second decisions to give or pull-and-fire.',
    stepByStep: [
      'On snap, QB seats ball into RB\'s stomach pocket and rides mesh for 2 steps.',
      'QB eyes remain strictly locked on the Conflict Linebacker (Apex LB).',
      'If Linebacker flows down to fill the B-gap run -> QB snaps ball back from RB pocket, sets feet, and throws the Slant/Glance route behind the LB.',
      'If Linebacker drops into the passing lane / widens -> QB gently releases ball to RB for the interior run.',
      'RB maintains clamped arms on the mesh, ready for either a clean hand-off or a clean pull.',
    ],
    qbCoachingKey: 'Ride the mesh with your knees bent and chest up. Keep your eyes up at the defender, never at the ball.',
    receiverCoachingKey: 'Run your route at full tempo as if it is a pure dropback pass; do not hesitate waiting for the run fake.',
    commonMistakes: [
      'RB clamping too hard and wrestling the ball away from the QB during a pull read.',
      'QB staring at the mesh instead of reading the conflict defender.',
      'QB throwing off back foot without squaring shoulders to the receiver.',
    ],
    variations: [
      'Change the perimeter route from a Slant to a Bubble screen or Speed Out.',
    ],
    diagramType: 'rpo-box',
  },

  // 8. QB Dropback Footwork & Clock Rhythm Drill
  {
    id: 'drill-qb-dropback-clock-rhythm',
    name: 'QB 3-Step / 5-Step Rhythm Drop & Hitch Timing Drill',
    category: 'QB_MECHANICS',
    targetRoutes: ['ALL', '3-STEP', '5-STEP', 'DROP'],
    targetPositions: ['QB', 'C'],
    difficulty: 'High School / Varsity',
    estimatedMinutes: 8,
    repCount: '10 snaps (5 Quick 3-Step, 5 Shotgun 3-Step + Hitch)',
    equipment: ['3 Cones in a straight vertical line', '5 Footballs', '1 Stopwatch / Whistle'],
    fieldSetup: 'Place Center cone at 0 yds, Step-1 cone at 2 yds, Step-3 cone at 4 yds, and Hitch cone at 3.5 yds.',
    objective: 'Ingrain muscle memory for clean shotgun catch, explosive backwards crossover drop, firm plant of back cleat, and rhythmic hitch step into the throw.',
    stepByStep: [
      'Center snaps ball with high spiral. QB catches ball cleanly with soft fingers at chest height.',
      'Step 1: Big directional push-off step with front foot.',
      'Step 2: Smooth crossover step maintaining level chin and two hands on the football.',
      'Step 3: Firm plant with back foot under the throwing shoulder at 90 degrees to target.',
      'Hitch: Forward weight transfer step (hitch) to throw on time at 1.8 seconds from snap.',
    ],
    qbCoachingKey: 'Keep two hands on the ball held at the chest level ("holding the baby"). Your feet dictate your accuracy.',
    receiverCoachingKey: 'Receivers run timed routes synchronizing their final break step to the QB\'s back foot plant.',
    commonMistakes: [
      'Dropping ball down to hip level during drop, increasing release time.',
      'Drifting backwards on the throw instead of stepping forward onto the target line.',
      'Taking false steps on the snap.',
    ],
    variations: [
      'Add a coach flashing a random number (1, 2, or 3 fingers) to force QB to reset feet to 2nd progression.',
    ],
    diagramType: 'qb-drop',
  },

  // 9. Dig / In Route (Route 6)
  {
    id: 'drill-dig-square-in-window',
    name: '10-Yard Dig / Square-In Route Window Penetration Drill',
    category: 'ROUTE_PRECISION',
    targetRoutes: ['6', 'DIG', 'IN', 'SQUARE_IN'],
    targetPositions: ['WR', 'SLOT', 'QB'],
    difficulty: 'High School / Varsity',
    estimatedMinutes: 8,
    repCount: '6 reps per side',
    equipment: ['4 Cones', '4 Footballs', '1 Linebacker Stand-in Dummy'],
    fieldSetup: 'Outside alignment. Place break cone at 10-12 yards depth. Place an inside window cone 10 yards horizontally across the middle.',
    objective: 'Teach outside receivers to push deep to 10-12 yards to back off deep third cornerbacks, snap violently 90° across the middle, and stay flat across open linebacker voids.',
    stepByStep: [
      'Receiver attacks corner with vertical speed, selling the 9 Go route to 10-12 yards.',
      'At 12 yards, plant outside foot with authority, drop hips, and snap at a crisp 90° angle across the hashes.',
      'Flatten path across the middle—do not drift backward or float upfield into safeties.',
      'Catch the firm ball in the seam window, brace for contact, and turn upfield immediately.',
    ],
    qbCoachingKey: 'Throw the Dig with velocity into the second window between the inside linebackers and dropping safety.',
    receiverCoachingKey: 'Run flat across the hashes. If you drift upfield, you will get hit by the free safety.',
    commonMistakes: [
      'Rounding the cut at 10 yards into a circle.',
      'Drifting upfield after the break into the safety\'s coverage alley.',
    ],
    variations: [
      'Add a Mike Linebacker jumping underneath to force the receiver to settle in the open void.',
    ],
    diagramType: 'single-route',
  },

  // 10. Flood / Sail 3-Level Stretch Concept
  {
    id: 'drill-flood-sail-3level',
    name: 'Flood / Sail 3-Level Vertical Sideline Stretch Drill',
    category: 'COMBO_SKELETON',
    targetRoutes: ['9', 'GO', '7', 'CORNER', '5', 'OUT', '1', 'FLAT'],
    targetPositions: ['WR', 'SLOT', 'RB', 'QB', 'DB'],
    difficulty: 'Advanced / Competitive',
    estimatedMinutes: 12,
    repCount: '8 reps vs Cover 3 and Cover 4',
    equipment: ['6 Cones', '6 Footballs', '2 Defensive Backs'],
    fieldSetup: 'Trips alignment to the right. #1 WR runs Go (Clear-out), #2 Slot runs 10-yard Out/Sail (Intermediate), #3 Inside Slot/RB runs 3-yard Flat (Underneath).',
    objective: 'Overload the sideline zone defense with 3 distinct vertical levels (Deep, Intermediate 10yd, Underneath 3yd), making it impossible for two zone defenders to cover three receivers.',
    stepByStep: [
      'On snap, #1 WR sprints deep on Go route to clear the deep third Cornerback out of the zone.',
      '#2 Slot pushes to 10 yards and cuts 90° to the sideline (Sail/Out).',
      '#3 Inside/RB releases immediately into the flat at 3 yards depth.',
      'QB takes 3-step drop and reads the Flat Defender (Nickel / OLB).',
      'If Flat Defender drops deep under the Sail -> QB hits the Flat route for 6+ RAC yards.',
      'If Flat Defender bites on the Flat -> QB hits the open Sail route at 10-12 yards along the sideline.',
    ],
    qbCoachingKey: 'High-to-low progression: Check if #1 cleared deep CB -> Read Flat defender to throw Sail or Flat.',
    receiverCoachingKey: '#1 WR must run at 100% speed to pull the deep defender with him, even if he knows the ball is going underneath.',
    commonMistakes: [
      'Clear-out receiver jogging, allowing CB to sit on the intermediate Sail route.',
      'Flat route getting too deep and cluttering the Sail window.',
    ],
    variations: [
      'Tag a backside post read if safety over-rotates to the flood side.',
    ],
    diagramType: 'hi-lo-combo',
  },
];

/**
 * Helper to analyze a play and extract all route numbers, codes, tags, and concepts.
 */
export function extractRoutesAndConceptsFromPlay(play?: Play | null): {
  routeCodes: string[];
  routeNames: string[];
  positions: string[];
  concepts: string[];
  qbDrop: string;
  isScreen: boolean;
  isRun: boolean;
  isRpo: boolean;
} {
  const routeCodes = new Set<string>();
  const routeNames = new Set<string>();
  const positions = new Set<string>();
  const concepts = new Set<string>();

  if (!play || !play.code) {
    return {
      routeCodes: [],
      routeNames: [],
      positions: [],
      concepts: [],
      qbDrop: 'Shotgun 3-Step',
      isScreen: false,
      isRun: false,
      isRpo: false,
    };
  }

  if (play.playType === 'SCREEN') concepts.add('SCREEN');
  if (play.playType === 'RUN') concepts.add('RUN');
  if (play.playType === 'RPO') concepts.add('RPO');
  if (play.playType === 'PLAY_ACTION') concepts.add('PLAY_ACTION');

  // Check play code for route numbers like "1 7 8", "2 2 2", "0 0 1"
  const digitsInCode = play.code.match(/\b[0-9]\b/g);
  if (digitsInCode) {
    digitsInCode.forEach((d) => routeCodes.add(d));
  }

  // Iterate all players
  if (play.players) {
    Object.values(play.players).forEach((p: PlayerAssignment) => {
      if (!p) return;
      positions.add(p.id);
      if (p.route) {
        if (p.route.routeNumber !== undefined && p.route.routeNumber !== null) {
          routeCodes.add(String(p.route.routeNumber));
        }

        const nameLower = (p.route.name || '').toLowerCase();
        if (p.route.name) routeNames.add(p.route.name);

        if (nameLower.includes('slant') || nameLower.includes('viisto')) routeCodes.add('2');
        if (nameLower.includes('hitch') || nameLower.includes('smoke') || nameLower.includes('bubble')) routeCodes.add('0');
        if (nameLower.includes('flat') || nameLower.includes('quick out') || nameLower.includes('speed out')) routeCodes.add('1');
        if (nameLower.includes('corner') || nameLower.includes('flag')) routeCodes.add('7');
        if (nameLower.includes('post')) routeCodes.add('8');
        if (nameLower.includes('go') || nameLower.includes('streak') || nameLower.includes('fade') || nameLower.includes('fly')) routeCodes.add('9');
        if (nameLower.includes('dig') || nameLower.includes('in') || nameLower.includes('square in')) routeCodes.add('6');
        if (nameLower.includes('out') && !nameLower.includes('quick out')) routeCodes.add('5');
        if (nameLower.includes('comeback')) routeCodes.add('3');
        if (nameLower.includes('curl') || nameLower.includes('hook')) routeCodes.add('4');
        if (nameLower.includes('wheel')) routeCodes.add('WHEEL');
        if (nameLower.includes('cross') || nameLower.includes('drag') || nameLower.includes('mesh')) routeCodes.add('MESH');
        if (nameLower.includes('screen')) concepts.add('SCREEN');
        if (nameLower.includes('block')) concepts.add('BLOCK');
      }
    });
  }

  // Identify Combo Concepts from name/tags
  const textBlob = `${play.code || ''} ${play.englishName || ''} ${play.conceptName || ''} ${(play.tags || []).join(' ')} ${play.description || ''}`.toLowerCase();
  if (textBlob.includes('smash') || (routeCodes.has('7') && (routeCodes.has('0') || routeCodes.has('1')))) {
    concepts.add('SMASH');
  }
  if (textBlob.includes('flood') || textBlob.includes('sail') || (routeCodes.has('9') && routeCodes.has('7') && routeCodes.has('1'))) {
    concepts.add('FLOOD');
  }
  if (textBlob.includes('mesh') || textBlob.includes('shallow') || routeCodes.has('MESH')) {
    concepts.add('MESH');
  }
  if (textBlob.includes('slant') || routeCodes.has('2')) {
    concepts.add('SLANT');
  }
  if (textBlob.includes('screen') || play.playType === 'SCREEN') {
    concepts.add('SCREEN');
  }
  if (textBlob.includes('rpo') || play.playType === 'RPO') {
    concepts.add('RPO');
  }

  return {
    routeCodes: Array.from(routeCodes),
    routeNames: Array.from(routeNames),
    positions: Array.from(positions),
    concepts: Array.from(concepts),
    qbDrop: play.qbDrop || 'Shotgun 3-Step',
    isScreen: play.playType === 'SCREEN' || concepts.has('SCREEN'),
    isRun: play.playType === 'RUN',
    isRpo: play.playType === 'RPO' || concepts.has('RPO'),
  };
}

/**
 * Returns prioritized drill suggestions scored specifically for the selected play.
 */
export function getDrillsForPlay(play?: Play | null): {
  primaryDrills: PracticeDrill[];
  secondaryDrills: PracticeDrill[];
  allMatchedDrills: PracticeDrill[];
  analysis: ReturnType<typeof extractRoutesAndConceptsFromPlay>;
} {
  const analysis = extractRoutesAndConceptsFromPlay(play);

  const scoredDrills = DRILL_DATABASE.map((drill) => {
    let score = 0;
    const matchReasons: string[] = [];

    // Match exact route codes
    for (const code of analysis.routeCodes) {
      if (drill.targetRoutes.includes(code)) {
        score += 15;
        matchReasons.push(`Route ${code}`);
      }
    }

    // Match combo concepts
    for (const concept of analysis.concepts) {
      if (drill.targetRoutes.includes(concept) || drill.id.toLowerCase().includes(concept.toLowerCase())) {
        score += 20;
        matchReasons.push(`Concept: ${concept}`);
      }
    }

    // Match QB mechanics
    if (drill.category === 'QB_MECHANICS') {
      score += 8;
    }

    // Screen match
    if (analysis.isScreen && (drill.id.includes('screen') || drill.category === 'SCREEN_RUN')) {
      score += 30;
    }

    // RPO match
    if (analysis.isRpo && drill.id.includes('rpo')) {
      score += 30;
    }

    return {
      drill,
      score,
      matchReasons,
    };
  });

  // Sort descending by score
  scoredDrills.sort((a, b) => b.score - a.score);

  // Divide into primary recommendations (score > 15) and secondary
  const primaryDrills = scoredDrills.filter((d) => d.score >= 15).map((d) => d.drill);
  const secondaryDrills = scoredDrills.filter((d) => d.score > 0 && d.score < 15).map((d) => d.drill);
  const allMatchedDrills = scoredDrills.map((d) => d.drill);

  // Always ensure at least 3 drills are present
  if (primaryDrills.length < 3) {
    const needed = 3 - primaryDrills.length;
    const fallback = scoredDrills.slice(primaryDrills.length, primaryDrills.length + needed).map((d) => d.drill);
    primaryDrills.push(...fallback);
  }

  return {
    primaryDrills,
    secondaryDrills,
    allMatchedDrills,
    analysis,
  };
}
