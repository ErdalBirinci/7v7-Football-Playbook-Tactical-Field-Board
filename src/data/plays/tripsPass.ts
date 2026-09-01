import { Play } from '../../types';
import { generateRoutePoints } from '../routeGenerator';

// Helper to build 7v7 Trips Pass plays
function createTripsPassPlay(
  playNumber: string | number,
  isRight: boolean,
  r1: number | string,
  r2: number | string,
  r3: number | string,
  cilekRoute: number | string = 1,
  pumpkinRoute?: number | string,
  specialTag?: string,
  isScreen?: boolean
): Play {
  const dir = isRight ? 'RIGHT' : 'LEFT';
  const sideLabel = isRight ? 'Right' : 'Left';
  const code = `${playNumber}. TRIPS ${dir} ${r1} ${r2} ${r3}${specialTag ? ' ' + specialTag : ''}`;

  // Positions on field:
  // Center: (50, 65)
  // QB: (50, 75)
  // RB: (isRight ? 42 : 58, 75)
  // Backside X (Cilek): (isRight ? 16 : 84, 65)
  // Trips side (Outside Z, Mid Y, Inside H):
  // If Right: Z=88, Y=76, H=66
  // If Left: Z=12, Y=24, H=34
  const zX = isRight ? 88 : 12;
  const yX = isRight ? 76 : 24;
  const hX = isRight ? 66 : 34;
  const xX = isRight ? 16 : 84;
  const rbX = isRight ? 42 : 58;

  const zRouteCode = r1;
  const yRouteCode = r2;
  const hRouteCode = pumpkinRoute !== undefined ? pumpkinRoute : r3;
  const cilekCode = cilekRoute;

  const zGen = generateRoutePoints(zX, 65, isScreen ? 'BLOCK' : zRouteCode, { isRightSide: isRight });
  const yGen = generateRoutePoints(yX, 66, isScreen ? 'BLOCK' : yRouteCode, { isRightSide: isRight });
  const hGen = generateRoutePoints(hX, 66, isScreen ? 'SCREEN' : hRouteCode, { isRightSide: isRight });
  const xGen = generateRoutePoints(xX, 65, cilekCode, { isRightSide: !isRight });
  const rbGen = generateRoutePoints(rbX, 75, isScreen ? 'BLOCK' : 1, { isRightSide: !isRight });

  return {
    id: `trips-pass-${playNumber}-${dir.toLowerCase()}`,
    playNumber,
    code,
    originalTurkishCode: code,
    englishName: `Trips ${sideLabel} - [${r1}-${r2}-${r3}] ${specialTag ? `(${specialTag})` : ''}`,
    category: 'TRIPS PASS',
    playType: isScreen ? 'SCREEN' : 'PASS',
    direction: dir,
    formationName: `Trips ${sideLabel} (3x1 Spread)`,
    conceptName: isScreen ? 'WR Screen Pass with Dual Slot Blocks' : `Trips Route Combination (${r1}-${r2}-${r3})`,
    tags: ['Trips', isRight ? 'Right Side' : 'Left Side', isScreen ? 'Screen' : 'Pass Concept'],
    description: `7v7 Trips ${sideLabel} pass concept. Outside WR runs route ${r1}, middle slot runs ${r2}, inside slot runs ${hRouteCode}, and backside single receiver (Solo/X) runs ${cilekCode}.`,
    coachingPoints: [
      `1st Read: Check primary route progression on trips strength side (${r1}/${r2}/${hRouteCode}).`,
      `2nd Read: If safety rolls to trips side, isolate Backside X (Solo) on 1-on-1 matchup.`,
      `Checkdown: Running Back flat route or underneath hot outlet.`,
    ],
    progressionReads: [
      { order: 1, playerId: 'Z', concept: `Primary Outside Break (${r1})`, cue: 'Check cornerback leverage on snap' },
      { order: 2, playerId: 'H', concept: `Seam / Inside Route (${hRouteCode})`, cue: 'Read middle linebacker/safety split' },
      { order: 3, playerId: 'X', concept: `Backside Solo (${cilekCode})`, cue: 'Single-coverage 1-on-1 alert' },
      { order: 4, playerId: 'RB', concept: 'Checkdown Flat', cue: 'Underneath safety valve' },
    ],
    qbDrop: isScreen ? 'Quick 1-Step' : 'Shotgun 3-Step',
    players: {
      QB: {
        id: 'QB',
        label: 'QB',
        positionName: 'Quarterback',
        initialPos: { x: 50, y: 75 },
        roleDescription: 'Shotgun dropback, read trips progression inside-out',
        route: {
          name: isScreen ? 'Quick Catch & Fire' : '3-Step Drop',
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
        roleDescription: 'Snaps ball and executes pass protection block',
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
        label: isRight ? 'Z (WR1)' : 'X (WR1)',
        positionName: 'Outside Receiver (WR1)',
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
      Y: {
        id: 'Y',
        label: isRight ? 'Y (SR2)' : 'H (SR2)',
        positionName: 'Middle Slot Receiver (SR2)',
        initialPos: { x: yX, y: 66 },
        roleDescription: `Runs route ${r2}`,
        route: {
          name: yGen.name,
          routeNumber: r2,
          points: yGen.points,
          isSecondary: true,
          color: '#10b981',
        },
      },
      H: {
        id: 'H',
        label: isRight ? 'H (SR1 / SLOT)' : 'Y (SR1 / SLOT)',
        positionName: 'Inside Slot Receiver (SR1)',
        initialPos: { x: hX, y: 66 },
        roleDescription: `Runs route ${hRouteCode}`,
        route: {
          name: hGen.name,
          routeNumber: hRouteCode,
          points: hGen.points,
          color: '#f59e0b',
        },
      },
      X: {
        id: 'X',
        label: isRight ? 'X (SOLO)' : 'Z (SOLO)',
        positionName: 'Backside Isolated Receiver (Solo)',
        initialPos: { x: xX, y: 65 },
        roleDescription: `Backside 1-on-1 route ${cilekCode}`,
        route: {
          name: xGen.name,
          routeNumber: cilekCode,
          points: xGen.points,
          color: '#ec4899',
        },
      },
      RB: {
        id: 'RB',
        label: 'RB',
        positionName: 'Running Back',
        initialPos: { x: rbX, y: 75 },
        roleDescription: 'Check-release to flat or pass pro',
        route: {
          name: rbGen.name,
          points: rbGen.points,
          isCheckdown: true,
          color: '#a855f7',
        },
      },
    },
  };
}

export const TRIPS_PASS_PLAYS: Play[] = [
  // 97
  createTripsPassPlay('97', true, 1, 7, 8, 1),
  createTripsPassPlay('97', false, 8, 7, 1, 1),
  // 98
  createTripsPassPlay('98', true, 1, 3, 9, 1),
  createTripsPassPlay('98', false, 9, 3, 1, 1),
  // 99
  createTripsPassPlay('99', true, 1, 7, 2, 1),
  createTripsPassPlay('99', false, 2, 7, 1, 1),
  // 100
  createTripsPassPlay('100', true, 1, 2, 6, 1),
  createTripsPassPlay('100', false, 6, 2, 1, 1),
  // 101
  createTripsPassPlay('101', true, 7, 2, 4, 1),
  createTripsPassPlay('101', false, 4, 2, 7, 1),
  // 102
  createTripsPassPlay('102', true, 3, 8, 9, 1),
  createTripsPassPlay('102', false, 9, 8, 3, 1),
  // 103
  createTripsPassPlay('103', true, 1, 2, 5, 1),
  createTripsPassPlay('103', false, 5, 2, 1, 1),
  // 104
  createTripsPassPlay('104', true, 3, 8, 7, 1),
  createTripsPassPlay('104', false, 7, 8, 3, 1),
  // 105
  createTripsPassPlay('105', true, 1, 7, 4, 1, undefined, 'SOLO 1'),
  createTripsPassPlay('105', false, 4, 7, 1, 1, 1, 'SLOT 1'),
  // 134
  createTripsPassPlay('134', true, 5, 1, 9, 1, 'QUICK IN', 'SLOT QUICK IN'),
  createTripsPassPlay('134', false, 9, 1, 5, 'QUICK IN', 5, 'SOLO QUICK IN'),
  // 135
  createTripsPassPlay('135', true, 3, 2, 8, 1, 1, 'SOLO 1 SLOT 1'),
  createTripsPassPlay('135', false, 8, 2, 3, 1, 1, 'SLOT 1 SOLO 1'),
  // 136
  createTripsPassPlay('136', true, 'BLOCK', 'BLOCK', 'SCREEN', 1, undefined, 'WR SCREEN PASS (DOUBLE SR BLOCK)', true),
  createTripsPassPlay('136', false, 'SCREEN', 'BLOCK', 'BLOCK', 1, undefined, 'WR SCREEN PASS (DOUBLE SR BLOCK)', true),
];
