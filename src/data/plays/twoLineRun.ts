import { Play, RoutePoint } from '../../types';
import { generateRoutePoints } from '../routeGenerator';

function createTwoLineRunPlay(
  playNumber: number | string,
  isRight: boolean,
  playCodeSuffix: string,
  englishAction: string,
  runnerType: 'QB' | 'WR' | 'SR',
  runScheme: 'SWEEP_LEFT' | 'SWEEP_RIGHT' | 'REVERSE_RIGHT' | 'REVERSE_LEFT' | 'TRAP_LEFT' | 'TRAP_RIGHT' | 'DIVE' | 'COUNTER_LEFT' | 'COUNTER_RIGHT' | 'PONCIK_LEFT' | 'PONCIK_RIGHT',
  hasMotion: boolean = false,
  motionPlayer: 'WR' | 'SR' = 'WR',
  motionFake: boolean = false
): Play {
  const dir = isRight ? 'RIGHT' : 'LEFT';
  const sideLabel = isRight ? 'Right' : 'Left';
  const numPrefix = typeof playNumber === 'number' ? `${playNumber}. ` : '* ';
  const code = `${numPrefix}2 LINE ${playCodeSuffix}`;

  // In 2 Line, receivers are stacked tandem:
  // Left stack: WR1 at 26 y=65, WR2 stacked at 26 y=68
  // Right stack: WR3 at 74 y=65, WR4 stacked at 74 y=68
  // Center at 50 y=65, QB at 50 y=75, RB at 42 y=75
  const leftStackX = 26;
  const rightStackX = 74;

  let qbRouteName = 'QB Run Action';
  let qbPoints: RoutePoint[] = [{ x: 50, y: 75, type: 'snap' }];
  let qbIsCarrier = runnerType === 'QB';

  if (runScheme === 'SWEEP_LEFT') {
    qbPoints = generateRoutePoints(50, 75, 'SWEEP_RUN_LEFT').points;
    qbRouteName = 'QB Sweep Left';
  } else if (runScheme === 'SWEEP_RIGHT') {
    qbPoints = generateRoutePoints(50, 75, 'SWEEP_RUN_RIGHT').points;
    qbRouteName = 'QB Sweep Right';
  } else if (runScheme === 'DIVE') {
    qbPoints = generateRoutePoints(50, 75, 'DIVE_RUN', { isRightSide: isRight }).points;
    qbRouteName = 'QB Dive';
  } else if (runScheme === 'TRAP_LEFT') {
    qbPoints = generateRoutePoints(50, 75, 'TRAP_RUN_LEFT').points;
    qbRouteName = 'QB Trap Left';
  } else if (runScheme === 'TRAP_RIGHT') {
    qbPoints = generateRoutePoints(50, 75, 'TRAP_RUN_RIGHT').points;
    qbRouteName = 'QB Trap Right';
  } else if (runScheme === 'REVERSE_RIGHT' || runScheme === 'REVERSE_LEFT') {
    qbPoints = [
      { x: 50, y: 75, type: 'snap' },
      { x: runScheme === 'REVERSE_RIGHT' ? 44 : 56, y: 77, type: 'fake' },
      { x: runScheme === 'REVERSE_RIGHT' ? 70 : 30, y: 74, type: 'stem' },
      { x: runScheme === 'REVERSE_RIGHT' ? 85 : 15, y: 40, type: 'target', label: 'REV' },
    ];
    qbRouteName = runScheme === 'REVERSE_RIGHT' ? 'QB Reverse Right' : 'QB Reverse Left';
  } else if (runScheme === 'PONCIK_LEFT') {
    qbPoints = [{ x: 50, y: 75, type: 'snap' }, { x: 48, y: 76, type: 'fake', label: 'PITCH' }];
    qbRouteName = 'QB Pitch Orbit Left';
  } else if (runScheme === 'PONCIK_RIGHT') {
    qbPoints = [{ x: 50, y: 75, type: 'snap' }, { x: 52, y: 76, type: 'fake', label: 'PITCH' }];
    qbRouteName = 'QB Pitch Orbit Right';
  }

  return {
    id: `two-line-run-${String(playNumber).replace(/[^a-z0-9]/g, '-')}-${dir.toLowerCase()}-${playCodeSuffix.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    playNumber,
    code,
    originalTurkishCode: code,
    englishName: `2-Line Stack - ${englishAction}`,
    category: '2 LINE RUN',
    playType: 'RUN',
    direction: dir,
    formationName: '2-Line Compressed Stack',
    conceptName: `${englishAction} from Tandem Stack`,
    tags: ['2 Line', 'Stack Formation', 'Run Play', runnerType === 'QB' ? 'QB Run' : 'Motion Run'],
    description: `7v7 2-Line compressed stack formation running ${englishAction}. Tandem receivers create immediate natural seals on perimeter defenders.`,
    coachingPoints: [
      `Stack Alignment: Inside receivers line up 3 yards behind outside receivers.`,
      `Pin & Pull Blocking: Front stack receiver pins inside, back stack receiver seals outside.`,
      `Ball Carrier: ${runnerType}. Explode through the alley created by the compressed stack.`,
    ],
    progressionReads: [
      { order: 1, playerId: runnerType === 'QB' ? 'QB' : 'WR1', concept: `Alley Read (${runScheme})`, cue: 'Follow stack lead block' },
    ],
    qbDrop: 'QB Keep',
    players: {
      QB: {
        id: 'QB',
        label: 'QB',
        positionName: 'Quarterback',
        initialPos: { x: 50, y: 75 },
        roleDescription: qbIsCarrier ? `Primary ball carrier executing ${qbRouteName}` : (motionFake ? 'Fake handoff to motion man' : 'Handoff to runner'),
        route: {
          name: qbRouteName,
          points: qbPoints,
          isBallCarrier: qbIsCarrier,
          isFake: !qbIsCarrier,
          color: qbIsCarrier ? '#ef4444' : '#64748b',
        },
      },
      C: {
        id: 'C',
        label: 'C',
        positionName: 'Center',
        initialPos: { x: 50, y: 65 },
        roleDescription: 'Snap ball and seal nose guard / rusher',
        route: {
          name: 'Interior Seal',
          points: [
            { x: 50, y: 65, type: 'snap' },
            { x: runScheme.includes('LEFT') ? 46 : 54, y: 60, type: 'block', label: 'SEAL' },
          ],
          isBlocking: true,
          color: '#f59e0b',
        },
      },
      WR1: {
        id: 'WR1',
        label: 'WR-L (Front)',
        positionName: 'Left Stack Front Receiver',
        initialPos: { x: leftStackX, y: 65 },
        roleDescription: (hasMotion && !isRight && motionPlayer === 'WR') ? 'Motion across' : 'Perimeter crack block',
        motion: (hasMotion && !isRight && motionPlayer === 'WR') ? {
          startPos: { x: leftStackX, y: 65 },
          endPos: { x: 52, y: 74 },
          type: 'across',
        } : undefined,
        route: {
          name: (!isRight && runnerType === 'WR') ? 'Motion Carrier' : 'Crack Block',
          points: [
            { x: leftStackX, y: 65, type: 'snap' },
            { x: leftStackX + 6, y: 56, type: 'block', label: 'BLOCK' },
          ],
          isBlocking: true,
          color: '#38bdf8',
        },
      },
      SR1: {
        id: 'SR1',
        label: 'SR-L (Back)',
        positionName: 'Left Stack Back Receiver',
        initialPos: { x: leftStackX, y: 68 },
        roleDescription: (hasMotion && !isRight && motionPlayer === 'SR') ? 'Pre-snap motion fake' : 'Lead block around corner',
        motion: (hasMotion && !isRight && motionPlayer === 'SR') ? {
          startPos: { x: leftStackX, y: 68 },
          endPos: { x: 52, y: 74 },
          type: 'across',
        } : undefined,
        route: {
          name: runScheme === 'PONCIK_LEFT' ? 'Orbit Motion Carrier' : 'Lead Block',
          points: runScheme === 'PONCIK_LEFT' ? generateRoutePoints(leftStackX, 68, 'PONCIK_LEFT').points : [
            { x: leftStackX, y: 68, type: 'snap' },
            { x: leftStackX - 6, y: 54, type: 'block', label: 'LEAD' },
          ],
          isBallCarrier: runScheme === 'PONCIK_LEFT',
          isBlocking: runScheme !== 'PONCIK_LEFT',
          color: runScheme === 'PONCIK_LEFT' ? '#ef4444' : '#10b981',
        },
      },
      WR2: {
        id: 'WR2',
        label: 'WR-R (Front)',
        positionName: 'Right Stack Front Receiver',
        initialPos: { x: rightStackX, y: 65 },
        roleDescription: (hasMotion && isRight && motionPlayer === 'WR') ? 'Motion across' : 'Perimeter crack block',
        motion: (hasMotion && isRight && motionPlayer === 'WR') ? {
          startPos: { x: rightStackX, y: 65 },
          endPos: { x: 48, y: 74 },
          type: 'across',
        } : undefined,
        route: {
          name: (isRight && runnerType === 'WR') ? 'Motion Carrier' : 'Crack Block',
          points: [
            { x: rightStackX, y: 65, type: 'snap' },
            { x: rightStackX - 6, y: 56, type: 'block', label: 'BLOCK' },
          ],
          isBlocking: true,
          color: '#ec4899',
        },
      },
      SR2: {
        id: 'SR2',
        label: 'SR-R (Back)',
        positionName: 'Right Stack Back Receiver',
        initialPos: { x: rightStackX, y: 68 },
        roleDescription: (hasMotion && isRight && motionPlayer === 'SR') ? 'Pre-snap motion fake' : 'Lead block around corner',
        motion: (hasMotion && isRight && motionPlayer === 'SR') ? {
          startPos: { x: rightStackX, y: 68 },
          endPos: { x: 48, y: 74 },
          type: 'across',
        } : undefined,
        route: {
          name: runScheme === 'PONCIK_RIGHT' ? 'Orbit Motion Carrier' : 'Lead Block',
          points: runScheme === 'PONCIK_RIGHT' ? generateRoutePoints(rightStackX, 68, 'PONCIK_RIGHT').points : [
            { x: rightStackX, y: 68, type: 'snap' },
            { x: rightStackX + 6, y: 54, type: 'block', label: 'LEAD' },
          ],
          isBallCarrier: runScheme === 'PONCIK_RIGHT',
          isBlocking: runScheme !== 'PONCIK_RIGHT',
          color: runScheme === 'PONCIK_RIGHT' ? '#ef4444' : '#a855f7',
        },
      },
      RB: {
        id: 'RB',
        label: 'RB',
        positionName: 'Running Back',
        initialPos: { x: isRight ? 42 : 58, y: 75 },
        roleDescription: 'Lead block through gap or check release',
        route: {
          name: 'Lead Block',
          points: [
            { x: isRight ? 42 : 58, y: 75, type: 'snap' },
            { x: 50, y: 62, type: 'block', label: 'LEAD' },
          ],
          isBlocking: true,
          color: '#f59e0b',
        },
      },
    },
  };
}

export const TWO_LINE_RUN_PLAYS: Play[] = [
  // 129
  createTwoLineRunPlay(129, true, 'QB DIVE', 'QB Direct Dive', 'QB', 'DIVE'),
  createTwoLineRunPlay(129, false, 'QB DIVE', 'QB Direct Dive', 'QB', 'DIVE'),
  // 130
  createTwoLineRunPlay(130, true, 'QB TRAP', 'QB Trap Left', 'QB', 'TRAP_LEFT'),
  createTwoLineRunPlay(130, false, 'QB TRAP', 'QB Trap Right', 'QB', 'TRAP_RIGHT'),
  // 131
  createTwoLineRunPlay(131, false, 'LEFT SR MOTION FAKE QB SWEEP LEFT', 'Left SR Motion Fake -> QB Sweep Left', 'QB', 'SWEEP_LEFT', true, 'SR', true),
  createTwoLineRunPlay(131, true, 'RIGHT SR MOTION FAKE QB SWEEP RIGHT', 'Right SR Motion Fake -> QB Sweep Right', 'QB', 'SWEEP_RIGHT', true, 'SR', true),
  // 132
  createTwoLineRunPlay(132, true, 'RIGHT SR MOTION FAKE QB DIVE', 'Right SR Motion Fake -> QB Dive', 'QB', 'DIVE', true, 'SR', true),
  createTwoLineRunPlay(132, false, 'LEFT SR MOTION FAKE QB DIVE', 'Left SR Motion Fake -> QB Dive', 'QB', 'DIVE', true, 'SR', true),
  // 133
  createTwoLineRunPlay(133, false, 'LEFT WR MOTION FAKE QB TRAP', 'Left WR Motion Fake -> QB Trap', 'QB', 'TRAP_LEFT', true, 'WR', true),
  createTwoLineRunPlay(133, true, 'RIGHT WR MOTION FAKE QB TRAP', 'Right WR Motion Fake -> QB Trap', 'QB', 'TRAP_RIGHT', true, 'WR', true),
  // * 2 LINE Asterisk plays:
  createTwoLineRunPlay('* A1', false, 'QB SWEEP LEFT', 'QB Sweep Left', 'QB', 'SWEEP_LEFT'),
  createTwoLineRunPlay('* A1', true, 'QB SWEEP RIGHT', 'QB Sweep Right', 'QB', 'SWEEP_RIGHT'),
  createTwoLineRunPlay('* A2', false, 'WR MOTION SWEEP LEFT', 'WR Motion Sweep Left', 'QB', 'SWEEP_LEFT', true, 'WR'),
  createTwoLineRunPlay('* A2', true, 'WR MOTION SWEEP RIGHT', 'WR Motion Sweep Right', 'QB', 'SWEEP_RIGHT', true, 'WR'),
  createTwoLineRunPlay('* A3', false, 'WR MOTION TRAP', 'WR Motion Trap Left', 'QB', 'TRAP_LEFT', true, 'WR'),
  createTwoLineRunPlay('* A3', true, 'WR MOTION TRAP', 'WR Motion Trap Right', 'QB', 'TRAP_RIGHT', true, 'WR'),
  createTwoLineRunPlay('* A4', true, 'QB SWEEP RIGHT REVERSE', 'QB Sweep Right Reverse', 'QB', 'REVERSE_RIGHT'),
  createTwoLineRunPlay('* A4', false, 'QB SWEEP LEFT REVERSE', 'QB Sweep Left Reverse', 'QB', 'REVERSE_LEFT'),
  createTwoLineRunPlay('* A5', false, 'WR MOTION DIVE', 'WR Motion Direct Dive', 'QB', 'DIVE', true, 'WR'),
  createTwoLineRunPlay('* A5', true, 'WR MOTION DIVE', 'WR Motion Direct Dive', 'QB', 'DIVE', true, 'WR'),
  createTwoLineRunPlay('* A6', true, 'TRIPS RIGHT QB SWEEP LEFT', '2-Line Trips Right QB Sweep Left', 'QB', 'SWEEP_LEFT'),
  createTwoLineRunPlay('* A6', false, 'TRIPS LEFT QB SWEEP RIGHT', '2-Line Trips Left QB Sweep Right', 'QB', 'SWEEP_RIGHT'),
  createTwoLineRunPlay('* A7', false, 'ORBIT JET SWEEP LEFT', 'Orbit Jet Sweep Left', 'SR', 'PONCIK_LEFT'),
  createTwoLineRunPlay('* A7', true, 'ORBIT JET SWEEP RIGHT', 'Orbit Jet Sweep Right', 'SR', 'PONCIK_RIGHT'),
];
