import { Play, RoutePoint } from '../../types';
import { generateRoutePoints } from '../routeGenerator';

function createTripsRunPlay(
  playNumber: number | string,
  isRight: boolean,
  playCodeSuffix: string,
  englishAction: string,
  runnerType: 'QB' | 'WR' | 'SR' | 'RB',
  runScheme: 'SWEEP_LEFT' | 'SWEEP_RIGHT' | 'TRAP_LEFT' | 'TRAP_RIGHT' | 'DIVE' | 'COUNTER_LEFT' | 'COUNTER_RIGHT' | 'MID_DRAW' | 'REVERSE' | 'PONCIK_LEFT' | 'PONCIK_RIGHT' | 'SCREEN',
  hasMotion: boolean = false,
  motionFake: boolean = false
): Play {
  const dir = isRight ? 'RIGHT' : 'LEFT';
  const sideLabel = isRight ? 'Right' : 'Left';
  const numStr = typeof playNumber === 'number' ? `${playNumber}. ` : '* ';
  const code = `${numStr}TRIPS ${dir} ${playCodeSuffix}`;

  // In Trips:
  // Right: Z at 88, Y at 76, H at 66; X at 16 (backside)
  // Center: C at 50, QB at 50, RB at 42
  const zX = isRight ? 88 : 12;
  const yX = isRight ? 76 : 24;
  const hX = isRight ? 66 : 34;
  const xX = isRight ? 16 : 84;
  const rbX = isRight ? 42 : 58;

  let qbPoints: RoutePoint[] = [{ x: 50, y: 75, type: 'snap' }];
  let qbIsCarrier = runnerType === 'QB';

  if (runScheme === 'SWEEP_LEFT') {
    qbPoints = generateRoutePoints(50, 75, 'SWEEP_RUN_LEFT').points;
  } else if (runScheme === 'SWEEP_RIGHT') {
    qbPoints = generateRoutePoints(50, 75, 'SWEEP_RUN_RIGHT').points;
  } else if (runScheme === 'DIVE') {
    qbPoints = generateRoutePoints(50, 75, 'DIVE_RUN', { isRightSide: isRight }).points;
  } else if (runScheme === 'TRAP_LEFT') {
    qbPoints = generateRoutePoints(50, 75, 'TRAP_RUN_LEFT').points;
  } else if (runScheme === 'TRAP_RIGHT') {
    qbPoints = generateRoutePoints(50, 75, 'TRAP_RUN_RIGHT').points;
  } else if (runScheme === 'COUNTER_LEFT') {
    qbPoints = generateRoutePoints(50, 75, 'COUNTER_RUN_LEFT').points;
  } else if (runScheme === 'COUNTER_RIGHT') {
    qbPoints = generateRoutePoints(50, 75, 'COUNTER_RUN_RIGHT').points;
  } else if (runScheme === 'MID_DRAW') {
    qbPoints = generateRoutePoints(50, 75, 'MID_DRAW').points;
  } else if (runScheme === 'REVERSE') {
    qbPoints = [
      { x: 50, y: 75, type: 'snap' },
      { x: isRight ? 44 : 56, y: 77, type: 'fake' },
      { x: isRight ? 72 : 28, y: 74, type: 'stem' },
      { x: isRight ? 86 : 14, y: 40, type: 'target', label: 'REV' },
    ];
  }

  return {
    id: `trips-run-${String(playNumber).replace(/[^a-z0-9]/g, '-')}-${dir.toLowerCase()}`,
    playNumber,
    code,
    originalTurkishCode: code,
    englishName: `Trips ${sideLabel} - ${englishAction}`,
    category: 'TRIPS RUN',
    playType: runScheme === 'SCREEN' ? 'SCREEN' : 'RUN',
    direction: dir,
    formationName: `Trips ${sideLabel} (3x1 Set)`,
    conceptName: `${englishAction} (${runnerType} Ball Carrier)`,
    tags: ['Trips', 'Run Play', `${runnerType} Run`, hasMotion ? 'Pre-Snap Motion' : 'Static'],
    description: `7v7 Trips ${sideLabel} run play executing ${englishAction}. Overloads the perimeter with 3 blockers to seal the edge.`,
    coachingPoints: [
      `3-Man Perimeter Stalk: Outside WR and two slot receivers execute coordinated crack-and-stalk blocks.`,
      `Ball Carrier: ${runnerType}. Cut up behind the trips wall of blocks.`,
    ],
    progressionReads: [
      { order: 1, playerId: runnerType === 'QB' ? 'QB' : 'Z', concept: `Trips Edge Run (${runScheme})`, cue: 'Read block on defensive end/corner' },
    ],
    qbDrop: 'QB Keep',
    players: {
      QB: {
        id: 'QB',
        label: 'QB',
        positionName: 'Quarterback',
        initialPos: { x: 50, y: 75 },
        roleDescription: qbIsCarrier ? 'Primary ball carrier' : (motionFake ? 'Fake handoff and roll away' : 'Handoff to motion runner'),
        route: {
          name: qbIsCarrier ? 'QB Ball Carrier' : (motionFake ? 'Mesh Fake' : 'Handoff'),
          points: qbPoints,
          isBallCarrier: qbIsCarrier,
          isFake: !qbIsCarrier && motionFake,
          color: qbIsCarrier ? '#ef4444' : '#64748b',
        },
      },
      C: {
        id: 'C',
        label: 'C',
        positionName: 'Center',
        initialPos: { x: 50, y: 65 },
        roleDescription: 'Snap ball and execute run seal',
        route: {
          name: 'Interior Seal Block',
          points: [{ x: 50, y: 65, type: 'snap' }, { x: runScheme.includes('LEFT') ? 46 : 54, y: 60, type: 'block', label: 'SEAL' }],
          isBlocking: true,
          color: '#f59e0b',
        },
      },
      Z: {
        id: 'Z',
        label: isRight ? 'Z (WR1)' : 'X (WR1)',
        positionName: 'Outside Trips Receiver',
        initialPos: { x: zX, y: 65 },
        roleDescription: (hasMotion && !motionFake && runnerType === 'WR') ? 'Motion across and take sweep' : 'Stalk block corner',
        motion: (hasMotion && !isRight) ? { startPos: { x: zX, y: 65 }, endPos: { x: 48, y: 75 }, type: 'across' } : undefined,
        route: {
          name: 'Perimeter Stalk Block',
          points: [{ x: zX, y: 65, type: 'snap' }, { x: zX, y: 55, type: 'block', label: 'BLOCK' }],
          isBlocking: true,
          color: '#38bdf8',
        },
      },
      Y: {
        id: 'Y',
        label: isRight ? 'Y (SR2)' : 'H (SR2)',
        positionName: 'Middle Slot Receiver',
        initialPos: { x: yX, y: 66 },
        roleDescription: 'Crack block safety',
        route: {
          name: 'Crack Block',
          points: [{ x: yX, y: 66, type: 'snap' }, { x: yX + (isRight ? -4 : 4), y: 56, type: 'block', label: 'BLOCK' }],
          isBlocking: true,
          color: '#10b981',
        },
      },
      H: {
        id: 'H',
        label: isRight ? 'H (SR1)' : 'Y (SR1)',
        positionName: 'Inside Slot Receiver',
        initialPos: { x: hX, y: 66 },
        roleDescription: 'Seal inside linebacker',
        route: {
          name: 'Seal Block',
          points: [{ x: hX, y: 66, type: 'snap' }, { x: hX + (isRight ? -6 : 6), y: 56, type: 'block', label: 'BLOCK' }],
          isBlocking: true,
          color: '#f59e0b',
        },
      },
      X: {
        id: 'X',
        label: isRight ? 'X (SOLO)' : 'Z (SOLO)',
        positionName: 'Backside Single Receiver',
        initialPos: { x: xX, y: 65 },
        roleDescription: (hasMotion && isRight && runnerType === 'WR') ? 'Pre-snap motion sweep carrier' : 'Backside stalk block',
        motion: (hasMotion && isRight) ? { startPos: { x: xX, y: 65 }, endPos: { x: 52, y: 74 }, type: 'across' } : undefined,
        route: {
          name: (hasMotion && isRight && runnerType === 'WR') ? 'Motion Sweep Ball Carrier' : 'Backside Stalk Block',
          points: (hasMotion && isRight && runnerType === 'WR') ? [
            { x: xX, y: 65, type: 'motion' },
            { x: 52, y: 74, type: 'snap' },
            { x: 74, y: 70, type: 'stem' },
            { x: 88, y: 44, type: 'target', label: 'RUN' },
          ] : [
            { x: xX, y: 65, type: 'snap' },
            { x: xX, y: 55, type: 'block', label: 'BLOCK' },
          ],
          isBallCarrier: hasMotion && isRight && runnerType === 'WR',
          isBlocking: !(hasMotion && isRight && runnerType === 'WR'),
          color: (hasMotion && isRight && runnerType === 'WR') ? '#ef4444' : '#ec4899',
        },
      },
      RB: {
        id: 'RB',
        label: 'RB',
        positionName: 'Running Back',
        initialPos: { x: rbX, y: 75 },
        roleDescription: 'Lead block out on the perimeter',
        route: {
          name: 'Lead Block',
          points: [{ x: rbX, y: 75, type: 'snap' }, { x: isRight ? 70 : 30, y: 68, type: 'stem' }, { x: isRight ? 84 : 16, y: 52, type: 'block', label: 'LEAD' }],
          isBlocking: true,
          color: '#a855f7',
        },
      },
    },
  };
}

export const TRIPS_RUN_PLAYS: Play[] = [
  // 73
  createTripsRunPlay(73, true, 'QB SWEEP RIGHT', 'QB Sweep Right', 'QB', 'SWEEP_RIGHT'),
  createTripsRunPlay(73, false, 'QB SWEEP LEFT', 'QB Sweep Left', 'QB', 'SWEEP_LEFT'),
  // 74
  createTripsRunPlay(74, true, 'QB SWEEP LEFT', 'QB Sweep Left', 'QB', 'SWEEP_LEFT'),
  createTripsRunPlay(74, false, 'QB SWEEP RIGHT', 'QB Sweep Right', 'QB', 'SWEEP_RIGHT'),
  // 75
  createTripsRunPlay(75, true, 'WR MOTION SWEEP LEFT', 'WR Motion Sweep Left', 'WR', 'SWEEP_LEFT', true),
  createTripsRunPlay(75, false, 'WR MOTION SWEEP RIGHT', 'WR Motion Sweep Right', 'WR', 'SWEEP_RIGHT', true),
  // 76
  createTripsRunPlay(76, true, 'WR MOTION FAKE QB SWEEP LEFT', 'WR Motion Fake -> QB Sweep Left', 'QB', 'SWEEP_LEFT', true, true),
  createTripsRunPlay(76, false, 'WR MOTION FAKE QB SWEEP RIGHT', 'WR Motion Fake -> QB Sweep Right', 'QB', 'SWEEP_RIGHT', true, true),
  // 77
  createTripsRunPlay(77, true, 'WR MOTION TRAP LEFT', 'WR Motion Trap Left', 'WR', 'TRAP_LEFT', true),
  createTripsRunPlay(77, false, 'WR MOTION TRAP RIGHT', 'WR Motion Trap Right', 'WR', 'TRAP_RIGHT', true),
  // 78
  createTripsRunPlay(78, true, 'WR MOTION FAKE QB TRAP LEFT', 'WR Motion Fake -> QB Trap Left', 'QB', 'TRAP_LEFT', true, true),
  createTripsRunPlay(78, false, 'WR MOTION FAKE QB TRAP RIGHT', 'WR Motion Fake -> QB Trap Right', 'QB', 'TRAP_RIGHT', true, true),
  // 106
  createTripsRunPlay(106, true, 'QB TRAP LEFT', 'QB Direct Trap Left', 'QB', 'TRAP_LEFT'),
  createTripsRunPlay(106, false, 'QB TRAP RIGHT', 'QB Direct Trap Right', 'QB', 'TRAP_RIGHT'),
  // 107
  createTripsRunPlay(107, true, 'QB REVERSE', 'QB Reverse Right', 'QB', 'REVERSE'),
  createTripsRunPlay(107, false, 'QB REVERSE', 'QB Reverse Left', 'QB', 'REVERSE'),
  // 108
  createTripsRunPlay(108, true, 'WR MOTION DIVE', 'WR Motion Direct Dive', 'WR', 'DIVE', true),
  createTripsRunPlay(108, false, 'WR MOTION DIVE', 'WR Motion Direct Dive', 'WR', 'DIVE', true),
  // 109
  createTripsRunPlay(109, true, 'WR MOTION FAKE QB DIVE', 'WR Motion Fake -> QB Dive', 'QB', 'DIVE', true, true),
  createTripsRunPlay(109, false, 'WR MOTION FAKE QB DIVE', 'WR Motion Fake -> QB Dive', 'QB', 'DIVE', true, true),
  // 110
  createTripsRunPlay(110, true, 'QB DIVE', 'QB Direct Dive', 'QB', 'DIVE'),
  createTripsRunPlay(110, false, 'QB DIVE', 'QB Direct Dive', 'QB', 'DIVE'),
  // 111
  createTripsRunPlay(111, true, 'QB MID DRAW', 'QB Middle Draw', 'QB', 'MID_DRAW'),
  createTripsRunPlay(111, false, 'QB MID DRAW', 'QB Middle Draw', 'QB', 'MID_DRAW'),
  // 112
  createTripsRunPlay(112, true, 'WR MOTION COUNTER LEFT', 'WR Motion Counter Left', 'WR', 'COUNTER_LEFT', true),
  createTripsRunPlay(112, false, 'WR MOTION COUNTER RIGHT', 'WR Motion Counter Right', 'WR', 'COUNTER_RIGHT', true),
  // 113
  createTripsRunPlay(113, true, 'QB COUNTER LEFT', 'QB Counter Left', 'QB', 'COUNTER_LEFT'),
  createTripsRunPlay(113, false, 'QB COUNTER RIGHT', 'QB Counter Right', 'QB', 'COUNTER_RIGHT'),
  // 114
  createTripsRunPlay(114, true, 'ORBIT JET SWEEP LEFT', 'Orbit Jet Sweep Left', 'WR', 'PONCIK_LEFT'),
  createTripsRunPlay(114, false, 'ORBIT JET SWEEP RIGHT', 'Orbit Jet Sweep Right', 'WR', 'PONCIK_RIGHT'),
  // Line screens
  createTripsRunPlay('* SCR1', true, 'LINE SCREEN LEFT', 'Trips Right Line Screen Left', 'WR', 'SCREEN'),
  createTripsRunPlay('* SCR1', false, 'LINE SCREEN RIGHT', 'Trips Left Line Screen Right', 'WR', 'SCREEN'),
];
