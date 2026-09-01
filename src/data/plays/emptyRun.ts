import { Play, RoutePoint } from '../../types';
import { generateRoutePoints } from '../routeGenerator';

function createEmptyRunPlay(
  playNumber: number | string,
  isRight: boolean,
  playCodeSuffix: string,
  englishAction: string,
  runnerType: 'QB' | 'WR' | 'SR',
  runScheme: 'SWEEP_LEFT' | 'SWEEP_RIGHT' | 'REVERSE_RIGHT' | 'REVERSE_LEFT' | 'TRAP_LEFT' | 'TRAP_RIGHT' | 'DIVE' | 'COUNTER_LEFT' | 'COUNTER_RIGHT',
  hasMotion: boolean = false,
  motionPlayer: 'WR' | 'SR' = 'WR',
  motionFake: boolean = false
): Play {
  const dir = isRight ? 'RIGHT' : 'LEFT';
  const sideLabel = isRight ? 'Right' : 'Left';
  const code = `${playNumber}. EMPTY ${dir} ${playCodeSuffix}`;

  // In Empty, 5 WRs spread out:
  // Left: X at 14, H at 32
  // Center: C at 50, QB at 50 (Shotgun)
  // Right: Y at 68, SR at 78, Z at 88 (or mirrored for Left)
  const xX = 14;
  const hX = 30;
  const yX = 66;
  const srX = 78;
  const zX = 88;

  const motionStartX = isRight ? zX : xX;
  const motionEndX = isRight ? 35 : 65;

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
    qbRouteName = 'QB Direct Dive';
  } else if (runScheme === 'TRAP_LEFT') {
    qbPoints = generateRoutePoints(50, 75, 'TRAP_RUN_LEFT').points;
    qbRouteName = 'QB Trap Left';
  } else if (runScheme === 'TRAP_RIGHT') {
    qbPoints = generateRoutePoints(50, 75, 'TRAP_RUN_RIGHT').points;
    qbRouteName = 'QB Trap Right';
  } else if (runScheme === 'COUNTER_LEFT') {
    qbPoints = generateRoutePoints(50, 75, 'COUNTER_RUN_LEFT').points;
    qbRouteName = 'QB Counter Left';
  } else if (runScheme === 'COUNTER_RIGHT') {
    qbPoints = generateRoutePoints(50, 75, 'COUNTER_RUN_RIGHT').points;
    qbRouteName = 'QB Counter Right';
  } else if (runScheme === 'REVERSE_RIGHT' || runScheme === 'REVERSE_LEFT') {
    qbPoints = [
      { x: 50, y: 75, type: 'snap' },
      { x: runScheme === 'REVERSE_RIGHT' ? 44 : 56, y: 77, type: 'fake' },
      { x: runScheme === 'REVERSE_RIGHT' ? 70 : 30, y: 74, type: 'stem' },
      { x: runScheme === 'REVERSE_RIGHT' ? 85 : 15, y: 40, type: 'target', label: 'REV' },
    ];
    qbRouteName = runScheme === 'REVERSE_RIGHT' ? 'QB Reverse Right' : 'QB Reverse Left';
  }

  return {
    id: `empty-run-${playNumber}-${dir.toLowerCase()}-${playCodeSuffix.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    playNumber,
    code,
    originalTurkishCode: code,
    englishName: `Empty ${sideLabel} - ${englishAction}`,
    category: 'EMPTY RUN',
    playType: 'RUN',
    direction: dir,
    formationName: `Empty ${sideLabel} (5-Wide)`,
    conceptName: `${englishAction} (${runnerType} Ball Carrier)`,
    tags: ['Empty', 'Run Play', runnerType === 'QB' ? 'QB Run' : 'Motion Sweep', hasMotion ? 'Pre-Snap Motion' : 'Static'],
    description: `7v7 Empty ${sideLabel} run concept featuring ${englishAction}. Designed to exploit vacated boxes in 5-wide sets.`,
    coachingPoints: [
      `Ball Carrier: ${runnerType}. Attack the designated gap/perimeter with decisive acceleration.`,
      hasMotion ? `Motion Timing: ${motionPlayer} goes in pre-snap motion across the formation.` : `Direct snap execution.`,
      `Perimeter Blocking: Receivers stalk-block defensive backs on the edge to spring the run.`,
    ],
    progressionReads: [
      { order: 1, playerId: runnerType === 'QB' ? 'QB' : (isRight ? 'Z' : 'X'), concept: `Primary Run Track (${runScheme})`, cue: 'Read defensive end / edge contain leverage' },
      { order: 2, playerId: 'C', concept: 'Center Lead / Seal', cue: 'Seal interior linebacker' },
    ],
    qbDrop: 'QB Keep',
    players: {
      QB: {
        id: 'QB',
        label: 'QB',
        positionName: 'Quarterback',
        initialPos: { x: 50, y: 75 },
        roleDescription: qbIsCarrier ? `Primary ball carrier executing ${qbRouteName}` : (motionFake ? 'Mesh fake with motion man, roll away' : 'Handoff/pitch to motion runner'),
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
        roleDescription: 'Snap ball and execute run block',
        route: {
          name: 'Run Seal Block',
          points: [
            { x: 50, y: 65, type: 'snap' },
            { x: runScheme.includes('LEFT') ? 46 : 54, y: 60, type: 'block', label: 'SEAL' },
          ],
          isBlocking: true,
          color: '#f59e0b',
        },
      },
      X: {
        id: 'X',
        label: 'X (WR-L)',
        positionName: 'Outside Left Receiver',
        initialPos: { x: xX, y: 65 },
        roleDescription: (!isRight && hasMotion && motionPlayer === 'WR') ? (runnerType === 'WR' ? 'Motion across and take handoff' : 'Motion fake across') : 'Stalk block left boundary corner',
        motion: (!isRight && hasMotion && motionPlayer === 'WR') ? {
          startPos: { x: xX, y: 65 },
          endPos: { x: 52, y: 74 },
          type: 'across',
        } : undefined,
        route: {
          name: (!isRight && runnerType === 'WR') ? 'Motion Sweep Carrier' : 'Perimeter Stalk Block',
          points: (!isRight && runnerType === 'WR') ? [
            { x: xX, y: 65, type: 'motion' },
            { x: 52, y: 74, type: 'snap' },
            { x: 74, y: 70, type: 'stem' },
            { x: 88, y: 45, type: 'target', label: 'RUN' },
          ] : [
            { x: xX, y: 65, type: 'snap' },
            { x: xX, y: 55, type: 'block', label: 'BLOCK' },
          ],
          isBallCarrier: !isRight && runnerType === 'WR',
          isBlocking: !(!isRight && runnerType === 'WR'),
          color: (!isRight && runnerType === 'WR') ? '#ef4444' : '#38bdf8',
        },
      },
      H: {
        id: 'H',
        label: 'H (Slot-L)',
        positionName: 'Inside Left Slot',
        initialPos: { x: hX, y: 66 },
        roleDescription: 'Stalk block nickel defender or crack safety',
        route: {
          name: 'Stalk / Crack Block',
          points: [
            { x: hX, y: 66, type: 'snap' },
            { x: hX + (runScheme.includes('LEFT') ? -4 : 4), y: 56, type: 'block', label: 'BLOCK' },
          ],
          isBlocking: true,
          color: '#10b981',
        },
      },
      Y: {
        id: 'Y',
        label: 'Y (Slot-R1)',
        positionName: 'Inside Right Slot',
        initialPos: { x: yX, y: 66 },
        roleDescription: 'Stalk block linebacker or safety',
        route: {
          name: 'Stalk Block',
          points: [
            { x: yX, y: 66, type: 'snap' },
            { x: yX + (runScheme.includes('RIGHT') ? 4 : -4), y: 56, type: 'block', label: 'BLOCK' },
          ],
          isBlocking: true,
          color: '#f59e0b',
        },
      },
      SR: {
        id: 'SR',
        label: 'SR (Slot-R2)',
        positionName: 'Middle Right Slot',
        initialPos: { x: srX, y: 66 },
        roleDescription: (hasMotion && motionPlayer === 'SR') ? 'Pre-snap motion for counter flow' : 'Perimeter seal block',
        motion: (hasMotion && motionPlayer === 'SR') ? {
          startPos: { x: srX, y: 66 },
          endPos: { x: 44, y: 73 },
          type: 'across',
        } : undefined,
        route: {
          name: (hasMotion && motionPlayer === 'SR' && runnerType === 'SR') ? 'Motion Counter Carrier' : 'Lead Block',
          points: [
            { x: srX, y: 66, type: 'snap' },
            { x: srX - 4, y: 54, type: 'block', label: 'BLOCK' },
          ],
          isBlocking: true,
          color: '#ec4899',
        },
      },
      Z: {
        id: 'Z',
        label: 'Z (WR-R)',
        positionName: 'Outside Right Receiver',
        initialPos: { x: zX, y: 65 },
        roleDescription: (isRight && hasMotion && motionPlayer === 'WR') ? (runnerType === 'WR' ? 'Motion sweep ball carrier' : 'Motion fake across') : 'Stalk block right boundary corner',
        motion: (isRight && hasMotion && motionPlayer === 'WR') ? {
          startPos: { x: zX, y: 65 },
          endPos: { x: 48, y: 74 },
          type: 'across',
        } : undefined,
        route: {
          name: (isRight && runnerType === 'WR') ? 'Motion Sweep Carrier' : 'Perimeter Stalk Block',
          points: (isRight && runnerType === 'WR') ? [
            { x: zX, y: 65, type: 'motion' },
            { x: 48, y: 74, type: 'snap' },
            { x: 26, y: 70, type: 'stem' },
            { x: 12, y: 45, type: 'target', label: 'RUN' },
          ] : [
            { x: zX, y: 65, type: 'snap' },
            { x: zX, y: 55, type: 'block', label: 'BLOCK' },
          ],
          isBallCarrier: isRight && runnerType === 'WR',
          isBlocking: !(isRight && runnerType === 'WR'),
          color: (isRight && runnerType === 'WR') ? '#ef4444' : '#a855f7',
        },
      },
    },
  };
}

export const EMPTY_RUN_PLAYS: Play[] = [
  // 115
  createEmptyRunPlay(115, true, 'QB SOL ACIK KOSU', 'QB Sweep Left', 'QB', 'SWEEP_LEFT'),
  createEmptyRunPlay(115, false, 'QB SAG ACIK KOSU', 'QB Sweep Right', 'QB', 'SWEEP_RIGHT'),
  // 116
  createEmptyRunPlay(116, true, 'QB SAG ACIK KOSU REVERSE', 'QB Sweep Right Reverse', 'QB', 'REVERSE_RIGHT'),
  createEmptyRunPlay(116, false, 'QB SOL ACIK KOSU REVERSE', 'QB Sweep Left Reverse', 'QB', 'REVERSE_LEFT'),
  // 117
  createEmptyRunPlay(117, true, 'WR MOTION SOL ACIK KOSU', 'WR Motion Sweep Left', 'WR', 'SWEEP_LEFT', true, 'WR'),
  createEmptyRunPlay(117, false, 'WR MOTION SAG ACIK KOSU', 'WR Motion Sweep Right', 'WR', 'SWEEP_RIGHT', true, 'WR'),
  // 118
  createEmptyRunPlay(118, true, 'WR MOTION FAKE QB SOL ACIK KOSU', 'WR Motion Fake -> QB Sweep Left', 'QB', 'SWEEP_LEFT', true, 'WR', true),
  createEmptyRunPlay(118, false, 'WR MOTION FAKE QB SAG ACIK KOSU', 'WR Motion Fake -> QB Sweep Right', 'QB', 'SWEEP_RIGHT', true, 'WR', true),
  // 119
  createEmptyRunPlay(119, true, 'WR MOTION TRAP LEFT', 'WR Motion Trap Left', 'WR', 'TRAP_LEFT', true, 'WR'),
  createEmptyRunPlay(119, false, 'WR MOTION TRAP RIGHT', 'WR Motion Trap Right', 'WR', 'TRAP_RIGHT', true, 'WR'),
  // 120
  createEmptyRunPlay(120, true, 'WR MOTION FAKE QB TRAP LEFT', 'WR Motion Fake -> QB Trap Left', 'QB', 'TRAP_LEFT', true, 'WR', true),
  createEmptyRunPlay(120, false, 'WR MOTION FAKE QB TRAP RIGHT', 'WR Motion Fake -> QB Trap Right', 'QB', 'TRAP_RIGHT', true, 'WR', true),
  // 121
  createEmptyRunPlay(121, true, 'QB TRAP LEFT', 'QB Direct Trap Left', 'QB', 'TRAP_LEFT'),
  createEmptyRunPlay(121, false, 'QB TRAP RIGHT', 'QB Direct Trap Right', 'QB', 'TRAP_RIGHT'),
  // 122
  createEmptyRunPlay(122, true, 'QB SOL ACIK KOSU REVERSE', 'QB Sweep Left Reverse', 'QB', 'REVERSE_LEFT'),
  createEmptyRunPlay(122, false, 'QB SAG ACIK KOSU REVERSE', 'QB Sweep Right Reverse', 'QB', 'REVERSE_RIGHT'),
  // 123
  createEmptyRunPlay(123, true, 'QB DIVE', 'QB Direct Dive', 'QB', 'DIVE'),
  createEmptyRunPlay(123, false, 'QB DIVE', 'QB Direct Dive', 'QB', 'DIVE'),
  // 124
  createEmptyRunPlay(124, true, 'WR MOTION FAKE QB DIVE', 'WR Motion Fake -> QB Dive', 'QB', 'DIVE', true, 'WR', true),
  createEmptyRunPlay(124, false, 'WR MOTION FAKE QB DIVE', 'WR Motion Fake -> QB Dive', 'QB', 'DIVE', true, 'WR', true),
  // 125
  createEmptyRunPlay(125, true, 'WR MOTION DIVE', 'WR Motion Direct Dive', 'WR', 'DIVE', true, 'WR'),
  createEmptyRunPlay(125, false, 'WR MOTION DIVE', 'WR Motion Direct Dive', 'WR', 'DIVE', true, 'WR'),
  // 126
  createEmptyRunPlay(126, true, 'QB COUNTER LEFT', 'QB Counter Left', 'QB', 'COUNTER_LEFT'),
  createEmptyRunPlay(126, false, 'QB COUNTER RIGHT', 'QB Counter Right', 'QB', 'COUNTER_RIGHT'),
  // 127
  createEmptyRunPlay(127, true, 'WR MOTION FAKE QB COUNTER LEFT', 'WR Motion Fake -> QB Counter Left', 'QB', 'COUNTER_LEFT', true, 'WR', true),
  createEmptyRunPlay(127, false, 'WR MOTION FAKE QB COUNTER RIGHT', 'WR Motion Fake -> QB Counter Right', 'QB', 'COUNTER_RIGHT', true, 'WR', true),
  // 128
  createEmptyRunPlay(128, true, 'SR MOTION COUNTER LEFT', 'Slot Receiver Motion Counter Left', 'SR', 'COUNTER_LEFT', true, 'SR'),
  createEmptyRunPlay(128, false, 'SR MOTION COUNTER RIGHT', 'Slot Receiver Motion Counter Right', 'SR', 'COUNTER_RIGHT', true, 'SR'),
];
