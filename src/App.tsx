import React, { useState, useEffect, useRef } from 'react';
import { Play, DefenseScheme } from './types';
import { ALL_PLAYBOOK_PLAYS, getPlayById } from './data/allPlays';
import { DEFENSE_SCHEMES } from './data/defenseSchemes';
import { FieldBoard } from './components/FieldBoard';
import { AnimationController } from './components/AnimationController';
import { TacticalDetailPanel } from './components/TacticalDetailPanel';
import { PlaySelector } from './components/PlaySelector';
import { RouteTreeModal } from './components/RouteTreeModal';
import { GlossaryModal } from './components/GlossaryModal';
import { PlaybookQuizModal } from './components/PlaybookQuizModal';
import { WristbandExportModal } from './components/WristbandExportModal';
import { CustomPlayDesigner } from './components/CustomPlayDesigner';
import {
  BookOpen,
  Languages,
  Zap,
  Printer,
  Sparkles,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Layers,
} from 'lucide-react';

export default function App() {
  // Current active play
  const [selectedPlay, setSelectedPlay] = useState<Play>(() => {
    // Default to Trips Pass Play 97 (Smash / 1 7 8)
    return getPlayById('trips-pass-97-right') || ALL_PLAYBOOK_PLAYS[0];
  });

  // Animation timeline state
  const [progress, setProgress] = useState(0); // 0 to 1
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1); // 0.5, 1, 1.5, 2

  // Tactical overlay toggles
  const [showDefense, setShowDefense] = useState(false);
  const [defenseScheme, setDefenseScheme] = useState<DefenseScheme | null>(DEFENSE_SCHEMES[2]); // Cover 2
  const [showFullRoutes, setShowFullRoutes] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showZones, setShowZones] = useState(true);
  const [fieldTheme, setFieldTheme] = useState<'turf' | 'tactical' | 'chalkboard'>('tactical');

  // Interactive selected player on field
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  // Modals state
  const [isRouteTreeOpen, setIsRouteTreeOpen] = useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isWristbandOpen, setIsWristbandOpen] = useState(false);
  const [isDesignerOpen, setIsDesignerOpen] = useState(false);

  // Animation loop ref
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Play animation loop
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      lastTimeRef.current = null;
      return;
    }

    const duration = 4000 / speed; // 4 seconds standard duration

    const updateLoop = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      setProgress((prev) => {
        const next = prev + deltaTime / duration;
        if (next >= 1) {
          setIsPlaying(false);
          return 1;
        }
        return next;
      });

      animFrameRef.current = requestAnimationFrame(updateLoop);
    };

    animFrameRef.current = requestAnimationFrame(updateLoop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying, speed]);

  // When selected play changes, reset animation
  const handleSelectPlay = (play: Play) => {
    setSelectedPlay(play);
    setProgress(0);
    setIsPlaying(false);
    setSelectedPlayerId(null);
  };

  // Save newly created custom whiteboard play
  const handleSaveCustomPlay = (newPlay: Play) => {
    ALL_PLAYBOOK_PLAYS.unshift(newPlay);
    handleSelectPlay(newPlay);
  };

  // Keyboard shortcuts (Space to toggle play, Left/Right arrows to scrub)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea', 'select'].includes((e.target as HTMLElement).tagName.toLowerCase())) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        setProgress((p) => Math.min(1, p + 0.05));
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        setProgress((p) => Math.max(0, p - 0.05));
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        setProgress(0);
        setIsPlaying(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Application Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Playbook Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <span className="font-mono font-black text-lg tracking-tighter">7v7</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight font-display text-slate-900">
                  GRIDIRON 7v7 PLAYBOOK
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-700 border border-emerald-300">
                  OFFLINE ENGINE
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                {ALL_PLAYBOOK_PLAYS.length} Diagrammed Plays • Vector Route Engine
              </p>
            </div>
          </div>

          {/* Top Quick Utility Buttons */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            <button
              onClick={() => setIsRouteTreeOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-blue-700 font-medium border border-slate-200 flex items-center gap-1.5 transition-all shadow-2xs"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Route Tree (0-9)</span>
              <span className="sm:hidden">Routes</span>
            </button>

            <button
              onClick={() => setIsGlossaryOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100/80 text-amber-800 font-medium border border-amber-200 flex items-center gap-1.5 transition-all shadow-2xs"
            >
              <Languages className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">EN-FI Glossary</span>
              <span className="sm:hidden">Sanasto</span>
            </button>

            <button
              onClick={() => setIsQuizOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100/80 text-purple-800 font-medium border border-purple-200 flex items-center gap-1.5 transition-all shadow-2xs"
            >
              <Zap className="w-3.5 h-3.5 text-purple-600" />
              <span>Quiz Mode</span>
            </button>

            <button
              onClick={() => setIsDesignerOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1.5 transition-all shadow-sm shadow-emerald-600/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Whiteboard Designer</span>
              <span className="sm:hidden">Designer</span>
            </button>

            <button
              onClick={() => setIsWristbandOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium border border-slate-200 flex items-center gap-1.5 transition-all shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Wristband Call Sheet</span>
              <span className="sm:hidden">Print</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Center Column: Field Board & Controller (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Interactive Tactical Field Board */}
          <FieldBoard
            play={selectedPlay}
            progress={progress}
            isPlaying={isPlaying}
            defenseScheme={defenseScheme}
            showDefense={showDefense}
            showFullRoutes={showFullRoutes}
            showLabels={showLabels}
            showZones={showZones}
            selectedPlayerId={selectedPlayerId}
            onSelectPlayer={setSelectedPlayerId}
            fieldTheme={fieldTheme}
          />

          {/* Interactive Animation Controller */}
          <AnimationController
            progress={progress}
            setProgress={setProgress}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            speed={speed}
            setSpeed={setSpeed}
            showDefense={showDefense}
            setShowDefense={setShowDefense}
            defenseScheme={defenseScheme}
            setDefenseScheme={setDefenseScheme}
            showFullRoutes={showFullRoutes}
            setShowFullRoutes={setShowFullRoutes}
            showLabels={showLabels}
            setShowLabels={setShowLabels}
            showZones={showZones}
            setShowZones={setShowZones}
            fieldTheme={fieldTheme}
            setFieldTheme={setFieldTheme}
          />

          {/* Detailed Tactical Progression & Assignment Analysis */}
          <TacticalDetailPanel
            play={selectedPlay}
            selectedPlayerId={selectedPlayerId}
            onSelectPlayer={setSelectedPlayerId}
            onOpenRouteTree={() => setIsRouteTreeOpen(true)}
          />
        </div>

        {/* Right Column: Play Selector & Playbook Explorer (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          <PlaySelector
            selectedPlay={selectedPlay}
            onSelectPlay={handleSelectPlay}
          />

          {/* Quick Shortcuts & Playbook Quick Facts */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm space-y-2.5 text-xs text-slate-600">
            <div className="flex items-center justify-between font-mono text-[11px] text-slate-800 font-bold border-b border-slate-100 pb-2">
              <span>KEYBOARD CONTROLS</span>
              <span className="text-blue-600 font-semibold">7v7 TACTICAL ENGINE</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300 font-semibold">Space</kbd>
                <span>Play / Pause</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300 font-semibold">R</kbd>
                <span>Reset to Snap</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300 font-semibold">← / →</kbd>
                <span>Step Timeline</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300 font-semibold">Click Token</kbd>
                <span>Inspect Player</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500 font-mono">
        Official 7v7 Flag &amp; Touch Football Playbook Engine • 100% Client-Side Vector Graphics • Offline Ready
      </footer>

      {/* Modals */}
      <RouteTreeModal
        isOpen={isRouteTreeOpen}
        onClose={() => setIsRouteTreeOpen(false)}
      />

      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />

      <PlaybookQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
      />

      <WristbandExportModal
        isOpen={isWristbandOpen}
        onClose={() => setIsWristbandOpen(false)}
      />

      <CustomPlayDesigner
        isOpen={isDesignerOpen}
        onClose={() => setIsDesignerOpen(false)}
        onSaveCustomPlay={handleSaveCustomPlay}
      />
    </div>
  );
}
