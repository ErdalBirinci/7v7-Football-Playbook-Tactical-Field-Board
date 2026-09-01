import React, { useState } from 'react';
import { Play, PlayerAssignment } from '../types';
import {
  BookOpen,
  Target,
  Compass,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Download,
} from 'lucide-react';

interface TacticalDetailPanelProps {
  play: Play;
  selectedPlayerId: string | null;
  onSelectPlayer: (id: string | null) => void;
  onOpenRouteTree?: () => void;
}

export const TacticalDetailPanel: React.FC<TacticalDetailPanelProps> = ({
  play,
  selectedPlayerId,
  onSelectPlayer,
  onOpenRouteTree,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Convert SVG to Canvas and export PNG image using canvas.toBlob
  const handleExportPNG = () => {
    const svgElement = document.getElementById('fieldboard-svg-canvas');
    if (!svgElement) return;

    setIsExporting(true);

    try {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement('canvas');
      canvas.width = 1600;
      canvas.height = 1200;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsExporting(false);
        return;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));

      img.onload = () => {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (!blob) {
            setIsExporting(false);
            return;
          }

          const blobUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          const cleanCode = (play.code || 'play').replace(/[^a-zA-Z0-9_-]/g, '_');
          a.download = `${cleanCode}_7v7_diagram.png`;
          a.href = blobUrl;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(blobUrl);

          setIsExporting(false);
          setDownloadSuccess(true);
          setTimeout(() => setDownloadSuccess(false), 2500);
        }, 'image/png');
      };

      img.onerror = (err) => {
        console.error('Failed to render SVG to canvas image', err);
        setIsExporting(false);
      };
    } catch (err) {
      console.error('Error exporting play diagram PNG:', err);
      setIsExporting(false);
    }
  };

  return (
    <div
      id="tactical-detail-panel"
      className="w-full bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-6"
    >
      {/* Header Info & Download Button */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
              {play.category}
            </span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
              {play.direction}
            </span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-purple-50 text-purple-800 border border-purple-200">
              {play.playType}
            </span>
            {play.qbDrop && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-100 text-slate-700 border border-slate-200">
                Drop: {play.qbDrop}
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-display">
            {play.code}
          </h2>
          <p className="text-sm font-semibold text-slate-600 mt-1">
            {play.englishName}
          </p>
        </div>

        <div className="shrink-0">
          <button
            id="download-play-diagram-btn"
            onClick={handleExportPNG}
            disabled={isExporting}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
              downloadSuccess
                ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
            }`}
            title="Download current play diagram as high-resolution PNG image"
          >
            {isExporting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Exporting...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Diagram Saved!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Diagram (PNG)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Concept & Description */}
      <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tactical Concept</span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed font-sans">
          {play.description}
        </p>
      </div>

      {/* QB Progression Reads */}
      {play.progressionReads && play.progressionReads.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <Target className="w-4 h-4 text-emerald-600" />
              <span>QB Progression Reads</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Rhythm Timing</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {play.progressionReads.map((read) => (
              <div
                key={`read-${read.order}`}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  selectedPlayerId === read.playerId
                    ? 'bg-emerald-50/80 border-emerald-500/80 shadow-xs ring-1 ring-emerald-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                }`}
                onClick={() => onSelectPlayer(read.playerId || null)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-emerald-100 text-emerald-800 border border-emerald-200">
                    READ #{read.order}
                  </span>
                  {read.playerId && (
                    <span className="text-[11px] font-mono font-bold text-slate-500">
                      Target: <span className="text-slate-900 font-black">{read.playerId}</span>
                    </span>
                  )}
                </div>
                <div className="text-xs font-bold text-slate-800">{read.concept}</div>
                {read.cue && (
                  <div className="text-[11px] text-slate-600 mt-1 italic">
                    Key: &ldquo;{read.cue}&rdquo;
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Player Route & Assignment Roster */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-blue-600" />
            <span>Player Assignments &amp; Routes</span>
          </div>
          {onOpenRouteTree && (
            <button
              onClick={onOpenRouteTree}
              className="text-[11px] font-mono text-blue-600 hover:text-blue-800 font-medium underline flex items-center gap-1"
            >
              <BookOpen className="w-3 h-3" />
              Route Tree Guide (0-9)
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-mono text-slate-500">
                <th className="py-2 px-2.5">Pos</th>
                <th className="py-2 px-2.5">Player</th>
                <th className="py-2 px-2.5">Route / Action</th>
                <th className="py-2 px-2.5">Role Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {(Object.entries(play.players) as [string, PlayerAssignment][]).map(([key, player]) => {
                const isSelected = selectedPlayerId === key;
                return (
                  <tr
                    key={`table-pos-${key}`}
                    onClick={() => onSelectPlayer(isSelected ? null : key)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-50/80 text-blue-900 font-semibold'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <td className="py-2 px-2.5 font-mono font-bold">
                      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-300">
                        {key}
                      </span>
                    </td>
                    <td className="py-2 px-2.5 text-slate-900 font-medium">
                      {player.label}
                    </td>
                    <td className="py-2 px-2.5">
                      <span
                        className="font-mono font-bold"
                        style={{ color: player.route.color || '#2563eb' }}
                      >
                        {player.route.name}
                      </span>
                      {player.route.routeNumber !== undefined && (
                        <span className="ml-1.5 px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-100 text-slate-700 border border-slate-200">
                          #{player.route.routeNumber}
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-2.5 text-slate-600 text-[11px]">
                      {player.roleDescription}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Coaching Points */}
      {play.coachingPoints && play.coachingPoints.length > 0 && (
        <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-200/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Coaching Keys &amp; Technique</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-700 font-sans list-disc list-inside">
            {play.coachingPoints.map((pt, i) => (
              <li key={`coach-pt-${i}`} className="leading-relaxed">
                {pt}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
