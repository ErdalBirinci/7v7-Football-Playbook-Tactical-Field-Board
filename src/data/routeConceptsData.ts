import { Play } from '../types';

export interface VideoChapter {
  timeSec: number;
  timeFormatted: string;
  title: string;
  subtitle: string;
  focusPoint: string;
}

export interface RouteConceptDefinition {
  id: string;
  name: string;
  nameFi?: string;
  category: 'Pass Concept' | 'Quick Game' | 'Deep Shot' | 'Play Action & RPO' | 'Screen' | 'Individual Route';
  shortSummary: string;
  keyRoutes: string[];
  idealVs: string;
  vulnerableVs: string;
  qbReadProgression: {
    step: number;
    target: string;
    timing: string;
    readCue: string;
  }[];
  receiverTechnique: {
    position: string;
    stem: string;
    breakpoint: string;
    catchAndYAC: string;
  }[];
  coachingPoints: string[];
  goldenRule: string;
  commonMistakes: string[];
  matchedDrillTitle: string;
  videoDurationSec: number;
  videoDurationFormatted: string;
  videoChapters: VideoChapter[];
  // Animation simulation data for video player canvas
  canvasAnimation: {
    qbPath: { x: number; y: number }[];
    primaryReceiverPath: { x: number; y: number; label?: string; role?: string }[];
    secondaryReceiverPath?: { x: number; y: number; label?: string; role?: string }[];
    checkdownPath?: { x: number; y: number; label?: string; role?: string }[];
    defenders: { x: number; y: number; label: string; coverage: string; moveTarget?: { x: number; y: number } }[];
    ballReleaseSec: number;
    ballCatchSec: number;
    targetPos: { x: number; y: number };
    throwTrajectory: 'touch_lob' | 'bullet' | 'backshoulder' | 'leading_stride';
  };
  fieldHighlightZones?: {
    x: number;
    y: number;
    radius: number;
    label: string;
    type: 'read_window' | 'conflict_zone' | 'break_landmark';
  }[];
}

export const ROUTE_CONCEPTS_DATABASE: RouteConceptDefinition[] = [
  {
    id: 'smash',
    name: 'Smash Concept (Corner + Hitch / Flat)',
    nameFi: 'Smash-konsepti (Kulma + Pysähdys)',
    category: 'Pass Concept',
    shortSummary: 'A two-man high-low passing concept designed to put the boundary cornerback or flat defender into immediate spatial conflict.',
    keyRoutes: ['7 - Corner (12 yds)', '0/1 - Hitch or Flat (4-5 yds)'],
    idealVs: 'Cover 2 Zone (Cornerback bites hitch, opens deep corner), Off-Man Coverage',
    vulnerableVs: 'Cover 4 Quarters with disciplined deep quarter safety jumping the corner route',
    qbReadProgression: [
      {
        step: 1,
        target: 'Read Boundary Cornerback (CB)',
        timing: 'Pre-Snap to Drop Step 3',
        readCue: 'If CB sinks deep with the 7-Corner route, throw Hitch immediately in the vacated flat.',
      },
      {
        step: 2,
        target: 'Primary 7-Corner Route',
        timing: 'Drop Step 5 (2.2s)',
        readCue: 'If CB squats or bites down on the 5yd Hitch, drive the ball into the turkey hole behind CB before Safety can arrive.',
      },
      {
        step: 3,
        target: 'Checkdown / Backside Cross',
        timing: 'Step 5 hitch up (2.8s)',
        readCue: 'If Safety rolls over top of Corner and CB drops underneath, check down to RB/C underneath.',
      },
    ],
    receiverTechnique: [
      {
        position: 'Outside Receiver (X or Z)',
        stem: 'Sprint vertical to 5 yards, sell the vertical go route with eyes up.',
        breakpoint: 'Hard 2-step plant, sink hips violently and turn 180° back toward QB numbers. Show high hands.',
        catchAndYAC: 'Catch with thumbs together, tuck the football securely against chest, turn upfield along sideline.',
      },
      {
        position: 'Inside Slot Receiver (H or Y)',
        stem: 'Push stem vertical to 10-12 yards, attack the inside leverage of the deep safety.',
        breakpoint: 'Plant inside foot hard, snap hips 45° towards the back corner pylon. Do not round the break.',
        catchAndYAC: 'High-point the football in the turkey hole between safety and dropping corner.',
      },
    ],
    coachingPoints: [
      'The Hitch receiver must not drift backwards after making the turn; hold your ground to provide a clean target.',
      'Slot receiver running the 7-Corner must push the stem deep to at least 10-12 yards before breaking, otherwise the safety will easily jump it.',
      'QB must look off the safety with helmet direction during steps 1-2 before driving the corner throw.',
    ],
    goldenRule: 'Make the flat defender wrong every time: if he drops, throw short; if he squats, throw deep.',
    commonMistakes: [
      'Hitch receiver breaking too shallow at 2 yards, allowing CB to cover both routes simultaneously.',
      'Slot running corner route rounding the cut like a banana rather than a violent 45° angle.',
      'QB waiting too long and throwing late when the safety has already closed the window.',
    ],
    matchedDrillTitle: 'Corner-Hitch High-Low Reaction Cone Drill',
    videoDurationSec: 45,
    videoDurationFormatted: '0:45',
    videoChapters: [
      { timeSec: 0, timeFormatted: '0:00', title: 'Pre-Snap Alignment', subtitle: 'Spacing & Leverage', focusPoint: 'Wide receiver 6yd split, Slot at 4yd offset' },
      { timeSec: 8, timeFormatted: '0:08', title: 'The Vertical Stem', subtitle: 'Attacking CB Cushion', focusPoint: 'WR pushes 5 yds hard, Slot stems to 10-12 yds' },
      { timeSec: 18, timeFormatted: '0:18', title: 'The Breakpoint & Conflict', subtitle: 'Forcing the Decision', focusPoint: 'WR snaps 180° hitch; Slot plants at 45° corner' },
      { timeSec: 28, timeFormatted: '0:28', title: 'QB Throw Window', subtitle: 'Ball in the Air', focusPoint: 'Lead ball into sideline turkey hole at 2.2 seconds' },
      { timeSec: 36, timeFormatted: '0:36', title: 'Catch & YAC Transition', subtitle: 'Boundary High-Point', focusPoint: 'Two hands away from frame, toe-tap boundary' },
    ],
    canvasAnimation: {
      qbPath: [{ x: 50, y: 75 }, { x: 50, y: 82 }, { x: 50, y: 80 }],
      primaryReceiverPath: [{ x: 68, y: 65 }, { x: 70, y: 46 }, { x: 88, y: 25 }, { x: 92, y: 15 }],
      secondaryReceiverPath: [{ x: 86, y: 65 }, { x: 86, y: 53 }, { x: 84, y: 55 }],
      checkdownPath: [{ x: 38, y: 77 }, { x: 42, y: 68 }, { x: 45, y: 60 }],
      defenders: [
        { x: 86, y: 50, label: 'CB', coverage: 'flat', moveTarget: { x: 84, y: 52 } },
        { x: 72, y: 30, label: 'FS', coverage: 'deep_half', moveTarget: { x: 78, y: 24 } },
      ],
      ballReleaseSec: 2.2,
      ballCatchSec: 3.4,
      targetPos: { x: 87, y: 26 },
      throwTrajectory: 'touch_lob',
    },
    fieldHighlightZones: [
      { x: 86, y: 54, radius: 6, label: 'Hitch Catch Window', type: 'read_window' },
      { x: 88, y: 24, radius: 7, label: 'Corner Turkey Hole Window', type: 'read_window' },
      { x: 86, y: 48, radius: 5, label: 'Conflict Defender (CB)', type: 'conflict_zone' },
    ],
  },

  {
    id: 'mesh',
    name: 'Mesh Concept (Crossers + Sit / Dig)',
    nameFi: 'Mesh-konsepti (Risteävät lyhyet kuviot)',
    category: 'Pass Concept',
    shortSummary: 'Two shallow crossers running at 4-6 yards depth rubbing shoulders against each other, paired with an over-the-top intermediate sit/dig route.',
    keyRoutes: ['Shallow Drag (Underneath, 4-5 yds)', 'Shallow Drag (Over top, 5-6 yds)', 'Sit / Hook (10-12 yds)'],
    idealVs: 'Man-to-Man Coverage (legal rub creates natural separation), Blitz',
    vulnerableVs: 'Zone coverage where middle linebackers drop into hook/curl holes',
    qbReadProgression: [
      {
        step: 1,
        target: 'Underneath Mesh Crosser (First to cross)',
        timing: '1.8 - 2.0s',
        readCue: 'If defender is trailing or picked on the rub point, deliver firm pass in stride to lead him across field.',
      },
      {
        step: 2,
        target: 'Over-the-Top Mesh Crosser',
        timing: '2.2 - 2.5s',
        readCue: 'If first crosser is covered, look for second crosser clearing the rub mesh point into open grass.',
      },
      {
        step: 3,
        target: 'Over-the-Middle Sit / Dig Route',
        timing: '2.8s',
        readCue: 'If linebackers flow laterally with mesh crossers, sit route settles wide open right over the ball.',
      },
    ],
    receiverTechnique: [
      {
        position: 'Left Crosser (Under)',
        stem: 'Sprint flat to 4-5 yards, flatten path horizontally across the center.',
        breakpoint: 'Rub closely under right crosser (touching jersey distance to create legal rub pick).',
        catchAndYAC: 'Never stop running vs Man; catch ball in full stride and accelerate toward opposite sideline.',
      },
      {
        position: 'Right Crosser (Over)',
        stem: 'Sprint vertical to 5-6 yards, flatten across directly above left crosser.',
        breakpoint: 'Give right of way to under crosser, maintain flat path at 6 yards.',
        catchAndYAC: 'If Zone coverage is detected, settle in open void between linebackers.',
      },
    ],
    coachingPoints: [
      'The crossers must brush shoulders at the mesh point (within 1 yard). If there is a 3-yard gap, the trailing defender will squeeze through.',
      'Versus Man coverage: continue running at full speed across the field. Versus Zone: find the open grass window and sit down.',
      'QB must throw with zero delay at the exit of the mesh point—do not let receiver run into sideline boundary.',
    ],
    goldenRule: 'Make the mesh point tight enough to give a high-five; punish man coverage with natural rub picks.',
    commonMistakes: [
      'Crossers running at different depths each snap, ruining timing.',
      'Crosser stopping against Man coverage instead of using open lateral green grass.',
      'QB throwing behind the moving crosser instead of putting ball out in front of his chest.',
    ],
    matchedDrillTitle: 'Mesh Rub & Separation Timing Drill',
    videoDurationSec: 42,
    videoDurationFormatted: '0:42',
    videoChapters: [
      { timeSec: 0, timeFormatted: '0:00', title: 'Mesh Setup & Spacing', subtitle: 'Width & Alignment', focusPoint: 'Spread formation with twin receivers opposite' },
      { timeSec: 9, timeFormatted: '0:09', title: 'The Mesh Cross Point', subtitle: 'Setting the Legal Rub', focusPoint: 'Crossers pass within arm reach at 5-6 yard depth' },
      { timeSec: 20, timeFormatted: '0:20', title: 'Man vs Zone Decision', subtitle: 'Run or Settle', focusPoint: 'Continue full speed vs Man; settle in grass vs Zone' },
      { timeSec: 30, timeFormatted: '0:30', title: 'QB Throw In Stride', subtitle: 'Lead Ball Delivery', focusPoint: 'Hit chest in front of numbers to maximize YAC' },
    ],
    canvasAnimation: {
      qbPath: [{ x: 50, y: 75 }, { x: 50, y: 80 }, { x: 50, y: 78 }],
      primaryReceiverPath: [{ x: 20, y: 65 }, { x: 28, y: 55 }, { x: 50, y: 54 }, { x: 78, y: 52 }],
      secondaryReceiverPath: [{ x: 80, y: 65 }, { x: 72, y: 53 }, { x: 50, y: 52 }, { x: 22, y: 50 }],
      checkdownPath: [{ x: 50, y: 65 }, { x: 50, y: 44 }, { x: 50, y: 44 }],
      defenders: [
        { x: 22, y: 58, label: 'CB1', coverage: 'man', moveTarget: { x: 38, y: 54 } },
        { x: 78, y: 58, label: 'CB2', coverage: 'man', moveTarget: { x: 62, y: 53 } },
      ],
      ballReleaseSec: 2.1,
      ballCatchSec: 3.1,
      targetPos: { x: 62, y: 53 },
      throwTrajectory: 'leading_stride',
    },
    fieldHighlightZones: [
      { x: 50, y: 53, radius: 5, label: 'The Mesh Rub Point (5 yds)', type: 'conflict_zone' },
      { x: 66, y: 52, radius: 6, label: 'Primary YAC Window', type: 'read_window' },
      { x: 50, y: 44, radius: 5, label: 'Over-the-Ball Sit Window', type: 'read_window' },
    ],
  },

  {
    id: 'flood',
    name: 'Flood / Sail Concept (3-Level Stretch)',
    nameFi: 'Flood-konsepti (3-tasoinen venytys)',
    category: 'Pass Concept',
    shortSummary: 'A 3-level passing stretch overloading one side of the field with deep vertical (Go/Post), intermediate out (Sail/Out at 10-12 yds), and shallow flat (4 yds).',
    keyRoutes: ['9 - Go/Fade Clearout (Deep 20+ yds)', '5/7 - Sail / Deep Out (10-12 yds)', '1 - Flat / Arrow (3-4 yds)'],
    idealVs: 'Cover 3 Zone (puts flat defender and deep third cornerback in impossible 3-on-2 conflict)',
    vulnerableVs: 'Cover 2 Invert or Cover 4 with matching apex defenders',
    qbReadProgression: [
      {
        step: 1,
        target: 'Deep Clearout Go (Alert)',
        timing: 'Drop Step 1-2',
        readCue: 'Take the deep shot only if Cornerback falls down or is completely beaten over the top.',
      },
      {
        step: 2,
        target: 'Intermediate Sail / Deep Out (Primary)',
        timing: 'Drop Step 5 (2.3s)',
        readCue: 'Read the Flat/Curl defender: if he steps up to play the flat, fire ball into Sail window at 12 yds.',
      },
      {
        step: 3,
        target: 'Shallow Flat / Swing (Checkdown)',
        timing: '2.7s',
        readCue: 'If Flat defender sinks under the Sail route, immediately dump off to Flat receiver in space.',
      },
    ],
    receiverTechnique: [
      {
        position: 'Outside Receiver (X or Z)',
        stem: 'Sprint vertical at top speed down the sideline.',
        breakpoint: 'Drive CB deep to clear the entire sideline window. Do not slow down.',
        catchAndYAC: 'Clear out deep third; ready for alert deep ball.',
      },
      {
        position: 'Slot Receiver (H or Y)',
        stem: 'Push stem straight upfield to 10-12 yards.',
        breakpoint: 'Square 90° speed cut toward sideline. Do not drift back toward line of scrimmage.',
        catchAndYAC: 'Catch with outside shoulder facing sideline, turn upfield immediately.',
      },
      {
        position: 'Back / Offset Slot',
        stem: 'Sprint immediately toward the flat at 3-4 yards depth.',
        breakpoint: 'Turn head back to QB at 3 yards, maintain width.',
        catchAndYAC: 'Catch in full stride, turn up sideline for instant positive yards.',
      },
    ],
    coachingPoints: [
      'The 3 levels must be distinct: Level 1 (Deep > 20 yds), Level 2 (Sail at 12 yds), Level 3 (Flat at 3 yds).',
      'The flat defender cannot cover both the 12-yard sail and the 3-yard flat. QB must make this read clean and decisive.',
      'QB rollouts or play-action fakes to the flood side enhance the read timing.',
    ],
    goldenRule: 'High-to-low read on the boundary: if the intermediate sail is open, throw it; if covered, take the flat.',
    commonMistakes: [
      'Sail route breaking too shallow (e.g. 6 yards), merging with the flat route.',
      'Outside clearout receiver relaxing, letting the CB sink and intercept the sail route.',
      'QB staring down the Sail route and getting hit from the backside rush.',
    ],
    matchedDrillTitle: 'Flood 3-Level Read & Timing Progression Drill',
    videoDurationSec: 48,
    videoDurationFormatted: '0:48',
    videoChapters: [
      { timeSec: 0, timeFormatted: '0:00', title: '3-Level Architecture', subtitle: 'Deep, Intermediate, Flat', focusPoint: 'Trips side overloading 3 distinct field depths' },
      { timeSec: 10, timeFormatted: '0:10', title: 'The Vertical Clearout', subtitle: 'Removing Deep Coverage', focusPoint: 'Outside WR sprints full speed to take CB away' },
      { timeSec: 22, timeFormatted: '0:22', title: 'The Sail Breakpoint', subtitle: '12-Yard Speed Out', focusPoint: 'Slot plants inside foot, cuts 90° to boundary' },
      { timeSec: 34, timeFormatted: '0:34', title: 'Flat Defender Conflict', subtitle: 'The High-Low Read', focusPoint: 'QB drives ball behind sinking linebacker' },
    ],
    canvasAnimation: {
      qbPath: [{ x: 50, y: 75 }, { x: 55, y: 80 }, { x: 58, y: 77 }],
      primaryReceiverPath: [{ x: 70, y: 65 }, { x: 72, y: 45 }, { x: 88, y: 44 }],
      secondaryReceiverPath: [{ x: 86, y: 65 }, { x: 88, y: 20 }],
      checkdownPath: [{ x: 58, y: 75 }, { x: 76, y: 62 }, { x: 86, y: 58 }],
      defenders: [
        { x: 86, y: 45, label: 'CB', coverage: 'deep_third', moveTarget: { x: 88, y: 25 } },
        { x: 74, y: 54, label: 'OLB', coverage: 'flat', moveTarget: { x: 78, y: 58 } },
      ],
      ballReleaseSec: 2.3,
      ballCatchSec: 3.3,
      targetPos: { x: 85, y: 44 },
      throwTrajectory: 'bullet',
    },
    fieldHighlightZones: [
      { x: 86, y: 44, radius: 6, label: 'Sail Route Window (12 yds)', type: 'read_window' },
      { x: 85, y: 58, radius: 5, label: 'Flat Route Window (3 yds)', type: 'read_window' },
      { x: 76, y: 52, radius: 6, label: 'Overloaded Flat Defender', type: 'conflict_zone' },
    ],
  },

  {
    id: 'stick',
    name: 'Stick Concept (Quick Game 3-Man Triangle)',
    nameFi: 'Stick-konsepti (Kolmiopeli & nopea peli)',
    category: 'Quick Game',
    shortSummary: 'A fast 1-to-3 step quick game concept creating a spatial triangle: outside vertical clearout, slot stick/option route at 5 yards, and running back speed flat.',
    keyRoutes: ['4 - Stick / Option (5 yds)', '1 - Speed Flat / Arrow (3 yds)', '9 - Fade / Vertical (Clearout)'],
    idealVs: 'Cover 3, Soft Zone, Blitz / Quick Pressure',
    vulnerableVs: 'Press-man with hard inside safety help',
    qbReadProgression: [
      {
        step: 1,
        target: 'Speed Flat (RB or Slot)',
        timing: '1-Step Drop (1.2s)',
        readCue: 'If defender is slow to expand to flat, throw flat immediately on 1st step.',
      },
      {
        step: 2,
        target: 'Inside Stick / Option Route',
        timing: '3-Step Drop (1.8s)',
        readCue: 'If defender flies to the flat, stick receiver turns to open window over the hash and catches with back to defender.',
      },
      {
        step: 3,
        target: 'Fade / Backside Slant',
        timing: '2.2s',
        readCue: 'If stick is squeezed from inside, alert deep fade 1-on-1 vs press.',
      },
    ],
    receiverTechnique: [
      {
        position: 'Slot (Stick Runner)',
        stem: 'Sprint 5 yards directly at inside linebacker or nickel DB.',
        breakpoint: 'Turn outside or inside depending on defender leverage; shield ball with your body.',
        catchAndYAC: 'High-point ball with two hands, immediately turn upfield.',
      },
      {
        position: 'Running Back (Flat)',
        stem: 'Sprint with speed into the boundary flat, gaining 2-3 yards width.',
        breakpoint: 'Turn head at line of scrimmage; be ready for hot throw.',
        catchAndYAC: 'Catch in stride and turn upfield along the sideline boundary.',
      },
    ],
    coachingPoints: [
      'Stick receiver must read the defender: if defender is inside, turn outside; if defender is outside, turn inside.',
      'QB must deliver ball with crisp velocity immediately on the break—stick is a rhythm play.',
      'Outside receiver must run full-speed fade to lift the cornerback out of the intermediate window.',
    ],
    goldenRule: 'Quick drop, read the apex linebacker: throw the flat if he hesitates, throw the stick if he widens.',
    commonMistakes: [
      'Stick receiver drifting upfield past 5 yards instead of snapping clean and presenting numbers.',
      'QB holding the ball past 2.0 seconds on a quick-game concept.',
    ],
    matchedDrillTitle: 'Stick-Option Triangle Rapid Reaction Drill',
    videoDurationSec: 38,
    videoDurationFormatted: '0:38',
    videoChapters: [
      { timeSec: 0, timeFormatted: '0:00', title: 'The Triangle Setup', subtitle: 'Fade, Stick, Flat', focusPoint: '3-receiver spacing creating the horizontal triangle' },
      { timeSec: 8, timeFormatted: '0:08', title: 'Apex Defender Read', subtitle: 'The Nickel / Will Read', focusPoint: 'Linebacker caught between flat sprint and stick turn' },
      { timeSec: 18, timeFormatted: '0:18', title: 'Stick Route Option Turn', subtitle: 'Finding Soft Grass', focusPoint: 'Slot turns chest to QB at exactly 5.0 yards' },
      { timeSec: 28, timeFormatted: '0:28', title: 'Rapid Ball Delivery', subtitle: '1-to-3 Step Rhythm', focusPoint: 'Ball leaves QB hand in under 1.8 seconds' },
    ],
    canvasAnimation: {
      qbPath: [{ x: 50, y: 75 }, { x: 50, y: 79 }],
      primaryReceiverPath: [{ x: 68, y: 65 }, { x: 68, y: 52 }, { x: 70, y: 52 }],
      secondaryReceiverPath: [{ x: 58, y: 75 }, { x: 78, y: 60 }],
      checkdownPath: [{ x: 86, y: 65 }, { x: 86, y: 25 }],
      defenders: [{ x: 70, y: 55, label: 'NICKEL', coverage: 'flat', moveTarget: { x: 76, y: 58 } }],
      ballReleaseSec: 1.8,
      ballCatchSec: 2.6,
      targetPos: { x: 70, y: 52 },
      throwTrajectory: 'bullet',
    },
    fieldHighlightZones: [
      { x: 69, y: 52, radius: 5, label: 'Stick Window (5 yds)', type: 'read_window' },
      { x: 80, y: 59, radius: 5, label: 'Speed Flat Window', type: 'read_window' },
      { x: 72, y: 54, radius: 6, label: 'Conflict Apex Defender', type: 'conflict_zone' },
    ],
  },

  {
    id: 'levels',
    name: 'Levels Concept (In-Breaking Hi-Lo Stretch)',
    nameFi: 'Levels-konsepti (Sisäänleikkaava kerroskuvio)',
    category: 'Pass Concept',
    shortSummary: 'Two in-breaking routes (5-yard quick in/drag and 10-12 yard intermediate dig) creating a vertical high-low stretch over middle linebackers.',
    keyRoutes: ['6 - Intermediate Dig / In (10-12 yds)', '1/2 - Shallow In / Drag (5 yds)'],
    idealVs: 'Cover 2, Cover 3, Middle of the Field Open (MOFO)',
    vulnerableVs: 'Cover 1 Robber with safety lurking in the intermediate hole',
    qbReadProgression: [
      {
        step: 1,
        target: 'Middle Linebacker (MLB) Hook/Curl Read',
        timing: 'Drop Step 3 to 5',
        readCue: 'If MLB drops deep under the 10-yard dig, throw the 5-yard shallow in underneath him.',
      },
      {
        step: 2,
        target: 'Intermediate Dig (10-12 yds)',
        timing: '2.4s',
        readCue: 'If MLB steps up or bites on the shallow in, drive the ball into the intermediate dig behind his helmet.',
      },
    ],
    receiverTechnique: [
      {
        position: 'Inside Slot (Shallow In)',
        stem: 'Sprint vertical 5 yards.',
        breakpoint: 'Sharp 90° square cut across the field.',
        catchAndYAC: 'Catch in stride and accelerate across field.',
      },
      {
        position: 'Outside Receiver (Intermediate Dig)',
        stem: 'Sprint vertical to 10-12 yards, selling the deep post/go.',
        breakpoint: 'Violent 90° square cut across the middle, flattening behind linebackers.',
        catchAndYAC: 'Catch with two hands, secure ball away from middle safety.',
      },
    ],
    coachingPoints: [
      'The shallow in creates the drag that pulls linebackers forward; the dig strikes the window right behind them.',
      'Dig runner must never round the break; sink hips at 10-12 yards and cut flat.',
    ],
    goldenRule: 'Read the middle linebacker: throw underneath his drop, or throw right over his head.',
    commonMistakes: [
      'Dig runner climbing higher than 12 yards into the safeties.',
      'Shallow in runner dropping back toward line of scrimmage.',
    ],
    matchedDrillTitle: 'Levels Hi-Lo Intermediate Dig Drill',
    videoDurationSec: 40,
    videoDurationFormatted: '0:40',
    videoChapters: [
      { timeSec: 0, timeFormatted: '0:00', title: 'The Hi-Lo Alignment', subtitle: '5yd In + 12yd Dig', focusPoint: 'Twin receivers on same side breaking inside at two depths' },
      { timeSec: 10, timeFormatted: '0:10', title: 'Linebacker Depth Conflict', subtitle: 'Reading the Hook Drop', focusPoint: 'MLB cannot cover both 5-yard and 12-yard in-breakers' },
      { timeSec: 22, timeFormatted: '0:22', title: 'Driving the Dig Window', subtitle: 'Ball Placement', focusPoint: 'Throw with zip between linebackers and safeties' },
    ],
    canvasAnimation: {
      qbPath: [{ x: 50, y: 75 }, { x: 50, y: 81 }, { x: 50, y: 79 }],
      primaryReceiverPath: [{ x: 80, y: 65 }, { x: 80, y: 44 }, { x: 52, y: 44 }],
      secondaryReceiverPath: [{ x: 68, y: 65 }, { x: 68, y: 55 }, { x: 42, y: 55 }],
      defenders: [{ x: 54, y: 52, label: 'MLB', coverage: 'hook_curl', moveTarget: { x: 52, y: 56 } }],
      ballReleaseSec: 2.4,
      ballCatchSec: 3.3,
      targetPos: { x: 58, y: 44 },
      throwTrajectory: 'bullet',
    },
    fieldHighlightZones: [
      { x: 56, y: 44, radius: 6, label: 'Intermediate Dig Window (12 yds)', type: 'read_window' },
      { x: 48, y: 55, radius: 5, label: 'Shallow In Window (5 yds)', type: 'read_window' },
      { x: 53, y: 52, radius: 5, label: 'Middle Linebacker in Conflict', type: 'conflict_zone' },
    ],
  },

  {
    id: 'four-verts',
    name: 'Four Verticals / Seam-Fade Concept',
    nameFi: 'Neljä pystykuviota (Four Verticals)',
    category: 'Deep Shot',
    shortSummary: 'Four deep vertical streaks attacking all 4 deep quarters of the secondary, stretching deep coverage horizontally and vertically.',
    keyRoutes: ['9 - Outside Fades (Numbers / Sideline)', '9 - Inside Seams (Hashmarks / Seam Bender)'],
    idealVs: 'Cover 3 (Puts single-high safety in 2-on-1 seam bind), Cover 2 (Outside corners squatted)',
    vulnerableVs: 'Cover 4 Quarters with 4 deep defensive backs',
    qbReadProgression: [
      {
        step: 1,
        target: 'Free Safety (Middle of Field)',
        timing: 'Pre-Snap to Step 3',
        readCue: 'If Single High Safety (Cover 3), identify which seam safety leans toward; throw to the opposite open seam.',
      },
      {
        step: 2,
        target: 'Seam Bender vs Cover 2',
        timing: 'Step 5 (2.3s)',
        readCue: 'If 2-High Safeties (Cover 2), throw the seam bender right between the safeties in the middle hole.',
      },
    ],
    receiverTechnique: [
      {
        position: 'Slot Receiver (Seam Runner)',
        stem: 'Sprint vertical along the hashmark.',
        breakpoint: 'If safety drops middle, bend seam slightly outside away from his leverage.',
        catchAndYAC: 'High-point ball over helmet in stride.',
      },
    ],
    coachingPoints: [
      'Outside receivers must keep width outside the numbers; slot receivers must run the hashmark.',
      'QB must look off the free safety with his eyes on step 1-2 before delivering to the seam.',
    ],
    goldenRule: 'Make the single-high safety pick a seam, then throw the other one with anticipation.',
    commonMistakes: [
      'Slot receivers drifting towards the sideline and crowding the outside fade.',
      'QB floating the ball too high, allowing safety to recover.',
    ],
    matchedDrillTitle: 'Four Verticals High-Safety Read Drill',
    videoDurationSec: 44,
    videoDurationFormatted: '0:44',
    videoChapters: [
      { timeSec: 0, timeFormatted: '0:00', title: 'Spacing the 4 Corridors', subtitle: 'Sidelines & Hashmarks', focusPoint: '4 distinct vertical channels across the field' },
      { timeSec: 10, timeFormatted: '0:10', title: 'The Single-High Safety Dilemma', subtitle: 'Cover 3 Stress', focusPoint: 'Free safety cannot cover both inside seams' },
      { timeSec: 24, timeFormatted: '0:24', title: 'Bending the Seam Route', subtitle: 'Adjusting vs Safety Leverage', focusPoint: 'Slot bends route into open window away from safety' },
    ],
    canvasAnimation: {
      qbPath: [{ x: 50, y: 75 }, { x: 50, y: 82 }],
      primaryReceiverPath: [{ x: 65, y: 65 }, { x: 62, y: 22 }],
      secondaryReceiverPath: [{ x: 35, y: 65 }, { x: 38, y: 22 }],
      defenders: [{ x: 50, y: 28, label: 'FS', coverage: 'deep_third', moveTarget: { x: 38, y: 24 } }],
      ballReleaseSec: 2.2,
      ballCatchSec: 3.4,
      targetPos: { x: 62, y: 22 },
      throwTrajectory: 'bullet',
    },
    fieldHighlightZones: [
      { x: 62, y: 25, radius: 7, label: 'Right Seam Window', type: 'read_window' },
      { x: 38, y: 25, radius: 7, label: 'Left Seam Window', type: 'read_window' },
      { x: 50, y: 28, radius: 8, label: 'Single High Free Safety in Conflict', type: 'conflict_zone' },
    ],
  },

  {
    id: 'slant-flat',
    name: 'Slant-Flat / Dragon Concept',
    nameFi: 'Viisto-Sivurajakonsepti (Slant-Flat)',
    category: 'Quick Game',
    shortSummary: 'A fast 2-step quick game concept combining a quick 3-step inside slant with a speed arrow route into the flat.',
    keyRoutes: ['2 - Quick Slant (3-5 yds)', '1 - Speed Flat (3 yds)'],
    idealVs: 'Cover 3 Zone, Off-Man Coverage, Blitz',
    vulnerableVs: 'Press-Man with inside shade safety help',
    qbReadProgression: [
      {
        step: 1,
        target: 'Apex / Flat Linebacker',
        timing: '1-to-3 Step Drop (1.4s)',
        readCue: 'If linebacker flies out to cover the flat route, throw the slant into the vacated window immediately behind him.',
      },
      {
        step: 2,
        target: 'Speed Flat',
        timing: '1.2s',
        readCue: 'If linebacker drops inside into slant window, dump off to flat route in open space.',
      },
    ],
    receiverTechnique: [
      {
        position: 'Outside Receiver (Slant)',
        stem: 'Hard 3 steps vertical, attack defender outside foot.',
        breakpoint: 'Violent 45° cut inside, flatten angle vs Zone.',
        catchAndYAC: 'Catch in stride with hands away from chest, turn upfield.',
      },
    ],
    coachingPoints: [
      'Slant receiver must flatten the angle if he detects Zone coverage so he does not run into the safety.',
      'QB must throw with zero hesitation: catch, plant, throw.',
    ],
    goldenRule: 'Rip the slant behind the expanding flat defender on your final drop step.',
    commonMistakes: [
      'Slant runner taking 5 steps instead of 3, throwing off QB rhythm.',
      'QB throwing behind the slant receiver.',
    ],
    matchedDrillTitle: 'Slant-Flat Rapid Release Drill',
    videoDurationSec: 36,
    videoDurationFormatted: '0:36',
    videoChapters: [
      { timeSec: 0, timeFormatted: '0:00', title: 'Quick Game Footwork', subtitle: '1-to-3 Step Gun Drop', focusPoint: 'Rhythm timing ball release under 1.5 seconds' },
      { timeSec: 10, timeFormatted: '0:10', title: 'Slant Break Angle', subtitle: '45° Violent Cut', focusPoint: 'Plant outside foot and drive across DB face' },
      { timeSec: 20, timeFormatted: '0:20', title: 'Reading Flat Expansion', subtitle: 'Hole Behind LB', focusPoint: 'LB opens hips to flat, Slant strikes open window' },
    ],
    canvasAnimation: {
      qbPath: [{ x: 50, y: 75 }, { x: 50, y: 78 }],
      primaryReceiverPath: [{ x: 80, y: 65 }, { x: 80, y: 56 }, { x: 62, y: 48 }],
      secondaryReceiverPath: [{ x: 65, y: 65 }, { x: 82, y: 60 }],
      defenders: [{ x: 72, y: 58, label: 'OLB', coverage: 'flat', moveTarget: { x: 80, y: 61 } }],
      ballReleaseSec: 1.5,
      ballCatchSec: 2.3,
      targetPos: { x: 66, y: 50 },
      throwTrajectory: 'bullet',
    },
    fieldHighlightZones: [
      { x: 66, y: 50, radius: 5, label: 'Slant Window (5 yds)', type: 'read_window' },
      { x: 82, y: 60, radius: 5, label: 'Speed Flat Window', type: 'read_window' },
      { x: 72, y: 58, radius: 5, label: 'Expanding Edge Defender', type: 'conflict_zone' },
    ],
  },
];

// Helper: detect which concepts are present in a given play
export function detectConceptsForPlay(play?: Play | null): RouteConceptDefinition[] {
  if (!play || !play.code) {
    return [ROUTE_CONCEPTS_DATABASE[0], ROUTE_CONCEPTS_DATABASE[1]];
  }
  const matched: RouteConceptDefinition[] = [];
  const playStr = `${play.code || ''} ${play.englishName || ''} ${play.conceptName || ''} ${play.originalTurkishCode || ''} ${(play.tags || []).join(' ')} ${play.description || ''}`.toLowerCase();

  for (const concept of ROUTE_CONCEPTS_DATABASE) {
    if (concept.id === 'smash') {
      const hasCorner = play.players && Object.values(play.players).some((p) => p.route && (p.route.name.includes('Corner') || p.route.routeNumber === 7 || p.route.routeNumber === '7'));
      const hasHitchOrFlat = play.players && Object.values(play.players).some((p) => p.route && (p.route.name.includes('Hitch') || p.route.name.includes('Flat') || p.route.name.includes('Out') || p.route.routeNumber === 0 || p.route.routeNumber === 1));
      if (playStr.includes('smash') || (hasCorner && hasHitchOrFlat) || playStr.includes(' 7 ') || playStr.includes('97')) {
        matched.push(concept);
      }
    } else if (concept.id === 'mesh') {
      const hasMesh = playStr.includes('mesh') || playStr.includes('cross') || playStr.includes('drag') || playStr.includes('rub');
      if (hasMesh) matched.push(concept);
    } else if (concept.id === 'flood') {
      const hasFlood = playStr.includes('flood') || playStr.includes('sail') || playStr.includes('trips') || playStr.includes('3-level');
      if (hasFlood) matched.push(concept);
    } else if (concept.id === 'stick') {
      const hasStick = playStr.includes('stick') || playStr.includes('option') || playStr.includes('quick');
      if (hasStick) matched.push(concept);
    } else if (concept.id === 'levels') {
      const hasLevels = playStr.includes('levels') || (playStr.includes('dig') && playStr.includes('in'));
      if (hasLevels) matched.push(concept);
    } else if (concept.id === 'four-verts') {
      const hasVerts = playStr.includes('vert') || playStr.includes('seam') || playStr.includes('deep') || playStr.includes('go') || playStr.includes('streak');
      if (hasVerts) matched.push(concept);
    } else if (concept.id === 'slant-flat') {
      const hasSlant = playStr.includes('slant') || (play.players && Object.values(play.players).some((p) => p.route && (p.route.name.includes('Slant') || p.route.routeNumber === 2)));
      if (hasSlant) matched.push(concept);
    }
  }

  // If none matched, provide default primary concept (Smash or Stick)
  if (matched.length === 0) {
    matched.push(ROUTE_CONCEPTS_DATABASE[0]);
    matched.push(ROUTE_CONCEPTS_DATABASE[1]);
  }

  return matched;
}
