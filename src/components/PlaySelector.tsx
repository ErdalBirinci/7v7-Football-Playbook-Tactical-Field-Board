import React, { useState, useMemo } from 'react';
import { Play, FormationCategory, PlayType, Direction } from '../types';
import { CATEGORIES, ALL_PLAYBOOK_PLAYS, searchPlays } from '../data/allPlays';
import {
  Search,
  Filter,
  Dices,
  ChevronRight,
  Shield,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface PlaySelectorProps {
  selectedPlay: Play;
  onSelectPlay: (play: Play) => void;
}

export const PlaySelector: React.FC<PlaySelectorProps> = ({
  selectedPlay,
  onSelectPlay,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedDirection, setSelectedDirection] = useState<Direction | 'ALL'>('ALL');
  const [selectedPlayType, setSelectedPlayType] = useState<PlayType | 'ALL'>('ALL');

  // Filtered plays list
  const filteredPlays = useMemo(() => {
    return searchPlays(searchQuery, {
      category: selectedCategory,
      direction: selectedDirection,
      playType: selectedPlayType,
    });
  }, [searchQuery, selectedCategory, selectedDirection, selectedPlayType]);

  // Roll a random play
  const handleRandomPlay = () => {
    if (filteredPlays.length === 0) return;
    const randomIdx = Math.floor(Math.random() * filteredPlays.length);
    onSelectPlay(filteredPlays[randomIdx]);
  };

  return (
    <div
      id="play-selector-panel"
      className="w-full bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm space-y-4"
    >
      {/* Top: Search Input & Random Play */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by play #, code (e.g. 97, Smash, Sweep, 115, Wheel)..."
            className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:bg-white text-xs sm:text-sm font-medium transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>

        <button
          onClick={handleRandomPlay}
          title="Pick Random Play"
          className="p-2.5 bg-amber-50 hover:bg-amber-100/80 text-amber-800 border border-amber-200 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold shadow-2xs"
        >
          <Dices className="w-4 h-4 text-amber-600" />
          <span className="hidden sm:inline">Random</span>
        </button>
      </div>

      {/* Formation Categories Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all border ${
            selectedCategory === 'ALL'
              ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-sm shadow-blue-500/20'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          All Formations ({ALL_PLAYBOOK_PLAYS.length})
        </button>
        {CATEGORIES.map((cat) => {
          const count = ALL_PLAYBOOK_PLAYS.filter((p) => p.category === cat).length;
          return (
            <button
              key={`cat-chip-${cat}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-sm shadow-blue-500/20'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Direction & Play Type Sub-filters */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
        {/* Direction Toggle */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-slate-400 font-mono mr-1">DIR:</span>
          {(['ALL', 'RIGHT', 'LEFT'] as const).map((dir) => (
            <button
              key={`dir-${dir}`}
              onClick={() => setSelectedDirection(dir)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold transition-all ${
                selectedDirection === dir
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {dir}
            </button>
          ))}
        </div>

        {/* Play Type Toggle */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-slate-400 font-mono mr-1">TYPE:</span>
          {(['ALL', 'PASS', 'RUN', 'SCREEN', 'PLAY_ACTION'] as const).map((t) => (
            <button
              key={`type-${t}`}
              onClick={() => setSelectedPlayType(t)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold transition-all ${
                selectedPlayType === t
                  ? 'bg-purple-100 text-purple-900 border border-purple-300'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Play Cards List */}
      <div className="max-h-[380px] overflow-y-auto space-y-1.5 pr-1 focus:outline-none">
        {filteredPlays.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            No plays matching &ldquo;{searchQuery}&rdquo;
          </div>
        ) : (
          filteredPlays.map((play) => {
            const isSelected = selectedPlay.id === play.id;
            return (
              <div
                key={`play-card-${play.id}`}
                onClick={() => onSelectPlay(play)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-500/80 shadow-xs ring-1 ring-blue-500/20'
                    : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Play Number Badge */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/25'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {play.playNumber}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 truncate font-display tracking-tight">
                        {play.code}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {play.englishName}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                      play.direction === 'RIGHT'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : play.direction === 'LEFT'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {play.direction}
                  </span>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isSelected ? 'text-blue-600 translate-x-0.5' : 'text-slate-400'
                    }`}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
