import { Play } from '../../types';
import { generateRoutePoints } from '../routeGenerator';

function createEmptyPassPlay(
  playNumber: number | string,
  isRight: boolean,
  r1: number | string,
  r2: number | string,
  r3: number | string,
  leftWR1: number | string = 1,
  leftWR2: number | string = 2,
  specialTag?: string
): Play {
  const dir = isRight ? 'RIGHT' : 'LEFT';
  const sideLabel = isRight ? 'Right' : 'Left';
  const code = `${playNumber}. EMPTY ${dir} ${r1} ${r2} ${r3}${specialTag ? ' ' + specialTag : ''}`;

  // Positions on field in 5-wide Empty:
  // Left: X=14 (WR1-L), H=30 (Slot1-L)
  // Center: C=50, QB=50
  // Right: Y=66 (Slot1-R), SR=78 (Slot2-R), Z=88 (WR1-R)
  const zX = isRight ? 88 : 14;
  const srX = isRight ? 78 : 30;
  const yX = isRight ? 66 : 42;
  const hX = isRight ? 30 : 70;
  const xX = isRight ? 14 : 86;

  const zGen = generateRoutePoints(zX, 65, r1, { isRightSide: isRight });
  const srGen = generateRoutePoints(srX, 66, r2, { isRightSide: isRight });
  const yGen = generateRoutePoints(yX, 66, r3, { isRightSide: isRight });
  const hGen = generateRoutePoints(hX, 66, leftWR2, { isRightSide: !isRight });
  const xGen = generateRoutePoints(xX, 65, leftWR1, { isRightSide: !isRight });

  return {
    id: `empty-pass-${playNumber}-${dir.toLowerCase()}`,
    playNumber,
    code,
    originalTurkishCode: code,
    englishName: `Empty ${sideLabel} - [${r1} / ${r2} / ${r3}] ${specialTag ? `(${specialTag})` : ''}`,
    category: 'EMPTY PASS',
    playType: 'PASS',
    direction: dir,
    formationName: `Empty ${sideLabel} (5-Wide Spread)`,
    conceptName: `5-Wide Route Concept (${r1}-${r2}-${r3})`,
    tags: ['Empty', 'Pass Concept', isRight ? 'Right Trips Side' : 'Left Trips Side', '5-Wide'],
    description: `7v7 Empty ${sideLabel} 5-wide pass play. Stretches the defense horizontally with 5 receivers releasing simultaneously across all levels.`,
    coachingPoints: [
      `Quick 3-step rhythm drop from shotgun.`,
      `Primary read to the 3-receiver trips side (${r1} / ${r2} / ${r3}).`,
      `Backside 2-receiver side (${leftWR1} / ${leftWR2}) acts as man-beater isolate or alert read.`,
    ],
    progressionReads: [
      { order: 1, playerId: isRight ? 'Z' : 'X', concept: `Trips Outside Route (${r1})`, cue: 'Check safety depth and corner cushion' },
      { order: 2, playerId: isRight ? 'SR' : 'H', concept: `Middle Slot Route (${r2})`, cue: 'Target seam or intermediate void' },
      { order: 3, playerId: isRight ? 'Y' : 'Y', concept: `Inside Slot Route (${r3})`, cue: 'Underneath crossing or curl window' },
      { order: 4, playerId: isRight ? 'X' : 'Z', concept: `Backside Matchup (${leftWR1})`, cue: 'Alert against Cover 0 / Cover 1 man' },
    ],
    qbDrop: 'Shotgun 3-Step',
    players: {
      QB: {
        id: 'QB',
        label: 'QB',
        positionName: 'Quarterback',
        initialPos: { x: 50, y: 75 },
        roleDescription: 'Quick 3-step shotgun drop, fast progression scan',
        route: {
          name: '3-Step Drop',
          points: [
            { x: 50, y: 75, type: 'snap' },
            { x: 50, y: 79, type: 'stem' },
          ],
        },
      },
      C: {
        id: 'C',
        label: 'C',
        positionName: 'Center',
        initialPos: { x: 50, y: 65 },
        roleDescription: 'Snaps ball and seals interior pass rush',
        route: {
          name: 'Pass Protection',
          points: [
            { x: 50, y: 65, type: 'snap' },
            { x: 50, y: 64, type: 'block', label: 'PRO' },
          ],
          isBlocking: true,
        },
      },
      Z: {
        id: 'Z',
        label: isRight ? 'Z (WR1-R)' : 'X (WR1-L)',
        positionName: 'Outside Trips Receiver',
        initialPos: { x: zX, y: 65 },
        roleDescription: `Runs route ${r1}`,
        route: {
          name: zGen.name,
          routeNumber: r1,
          points: zGen.points,
          isPrimary: true,
          color: '#38bdf8',
        },
      },
      SR: {
        id: 'SR',
        label: isRight ? 'SR (Slot2-R)' : 'H (Slot2-L)',
        positionName: 'Middle Slot Receiver',
        initialPos: { x: srX, y: 66 },
        roleDescription: `Runs route ${r2}`,
        route: {
          name: srGen.name,
          routeNumber: r2,
          points: srGen.points,
          isSecondary: true,
          color: '#10b981',
        },
      },
      Y: {
        id: 'Y',
        label: isRight ? 'Y (Slot1-R / PUMPKIN)' : 'Y (Slot1-L / PUMPKIN)',
        positionName: 'Inside Slot Receiver',
        initialPos: { x: yX, y: 66 },
        roleDescription: `Runs route ${r3}`,
        route: {
          name: yGen.name,
          routeNumber: r3,
          points: yGen.points,
          color: '#f59e0b',
        },
      },
      H: {
        id: 'H',
        label: isRight ? 'H (Slot-L)' : 'SR (Slot-R)',
        positionName: 'Backside Inside Receiver',
        initialPos: { x: hX, y: 66 },
        roleDescription: `Runs route ${leftWR2}`,
        route: {
          name: hGen.name,
          routeNumber: leftWR2,
          points: hGen.points,
          color: '#ec4899',
        },
      },
      X: {
        id: 'X',
        label: isRight ? 'X (WR-L / SOLO)' : 'Z (WR-R / SOLO)',
        positionName: 'Backside Outside Receiver',
        initialPos: { x: xX, y: 65 },
        roleDescription: `Runs route ${leftWR1}`,
        route: {
          name: xGen.name,
          routeNumber: leftWR1,
          points: xGen.points,
          color: '#a855f7',
        },
      },
    },
  };
}

export const EMPTY_PASS_PLAYS: Play[] = [
  // 137
  createEmptyPassPlay(137, true, 8, 3, 2, 1, 2),
  createEmptyPassPlay(137, false, 2, 3, 8, 1, 2),
  // 138
  createEmptyPassPlay(138, true, 9, 2, 6, 1, 4),
  createEmptyPassPlay(138, false, 6, 2, 9, 1, 4),
  // 139
  createEmptyPassPlay(139, true, 4, 1, 2, 1, 2),
  createEmptyPassPlay(139, false, 2, 1, 4, 1, 2),
  // 140
  createEmptyPassPlay(140, true, 2, 8, 4, 1, 2),
  createEmptyPassPlay(140, false, 4, 8, 2, 1, 2),
  // 141
  createEmptyPassPlay(141, true, 5, 5, 5, 5, 5),
  createEmptyPassPlay(141, false, 5, 5, 5, 5, 5),
  // 142
  createEmptyPassPlay(142, true, 2, 2, 9, 1, 2),
  createEmptyPassPlay(142, false, 9, 2, 2, 1, 2),
  // 143
  createEmptyPassPlay(143, true, 6, 4, 5, 1, 4),
  createEmptyPassPlay(143, false, 5, 4, 6, 1, 4),
  // 144
  createEmptyPassPlay(144, true, 2, 'WHEEL', 8, 1, 2),
  createEmptyPassPlay(144, false, 8, 'WHEEL', 2, 1, 2),
  // 145
  createEmptyPassPlay(145, true, 'QUICK SLANT', 3, 4, 1, 2),
  createEmptyPassPlay(145, false, 4, 3, 'QUICK SLANT', 1, 2),
  // 146
  createEmptyPassPlay(146, true, 5, 'QUICK SLANT', 'WHIP', 1, 4),
  createEmptyPassPlay(146, false, 'WHIP', 'QUICK SLANT', 5, 1, 4),
  // 147
  createEmptyPassPlay(147, true, 2, 'WHIP', 9, 1, 2),
  createEmptyPassPlay(147, false, 9, 'WHIP', 2, 1, 2),
  // 148
  createEmptyPassPlay(148, true, 'QUICK IN', 4, 8, 1, 4),
  createEmptyPassPlay(148, false, 8, 4, 'QUICK IN', 1, 4),
  // 149
  createEmptyPassPlay(149, true, 4, 2, 8, 1, 2, 'SOLO 1'),
  createEmptyPassPlay(149, false, 8, 2, 4, 1, 1, 'SLOT 1'),
  // 150
  createEmptyPassPlay(150, true, 2, 4, 9, 1, 1, 'SLOT 1'),
  createEmptyPassPlay(150, false, 9, 4, 2, 1, 2, 'SOLO 1'),
  // 151
  createEmptyPassPlay(151, true, 9, 3, 8, 'QUICK IN', 2, 'SLOT QUICK IN'),
  createEmptyPassPlay(151, false, 8, 3, 9, 1, 'QUICK IN', 'SOLO QUICK IN'),
];
