import { Play } from '../../types';
import { generateRoutePoints } from '../routeGenerator';

function createTwoLinePassPlay(
  playNumber: number | string,
  isRight: boolean,
  r1: number | string,
  r2: number | string,
  r3: number | string,
  r4: number | string,
  specialTag?: string,
  isTrips: boolean = true
): Play {
  const dir = isRight ? 'RIGHT' : 'LEFT';
  const sideLabel = isRight ? 'Right' : 'Left';
  const numStr = typeof playNumber === 'number' ? `${playNumber}. ` : '* ';
  const tripsPrefix = isTrips ? `TRIPS ${dir} ` : '';
  const code = `${numStr}2 LINE ${tripsPrefix}${r1} ${r2} ${r3} ${r4}${specialTag ? ' ' + specialTag : ''}`.trim();

  // Positions in 2 Line:
  // If Trips Right:
  // Right side 3-stack: WR-Front at 72 y=65, SR-Back at 72 y=68, Slot-Inside at 62 y=66
  // Left side single: X at 18 y=65
  // QB at 50 y=75, C at 50 y=65, RB at 42 y=75
  const stackFrontX = isRight ? 72 : 28;
  const stackBackX = isRight ? 72 : 28;
  const insideSlotX = isRight ? 60 : 40;
  const backsideX = isRight ? 18 : 82;
  const rbX = isRight ? 42 : 58;

  const wrFrontGen = generateRoutePoints(stackFrontX, 65, r1, { isRightSide: isRight });
  const wrBackGen = generateRoutePoints(stackBackX, 68, r2, { isRightSide: isRight });
  const insideGen = generateRoutePoints(insideSlotX, 66, r3, { isRightSide: isRight });
  const backsideGen = generateRoutePoints(backsideX, 65, r4, { isRightSide: !isRight });
  const rbGen = generateRoutePoints(rbX, 75, 1, { isRightSide: !isRight });

  return {
    id: `two-line-pass-${String(playNumber).replace(/[^a-z0-9]/g, '-')}-${dir.toLowerCase()}`,
    playNumber,
    code,
    originalTurkishCode: code,
    englishName: `2-Line ${isTrips ? `Trips ${sideLabel}` : sideLabel} - [${r1}-${r2}-${r3}-${r4}] ${specialTag ? `(${specialTag})` : ''}`,
    category: '2 LINE PASS',
    playType: 'PASS',
    direction: dir,
    formationName: isTrips ? `2-Line Trips ${sideLabel} (Stack)` : '2-Line Balanced Stack',
    conceptName: `2-Line Stack Combination (${r1}-${r2}-${r3}-${r4})`,
    tags: ['2 Line', 'Stack Pass', isRight ? 'Right Side' : 'Left Side', 'Natural Rub/Pick'],
    description: `7v7 2-Line stack pass play. The tandem alignment creates instant rub/mesh traffic against man coverage and stretches zone levels.`,
    coachingPoints: [
      `Stack Release: Front receiver releases outside, back receiver releases inside to cross defenders.`,
      `Natural Rubs: Capitalize on defender collision/traffic at 5 yards.`,
      `Progression: Primary read to the stack combo (${r1} / ${r2}), backside isolate (${r4}) on single-high alert.`,
    ],
    progressionReads: [
      { order: 1, playerId: 'WR_FRONT', concept: `Stack Front Route (${r1})`, cue: 'Check release leverage and corner hip turn' },
      { order: 2, playerId: 'WR_BACK', concept: `Stack Back Route (${r2})`, cue: 'Target rub window behind front receiver' },
      { order: 3, playerId: 'SLOT', concept: `Inside Seam (${r3})`, cue: 'Read middle linebacker/safety' },
      { order: 4, playerId: 'BACKSIDE', concept: `Backside 1-on-1 (${r4})`, cue: 'Single-coverage alert' },
    ],
    qbDrop: 'Shotgun 3-Step',
    players: {
      QB: {
        id: 'QB',
        label: 'QB',
        positionName: 'Quarterback',
        initialPos: { x: 50, y: 75 },
        roleDescription: 'Rhythm 3-step shotgun drop, scan stack progression',
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
        roleDescription: 'Snap ball and execute pass protection',
        route: {
          name: 'Pass Protection',
          points: [
            { x: 50, y: 65, type: 'snap' },
            { x: 50, y: 64, type: 'block', label: 'PRO' },
          ],
          isBlocking: true,
        },
      },
      WR_FRONT: {
        id: 'WR_FRONT',
        label: isRight ? 'Z (Stack-Front)' : 'X (Stack-Front)',
        positionName: 'Stack Front Receiver',
        initialPos: { x: stackFrontX, y: 65 },
        roleDescription: `Runs route ${r1}`,
        route: {
          name: wrFrontGen.name,
          routeNumber: r1,
          points: wrFrontGen.points,
          isPrimary: true,
          color: '#38bdf8',
        },
      },
      WR_BACK: {
        id: 'WR_BACK',
        label: isRight ? 'SR (Stack-Back)' : 'SR (Stack-Back)',
        positionName: 'Stack Back Receiver',
        initialPos: { x: stackBackX, y: 68 },
        roleDescription: `Runs route ${r2}`,
        route: {
          name: wrBackGen.name,
          routeNumber: r2,
          points: wrBackGen.points,
          isSecondary: true,
          color: '#10b981',
        },
      },
      SLOT: {
        id: 'SLOT',
        label: isRight ? 'H (Inside Slot)' : 'Y (Inside Slot)',
        positionName: 'Inside Slot Receiver',
        initialPos: { x: insideSlotX, y: 66 },
        roleDescription: `Runs route ${r3}`,
        route: {
          name: insideGen.name,
          routeNumber: r3,
          points: insideGen.points,
          color: '#f59e0b',
        },
      },
      BACKSIDE: {
        id: 'BACKSIDE',
        label: isRight ? 'X (Backside WR)' : 'Z (Backside WR)',
        positionName: 'Backside Single Receiver',
        initialPos: { x: backsideX, y: 65 },
        roleDescription: `Runs route ${r4}`,
        route: {
          name: backsideGen.name,
          routeNumber: r4,
          points: backsideGen.points,
          color: '#ec4899',
        },
      },
      RB: {
        id: 'RB',
        label: 'RB',
        positionName: 'Running Back',
        initialPos: { x: rbX, y: 75 },
        roleDescription: 'Checkdown flat release or pass protection',
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

export const TWO_LINE_PASS_PLAYS: Play[] = [
  // 152
  createTwoLinePassPlay(152, true, 8, 1, 7, 8),
  createTwoLinePassPlay(152, false, 8, 7, 1, 8),
  // 153
  createTwoLinePassPlay(153, true, 9, 1, 4, 9),
  createTwoLinePassPlay(153, false, 9, 4, 1, 9),
  // 154
  createTwoLinePassPlay(154, true, 9, 1, 7, 2),
  createTwoLinePassPlay(154, false, 2, 7, 1, 9),
  // 155
  createTwoLinePassPlay(155, true, 8, 1, 2, 6),
  createTwoLinePassPlay(155, false, 6, 2, 1, 8),
  // 156
  createTwoLinePassPlay(156, true, 4, 7, 2, 4),
  createTwoLinePassPlay(156, false, 4, 2, 7, 4),
  // 157
  createTwoLinePassPlay(157, true, 9, 2, 5, 9),
  createTwoLinePassPlay(157, false, 9, 5, 2, 9),
  // 158
  createTwoLinePassPlay(158, true, 2, 3, 7, 8),
  createTwoLinePassPlay(158, false, 8, 7, 3, 2),
  // 159
  createTwoLinePassPlay(159, true, 5, 7, 'QUICK SLANT', 6),
  createTwoLinePassPlay(159, false, 6, 'QUICK SLANT', 7, 5),
  // 160
  createTwoLinePassPlay(160, true, 4, 7, 'WHEEL', 8, undefined, false),
  createTwoLinePassPlay(160, false, 8, 'WHEEL', 7, 4, undefined, false),
  // 161
  createTwoLinePassPlay(161, true, 4, 3, 8, 9, undefined, false),
  createTwoLinePassPlay(161, false, 9, 8, 3, 4, undefined, false),
  // 162 Motion Sweep/Pass
  createTwoLinePassPlay(162, true, 'SWEEP_RUN_RIGHT', 'BLOCK', 8, 2, '(FULL SOL / FULL LEFT)', false),
  createTwoLinePassPlay(162, false, 'SWEEP_RUN_LEFT', 'BLOCK', 2, 8, '(SAG / RIGHT)', false),
  // Asterisk 2-Line plays:
  createTwoLinePassPlay('* P1', true, 4, 'WHIP', 4, 'WHIP', "SR'S WHIP WR'S 4", false),
  createTwoLinePassPlay('* P2', true, 8, 'WHEEL', 8, 'WHEEL', "SR'S WHEEL WR'S 8", false),
  createTwoLinePassPlay('* P3', true, 2, 1, 1, 2, '2 1 1 2', false),
  createTwoLinePassPlay('* P4', true, 4, 7, 8, 9, '4 7 8 9', false),
  createTwoLinePassPlay('* P5', true, 6, 5, 4, 6, '6 5 4 6', false),
];
