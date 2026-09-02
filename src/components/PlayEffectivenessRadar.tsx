import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play } from '../types';
import { calculatePlayRadarProfile, PlayMetricCategory } from '../data/playMetrics';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from 'recharts';
import {
  Activity,
  Zap,
  Layers,
  ArrowUpRight,
  ShieldAlert,
  ShieldCheck,
  Info,
  ChevronRight,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

interface PlayEffectivenessRadarProps {
  play: Play;
  showComparison?: boolean;
}

export const PlayEffectivenessRadar: React.FC<PlayEffectivenessRadarProps> = ({
  play,
  showComparison: initialShowComparison = true,
}) => {
  const [showBenchmark, setShowBenchmark] = useState(initialShowComparison);
  const [activeCategoryKey, setActiveCategoryKey] = useState<string | null>(null);

  const profile = useMemo(() => {
    return calculatePlayRadarProfile(play);
  }, [play]);

  // Transform data for Recharts RadarChart
  const radarChartData = useMemo(() => {
    return profile.metrics.map((m) => ({
      subject: m.shortLabel,
      fullName: m.category,
      score: m.score,
      benchmark: 72, // Playbook Baseline Average
      fullMark: 100,
      grade: m.grade,
      description: m.description,
      tacticalFactor: m.tacticalFactor,
      key: m.key,
    }));
  }, [profile]);

  const activeCategory = useMemo(() => {
    if (!activeCategoryKey) return profile.metrics[0];
    return profile.metrics.find((m) => m.key === activeCategoryKey) || profile.metrics[0];
  }, [activeCategoryKey, profile]);

  const getScoreColor = (score: number) => {
    if (score >= 88) return 'text-emerald-700 bg-emerald-50 border-emerald-300';
    if (score >= 78) return 'text-blue-700 bg-blue-50 border-blue-300';
    if (score >= 68) return 'text-amber-700 bg-amber-50 border-amber-300';
    return 'text-slate-700 bg-slate-100 border-slate-300';
  };

  const getMetricIcon = (key: string) => {
    switch (key) {
      case 'speed':
        return <Zap className="w-3.5 h-3.5 text-amber-600" />;
      case 'complexity':
        return <Layers className="w-3.5 h-3.5 text-purple-600" />;
      case 'vertical':
        return <ArrowUpRight className="w-3.5 h-3.5 text-blue-600" />;
      case 'manBeater':
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />;
      case 'zoneExploitation':
        return <Activity className="w-3.5 h-3.5 text-indigo-600" />;
      case 'redZone':
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-blue-600" />;
    }
  };

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs backdrop-blur-md max-w-xs z-50">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5 mb-1.5">
            <span className="font-bold text-slate-200">{data.fullName}</span>
            <span className="px-1.5 py-0.5 rounded font-mono font-black text-[11px] bg-blue-500/30 text-blue-300 border border-blue-400/40">
              {data.score} / 100 ({data.grade})
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug">{data.description}</p>
          <div className="mt-1.5 pt-1.5 border-t border-slate-800/80 text-[10px] text-amber-300/90 font-mono">
            Key: {data.tacticalFactor}
          </div>
          {showBenchmark && (
            <div className="mt-1 text-[10px] text-slate-400 font-mono flex items-center justify-between">
              <span>Playbook Avg:</span>
              <span className="font-bold text-slate-300">72 / 100</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div
      id="play-effectiveness-radar-section"
      className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-4"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/70 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-blue-600 text-white shadow-2xs">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Play Effectiveness Profile
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-100 text-blue-800 border border-blue-200">
              Radar Analysis
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-sans">
            Tactical rating across Speed, Route Complexity, Vertical Threat &amp; Man-Beater metrics
          </p>
        </div>

        {/* Action / Benchmark toggle & Overall Score badge */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            id="toggle-radar-benchmark-btn"
            onClick={() => setShowBenchmark(!showBenchmark)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
              showBenchmark
                ? 'bg-blue-50 text-blue-800 border-blue-300'
                : 'bg-white text-slate-600 hover:bg-slate-100 border-slate-300'
            }`}
            title="Toggle system benchmark overlay comparison"
          >
            <Sliders className="w-3 h-3" />
            <span>{showBenchmark ? 'Baseline (ON)' : 'Show Baseline'}</span>
          </button>

          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 text-white shadow-xs font-mono"
            title="Overall Composite Play Rating"
          >
            <span className="text-[10px] uppercase text-slate-400 font-medium">Rating:</span>
            <span className="text-xs font-black text-amber-400">{profile.overallRating}</span>
            <span className="text-[10px] text-slate-400">/100</span>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Radar Chart on Left / Breakdown Cards on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Radar Chart Visual Container (7 Cols on large screens) */}
        <div className="lg:col-span-7 bg-white rounded-xl p-2 sm:p-3 border border-slate-200 shadow-2xs flex flex-col items-center justify-center relative min-h-[290px] overflow-hidden">
          <motion.div
            key={`radar-visual-frame-${play.id || play.code}`}
            initial={{ scale: 0.86, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.48,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="w-full h-[270px] sm:h-[290px]"
          >
            <ResponsiveContainer key={`radar-resp-${play.id || play.code}-${showBenchmark}`} width="100%" height="100%">
              <RadarChart
                cx="50%"
                cy="50%"
                outerRadius="75%"
                data={radarChartData}
              >
                <PolarGrid stroke="#cbd5e1" strokeDasharray="3 3" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{
                    fill: '#1e293b',
                    fontSize: 11,
                    fontWeight: 700,
                    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                  }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fill: '#94a3b8', fontSize: 9 }}
                  axisLine={false}
                />
                {showBenchmark && (
                  <Radar
                    name="Playbook Average"
                    dataKey="benchmark"
                    stroke="#94a3b8"
                    fill="#94a3b8"
                    fillOpacity={0.15}
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    isAnimationActive={true}
                    animationDuration={650}
                    animationEasing="ease-out"
                  />
                )}
                <Radar
                  key={`radar-polygon-${play.id || play.code}`}
                  name={play.code || 'Current Play'}
                  dataKey="score"
                  stroke="#2563eb"
                  fill="#3b82f6"
                  fillOpacity={0.45}
                  strokeWidth={2.5}
                  dot={{ r: 3.5, fill: '#1d4ed8', stroke: '#ffffff', strokeWidth: 1.5 }}
                  activeDot={{ r: 5.5, fill: '#2563eb', stroke: '#ffffff', strokeWidth: 2 }}
                  isAnimationActive={true}
                  animationDuration={650}
                  animationEasing="ease-out"
                  animationBegin={80}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Quick Legend under chart */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-slate-600 mt-1 pt-2 border-t border-slate-100 w-full">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-600 inline-block shadow-2xs" />
              <span className="font-bold text-slate-800">This Play ({profile.overallRating})</span>
            </div>
            {showBenchmark && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-400 inline-block border border-dashed border-slate-500" />
                <span className="text-slate-500">Playbook Average (72)</span>
              </div>
            )}
            <div className="text-[10px] text-slate-400 italic">
              Hover axes for category details
            </div>
          </div>
        </div>

        {/* Tactical Synthesis & Category Cards (5 Cols on large screens) */}
        <motion.div
          key={`radar-sidebar-${play.id || play.code}`}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.38, ease: 'easeOut', delay: 0.08 }}
          className="lg:col-span-5 flex flex-col gap-2.5"
        >
          {/* Archetype & Matchup Banner */}
          <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-500 font-mono text-[11px] uppercase">Archetype</span>
              <span className="font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 text-xs">
                {profile.archetype}
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-start gap-1.5 text-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-emerald-900">Optimal vs: </span>
                  <span className="text-slate-700">{profile.bestAgainstDefense}</span>
                </div>
              </div>
              <div className="flex items-start gap-1.5 text-slate-700">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-900">Caution vs: </span>
                  <span className="text-slate-700">{profile.cautionAgainstDefense}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Metric Category Pills / Grid */}
          <div className="grid grid-cols-2 gap-1.5">
            {profile.metrics.map((metric) => {
              const isSelected = activeCategory.key === metric.key;
              return (
                <button
                  key={`metric-btn-${metric.key}`}
                  onClick={() => setActiveCategoryKey(metric.key)}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between gap-1.5 ${
                    isSelected
                      ? 'bg-blue-50 border-blue-400 shadow-xs ring-1 ring-blue-400/30'
                      : 'bg-white hover:bg-slate-50/80 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    {getMetricIcon(metric.key)}
                    <span className="text-[11px] font-bold text-slate-800 truncate">
                      {metric.shortLabel}
                    </span>
                  </div>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-black border shrink-0 ${getScoreColor(
                      metric.score
                    )}`}
                  >
                    {metric.score}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Metric Detail Card */}
          <div className="bg-slate-900 text-slate-100 rounded-xl p-3 border border-slate-800 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                {getMetricIcon(activeCategory.key)}
                <span>{activeCategory.category}</span>
              </div>
              <span className="px-1.5 py-0.5 rounded font-mono text-[10px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Grade: {activeCategory.grade} ({activeCategory.score}/100)
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug font-sans">
              {activeCategory.description}
            </p>
            <div className="text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800 flex items-center justify-between">
              <span>Key Tactical Driver:</span>
              <span className="text-slate-200 font-semibold">{activeCategory.tacticalFactor}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
