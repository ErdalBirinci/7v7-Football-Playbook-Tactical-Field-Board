import React, { useState, useEffect, useRef } from 'react';
import { RouteConceptDefinition } from '../data/routeConceptsData';
import {
  Play as PlayIcon,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  X,
  GraduationCap,
  Sparkles,
  ChevronDown,
  Layers,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

interface CoachingVideoOverlayProps {
  concept: RouteConceptDefinition;
  allAvailableConcepts: RouteConceptDefinition[];
  onSelectConcept: (concept: RouteConceptDefinition) => void;
  onOpenFullModal: () => void;
  onClose: () => void;
  showFieldHighlights: boolean;
  onToggleFieldHighlights: (val: boolean) => void;
}

export const CoachingVideoOverlay: React.FC<CoachingVideoOverlayProps> = ({
  concept,
  allAvailableConcepts,
  onSelectConcept,
  onOpenFullModal,
  onClose,
  showFieldHighlights,
  onToggleFieldHighlights,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState<'bottom-left' | 'top-left' | 'bottom-right'>('bottom-left');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  // Duration in seconds (normalized animation loop)
  const durationSec = concept.videoDurationSec || 40;

  // Active chapter based on currentTimeSec
  const currentChapter = [...concept.videoChapters]
    .reverse()
    .find((c) => currentTimeSec >= c.timeSec) || concept.videoChapters[0];

  // Animation Loop for the Video Canvas
  useEffect(() => {
    let animId: number;

    const renderLoop = (time: number) => {
      const deltaSec = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      if (isPlaying) {
        setCurrentTimeSec((prev) => {
          const next = prev + deltaSec * playbackSpeed;
          if (next >= durationSec) {
            return 0; // Loop back to beginning
          }
          return next;
        });
      }

      drawVideoCanvas();
      animId = requestAnimationFrame(renderLoop);
    };

    lastTimeRef.current = performance.now();
    animId = requestAnimationFrame(renderLoop);
    animFrameRef.current = animId;

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isPlaying, playbackSpeed, concept, durationSec]);

  // Draw tactical animated video simulation on the HTML5 Canvas
  const drawVideoCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background: Dark Tactical Chalkboard
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    // Field Grid Lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let y = 15; y < height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Line of Scrimmage (LOS)
    const losY = height * 0.65;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, losY);
    ctx.lineTo(width, losY);
    ctx.stroke();
    ctx.setLineDash([]);

    // LOS label
    ctx.fillStyle = '#38bdf8';
    ctx.font = '8px monospace';
    ctx.fillText('LOS (0 YDS)', 6, losY - 3);

    // Progress percentage 0 to 1
    const progress = Math.min(1, Math.max(0, currentTimeSec / durationSec));

    // Animation Paths
    const { primaryReceiverPath, secondaryReceiverPath, qbPath, defenders, ballReleaseSec, ballCatchSec, targetPos } = concept.canvasAnimation;

    // Helper: interpolate point along multi-segment path
    const getPosAlongPath = (path: { x: number; y: number }[], t: number) => {
      if (!path || path.length === 0) return { x: width / 2, y: height / 2 };
      if (path.length === 1) return { x: (path[0].x / 100) * width, y: (path[0].y / 100) * height };

      const totalSegments = path.length - 1;
      const segIndex = Math.min(Math.floor(t * totalSegments), totalSegments - 1);
      const segT = (t * totalSegments) - segIndex;

      const p1 = path[segIndex];
      const p2 = path[segIndex + 1];

      return {
        x: ((p1.x + (p2.x - p1.x) * segT) / 100) * width,
        y: ((p1.y + (p2.y - p1.y) * segT) / 100) * height,
      };
    };

    // Draw primary route trajectory trace
    if (primaryReceiverPath && primaryReceiverPath.length > 1) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      primaryReceiverPath.forEach((p, idx) => {
        const px = (p.x / 100) * width;
        const py = (p.y / 100) * height;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // Route arrow tip
      const last = primaryReceiverPath[primaryReceiverPath.length - 1];
      const prev = primaryReceiverPath[primaryReceiverPath.length - 2];
      const lx = (last.x / 100) * width;
      const ly = (last.y / 100) * height;
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(lx, ly, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw secondary route trajectory trace
    if (secondaryReceiverPath && secondaryReceiverPath.length > 1) {
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      secondaryReceiverPath.forEach((p, idx) => {
        const px = (p.x / 100) * width;
        const py = (p.y / 100) * height;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Target Catch Window Ring
    if (targetPos) {
      const tx = (targetPos.x / 100) * width;
      const ty = (targetPos.y / 100) * height;
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.arc(tx, ty, 8 + Math.sin(currentTimeSec * 5) * 1.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#22c55e';
      ctx.font = '7px sans-serif';
      ctx.fillText('TARGET', tx - 12, ty + 14);
    }

    // Draw Animated Primary Receiver
    const recPos = getPosAlongPath(primaryReceiverPath, Math.min(progress * 1.3, 1));
    ctx.fillStyle = '#0284c7';
    ctx.strokeStyle = '#7dd3fc';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(recPos.x, recPos.y, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 7px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('WR', recPos.x, recPos.y + 2.5);

    // Draw Animated Secondary Receiver if exists
    if (secondaryReceiverPath) {
      const secPos = getPosAlongPath(secondaryReceiverPath, Math.min(progress * 1.2, 1));
      ctx.fillStyle = '#b45309';
      ctx.strokeStyle = '#fde68a';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(secPos.x, secPos.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Draw Animated QB
    const qbPos = getPosAlongPath(qbPath, Math.min(progress * 0.8, 1));
    ctx.fillStyle = '#dc2626';
    ctx.strokeStyle = '#fca5a5';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(qbPos.x, qbPos.y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 7px sans-serif';
    ctx.fillText('QB', qbPos.x, qbPos.y + 2.5);

    // Draw Animated Defenders
    if (defenders && defenders.length > 0) {
      defenders.forEach((def) => {
        const startX = (def.x / 100) * width;
        const startY = (def.y / 100) * height;
        let defX = startX;
        let defY = startY;

        if (def.moveTarget && progress > 0.2) {
          const moveT = Math.min(1, (progress - 0.2) * 1.6);
          const targetX = (def.moveTarget.x / 100) * width;
          const targetY = (def.moveTarget.y / 100) * height;
          defX = startX + (targetX - startX) * moveT;
          defY = startY + (targetY - startY) * moveT;
        }

        ctx.fillStyle = '#475569';
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(defX, defY, 4.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#f87171';
        ctx.font = 'bold 6px monospace';
        ctx.fillText(def.label, defX, defY + 2.2);
      });
    }

    // Draw Football flight animation
    const relNorm = ballReleaseSec / (durationSec || 40);
    const catchNorm = ballCatchSec / (durationSec || 40);

    if (progress >= relNorm && progress <= catchNorm + 0.15) {
      const flightT = Math.min(1, Math.max(0, (progress - relNorm) / (catchNorm - relNorm)));
      const startX = qbPos.x;
      const startY = qbPos.y;
      const endX = (targetPos.x / 100) * width;
      const endY = (targetPos.y / 100) * height;

      // Arc curve
      const ballX = startX + (endX - startX) * flightT;
      const ballY = startY + (endY - startY) * flightT - Math.sin(flightT * Math.PI) * 12;

      // Ball shadow & Ball
      ctx.fillStyle = '#ea580c';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(ballX, ballY, 3, 2, flightT * Math.PI, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Video timestamp badge overlay
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(4, 4, 42, 14);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(4, 4, 42, 14);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '8px monospace';
    const minutes = Math.floor(currentTimeSec / 60);
    const seconds = Math.floor(currentTimeSec % 60);
    const timeStr = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    ctx.fillText(`▶ ${timeStr}`, 8, 14);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    setCurrentTimeSec(pct * durationSec);
  };

  // If minimized, display a sleek compact floating badge
  if (isMinimized) {
    return (
      <div
        className={`absolute z-30 transition-all ${
          position === 'bottom-left'
            ? 'bottom-4 left-4'
            : position === 'top-left'
            ? 'top-4 left-4'
            : 'bottom-4 right-4'
        }`}
      >
        <div className="bg-slate-950/95 backdrop-blur-md border border-blue-500/60 rounded-2xl p-2.5 shadow-2xl flex items-center gap-3 text-xs text-white">
          <div className="w-7 h-7 rounded-xl bg-blue-600 flex items-center justify-center animate-pulse">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-bold flex items-center gap-1.5 text-blue-300">
              <span>{concept.name.split('(')[0]}</span>
              <span className="text-[10px] font-mono text-slate-400">({concept.videoDurationFormatted})</span>
            </div>
            <div className="text-[11px] text-slate-300 truncate max-w-[180px]">
              {currentChapter?.title || 'Tutorial in progress'}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? 'Pause' : 'Play'}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <PlayIcon className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setIsMinimized(false)}
              title="Expand Video HUD"
              className="p-1 rounded-lg hover:bg-blue-900/50 text-blue-400 hover:text-blue-200"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              title="Close Coaching Overlay"
              className="p-1 rounded-lg hover:bg-red-950/60 text-slate-400 hover:text-red-400"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`absolute z-30 transition-all select-none ${
        position === 'bottom-left'
          ? 'bottom-3 left-3'
          : position === 'top-left'
          ? 'top-3 left-3'
          : 'bottom-3 right-3'
      } w-80 sm:w-96 max-w-[calc(100vw-24px)]`}
    >
      <div className="bg-slate-950/95 backdrop-blur-xl border border-blue-500/50 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col">
        {/* Overlay Header Bar */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 px-3 py-2 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <div className="flex items-center gap-1.5 text-xs font-black text-blue-300 uppercase tracking-wider">
              <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
              <span>Coaching Video HUD</span>
            </div>
          </div>

          {/* Quick Concept Dropdown if multiple matched concepts */}
          {allAvailableConcepts.length > 1 && (
            <div className="relative group">
              <select
                value={concept.id}
                onChange={(e) => {
                  const sel = allAvailableConcepts.find((c) => c.id === e.target.value);
                  if (sel) onSelectConcept(sel);
                }}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-[11px] font-bold rounded-lg px-2 py-0.5 outline-none hover:border-blue-400 cursor-pointer"
              >
                {allAvailableConcepts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name.split('(')[0].trim()}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Window Control Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                const nextPos =
                  position === 'bottom-left' ? 'top-left' : position === 'top-left' ? 'bottom-right' : 'bottom-left';
                setPosition(nextPos);
              }}
              title="Dock overlay to different corner"
              className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-[10px]"
            >
              Dock
            </button>
            <button
              onClick={() => setIsMinimized(true)}
              title="Minimize to Pill"
              className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              <Minimize2 className="w-3 h-3" />
            </button>
            <button
              onClick={onClose}
              title="Close Coaching Overlay"
              className="p-1 rounded-md text-slate-400 hover:text-red-400 hover:bg-slate-800"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Video Canvas Stage */}
        <div className="relative bg-black w-full aspect-video flex items-center justify-center overflow-hidden">
          <canvas
            ref={canvasRef}
            width={384}
            height={216}
            className="w-full h-full object-cover"
          />

          {/* Live Coaching Focus Subtitle Banner (Bottom of video) */}
          <div className="absolute bottom-2 left-2 right-2 bg-slate-950/90 backdrop-blur-md border border-slate-700/80 rounded-xl px-2.5 py-1.5 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            <div className="text-[11px] leading-tight overflow-hidden">
              <span className="font-bold text-amber-300 mr-1.5">{currentChapter?.title}:</span>
              <span className="text-slate-200">{currentChapter?.focusPoint || currentChapter?.subtitle}</span>
            </div>
          </div>
        </div>

        {/* Video Scrub Bar */}
        <div
          onClick={handleSeek}
          className="h-1.5 bg-slate-800 hover:h-2 transition-all cursor-pointer relative group"
        >
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-sky-400 relative"
            style={{ width: `${(currentTimeSec / durationSec) * 100}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Video Playback Controls Bar */}
        <div className="px-3 py-2 bg-slate-900/90 flex items-center justify-between gap-2 border-b border-slate-800/80">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? 'Pause Video' : 'Play Video'}
              className="w-7 h-7 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-transform active:scale-90"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <PlayIcon className="w-3.5 h-3.5 ml-0.5" />}
            </button>
            <button
              onClick={() => setCurrentTimeSec(0)}
              title="Restart Tutorial"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono text-slate-300 ml-1">
              {Math.floor(currentTimeSec)}s / {concept.videoDurationFormatted}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {/* Speed Multiplier */}
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
              {[0.5, 1, 1.5].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                    playbackSpeed === spd
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Concept Coaching Highlights & Field Annotation Toggle */}
        <div className="p-3 space-y-2.5 text-xs bg-slate-950/80">
          <div>
            <div className="font-extrabold text-white text-xs flex items-center justify-between">
              <span>{concept.name}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/60">
                {concept.category}
              </span>
            </div>
            <p className="text-slate-400 text-[11px] line-clamp-2 mt-0.5">
              {concept.shortSummary}
            </p>
          </div>

          {/* Quick Coach Golden Rule Box */}
          <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-2 flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-[11px] text-amber-200/90 leading-tight">
              <span className="font-bold text-amber-300">Golden Rule: </span>
              {concept.goldenRule}
            </div>
          </div>

          {/* Action Row: Field Highlights Toggle & Full Modal Trigger */}
          <div className="flex items-center justify-between pt-1 gap-2 border-t border-slate-800/60">
            <label className="flex items-center gap-1.5 text-[11px] text-slate-300 hover:text-white cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showFieldHighlights}
                onChange={(e) => onToggleFieldHighlights(e.target.checked)}
                className="w-3.5 h-3.5 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0"
              />
              <span className="font-medium">Show Field Board Targets</span>
            </label>

            <button
              onClick={onOpenFullModal}
              className="text-[11px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 hover:underline"
            >
              <span>Full Guide</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
