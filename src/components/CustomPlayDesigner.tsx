import React, { useState, useRef } from 'react';
import { Play, PlayerAssignment } from '../types';
import { ROUTE_TREE } from '../data/routeTree';
import { generateRoutePoints } from '../data/routeGenerator';
import {
  X,
  Plus,
  Play as PlayIcon,
  RotateCcw,
  Download,
  Save,
  Trash2,
  Sparkles,
  Move,
} from 'lucide-react';

interface CustomPlayDesignerProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCustomPlay: (play: Play) => void;
}

export const CustomPlayDesigner: React.FC<CustomPlayDesignerProps> = ({
  isOpen,
  onClose,
  onSaveCustomPlay,
}) => {
  const [playName, setPlayName] = useState('CUSTOM 7v7 PLAY');
  const [playCode, setPlayCode] = useState('CUSTOM 1 7 8');
  const [formation, setFormation] = useState('Trips Right');
  const [direction, setDirection] = useState<'RIGHT' | 'LEFT' | 'BALANCED'>('RIGHT');
  const [playType, setPlayType] = useState<'PASS' | 'RUN' | 'SCREEN'>('PASS');

  // Custom players state
  const [players, setPlayers] = useState<Record<string, PlayerAssignment>>({
    QB: {
      id: 'QB',
      label: 'QB',
      positionName: 'Quarterback',
      initialPos: { x: 50, y: 75 },
      roleDescription: 'Passer / Handoff',
      route: { name: '3-Step Drop', points: [{ x: 50, y: 75, type: 'snap' }, { x: 50, y: 79, type: 'stem' }] },
    },
    C: {
      id: 'C',
      label: 'C',
      positionName: 'Center',
      initialPos: { x: 50, y: 65 },
      roleDescription: 'Snap & Pass Pro',
      route: { name: 'Pass Pro', points: [{ x: 50, y: 65, type: 'snap' }, { x: 50, y: 64, type: 'block' }], isBlocking: true },
    },
    X: {
      id: 'X',
      label: 'X (WR-L)',
      positionName: 'Outside Left WR',
      initialPos: { x: 16, y: 65 },
      roleDescription: 'Route 1',
      route: { name: '1 - Flat', routeNumber: 1, points: generateRoutePoints(16, 65, 1, { isRightSide: false }).points, color: '#ec4899' },
    },
    H: {
      id: 'H',
      label: 'H (Slot)',
      positionName: 'Inside Slot',
      initialPos: { x: 66, y: 66 },
      roleDescription: 'Route 8',
      route: { name: '8 - Post', routeNumber: 8, points: generateRoutePoints(66, 66, 8, { isRightSide: true }).points, color: '#f59e0b' },
    },
    Y: {
      id: 'Y',
      label: 'Y (Slot)',
      positionName: 'Middle Slot',
      initialPos: { x: 76, y: 66 },
      roleDescription: 'Route 7',
      route: { name: '7 - Corner', routeNumber: 7, points: generateRoutePoints(76, 66, 7, { isRightSide: true }).points, isSecondary: true, color: '#10b981' },
    },
    Z: {
      id: 'Z',
      label: 'Z (WR-R)',
      positionName: 'Outside Right WR',
      initialPos: { x: 88, y: 65 },
      roleDescription: 'Route 1',
      route: { name: '1 - Flat', routeNumber: 1, points: generateRoutePoints(88, 65, 1, { isRightSide: true }).points, isPrimary: true, color: '#38bdf8' },
    },
    RB: {
      id: 'RB',
      label: 'RB',
      positionName: 'Running Back',
      initialPos: { x: 42, y: 75 },
      roleDescription: 'Pass Pro Check',
      route: { name: 'Pass Pro', points: [{ x: 42, y: 75, type: 'snap' }, { x: 42, y: 70, type: 'block' }], isBlocking: true, color: '#a855f7' },
    },
  });

  const [selectedPlayerKey, setSelectedPlayerKey] = useState<string>('Z');
  const [draggingPlayerKey, setDraggingPlayerKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRouteSelect = (routeNum: number | string) => {
    if (!selectedPlayerKey || !players[selectedPlayerKey]) return;
    const p = players[selectedPlayerKey];
    const isRight = p.initialPos.x >= 50;
    const generated = generateRoutePoints(p.initialPos.x, p.initialPos.y, routeNum, { isRightSide: isRight });

    setPlayers({
      ...players,
      [selectedPlayerKey]: {
        ...p,
        roleDescription: `Runs route ${routeNum}`,
        route: {
          ...p.route,
          name: generated.name,
          routeNumber: routeNum,
          points: generated.points,
        },
      },
    });
  };

  const handleSave = () => {
    const newPlay: Play = {
      id: `custom-${Date.now()}`,
      playNumber: '★',
      code: playCode,
      originalTurkishCode: playCode,
      englishName: playName,
      category: 'TRIPS PASS',
      playType: playType,
      direction: direction,
      formationName: formation,
      conceptName: playName,
      tags: ['Custom Play', 'Whiteboard Designed'],
      description: 'Custom coach-designed 7v7 play created in the tactical whiteboard designer.',
      progressionReads: [
        {
          order: 1,
          playerId: selectedPlayerKey || 'Z',
          concept: 'Primary assigned route',
          cue: 'Read safety leverage and release timing',
        },
        {
          order: 2,
          playerId: 'Y',
          concept: 'Secondary intermediate read',
          cue: 'Hit soft spot behind dropping linebacker',
        },
      ],
      coachingPoints: ['Execute according to custom assignments and route depths.'],
      qbDrop: 'Shotgun 3-Step',
      players,
    };
    onSaveCustomPlay(newPlay);
    onClose();
  };

  // Convert SVG to Canvas and export PNG image
  const handleExportPNG = () => {
    const svgElement = document.getElementById('designer-svg-canvas');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 900;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));

    img.onload = () => {
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const pngUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.download = `${playCode.replace(/[^a-z0-9]/gi, '_')}.png`;
      a.href = pngUrl;
      a.click();
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 font-display">
                7v7 Tactical Whiteboard Designer
              </h3>
              <p className="text-xs text-slate-500">
                Design, customize routes, test alignments, and export your own playbook plays
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPNG}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 border border-slate-300 transition-all"
            >
              <Download className="w-4 h-4" /> Export PNG
            </button>
            <button
              onClick={handleSave}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Save className="w-4 h-4" /> Save Play
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Designer Content Grid */}
        <div className="p-5 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-5 bg-slate-50/50">
          {/* Left Canvas: SVG Gridiron */}
          <div className="md:col-span-7 space-y-3">
            <div className="relative aspect-[4/3] bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] rounded-2xl border border-slate-300 overflow-hidden shadow-sm p-2 select-none">
              <svg
                id="designer-svg-canvas"
                viewBox="0 0 100 100"
                className="w-full h-full"
              >
                <defs>
                  <marker
                    id="designer-arrow"
                    viewBox="0 0 10 10"
                    refX="6"
                    refY="5"
                    markerWidth="4"
                    markerHeight="4"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
                  </marker>
                </defs>

                {/* Yardlines */}
                {[20, 35, 50, 65, 80].map((y) => (
                  <line
                    key={`des-yard-${y}`}
                    x1="0"
                    y1={y}
                    x2="100"
                    y2={y}
                    stroke={y === 65 ? '#0284c7' : 'rgba(56, 189, 248, 0.2)'}
                    strokeWidth={y === 65 ? '0.8' : '0.35'}
                    strokeDasharray={y === 65 ? undefined : '2,2'}
                  />
                ))}
                <text x="3" y="64" fontSize="2.2" fill="#38bdf8" fontWeight="bold" className="font-mono">
                  LOS (65)
                </text>

                {/* Drawn Routes */}
                {(Object.entries(players) as [string, PlayerAssignment][]).map(([key, player]) => {
                  const pts = player.route.points;
                  if (!pts || pts.length < 2) return null;
                  let d = `M ${pts[0].x} ${pts[0].y}`;
                  for (let i = 1; i < pts.length; i++) {
                    d += ` L ${pts[i].x} ${pts[i].y}`;
                  }
                  return (
                    <path
                      key={`des-route-${key}`}
                      d={d}
                      fill="none"
                      stroke={player.route.color || '#38bdf8'}
                      strokeWidth="1"
                      strokeLinecap="round"
                      markerEnd="url(#designer-arrow)"
                    />
                  );
                })}

                {/* Player Tokens */}
                {(Object.entries(players) as [string, PlayerAssignment][]).map(([key, player]) => {
                  const isSelected = selectedPlayerKey === key;
                  return (
                    <g
                      key={`des-token-${key}`}
                      className="cursor-pointer"
                      onClick={() => setSelectedPlayerKey(key)}
                    >
                      {isSelected && (
                        <circle
                          cx={player.initialPos.x}
                          cy={player.initialPos.y}
                          r="4.2"
                          fill="#facc15"
                          opacity="0.3"
                          className="animate-ping"
                        />
                      )}
                      <circle
                        cx={player.initialPos.x}
                        cy={player.initialPos.y}
                        r="2.8"
                        fill={key === 'QB' ? '#dc2626' : (key === 'C' ? '#475569' : '#0f172a')}
                        stroke={isSelected ? '#facc15' : '#38bdf8'}
                        strokeWidth={isSelected ? '0.9' : '0.6'}
                      />
                      <text
                        x={player.initialPos.x}
                        y={player.initialPos.y + 0.9}
                        textAnchor="middle"
                        fontSize="2"
                        fontWeight="bold"
                        fill="#ffffff"
                        className="font-mono select-none"
                      >
                        {key}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            <p className="text-[11px] text-slate-500 font-mono text-center">
              Click any offensive token to select and assign routes from the panel on the right.
            </p>
          </div>

          {/* Right Panel: Play Meta & Route Selector */}
          <div className="md:col-span-5 space-y-4">
            {/* Play Metadata */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-2xs">
              <div>
                <label className="text-[11px] font-mono text-slate-600 block mb-1">Play Code / Call</label>
                <input
                  type="text"
                  value={playCode}
                  onChange={(e) => setPlayCode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-mono text-slate-600 block mb-1">Direction</label>
                  <select
                    value={direction}
                    onChange={(e) => setDirection(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-mono"
                  >
                    <option value="RIGHT">RIGHT</option>
                    <option value="LEFT">LEFT</option>
                    <option value="BALANCED">BALANCED</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-mono text-slate-600 block mb-1">Play Type</label>
                  <select
                    value={playType}
                    onChange={(e) => setPlayType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-mono"
                  >
                    <option value="PASS">PASS</option>
                    <option value="RUN">RUN</option>
                    <option value="SCREEN">SCREEN</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Selected Player Route Assignment */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  Assign Route to: <span className="text-amber-700 font-mono font-bold">[{selectedPlayerKey}]</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  Current: {players[selectedPlayerKey]?.route.name}
                </span>
              </div>

              {/* 0-9 Route Grid Buttons */}
              <div className="grid grid-cols-5 gap-1.5">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={`route-btn-${num}`}
                    onClick={() => handleRouteSelect(num)}
                    className="p-2 rounded-lg bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-blue-700 border border-slate-200 font-mono font-bold text-xs transition-all text-center"
                  >
                    #{num}
                  </button>
                ))}
              </div>

              {/* Special Routes */}
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                {['WHEEL', 'WHIP', 'BUBBLE', 'QUICK SLANT', 'QUICK IN', 'SMASH'].map((spec) => (
                  <button
                    key={`spec-route-${spec}`}
                    onClick={() => handleRouteSelect(spec)}
                    className="px-2 py-1 rounded bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-[10px] font-mono transition-all font-semibold"
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
