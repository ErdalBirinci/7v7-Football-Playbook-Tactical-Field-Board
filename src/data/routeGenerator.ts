import { RoutePoint } from '../types';

/**
 * Generates coordinate waypoints for standard 0-9 routes and custom football concepts
 * based on starting (x, y) coordinates and alignment direction.
 */
export function generateRoutePoints(
  startX: number,
  startY: number,
  routeCode: number | string,
  options: {
    isRightSide?: boolean;
    depthMultiplier?: number;
    customDepth?: number;
    tag?: string;
  } = {}
): { points: RoutePoint[]; name: string } {
  const isRight = options.isRightSide ?? startX > 50;
  const los = 65; // Line of scrimmage Y coordinate
  const stemY = los;
  const outsideDir = isRight ? 1 : -1;
  const insideDir = isRight ? -1 : 1;

  // Convert code to string
  const codeStr = String(routeCode).toUpperCase().trim();

  switch (codeStr) {
    case '0':
    case 'HITCH':
    case 'SMOKE':
      return {
        name: '0 - Quick Hitch / Smoke',
        points: [
          { x: startX, y: startY, type: 'snap' },
          { x: startX, y: startY - 14, type: 'stem' },
          { x: startX + insideDir * 2, y: startY - 10, type: 'target', label: '0' },
        ],
      };

    case '1':
    case 'FLAT':
    case 'QUICK_OUT':
      return {
        name: '1 - Flat / Speed Out (3-5 yds)',
        points: [
          { x: startX, y: startY, type: 'snap' },
          { x: startX, y: startY - 12, type: 'stem' },
          { x: startX + outsideDir * 14, y: startY - 14, type: 'target', label: '1' },
        ],
      };

    case '2':
    case 'SLANT':
      return {
        name: '2 - Slant (3-Step)',
        points: [
          { x: startX, y: startY, type: 'snap' },
          { x: startX, y: startY - 8, type: 'stem' },
          { x: startX + insideDir * 18, y: startY - 24, type: 'target', label: '2' },
        ],
      };

    case '3':
    case 'COMEBACK':
      return {
        name: '3 - Comeback (12 yds)',
        points: [
          { x: startX, y: startY, type: 'snap' },
          { x: startX, y: startY - 32, type: 'stem' },
          { x: startX + outsideDir * 6, y: startY - 26, type: 'target', label: '3' },
        ],
      };

    case '4':
    case 'CURL':
      return {
        name: '4 - Curl / Hitch (10 yds)',
        points: [
          { x: startX, y: startY, type: 'snap' },
          { x: startX, y: startY - 28, type: 'stem' },
          { x: startX + insideDir * 2, y: startY - 24, type: 'target', label: '4' },
        ],
      };

    case '5':
    case 'OUT':
      return {
        name: '5 - Out / Deep Out (10-12 yds)',
        points: [
          { x: startX, y: startY, type: 'snap' },
          { x: startX, y: startY - 28, type: 'stem' },
          { x: startX + outsideDir * 16, y: startY - 28, type: 'target', label: '5' },
        ],
      };

    case '6':
    case 'IN':
    case 'DIG':
      return {
        name: '6 - Dig / In (10-12 yds)',
        points: [
          { x: startX, y: startY, type: 'snap' },
          { x: startX, y: startY - 28, type: 'stem' },
          { x: startX + insideDir * 20, y: startY - 28, type: 'target', label: '6' },
        ],
      };

    case '7':
    case 'CORNER':
    case 'FLAG':
      return {
        name: '7 - Corner / Flag (12-15 yds)',
        points: [
          { x: startX, y: startY, type: 'snap' },
          { x: startX, y: startY - 28, type: 'stem' },
          { x: startX + outsideDir * 18, y: startY - 45, type: 'target', label: '7' },
        ],
      };

    case '8':
    case 'POST':
      return {
        name: '8 - Post (12-15 yds)',
        points: [
          { x: startX, y: startY, type: 'snap' },
          { x: startX, y: startY - 28, type: 'stem' },
          { x: startX + insideDir * 22, y: startY - 48, type: 'target', label: '8' },
        ],
      };

    case '9':
    case 'GO':
    case 'STREAK':
    case 'FLY':
      return {
        name: '9 - Go / Streak (Vertical Deep)',
        points: [
          { x: startX, y: startY, type: 'snap' },
          { x: startX, y: startY - 50, type: 'target', label: '9' },
        ],
      };

    case 'WHEEL':
      return {
        name: 'Wheel Route',
        points: [
          { x: startX, y: startY, type: 'snap' },
          { x: startX + outsideDir * 12, y: startY - 10, type: 'stem' },
          { x: startX + outsideDir * 16, y: startY - 20, type: 'break' },
          { x: startX + outsideDir * 16, y: startY - 48, type: 'target', label: 'WHEEL' },
        ],
      };

    case 'WHIP':
    case 'PIVOT':
      return {
        name: 'Whip / Pivot Route',
        points: [
          { x: startX, y: startY, type: 'snap' },
          { x: startX + insideDir * 6, y: startY - 12, type: 'stem' },
          { x: startX + outsideDir * 12, y: startY - 14, type: 'target', label: 'WHIP' },
        ],
      };

    case 'QUICK_SLANT':
    case 'QUICK SLANT':
      return {
        name: 'Quick Slant',
        points: [
          { x: startX, y: startY, type: 'snap' },
          { x: startX, y: startY - 5, type: 'stem' },
          { x: startX + insideDir * 14, y: startY - 18, type: 'target', label: 'Q-SLANT' },
        ],
      };

    case 'QUICK_IN':
    case 'QUICK IN':
      return {
        name: 'Quick In / Drag (3 yds)',
        points: [
          { x: startX, y: startY, type: 'snap' },
          { x: startX, y: startY - 10, type: 'stem' },
          { x: startX + insideDir * 18, y: startY - 10, type: 'target', label: 'Q-IN' },
        ],
      };

    case 'BUBBLE':
    case 'SCREEN':
      return {
        name: 'Bubble Screen',
        points: [
          { x: startX, y: startY, type: 'snap' },
          { x: startX + outsideDir * 4, y: startY + 4, type: 'break' },
          { x: startX + outsideDir * 8, y: startY - 20, type: 'target', label: 'SCREEN' },
        ],
      };

    case 'BLOCK':
    case 'LEAD_BLOCK':
    case 'SR_BLOCK':
      return {
        name: 'Lead / Stalk Block',
        points: [
          { x: startX, y: startY, type: 'snap' },
          { x: startX + (isRight ? 6 : -6), y: startY - 8, type: 'block', label: 'BLOCK' },
        ],
      };

    case 'PROTECT':
    case 'KORUMA':
      return {
        name: 'Pass Protection',
        points: [
          { x: startX, y: startY, type: 'snap' },
          { x: 50 + (isRight ? 4 : -4), y: startY - 4, type: 'block', label: 'PRO' },
        ],
      };

    case 'SWEEP_RUN_RIGHT':
      return {
        name: 'Sweep Run Right',
        points: [
          { x: startX, y: startY, type: 'snap' },
          { x: startX + 16, y: startY - 3, type: 'stem' },
          { x: startX + 28, y: startY - 8, type: 'break' },
          { x: startX + 32, y: startY - 35, type: 'target', label: 'RUN' },
        ],
      };

    case 'SWEEP_RUN_LEFT':
      return {
        name: 'Sweep Run Left',
        points: [
          { x: startX, y: startY, type: 'snap' },
          { x: startX - 16, y: startY - 3, type: 'stem' },
          { x: startX - 28, y: startY - 8, type: 'break' },
          { x: startX - 32, y: startY - 35, type: 'target', label: 'RUN' },
        ],
      };

    case 'DIVE_RUN':
      return {
        name: 'Inside Dive Run',
        points: [
          { x: startX, y: startY, type: 'snap' },
          { x: 50 + (isRight ? 3 : -3), y: startY - 8, type: 'stem' },
          { x: 50 + (isRight ? 2 : -2), y: startY - 26, type: 'target', label: 'DIVE' },
        ],
      };

    case 'TRAP_RUN_LEFT':
      return {
        name: 'Trap Run Left',
        points: [
          { x: startX, y: startY, type: 'snap' },
          { x: startX + 4, y: startY - 2, type: 'fake' },
          { x: 44, y: startY - 8, type: 'break' },
          { x: 40, y: startY - 30, type: 'target', label: 'TRAP' },
        ],
      };

    case 'TRAP_RUN_RIGHT':
      return {
        name: 'Trap Run Right',
        points: [
          { x: startX, y: startY, type: 'snap' },
          { x: startX - 4, y: startY - 2, type: 'fake' },
          { x: 56, y: startY - 8, type: 'break' },
          { x: 60, y: startY - 30, type: 'target', label: 'TRAP' },
        ],
      };

    case 'COUNTER_RUN_LEFT':
      return {
        name: 'Counter Run Left',
        points: [
          { x: startX, y: startY, type: 'snap' },
          { x: startX + 8, y: startY + 2, type: 'fake' },
          { x: startX - 8, y: startY - 4, type: 'break' },
          { x: startX - 22, y: startY - 28, type: 'target', label: 'COUNTER' },
        ],
      };

    case 'COUNTER_RUN_RIGHT':
      return {
        name: 'Counter Run Right',
        points: [
          { x: startX, y: startY, type: 'snap' },
          { x: startX - 8, y: startY + 2, type: 'fake' },
          { x: startX + 8, y: startY - 4, type: 'break' },
          { x: startX + 22, y: startY - 28, type: 'target', label: 'COUNTER' },
        ],
      };

    case 'MID_DRAW':
      return {
        name: 'Middle Draw',
        points: [
          { x: startX, y: startY, type: 'snap' },
          { x: startX, y: startY + 3, type: 'fake' },
          { x: 50, y: startY - 10, type: 'stem' },
          { x: 50, y: startY - 32, type: 'target', label: 'DRAW' },
        ],
      };

    case 'PONCIK_LEFT':
    case 'JET_SWEEP_LEFT':
      return {
        name: 'Orbit Jet Sweep Left',
        points: [
          { x: startX, y: startY, type: 'snap' },
          { x: 50, y: startY + 6, type: 'stem' },
          { x: 26, y: startY + 2, type: 'break' },
          { x: 14, y: startY - 30, type: 'target', label: 'SWEEP' },
        ],
      };

    case 'PONCIK_RIGHT':
    case 'JET_SWEEP_RIGHT':
      return {
        name: 'Orbit Jet Sweep Right',
        points: [
          { x: startX, y: startY, type: 'snap' },
          { x: 50, y: startY + 6, type: 'stem' },
          { x: 74, y: startY + 2, type: 'break' },
          { x: 86, y: startY - 30, type: 'target', label: 'SWEEP' },
        ],
      };

    default:
      // Default straight stem
      return {
        name: `Custom Route (${codeStr})`,
        points: [
          { x: startX, y: startY, type: 'snap' },
          { x: startX, y: startY - 20, type: 'target', label: codeStr },
        ],
      };
  }
}
