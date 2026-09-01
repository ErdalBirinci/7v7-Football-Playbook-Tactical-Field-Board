import { FormationTemplate } from '../types';

export const BUILT_IN_FORMATION_TEMPLATES: FormationTemplate[] = [
  {
    id: 'builtin-trips-right',
    name: 'Trips Right (3x1)',
    category: 'TRIPS PASS',
    direction: 'RIGHT',
    isBuiltIn: true,
    description: '3 receivers to the right (X solo on left, H, Y, Z on right, RB in backfield)',
    playerPositions: {
      QB: { id: 'QB', label: 'QB', positionName: 'Quarterback', initialPos: { x: 50, y: 75 }, roleDescription: 'Passer / Handoff' },
      C: { id: 'C', label: 'C', positionName: 'Center', initialPos: { x: 50, y: 65 }, roleDescription: 'Snap & Pass Pro' },
      X: { id: 'X', label: 'X (Solo)', positionName: 'Outside Left WR', initialPos: { x: 16, y: 65 }, roleDescription: 'Solo 1-on-1' },
      H: { id: 'H', label: 'H (Slot)', positionName: 'Inside Slot', initialPos: { x: 66, y: 66 }, roleDescription: 'Inside Seam/Out' },
      Y: { id: 'Y', label: 'Y (Slot)', positionName: 'Middle Slot', initialPos: { x: 76, y: 66 }, roleDescription: 'Intermediate Dig/Corner' },
      Z: { id: 'Z', label: 'Z (WR-R)', positionName: 'Outside Right WR', initialPos: { x: 88, y: 65 }, roleDescription: 'Perimeter Primary' },
      RB: { id: 'RB', label: 'RB', positionName: 'Running Back', initialPos: { x: 42, y: 75 }, roleDescription: 'Pass Pro / Checkdown' },
    },
  },
  {
    id: 'builtin-trips-left',
    name: 'Trips Left (3x1)',
    category: 'TRIPS PASS',
    direction: 'LEFT',
    isBuiltIn: true,
    description: '3 receivers to the left (Z solo on right, X, Y, H on left, RB in backfield)',
    playerPositions: {
      QB: { id: 'QB', label: 'QB', positionName: 'Quarterback', initialPos: { x: 50, y: 75 }, roleDescription: 'Passer / Handoff' },
      C: { id: 'C', label: 'C', positionName: 'Center', initialPos: { x: 50, y: 65 }, roleDescription: 'Snap & Pass Pro' },
      X: { id: 'X', label: 'X (WR-L)', positionName: 'Outside Left WR', initialPos: { x: 12, y: 65 }, roleDescription: 'Perimeter Primary' },
      Y: { id: 'Y', label: 'Y (Slot)', positionName: 'Middle Slot', initialPos: { x: 24, y: 66 }, roleDescription: 'Intermediate Dig/Corner' },
      H: { id: 'H', label: 'H (Slot)', positionName: 'Inside Slot', initialPos: { x: 34, y: 66 }, roleDescription: 'Inside Seam/Out' },
      Z: { id: 'Z', label: 'Z (Solo)', positionName: 'Outside Right WR', initialPos: { x: 84, y: 65 }, roleDescription: 'Solo 1-on-1' },
      RB: { id: 'RB', label: 'RB', positionName: 'Running Back', initialPos: { x: 58, y: 75 }, roleDescription: 'Pass Pro / Checkdown' },
    },
  },
  {
    id: 'builtin-twins-2x2',
    name: 'Twins 2x2 (Spread)',
    category: 'TWINS PASS',
    direction: 'BALANCED',
    isBuiltIn: true,
    description: '2x2 Balanced spread formation (X & H left, Y & Z right)',
    playerPositions: {
      QB: { id: 'QB', label: 'QB', positionName: 'Quarterback', initialPos: { x: 50, y: 75 }, roleDescription: 'Passer / Handoff' },
      C: { id: 'C', label: 'C', positionName: 'Center', initialPos: { x: 50, y: 65 }, roleDescription: 'Snap & Pass Pro' },
      X: { id: 'X', label: 'X (WR-L)', positionName: 'Outside Left WR', initialPos: { x: 15, y: 65 }, roleDescription: 'Boundary Outside' },
      H: { id: 'H', label: 'H (Slot-L)', positionName: 'Inside Left Slot', initialPos: { x: 30, y: 66 }, roleDescription: 'Field Slot Left' },
      Y: { id: 'Y', label: 'Y (Slot-R)', positionName: 'Inside Right Slot', initialPos: { x: 70, y: 66 }, roleDescription: 'Field Slot Right' },
      Z: { id: 'Z', label: 'Z (WR-R)', positionName: 'Outside Right WR', initialPos: { x: 85, y: 65 }, roleDescription: 'Boundary Outside' },
      RB: { id: 'RB', label: 'RB', positionName: 'Running Back', initialPos: { x: 42, y: 75 }, roleDescription: 'Pass Pro / Option Route' },
    },
  },
  {
    id: 'builtin-empty-5wide',
    name: 'Empty 5-Wide',
    category: 'EMPTY PASS',
    direction: 'BALANCED',
    isBuiltIn: true,
    description: 'No backs in backfield, 5 wide receivers stretched horizontally across field',
    playerPositions: {
      QB: { id: 'QB', label: 'QB', positionName: 'Quarterback', initialPos: { x: 50, y: 75 }, roleDescription: 'Quick Passer' },
      C: { id: 'C', label: 'C', positionName: 'Center', initialPos: { x: 50, y: 65 }, roleDescription: 'Snap & Pro' },
      X: { id: 'X', label: 'X (WR-1)', positionName: 'Far Left WR', initialPos: { x: 12, y: 65 }, roleDescription: 'Quick Outlet' },
      H: { id: 'H', label: 'H (Slot-1)', positionName: 'Left Slot', initialPos: { x: 28, y: 66 }, roleDescription: 'Slot Quick Under' },
      Y: { id: 'Y', label: 'Y (Slot-2)', positionName: 'Right Inside Slot', initialPos: { x: 65, y: 66 }, roleDescription: 'Seam Crosser' },
      RB: { id: 'RB', label: 'RB (Slot-3)', positionName: 'Right Slot', initialPos: { x: 77, y: 66 }, roleDescription: 'Motion / Wheel' },
      Z: { id: 'Z', label: 'Z (WR-2)', positionName: 'Far Right WR', initialPos: { x: 88, y: 65 }, roleDescription: 'Outside Vertical' },
    },
  },
  {
    id: 'builtin-split-backs',
    name: 'Split Backs (Pro Set)',
    category: 'SPLIT PASS',
    direction: 'BALANCED',
    isBuiltIn: true,
    description: 'Two running backs flanking the QB with 3 spread receivers',
    playerPositions: {
      QB: { id: 'QB', label: 'QB', positionName: 'Quarterback', initialPos: { x: 50, y: 75 }, roleDescription: 'Passer / Option' },
      C: { id: 'C', label: 'C', positionName: 'Center', initialPos: { x: 50, y: 65 }, roleDescription: 'Snap & Pass Pro' },
      X: { id: 'X', label: 'X (WR-L)', positionName: 'Outside Left WR', initialPos: { x: 15, y: 65 }, roleDescription: 'Boundary ISO' },
      H: { id: 'H', label: 'H (Slot)', positionName: 'Slot Receiver', initialPos: { x: 32, y: 66 }, roleDescription: 'Intermediate Seam' },
      Z: { id: 'Z', label: 'Z (WR-R)', positionName: 'Outside Right WR', initialPos: { x: 85, y: 65 }, roleDescription: 'Field ISO' },
      Y: { id: 'Y', label: 'HB (Left Back)', positionName: 'Left Halfback', initialPos: { x: 40, y: 77 }, roleDescription: 'Pass Pro / Dual Flat' },
      RB: { id: 'RB', label: 'RB (Right Back)', positionName: 'Right Running Back', initialPos: { x: 60, y: 77 }, roleDescription: 'Pass Pro / Wheel' },
    },
  },
  {
    id: 'builtin-bunch-right',
    name: 'Bunch / Stack Right',
    category: 'TRIPS PASS',
    direction: 'RIGHT',
    isBuiltIn: true,
    description: 'Tight clustered 3-man bunch on right creating natural pick/rub routes',
    playerPositions: {
      QB: { id: 'QB', label: 'QB', positionName: 'Quarterback', initialPos: { x: 50, y: 75 }, roleDescription: 'Passer / Handoff' },
      C: { id: 'C', label: 'C', positionName: 'Center', initialPos: { x: 50, y: 65 }, roleDescription: 'Snap & Pass Pro' },
      X: { id: 'X', label: 'X (Solo)', positionName: 'Outside Left WR', initialPos: { x: 15, y: 65 }, roleDescription: 'Backside Solo' },
      Z: { id: 'Z', label: 'Z (Bunch Point)', positionName: 'Point Receiver', initialPos: { x: 76, y: 65 }, roleDescription: 'Point Clearout' },
      H: { id: 'H', label: 'H (Bunch Inside)', positionName: 'Inside Bunch Slot', initialPos: { x: 71, y: 67 }, roleDescription: 'Under Rub / Flat' },
      Y: { id: 'Y', label: 'Y (Bunch Outside)', positionName: 'Outside Bunch Slot', initialPos: { x: 81, y: 67 }, roleDescription: 'Corner / Flag' },
      RB: { id: 'RB', label: 'RB', positionName: 'Running Back', initialPos: { x: 42, y: 75 }, roleDescription: 'Checkdown' },
    },
  },
  {
    id: 'builtin-2line-tight',
    name: '2-Line Tight Set',
    category: '2 LINE PASS',
    direction: 'BALANCED',
    isBuiltIn: true,
    description: 'Compact 2-line formation for quick play-action and tight window reads',
    playerPositions: {
      QB: { id: 'QB', label: 'QB', positionName: 'Quarterback', initialPos: { x: 50, y: 75 }, roleDescription: 'Passer / Handoff' },
      C: { id: 'C', label: 'C', positionName: 'Center', initialPos: { x: 50, y: 65 }, roleDescription: 'Snap & Pass Pro' },
      X: { id: 'X', label: 'X (WR-L)', positionName: 'Tight Left WR', initialPos: { x: 22, y: 65 }, roleDescription: 'Tight Split Left' },
      H: { id: 'H', label: 'H (SR-L)', positionName: 'Inside Slot Left', initialPos: { x: 38, y: 66 }, roleDescription: 'Inside Cross' },
      Y: { id: 'Y', label: 'Y (SR-R)', positionName: 'Inside Slot Right', initialPos: { x: 62, y: 66 }, roleDescription: 'Inside Cross' },
      Z: { id: 'Z', label: 'Z (WR-R)', positionName: 'Tight Right WR', initialPos: { x: 78, y: 65 }, roleDescription: 'Tight Split Right' },
      RB: { id: 'RB', label: 'RB (Deep Pistol)', positionName: 'Pistol Running Back', initialPos: { x: 50, y: 81 }, roleDescription: 'Pistol Run / Pro' },
    },
  },
];

const STORAGE_KEY = 'playbook_formation_templates_v1';

export function getStoredFormationTemplates(): FormationTemplate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return BUILT_IN_FORMATION_TEMPLATES;
    }
    const customTemplates: FormationTemplate[] = JSON.parse(raw);
    return [...BUILT_IN_FORMATION_TEMPLATES, ...customTemplates];
  } catch (err) {
    console.error('Error loading custom formation templates:', err);
    return BUILT_IN_FORMATION_TEMPLATES;
  }
}

export function saveCustomFormationTemplate(newTemplate: FormationTemplate): FormationTemplate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const existing: FormationTemplate[] = raw ? JSON.parse(raw) : [];
    // If ID exists, replace; otherwise append
    const index = existing.findIndex((t) => t.id === newTemplate.id);
    let updated: FormationTemplate[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = newTemplate;
    } else {
      updated = [newTemplate, ...existing];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return [...BUILT_IN_FORMATION_TEMPLATES, ...updated];
  } catch (err) {
    console.error('Error saving custom formation template:', err);
    return getStoredFormationTemplates();
  }
}

export function deleteCustomFormationTemplate(templateId: string): FormationTemplate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return BUILT_IN_FORMATION_TEMPLATES;
    const existing: FormationTemplate[] = JSON.parse(raw);
    const updated = existing.filter((t) => t.id !== templateId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return [...BUILT_IN_FORMATION_TEMPLATES, ...updated];
  } catch (err) {
    console.error('Error deleting custom formation template:', err);
    return getStoredFormationTemplates();
  }
}
