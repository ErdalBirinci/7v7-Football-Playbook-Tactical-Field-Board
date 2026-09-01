import { Play } from '../../types';
import { generateRoutePoints } from '../routeGenerator';

function createOneLinePassPlay(
  idSuffix: string,
  isRight: boolean,
  bunchCount: 3 | 4,
  r1: number | string,
  r2: number | string,
  r3: number | string,
  r4: number | string,
  r5?: number | string
): Play {
  const dir = isRight ? 'RIGHT' : 'LEFT';
  const sideLabel = isRight ? 'Right' : 'Left';
  const routeList = [r1, r2, r3, r4, r5].filter((r) => r !== undefined).join(' ');
  const code = `* 1 LINE ${bunchCount} ${dir} ${routeList}`;

  // In 1 Line bunch, receivers are aligned in a single horizontal or compressed bunch line:
  // E.g., 3 bunch right: WR1 at 70, WR2 at 78, WR3 at 86, X at 18, RB at 42
  // Or 4 bunch right: WR1 at 65, WR2 at 73, WR3 at 81, WR4 at 89, RB at 42
  const wr1X = isRight ? (bunchCount === 4 ? 65 : 70) : (bunchCount === 4 ? 35 : 30);
  const wr2X = isRight ? (bunchCount === 4 ? 73 : 78) : (bunchCount === 4 ? 27 : 22);
  const wr3X = isRight ? (bunchCount === 4 ? 81 : 86) : (bunchCount === 4 ? 19 : 14);
  const wr4X = isRight ? 89 : 11;
  const singleX = isRight ? 16 : 84;

  const g1 = generateRoutePoints(wr1X, 65, r1, { isRightSide: isRight });
  const g2 = generateRoutePoints(wr2X, 65, r2, { isRightSide: isRight });
  const g3 = generateRoutePoints(wr3X, 65, r3, { isRightSide: isRight });
  const g4 = generateRoutePoints(bunchCount === 4 ? wr4X : singleX, 65, r4, { isRightSide: bunchCount === 4 ? isRight : !isRight });
  const g5 = r5 !== undefined ? generateRoutePoints(singleX, 65, r5, { isRightSide: !isRight }) : undefined;

  return {
    id: `one-line-pass-${idSuffix}-${dir.toLowerCase()}`,
    playNumber: '*',
    code,
    originalTurkishCode: code,
    englishName: `1-Line ${bunchCount} ${sideLabel} - [${routeList}]`,
    category: '1 LINE PASS',
    playType: 'PASS',
    direction: dir,
    formationName: `1-Line ${bunchCount}x1 Bunch (${sideLabel})`,
    conceptName: `1-Line Bunch Combination (${routeList})`,
    tags: ['1 Line', 'Bunch Formation', isRight ? 'Right Bunch' : 'Left Bunch', 'Pass Concept'],
    description: `7v7 1-Line bunch pass play. Concentrates ${bunchCount} receivers along a single compressed line of scrimmage to overwhelm zone landmarks and confuse man switch rules.`,
    coachingPoints: [
      `Bunch Spacing: Maintain 2-3 yard intervals between receivers at the line.`,
      `Immediate Route Distribution: Disperse high, medium, and low into distinct coverage voids.`,
      `Primary Read: Check inside-out across the bunch alignment.`,
    ],
    progressionReads: [
      { order: 1, playerId: 'WR1', concept: `Bunch Inside Route (${r1})`, cue: 'Check first open window' },
      { order: 2, playerId: 'WR2', concept: `Bunch Middle Route (${r2})`, cue: 'Read underneath defender leverage' },
      { order: 3, playerId: 'WR3', concept: `Bunch Outside Route (${r3})`, cue: 'High-low deep shot' },
      { order: 4, playerId: 'SINGLE', concept: `Backside Matchup (${r4})`, cue: 'Man isolate alert' },
    ],
    qbDrop: 'Shotgun 3-Step',
    players: {
      QB: {
        id: 'QB',
        label: 'QB',
        positionName: 'Quarterback',
        initialPos: { x: 50, y: 75 },
        roleDescription: 'Quick shotgun drop, read bunch distribution',
        route: {
          name: '3-Step Drop',
          points: [{ x: 50, y: 75, type: 'snap' }, { x: 50, y: 79, type: 'stem' }],
        },
      },
      C: {
        id: 'C',
        label: 'C',
        positionName: 'Center',
        initialPos: { x: 50, y: 65 },
        roleDescription: 'Snap and execute pass pro block',
        route: {
          name: 'Pass Protection',
          points: [{ x: 50, y: 65, type: 'snap' }, { x: 50, y: 64, type: 'block', label: 'PRO' }],
          isBlocking: true,
        },
      },
      WR1: {
        id: 'WR1',
        label: isRight ? 'WR1 (Bunch In)' : 'WR1 (Bunch In)',
        positionName: 'Inside Bunch Receiver',
        initialPos: { x: wr1X, y: 65 },
        roleDescription: `Runs route ${r1}`,
        route: { name: g1.name, routeNumber: r1, points: g1.points, isPrimary: true, color: '#38bdf8' },
      },
      WR2: {
        id: 'WR2',
        label: isRight ? 'WR2 (Bunch Mid)' : 'WR2 (Bunch Mid)',
        positionName: 'Middle Bunch Receiver',
        initialPos: { x: wr2X, y: 65 },
        roleDescription: `Runs route ${r2}`,
        route: { name: g2.name, routeNumber: r2, points: g2.points, isSecondary: true, color: '#10b981' },
      },
      WR3: {
        id: 'WR3',
        label: isRight ? 'WR3 (Bunch Out)' : 'WR3 (Bunch Out)',
        positionName: 'Outside Bunch Receiver',
        initialPos: { x: wr3X, y: 65 },
        roleDescription: `Runs route ${r3}`,
        route: { name: g3.name, routeNumber: r3, points: g3.points, color: '#f59e0b' },
      },
      SINGLE: {
        id: 'SINGLE',
        label: bunchCount === 4 ? (isRight ? 'WR4 (Bunch Far)' : 'WR4 (Bunch Far)') : (isRight ? 'X (Backside)' : 'Z (Backside)'),
        positionName: bunchCount === 4 ? 'Far Bunch Receiver' : 'Backside Single Receiver',
        initialPos: { x: bunchCount === 4 ? wr4X : singleX, y: 65 },
        roleDescription: `Runs route ${r4}`,
        route: { name: g4.name, routeNumber: r4, points: g4.points, color: '#ec4899' },
      },
      RB: {
        id: 'RB',
        label: 'RB',
        positionName: 'Running Back',
        initialPos: { x: isRight ? 42 : 58, y: 75 },
        roleDescription: g5 ? `Runs route ${r5}` : 'Checkdown flat release',
        route: {
          name: g5 ? g5.name : 'Flat Release',
          points: g5 ? g5.points : [{ x: isRight ? 42 : 58, y: 75, type: 'snap' }, { x: isRight ? 25 : 75, y: 64, type: 'target', label: '1' }],
          isCheckdown: true,
          color: '#a855f7',
        },
      },
    },
  };
}

export const ONE_LINE_PLAYS: Play[] = [
  // 1 LINE RUN
  {
    id: 'one-line-run-1',
    playNumber: '*',
    code: '* 1 LINE 4 RIGHT SOL WR MOTION SAG ACIK KOSU REVERSE',
    originalTurkishCode: '* 1 LINE 4 RIGHT SOL WR MOTION SAG ACIK KOSU REVERSE',
    englishName: '1-Line 4 Right - Left WR Motion Sweep Right Reverse',
    category: '1 LINE RUN',
    playType: 'REVERSE',
    direction: 'RIGHT',
    formationName: '1-Line 4-Right Bunch',
    conceptName: 'Motion Reverse Sweep Right',
    tags: ['1 Line', 'Reverse', 'Motion Run', 'Trick Play'],
    description: '7v7 1-Line 4-Right formation where the left backside receiver motions across for a reverse sweep around the right perimeter.',
    coachingPoints: [
      'Sell initial run flow to the left.',
      'Smooth exchange on the reverse handoff at full speed.',
      'Perimeter bunch receivers seal edge defenders.',
    ],
    progressionReads: [{ order: 1, playerId: 'WR_MOTION', concept: 'Perimeter Reverse Track', cue: 'Follow right bunch blocks' }],
    qbDrop: 'QB Keep',
    players: {
      QB: {
        id: 'QB',
        label: 'QB',
        positionName: 'Quarterback',
        initialPos: { x: 50, y: 75 },
        roleDescription: 'Handoff to motion runner and boot left',
        route: {
          name: 'Reverse Handoff & Boot',
          points: [{ x: 50, y: 75, type: 'snap' }, { x: 54, y: 76, type: 'fake', label: 'HANDOFF' }, { x: 30, y: 72, type: 'stem' }],
          isFake: true,
          color: '#64748b',
        },
      },
      C: {
        id: 'C',
        label: 'C',
        positionName: 'Center',
        initialPos: { x: 50, y: 65 },
        roleDescription: 'Interior seal block',
        route: { name: 'Seal Block', points: [{ x: 50, y: 65, type: 'snap' }, { x: 54, y: 60, type: 'block', label: 'SEAL' }], isBlocking: true },
      },
      WR_MOTION: {
        id: 'WR_MOTION',
        label: 'X (Motion Carrier)',
        positionName: 'Backside Receiver',
        initialPos: { x: 16, y: 65 },
        roleDescription: 'Motion across behind QB, take reverse pitch, explode right',
        motion: { startPos: { x: 16, y: 65 }, endPos: { x: 46, y: 76 }, type: 'across' },
        route: {
          name: 'Reverse Sweep Carrier',
          points: [
            { x: 16, y: 65, type: 'motion' },
            { x: 46, y: 76, type: 'snap' },
            { x: 74, y: 72, type: 'stem' },
            { x: 88, y: 40, type: 'target', label: 'RUN' },
          ],
          isBallCarrier: true,
          color: '#ef4444',
        },
      },
      WR1: {
        id: 'WR1',
        label: 'WR1 (Bunch)',
        positionName: 'Bunch Receiver 1',
        initialPos: { x: 65, y: 65 },
        roleDescription: 'Crack block inside linebacker',
        route: { name: 'Crack Block', points: [{ x: 65, y: 65, type: 'snap' }, { x: 60, y: 56, type: 'block', label: 'BLOCK' }], isBlocking: true, color: '#38bdf8' },
      },
      WR2: {
        id: 'WR2',
        label: 'WR2 (Bunch)',
        positionName: 'Bunch Receiver 2',
        initialPos: { x: 73, y: 65 },
        roleDescription: 'Stalk block corner',
        route: { name: 'Stalk Block', points: [{ x: 73, y: 65, type: 'snap' }, { x: 73, y: 55, type: 'block', label: 'BLOCK' }], isBlocking: true, color: '#10b981' },
      },
      WR3: {
        id: 'WR3',
        label: 'WR3 (Bunch)',
        positionName: 'Bunch Receiver 3',
        initialPos: { x: 81, y: 65 },
        roleDescription: 'Seal perimeter safety',
        route: { name: 'Perimeter Seal', points: [{ x: 81, y: 65, type: 'snap' }, { x: 84, y: 54, type: 'block', label: 'SEAL' }], isBlocking: true, color: '#f59e0b' },
      },
      RB: {
        id: 'RB',
        label: 'RB',
        positionName: 'Running Back',
        initialPos: { x: 42, y: 75 },
        roleDescription: 'Lead block around right edge',
        route: { name: 'Lead Block', points: [{ x: 42, y: 75, type: 'snap' }, { x: 76, y: 68, type: 'stem' }, { x: 88, y: 52, type: 'block', label: 'LEAD' }], isBlocking: true, color: '#a855f7' },
      },
    },
  },
  {
    id: 'one-line-run-2',
    playNumber: '*',
    code: '* 1 LINE 4 RIGHT SOL WR MOTION SAG ACIK KOSU',
    originalTurkishCode: '* 1 LINE 4 RIGHT SOL WR MOTION SAG ACIK KOSU',
    englishName: '1-Line 4 Right - Left WR Motion Sweep Right',
    category: '1 LINE RUN',
    playType: 'RUN',
    direction: 'RIGHT',
    formationName: '1-Line 4-Right Bunch',
    conceptName: 'Motion Sweep Right',
    tags: ['1 Line', 'Motion Sweep', 'Perimeter Run'],
    description: 'Pre-snap motion from left receiver across the formation for an outside perimeter sweep to the right.',
    coachingPoints: ['Snap timed precisely as motion runner reaches QB shoulder.', 'Lead blocks on perimeter.'],
    progressionReads: [{ order: 1, playerId: 'WR_MOTION', concept: 'Perimeter Sweep', cue: 'Follow RB lead block' }],
    qbDrop: 'QB Keep',
    players: {
      QB: {
        id: 'QB',
        label: 'QB',
        positionName: 'Quarterback',
        initialPos: { x: 50, y: 75 },
        roleDescription: 'Handoff to motion runner',
        route: { name: 'Handoff', points: [{ x: 50, y: 75, type: 'snap' }, { x: 52, y: 76, type: 'fake', label: 'HANDOFF' }], isFake: true },
      },
      C: {
        id: 'C',
        label: 'C',
        positionName: 'Center',
        initialPos: { x: 50, y: 65 },
        roleDescription: 'Interior seal',
        route: { name: 'Seal Block', points: [{ x: 50, y: 65, type: 'snap' }, { x: 54, y: 60, type: 'block', label: 'SEAL' }], isBlocking: true },
      },
      WR_MOTION: {
        id: 'WR_MOTION',
        label: 'X (Motion Carrier)',
        positionName: 'Backside Receiver',
        initialPos: { x: 16, y: 65 },
        roleDescription: 'Motion across, take sweep handoff, accelerate right',
        motion: { startPos: { x: 16, y: 65 }, endPos: { x: 48, y: 75 }, type: 'across' },
        route: {
          name: 'Sweep Ball Carrier',
          points: [{ x: 16, y: 65, type: 'motion' }, { x: 48, y: 75, type: 'snap' }, { x: 74, y: 70, type: 'stem' }, { x: 88, y: 42, type: 'target', label: 'RUN' }],
          isBallCarrier: true,
          color: '#ef4444',
        },
      },
      WR1: {
        id: 'WR1',
        label: 'WR1',
        positionName: 'Bunch WR 1',
        initialPos: { x: 65, y: 65 },
        roleDescription: 'Crack block',
        route: { name: 'Crack Block', points: [{ x: 65, y: 65, type: 'snap' }, { x: 60, y: 56, type: 'block', label: 'BLOCK' }], isBlocking: true },
      },
      WR2: {
        id: 'WR2',
        label: 'WR2',
        positionName: 'Bunch WR 2',
        initialPos: { x: 73, y: 65 },
        roleDescription: 'Stalk block',
        route: { name: 'Stalk Block', points: [{ x: 73, y: 65, type: 'snap' }, { x: 73, y: 55, type: 'block', label: 'BLOCK' }], isBlocking: true },
      },
      WR3: {
        id: 'WR3',
        label: 'WR3',
        positionName: 'Bunch WR 3',
        initialPos: { x: 81, y: 65 },
        roleDescription: 'Perimeter seal',
        route: { name: 'Perimeter Seal', points: [{ x: 81, y: 65, type: 'snap' }, { x: 84, y: 54, type: 'block', label: 'SEAL' }], isBlocking: true },
      },
      RB: {
        id: 'RB',
        label: 'RB',
        positionName: 'Running Back',
        initialPos: { x: 42, y: 75 },
        roleDescription: 'Lead block on perimeter',
        route: { name: 'Lead Block', points: [{ x: 42, y: 75, type: 'snap' }, { x: 78, y: 66, type: 'stem' }, { x: 88, y: 52, type: 'block', label: 'LEAD' }], isBlocking: true },
      },
    },
  },
  {
    id: 'one-line-run-3',
    playNumber: '*',
    code: '* 1 LINE 4 RIGHT SOL WR MOTION FAKE QB SOL ACIK KOSU',
    originalTurkishCode: '* 1 LINE 4 RIGHT SOL WR MOTION FAKE QB SOL ACIK KOSU',
    englishName: '1-Line 4 Right - Motion Fake -> QB Sweep Left',
    category: '1 LINE RUN',
    playType: 'RUN',
    direction: 'LEFT',
    formationName: '1-Line 4-Right Bunch',
    conceptName: 'Motion Fake QB Boot / Sweep Left',
    tags: ['1 Line', 'QB Sweep', 'Motion Fake', 'Counter Flow'],
    description: 'Deceptive play where the motion man fakes taking the sweep to the right, while the Quarterback keeps and runs a sweep to the left.',
    coachingPoints: ['Sell the rightward motion fake to draw defense flow right.', 'QB cuts back aggressively to the vacated left flat.'],
    progressionReads: [{ order: 1, playerId: 'QB', concept: 'QB Boot Sweep Left', cue: 'Attack vacated left boundary' }],
    qbDrop: 'QB Keep',
    players: {
      QB: {
        id: 'QB',
        label: 'QB',
        positionName: 'Quarterback',
        initialPos: { x: 50, y: 75 },
        roleDescription: 'Mesh fake right, keep ball and sprint sweep left',
        route: {
          name: 'QB Sweep Left Carrier',
          points: [{ x: 50, y: 75, type: 'snap' }, { x: 53, y: 76, type: 'fake', label: 'FAKE' }, { x: 30, y: 72, type: 'stem' }, { x: 14, y: 40, type: 'target', label: 'RUN' }],
          isBallCarrier: true,
          color: '#ef4444',
        },
      },
      C: {
        id: 'C',
        label: 'C',
        positionName: 'Center',
        initialPos: { x: 50, y: 65 },
        roleDescription: 'Interior seal block left',
        route: { name: 'Seal Left', points: [{ x: 50, y: 65, type: 'snap' }, { x: 44, y: 60, type: 'block', label: 'SEAL' }], isBlocking: true },
      },
      WR_MOTION: {
        id: 'WR_MOTION',
        label: 'X (Motion Fake)',
        positionName: 'Motion Fake Receiver',
        initialPos: { x: 16, y: 65 },
        roleDescription: 'Motion across, fake taking handoff to right',
        motion: { startPos: { x: 16, y: 65 }, endPos: { x: 48, y: 75 }, type: 'across' },
        route: {
          name: 'Motion Fake',
          points: [{ x: 16, y: 65, type: 'motion' }, { x: 48, y: 75, type: 'snap' }, { x: 74, y: 70, type: 'fake', label: 'FAKE' }],
          isFake: true,
          color: '#64748b',
        },
      },
      WR1: {
        id: 'WR1',
        label: 'WR1',
        positionName: 'Bunch WR 1',
        initialPos: { x: 65, y: 65 },
        roleDescription: 'Route / Stalk',
        route: { name: 'Stalk Block', points: [{ x: 65, y: 65, type: 'snap' }, { x: 65, y: 55, type: 'block', label: 'BLOCK' }], isBlocking: true },
      },
      WR2: {
        id: 'WR2',
        label: 'WR2',
        positionName: 'Bunch WR 2',
        initialPos: { x: 73, y: 65 },
        roleDescription: 'Stalk block',
        route: { name: 'Stalk Block', points: [{ x: 73, y: 65, type: 'snap' }, { x: 73, y: 55, type: 'block', label: 'BLOCK' }], isBlocking: true },
      },
      WR3: {
        id: 'WR3',
        label: 'WR3',
        positionName: 'Bunch WR 3',
        initialPos: { x: 81, y: 65 },
        roleDescription: 'Stalk block',
        route: { name: 'Stalk Block', points: [{ x: 81, y: 65, type: 'snap' }, { x: 81, y: 55, type: 'block', label: 'BLOCK' }], isBlocking: true },
      },
      RB: {
        id: 'RB',
        label: 'RB',
        positionName: 'Running Back',
        initialPos: { x: 42, y: 75 },
        roleDescription: 'Lead block out to the left for QB',
        route: { name: 'Lead Block Left', points: [{ x: 42, y: 75, type: 'snap' }, { x: 26, y: 70, type: 'stem' }, { x: 16, y: 50, type: 'block', label: 'LEAD' }], isBlocking: true, color: '#f59e0b' },
      },
    },
  },

  // 1 LINE PASS PLAYS
  createOneLinePassPlay('p1', true, 3, 2, 1, 7, 1, 2),
  createOneLinePassPlay('p1', false, 3, 2, 1, 7, 1, 2),
  createOneLinePassPlay('p2', true, 3, 8, 7, 4, 7, 8),
  createOneLinePassPlay('p2', false, 3, 8, 7, 4, 7, 8),
  createOneLinePassPlay('p3', true, 3, 6, 5, 5, 8, 6),
  createOneLinePassPlay('p3', false, 3, 6, 8, 5, 5, 6),
  createOneLinePassPlay('p4', true, 3, 2, 3, 7, 4, 8),
  createOneLinePassPlay('p4', false, 3, 8, 4, 7, 3, 2),
  createOneLinePassPlay('p5', true, 4, 'WHIP', 2, 4, 8, 9),
  createOneLinePassPlay('p5', false, 4, 9, 8, 4, 2, 'WHIP'),
  createOneLinePassPlay('p6', true, 4, 9, 'QUICK SLANT', 5, 'WHEEL', 8),
  createOneLinePassPlay('p6', false, 4, 8, 'WHEEL', 5, 'QUICK SLANT', 9),
];
