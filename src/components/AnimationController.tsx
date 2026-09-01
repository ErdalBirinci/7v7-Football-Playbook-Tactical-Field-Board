import React from 'react';
import {
  Play as PlayIcon,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Shield,
  Layers,
  Tag,
  Palette,
  Eye,
} from 'lucide-react';
import { DEFENSE_SCHEMES } from '../data/defenseSchemes';
import { DefenseScheme } from '../types';

interface AnimationControllerProps {
  progress: number;
  setProgress: (p: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  speed: number;
  setSpeed: (s: number) => void;
  showDefense: boolean;
  setShowDefense: (val: boolean) => void;
  defenseScheme: DefenseScheme | null;
  setDefenseScheme: (scheme: DefenseScheme | null) => void;
  showFullRoutes: boolean;
  setShowFullRoutes: (val: boolean) => void;
  showLabels: boolean;
  setShowLabels: (val: boolean) => void;
  showZones: boolean;
  setShowZones: (val: boolean) => void;
  fieldTheme: 'turf' | 'tactical' | 'chalkboard';
  setFieldTheme: (theme: 'turf' | 'tactical' | 'chalkboard') => void;
}

export const AnimationController: React.FC<AnimationControllerProps> = ({
  progress,
  setProgress,
  isPlaying,
  setIsPlaying,
  speed,
  setSpeed,
  showDefense,
  setShowDefense,
  defenseScheme,
  setDefenseScheme,
  showFullRoutes,
  setShowFullRoutes,
  showLabels,
  setShowLabels,
  showZones,
  setShowZones,
  fieldTheme,
  setFieldTheme,
}) => {
  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleReset = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  const handleStep = (direction: 'back' | 'forward') => {
    setIsPlaying(false);
    const delta = direction === 'forward' ? 0.05 : -0.05;
    setProgress(Math.min(1, Math.max(0, progress + delta)));
  };

  return (
    <div
      id="play-animation-controller"
      className="w-full bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm space-y-4"
    >
      {/* Top Row: Timeline scrubber & playback phase markers */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-800 font-bold">EXECUTION TIMELINE</span>
            <span className="text-blue-600 font-semibold">
              {progress < 0.25 ? 'Pre-Snap Motion' : progress < 0.65 ? 'Route Stems & Mesh' : 'Break & Target Window'}
            </span>
          </div>
          <span className="font-bold text-slate-800">{(progress * 100).toFixed(0)}%</span>
        </div>

        {/* Progress Slider */}
        <div className="relative flex items-center">
          <input
            type="range"
            min="0"
            max="1"
            step="0.005"
            value={progress}
            onChange={(e) => {
              setIsPlaying(false);
              setProgress(parseFloat(e.target.value));
            }}
            className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 focus:outline-none"
          />
        </div>

        {/* Timeline Phase indicators */}
        <div className="flex justify-between text-[10px] text-slate-400 font-mono px-1">
          <span>0% Pre-Snap</span>
          <span>25% Snap</span>
          <span>50% Route Cut</span>
          <span>75% Catch Point</span>
          <span>100% YAC</span>
        </div>
      </div>

      {/* Middle Row: Playback Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
        {/* Play/Pause & Step Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleReset}
            title="Reset to Pre-Snap (0%)"
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleStep('back')}
            title="Step Back 5%"
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={togglePlay}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shadow-xs ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span className="text-xs uppercase tracking-wider">Pause</span>
              </>
            ) : (
              <>
                <PlayIcon className="w-4 h-4 fill-current" />
                <span className="text-xs uppercase tracking-wider">Play</span>
              </>
            )}
          </button>
          <button
            onClick={() => handleStep('forward')}
            title="Step Forward 5%"
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 ml-2 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs">
            {[0.5, 1, 1.5, 2].map((s) => (
              <button
                key={`speed-${s}`}
                onClick={() => setSpeed(s)}
                className={`px-2 py-1 rounded-lg font-mono text-[11px] font-semibold transition-all ${
                  speed === s
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Tactical Overlay Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Full Routes Toggle */}
          <button
            onClick={() => setShowFullRoutes(!showFullRoutes)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              showFullRoutes
                ? 'bg-blue-50 text-blue-700 border-blue-300'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Routes</span>
          </button>

          {/* Route Numbers & Labels Toggle */}
          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              showLabels
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Labels</span>
          </button>

          {/* Defensive Scheme Toggle & Selector */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                const next = !showDefense;
                setShowDefense(next);
                if (next && !defenseScheme) {
                  setDefenseScheme(DEFENSE_SCHEMES[2]); // default Cover 2
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                showDefense
                  ? 'bg-rose-50 text-rose-700 border-rose-300'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Defense</span>
            </button>

            {showDefense && (
              <select
                value={defenseScheme?.id || 'cover-2'}
                onChange={(e) => {
                  const s = DEFENSE_SCHEMES.find((ds) => ds.id === e.target.value);
                  setDefenseScheme(s || null);
                }}
                className="bg-white text-rose-700 border border-rose-300 rounded-xl px-2.5 py-1.5 text-xs font-mono font-medium focus:outline-none focus:border-rose-500 shadow-2xs"
              >
                {DEFENSE_SCHEMES.map((scheme) => (
                  <option key={scheme.id} value={scheme.id}>
                    {scheme.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Field Theme Selector */}
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setFieldTheme('tactical')}
              className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-all ${
                fieldTheme === 'tactical'
                  ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tactical
            </button>
            <button
              onClick={() => setFieldTheme('turf')}
              className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-all ${
                fieldTheme === 'turf'
                  ? 'bg-emerald-600 text-white font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Turf
            </button>
            <button
              onClick={() => setFieldTheme('chalkboard')}
              className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-all ${
                fieldTheme === 'chalkboard'
                  ? 'bg-slate-800 text-white font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Chalk
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
