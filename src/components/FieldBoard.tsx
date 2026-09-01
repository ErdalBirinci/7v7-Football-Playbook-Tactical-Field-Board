import React, { useState, useRef, useEffect } from 'react';
import { Play, DefensivePlayer, DefenseScheme, PlayerAssignment, RosterPlayer, TokenDisplayMode } from '../types';
import { getPlayerAssignedToSlot } from '../data/rosterData';
import {
  detectConceptsForPlay,
  ROUTE_CONCEPTS_DATABASE,
  RouteConceptDefinition,
} from '../data/routeConceptsData';
import { CoachingVideoOverlay } from './CoachingVideoOverlay';
import {
  Maximize2,
  Minimize2,
  Play as PlayIcon,
  Pause,
  RotateCcw,
  PenTool,
  Users,
  GraduationCap,
  Tv,
} from 'lucide-react';

interface FieldBoardProps {
  play: Play;
  progress: number; // 0 to 1
  isPlaying: boolean;
  defenseScheme?: DefenseScheme | null;
  showDefense: boolean;
  showFullRoutes: boolean;
  showLabels: boolean;
  showZones: boolean;
  selectedPlayerId?: string | null;
  onSelectPlayer?: (playerId: string | null) => void;
  fieldTheme: 'turf' | 'tactical' | 'chalkboard';
  onTogglePlay?: () => void;
  onSeek?: (progress: number) => void;
  onOpenWhiteboard?: () => void;
  roster?: RosterPlayer[];
  tokenDisplayMode?: TokenDisplayMode;
  onToggleTokenMode?: () => void;
  onOpenRoster?: () => void;
  isCoachingOverlayOpen?: boolean;
  onToggleCoachingOverlay?: (val: boolean) => void;
  onOpenCoachingModal?: () => void;
  activeRouteConceptId?: string;
  onSelectRouteConceptId?: (id: string) => void;
}

export const FieldBoard: React.FC<FieldBoardProps> = ({
  play,
  progress,
  isPlaying,
  defenseScheme,
  showDefense,
  showFullRoutes,
  showLabels,
  showZones,
  selectedPlayerId,
  onSelectPlayer,
  fieldTheme,
  onTogglePlay,
  onSeek,
  onOpenWhiteboard,
  roster = [],
  tokenDisplayMode = 'jersey',
  onToggleTokenMode,
  onOpenRoster,
  isCoachingOverlayOpen = false,
  onToggleCoachingOverlay,
  onOpenCoachingModal,
  activeRouteConceptId,
  onSelectRouteConceptId,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCoachingFieldHighlights, setShowCoachingFieldHighlights] = useState(true);

  // Available concepts for active play
  const matchedConcepts = detectConceptsForPlay(play);
  const activeConcept =
    ROUTE_CONCEPTS_DATABASE.find((c) => c.id === activeRouteConceptId) ||
    matchedConcepts[0] ||
    ROUTE_CONCEPTS_DATABASE[0];

  // Synchronize fullscreen state with browser events and keydown (ESC)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
        setIsFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  const toggleFullscreen = async () => {
    if (isFullscreen) {
      if (document.fullscreenElement) {
        try {
          await document.exitFullscreen();
        } catch {
          // ignore error
        }
      }
      setIsFullscreen(false);
    } else {
      if (containerRef.current?.requestFullscreen) {
        try {
          await containerRef.current.requestFullscreen();
          setIsFullscreen(true);
        } catch {
          // Fallback to CSS fixed full-screen modal mode if sandboxed iframe blocks requestFullscreen
          setIsFullscreen(true);
        }
      } else {
        setIsFullscreen(true);
      }
    }
  };

  // Field dimensions in SVG units
  // Field coordinate system: 0-100 X (width), 0-100 Y (length)
  // End Zone: Y 0 to 15 (15 yds deep / goal line at 15)
  // LOS is at Y = 65 (50 yard line marker)
  // Backfield is Y 65 to 90

  // Calculate current animated position of an offensive player based on timeline progress (0 to 1)
  const getPlayerCurrentPosition = (playerKey: string) => {
    const player = play.players[playerKey];
    if (!player) return { x: 50, y: 75 };

    const { initialPos, motion, route } = player;

    // Phase 1: Pre-snap motion (progress 0 to 0.25)
    if (motion) {
      if (progress < 0.25) {
        const motionProgress = progress / 0.25;
        const curX = motion.startPos.x + (motion.endPos.x - motion.startPos.x) * motionProgress;
        const curY = motion.startPos.y + (motion.endPos.y - motion.startPos.y) * motionProgress;
        return { x: curX, y: curY };
      }
    }

    // Phase 2: Post-snap route execution (progress 0.25 to 1.0)
    const playProgress = motion ? Math.max(0, (progress - 0.25) / 0.75) : progress;
    const points = route.points;

    if (!points || points.length <= 1) {
      return motion && progress >= 0.25 ? motion.endPos : initialPos;
    }

    // Total route path length approximation
    let totalLength = 0;
    const segmentLengths: number[] = [];
    for (let i = 0; i < points.length - 1; i++) {
      const dx = points[i + 1].x - points[i].x;
      const dy = points[i + 1].y - points[i].y;
      const len = Math.sqrt(dx * dx + dy * dy);
      segmentLengths.push(len);
      totalLength += len;
    }

    if (totalLength === 0) return points[0];

    const targetDistance = totalLength * playProgress;
    let accumulated = 0;

    for (let i = 0; i < segmentLengths.length; i++) {
      const segLen = segmentLengths[i];
      if (accumulated + segLen >= targetDistance) {
        const segProgress = segLen > 0 ? (targetDistance - accumulated) / segLen : 0;
        const p1 = points[i];
        const p2 = points[i + 1];
        return {
          x: p1.x + (p2.x - p1.x) * segProgress,
          y: p1.y + (p2.y - p1.y) * segProgress,
        };
      }
      accumulated += segLen;
    }

    return points[points.length - 1];
  };

  // Convert route points to smooth SVG path 'd' string
  const getRouteSvgPath = (points: { x: number; y: number }[]) => {
    if (!points || points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
    if (points.length === 2) {
      return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
    }

    // Smooth spline
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const p0 = points[i - 1];
      const p1 = points[i];
      d += ` L ${p1.x} ${p1.y}`;
    }
    return d;
  };

  // Calculate ball position during play animation
  const getBallPosition = () => {
    const qbPos = getPlayerCurrentPosition('QB');
    // If progress is early (0 to 0.45), QB holds ball
    if (progress < 0.45) {
      return { x: qbPos.x, y: qbPos.y - 1.5 };
    }

    // If it's a run play or ball carrier exists
    const ballCarrierKey = Object.keys(play.players).find(
      (k) => play.players[k].route.isBallCarrier
    );
    if (ballCarrierKey) {
      const carrierPos = getPlayerCurrentPosition(ballCarrierKey);
      return { x: carrierPos.x, y: carrierPos.y - 1.5 };
    }

    // If it's a pass play, ball travels from QB to primary receiver between progress 0.45 and 0.85
    const primaryKey = Object.keys(play.players).find(
      (k) => play.players[k].route.isPrimary
    ) || 'Z';
    const targetPlayer = play.players[primaryKey];
    if (targetPlayer) {
      const targetPos = getPlayerCurrentPosition(primaryKey);
      const throwProgress = Math.min(1, Math.max(0, (progress - 0.45) / 0.4));
      // Parabolic throw arc effect
      const arcHeight = Math.sin(throwProgress * Math.PI) * 8;
      return {
        x: qbPos.x + (targetPos.x - qbPos.x) * throwProgress,
        y: qbPos.y + (targetPos.y - qbPos.y) * throwProgress - arcHeight,
      };
    }

    return { x: qbPos.x, y: qbPos.y - 1.5 };
  };

  const ballPos = getBallPosition();

  // Background styling based on theme
  const getThemeBg = () => {
    switch (fieldTheme) {
      case 'turf':
        return 'bg-gradient-to-b from-[#14532d] via-[#166534] to-[#14532d]';
      case 'chalkboard':
        return 'bg-gradient-to-b from-slate-800 via-slate-700 to-slate-800';
      case 'tactical':
      default:
        return 'bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a]';
    }
  };

  const getLineColor = () => {
    switch (fieldTheme) {
      case 'turf':
        return 'stroke-emerald-200/50';
      case 'chalkboard':
        return 'stroke-slate-200/50';
      case 'tactical':
      default:
        return 'stroke-sky-300/40';
    }
  };

  const lineStroke = getLineColor();

  const fieldBoardContent = (
    <div
      className={`relative w-full h-full ${
        isFullscreen
          ? 'max-h-[calc(100vh-90px)] max-w-[calc((100vh-90px)*16/9)] aspect-[16/9] mx-auto rounded-2xl overflow-hidden shadow-2xl border border-slate-700/80'
          : 'aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] rounded-2xl overflow-hidden shadow-md border border-slate-300'
      } select-none ${getThemeBg()}`}
    >
      <svg
        id="fieldboard-svg-canvas"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full"
      >
        <defs>
          {/* Arrowhead Markers */}
          <marker
            id="arrow-primary"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="4"
            markerHeight="4"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
          </marker>
          <marker
            id="arrow-secondary"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="4"
            markerHeight="4"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
          </marker>
          <marker
            id="arrow-amber"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="4"
            markerHeight="4"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b" />
          </marker>
          <marker
            id="arrow-pink"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="4"
            markerHeight="4"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#ec4899" />
          </marker>
          <marker
            id="arrow-purple"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="4"
            markerHeight="4"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#a855f7" />
          </marker>
          <marker
            id="arrow-runner"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="4.5"
            markerHeight="4.5"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#ef4444" />
          </marker>
          <marker
            id="arrow-motion"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="3.5"
            markerHeight="3.5"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#fb923c" />
          </marker>

          {/* Glow Filters */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Base Canvas Field Background for Export and Rendering */}
        <rect
          x="0"
          y="0"
          width="100"
          height="100"
          fill={fieldTheme === 'turf' ? '#14532d' : fieldTheme === 'chalkboard' ? '#1e293b' : '#0f172a'}
        />

        {/* ================= Field Markings ================= */}
        {/* Endzone */}
        <rect
          x="0"
          y="0"
          width="100"
          height="12"
          fill={fieldTheme === 'turf' ? '#064e3b' : '#0f172a'}
          opacity="0.8"
        />
        {/* Endzone Diagonal Stripes */}
        {Array.from({ length: 9 }).map((_, i) => (
          <line
            key={`ez-stripe-${i}`}
            x1={i * 12}
            y1="0"
            x2={i * 12 + 15}
            y2="12"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="0.8"
          />
        ))}
        <text
          x="50"
          y="8"
          textAnchor="middle"
          fontSize="4.5"
          fontWeight="bold"
          fill="rgba(255,255,255,0.25)"
          letterSpacing="0.4em"
          className="font-display uppercase"
        >
          END ZONE
        </text>

        {/* Goal Line */}
        <line x1="0" y1="12" x2="100" y2="12" stroke="#ffffff" strokeWidth="0.8" />

        {/* Yard Lines (every 10 yards: 12, 22.6, 33.2, 43.8, 54.4, 65, 75.6, 86.2, 96.8) */}
        {[
          { y: 22, yard: '10' },
          { y: 32, yard: '20' },
          { y: 42, yard: '30' },
          { y: 52, yard: '40' },
          { y: 65, yard: '50' }, // Line of Scrimmage
          { y: 76, yard: '40' },
          { y: 88, yard: '30' },
        ].map((line, idx) => (
          <g key={`yardline-${idx}`}>
            <line
              x1="0"
              y1={line.y}
              x2="100"
              y2={line.y}
              className={lineStroke}
              strokeWidth={line.y === 65 ? '0.7' : '0.35'}
              strokeDasharray={line.y === 65 ? undefined : '1.5,1.5'}
            />
            {/* Yard Numbers on Left and Right */}
            {line.y !== 65 && (
              <>
                <text
                  x="8"
                  y={line.y + 1.2}
                  fontSize="2.4"
                  fontWeight="bold"
                  fill="rgba(255,255,255,0.22)"
                  textAnchor="middle"
                  className="font-mono"
                >
                  {line.yard}
                </text>
                <text
                  x="92"
                  y={line.y + 1.2}
                  fontSize="2.4"
                  fontWeight="bold"
                  fill="rgba(255,255,255,0.22)"
                  textAnchor="middle"
                  className="font-mono"
                >
                  {line.yard}
                </text>
              </>
            )}
          </g>
        ))}

        {/* College / Pro Hash Marks */}
        {Array.from({ length: 30 }).map((_, i) => {
          const yPos = 14 + i * 2.8;
          if (yPos > 96) return null;
          return (
            <g key={`hash-${i}`} opacity="0.3">
              <line x1="38" y1={yPos} x2="40" y2={yPos} stroke="#ffffff" strokeWidth="0.3" />
              <line x1="60" y1={yPos} x2="62" y2={yPos} stroke="#ffffff" strokeWidth="0.3" />
              <line x1="2" y1={yPos} x2="4" y2={yPos} stroke="#ffffff" strokeWidth="0.3" />
              <line x1="96" y1={yPos} x2="98" y2={yPos} stroke="#ffffff" strokeWidth="0.3" />
            </g>
          );
        })}

        {/* Line of Scrimmage (LOS) Indicator Bar (Blue) */}
        <line
          x1="0"
          y1="65"
          x2="100"
          y2="65"
          stroke="#0284c7"
          strokeWidth="0.9"
          opacity="0.85"
        />
        <text
          x="3"
          y="64.2"
          fontSize="2.2"
          fontWeight="bold"
          fill="#38bdf8"
          className="font-mono"
        >
          LOS (Line of Scrimmage)
        </text>

        {/* First Down Line Indicator (Yellow - 10 yds downfield at y=52) */}
        <line
          x1="0"
          y1="52"
          x2="100"
          y2="52"
          stroke="#eab308"
          strokeWidth="0.6"
          strokeDasharray="2,1"
          opacity="0.65"
        />
        <text
          x="97"
          y="51.2"
          fontSize="2"
          fontWeight="bold"
          fill="#facc15"
          textAnchor="end"
          className="font-mono"
        >
          1st Down (Line to Gain)
        </text>

        {/* ================= Defensive Zones & Coverage Overlay ================= */}
        {showDefense && defenseScheme && (
          <g id="defensive-scheme-overlay">
            {/* Zone Shading Areas */}
            {showZones &&
              defenseScheme.players
                .filter((p) => p.zoneArea)
                .map((defPlayer) => {
                  const zone = defPlayer.zoneArea!;
                  return (
                    <g key={`zone-${defPlayer.id}`}>
                      <rect
                        x={zone.x}
                        y={zone.y}
                        width={zone.width}
                        height={zone.height}
                        rx="2"
                        fill="rgba(244, 63, 94, 0.08)"
                        stroke="rgba(244, 63, 94, 0.35)"
                        strokeWidth="0.4"
                        strokeDasharray="1.5,1.5"
                      />
                      <text
                        x={zone.x + zone.width / 2}
                        y={zone.y + zone.height / 2 + 1}
                        textAnchor="middle"
                        fontSize="2.2"
                        fontWeight="600"
                        fill="rgba(251, 113, 133, 0.6)"
                        className="font-mono uppercase tracking-wider"
                      >
                        {zone.label}
                      </text>
                    </g>
                  );
                })}

            {/* Man Coverage Tether Lines */}
            {defenseScheme.players
              .filter((p) => p.coverageType === 'man' && p.targetOffensivePlayerId)
              .map((defPlayer) => {
                const offPlayer = play.players[defPlayer.targetOffensivePlayerId!];
                if (!offPlayer) return null;
                const offPos = getPlayerCurrentPosition(defPlayer.targetOffensivePlayerId!);
                return (
                  <line
                    key={`tether-${defPlayer.id}`}
                    x1={defPlayer.initialPos.x}
                    y1={defPlayer.initialPos.y}
                    x2={offPos.x}
                    y2={offPos.y}
                    stroke="rgba(244, 63, 94, 0.25)"
                    strokeWidth="0.4"
                    strokeDasharray="1,1"
                  />
                );
              })}

            {/* Defensive Player Tokens */}
            {defenseScheme.players.map((defPlayer) => {
              // Calculate slight reaction towards ball or assignment
              let defX = defPlayer.initialPos.x;
              let defY = defPlayer.initialPos.y;

              if (progress > 0.3) {
                const reactProgress = (progress - 0.3) / 0.7;
                if (defPlayer.coverageType === 'blitz') {
                  defY = defPlayer.initialPos.y + (75 - defPlayer.initialPos.y) * reactProgress * 0.7;
                  defX = defPlayer.initialPos.x + (50 - defPlayer.initialPos.x) * reactProgress * 0.7;
                } else if (defPlayer.targetOffensivePlayerId && play.players[defPlayer.targetOffensivePlayerId]) {
                  const offPos = getPlayerCurrentPosition(defPlayer.targetOffensivePlayerId);
                  defX = defPlayer.initialPos.x + (offPos.x - defPlayer.initialPos.x) * reactProgress * 0.6;
                  defY = defPlayer.initialPos.y + (offPos.y - 4 - defPlayer.initialPos.y) * reactProgress * 0.6;
                } else if (defPlayer.coverageType.includes('deep')) {
                  defY = defPlayer.initialPos.y - 4 * reactProgress; // Backpedal
                }
              }

              return (
                <g key={`def-${defPlayer.id}`}>
                  {/* Defender Circle */}
                  <circle
                    cx={defX}
                    cy={defY}
                    r="2.3"
                    fill="#be123c"
                    stroke="#fda4af"
                    strokeWidth="0.5"
                    className="transition-all duration-75"
                  />
                  <text
                    x={defX}
                    y={defY + 0.9}
                    textAnchor="middle"
                    fontSize="1.9"
                    fontWeight="bold"
                    fill="#ffffff"
                    className="font-mono select-none"
                  >
                    {defPlayer.label}
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {/* ================= Offensive Routes & Paths ================= */}
        {(Object.entries(play.players) as [string, PlayerAssignment][]).map(([key, player]) => {
          const isSelected = selectedPlayerId === key;
          const isPrimary = player.route.isPrimary;
          const isBallCarrier = player.route.isBallCarrier;
          const isBlocking = player.route.isBlocking;

          // Route color logic
          let strokeColor = player.route.color || '#38bdf8';
          let markerEnd = 'url(#arrow-primary)';
          if (isBallCarrier) {
            strokeColor = '#ef4444';
            markerEnd = 'url(#arrow-runner)';
          } else if (isPrimary) {
            strokeColor = '#38bdf8';
            markerEnd = 'url(#arrow-primary)';
          } else if (player.route.isSecondary) {
            strokeColor = '#10b981';
            markerEnd = 'url(#arrow-secondary)';
          } else if (strokeColor === '#f59e0b') {
            markerEnd = 'url(#arrow-amber)';
          } else if (strokeColor === '#ec4899') {
            markerEnd = 'url(#arrow-pink)';
          } else if (strokeColor === '#a855f7') {
            markerEnd = 'url(#arrow-purple)';
          }

          const routeSvg = getRouteSvgPath(player.route.points);

          return (
            <g key={`route-group-${key}`}>
              {/* Pre-Snap Motion Path (Dashed Orange) */}
              {player.motion && (
                <g>
                  <line
                    x1={player.motion.startPos.x}
                    y1={player.motion.startPos.y}
                    x2={player.motion.endPos.x}
                    y2={player.motion.endPos.y}
                    stroke="#fb923c"
                    strokeWidth="0.75"
                    strokeDasharray="1.5,1.5"
                    markerEnd="url(#arrow-motion)"
                  />
                  <circle
                    cx={player.motion.startPos.x}
                    cy={player.motion.startPos.y}
                    r="1.4"
                    fill="none"
                    stroke="#fb923c"
                    strokeWidth="0.5"
                    strokeDasharray="1,1"
                  />
                  {showLabels && (
                    <text
                      x={(player.motion.startPos.x + player.motion.endPos.x) / 2}
                      y={(player.motion.startPos.y + player.motion.endPos.y) / 2 - 1.5}
                      textAnchor="middle"
                      fontSize="1.7"
                      fontWeight="bold"
                      fill="#fb923c"
                      className="font-mono"
                    >
                      MOTION
                    </text>
                  )}
                </g>
              )}

              {/* Full Route Line (If enabled or selected) */}
              {(showFullRoutes || isSelected) && (
                <g>
                  {/* Outer glow on selected/primary */}
                  {(isSelected || isPrimary || isBallCarrier) && (
                    <path
                      d={routeSvg}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="2.5"
                      strokeOpacity="0.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}

                  {/* Route Vector Path */}
                  <path
                    d={routeSvg}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={isBallCarrier ? '1.2' : (isBlocking ? '0.7' : (isSelected ? '1.1' : '0.85'))}
                    strokeDasharray={player.route.isFake ? '2,1.5' : undefined}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    markerEnd={isBlocking ? undefined : markerEnd}
                    opacity={selectedPlayerId && !isSelected ? 0.35 : 0.95}
                  />

                  {/* Blocking T-Bar Cap for blocking assignments */}
                  {isBlocking && player.route.points.length >= 2 && (
                    (() => {
                      const lastPt = player.route.points[player.route.points.length - 1];
                      const prevPt = player.route.points[player.route.points.length - 2];
                      const dx = lastPt.x - prevPt.x;
                      const dy = lastPt.y - prevPt.y;
                      const angle = Math.atan2(dy, dx);
                      const perpAngle = angle + Math.PI / 2;
                      const barLen = 1.8;
                      return (
                        <line
                          x1={lastPt.x - Math.cos(perpAngle) * barLen}
                          y1={lastPt.y - Math.sin(perpAngle) * barLen}
                          x2={lastPt.x + Math.cos(perpAngle) * barLen}
                          y2={lastPt.y + Math.sin(perpAngle) * barLen}
                          stroke={strokeColor}
                          strokeWidth="1.1"
                          strokeLinecap="square"
                        />
                      );
                    })()
                  )}

                  {/* Route Number / Concept Label at break/target point */}
                  {showLabels && player.route.routeNumber !== undefined && (
                    (() => {
                      const targetPt = player.route.points[player.route.points.length - 1];
                      return (
                        <g>
                          <rect
                            x={targetPt.x - 2.8}
                            y={targetPt.y - 3.8}
                            width="5.6"
                            height="3.2"
                            rx="1"
                            fill="#0f172a"
                            stroke={strokeColor}
                            strokeWidth="0.4"
                            opacity="0.9"
                          />
                          <text
                            x={targetPt.x}
                            y={targetPt.y - 1.6}
                            textAnchor="middle"
                            fontSize="2"
                            fontWeight="bold"
                            fill="#ffffff"
                            className="font-mono"
                          >
                            {player.route.routeNumber}
                          </text>
                        </g>
                      );
                    })()
                  )}
                </g>
              )}
            </g>
          );
        })}

        {/* ================= Animated Ball Flight ================= */}
        {isPlaying && progress > 0.05 && (
          <g>
            {/* Ball Shadow */}
            <ellipse
              cx={ballPos.x}
              cy={ballPos.y + 1}
              rx="1.2"
              ry="0.6"
              fill="rgba(0,0,0,0.4)"
            />
            {/* Football */}
            <ellipse
              cx={ballPos.x}
              cy={ballPos.y}
              rx="1.4"
              ry="0.85"
              fill="#92400e"
              stroke="#fef3c7"
              strokeWidth="0.3"
              transform={`rotate(-25 ${ballPos.x} ${ballPos.y})`}
            />
            {/* White Laces */}
            <line
              x1={ballPos.x - 0.5}
              y1={ballPos.y}
              x2={ballPos.x + 0.5}
              y2={ballPos.y}
              stroke="#ffffff"
              strokeWidth="0.3"
            />
          </g>
        )}

        {/* ================= Coaching Highlights (When Video Overlay Active) ================= */}
        {isCoachingOverlayOpen && showCoachingFieldHighlights && activeConcept.fieldHighlightZones && (
          <g className="animate-in fade-in duration-300">
            {activeConcept.fieldHighlightZones.map((zone, idx) => {
              const isConflict = zone.type === 'conflict_zone';
              const isRead = zone.type === 'read_window';
              const ringColor = isConflict ? '#ef4444' : isRead ? '#22c55e' : '#38bdf8';
              const fillBg = isConflict ? 'rgba(239, 68, 68, 0.15)' : isRead ? 'rgba(34, 197, 94, 0.15)' : 'rgba(56, 189, 248, 0.15)';

              return (
                <g key={`coaching-zone-${idx}`}>
                  {/* Outer Pulsing Zone Ring */}
                  <circle
                    cx={zone.x}
                    cy={zone.y}
                    r={zone.radius}
                    fill={fillBg}
                    stroke={ringColor}
                    strokeWidth="0.6"
                    strokeDasharray={isConflict ? '2,2' : '3,2'}
                  />
                  {/* Center Dot Landmark */}
                  <circle
                    cx={zone.x}
                    cy={zone.y}
                    r="1.2"
                    fill={ringColor}
                  />
                  {/* Zone Label Badge */}
                  <g>
                    <rect
                      x={zone.x - 12}
                      y={zone.y + zone.radius + 1.2}
                      width="24"
                      height="3.6"
                      rx="1"
                      fill="#0f172a"
                      stroke={ringColor}
                      strokeWidth="0.3"
                      opacity="0.95"
                    />
                    <text
                      x={zone.x}
                      y={zone.y + zone.radius + 3.8}
                      textAnchor="middle"
                      fontSize="1.6"
                      fontWeight="bold"
                      fill={ringColor}
                      className="font-sans pointer-events-none select-none"
                    >
                      {zone.label}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>
        )}

        {/* ================= Offensive Player Tokens ================= */}
        {(Object.entries(play.players) as [string, PlayerAssignment][]).map(([key, player]) => {
          const currentPos = getPlayerCurrentPosition(key);
          const isSelected = selectedPlayerId === key;
          const isPrimary = player.route.isPrimary;
          const isBallCarrier = player.route.isBallCarrier;

          // Lookup assigned player from roster
          const rosterPlayer = getPlayerAssignedToSlot(key, roster);
          const jerseyNum = rosterPlayer ? rosterPlayer.jerseyNumber : null;

          // Determine token text based on tokenDisplayMode and roster assignment
          let tokenMainText = key;
          let isJerseyRendered = false;

          if (tokenDisplayMode === 'jersey' && jerseyNum) {
            tokenMainText = `${jerseyNum}`;
            isJerseyRendered = true;
          } else if (tokenDisplayMode === 'both' && jerseyNum) {
            tokenMainText = `${jerseyNum}`;
            isJerseyRendered = true;
          } else if (tokenDisplayMode === 'name' && rosterPlayer) {
            const lastName = rosterPlayer.name.split(' ').pop() || rosterPlayer.name;
            tokenMainText = lastName.slice(0, 4).toUpperCase();
          } else if (jerseyNum) {
            // Default: if jersey number exists, show key or jersey based on mode
            tokenMainText = key;
          }

          // Subtitle / Tooltip text
          let subLabelText = player.label.split(' ')[0];
          if (rosterPlayer) {
            const lastName = rosterPlayer.name.split(' ').pop() || rosterPlayer.name;
            if (tokenDisplayMode === 'jersey' || tokenDisplayMode === 'both') {
              subLabelText = `${lastName} (${key})`;
            } else if (tokenDisplayMode === 'position') {
              subLabelText = `#${rosterPlayer.jerseyNumber} ${lastName}`;
            } else {
              subLabelText = `#${rosterPlayer.jerseyNumber} ${key}`;
            }
          }

          // Color token based on position or custom player avatar color
          let tokenBg = rosterPlayer?.avatarColor || '#1e293b';
          let tokenBorder = '#94a3b8';
          let textColor = '#ffffff';

          if (key === 'QB') {
            tokenBg = rosterPlayer?.avatarColor || '#dc2626'; // Red for QB
            tokenBorder = '#fca5a5';
          } else if (key === 'C') {
            tokenBg = rosterPlayer?.avatarColor || '#475569'; // Slate for Center
            tokenBorder = '#cbd5e1';
          } else if (isBallCarrier) {
            tokenBg = '#ea580c'; // Orange for carrier
            tokenBorder = '#fdba74';
          } else if (isPrimary) {
            tokenBg = rosterPlayer?.avatarColor || '#0284c7'; // Sky for Primary
            tokenBorder = '#7dd3fc';
          } else if (player.route.isSecondary) {
            tokenBg = rosterPlayer?.avatarColor || '#059669'; // Emerald for Secondary
            tokenBorder = '#6ee7b7';
          } else if (key.includes('RB') || key.includes('HB')) {
            tokenBg = rosterPlayer?.avatarColor || '#7c3aed'; // Purple for Backs
            tokenBorder = '#c4b5fd';
          } else {
            tokenBg = rosterPlayer?.avatarColor || '#0f172a';
            tokenBorder = '#38bdf8';
          }

          if (isSelected) {
            tokenBorder = '#facc15'; // Bright yellow border on selected
          }

          return (
            <g
              key={`player-token-${key}`}
              className="cursor-pointer group"
              onClick={() => onSelectPlayer?.(isSelected ? null : key)}
            >
              {/* Highlight Aura if Selected or Primary */}
              {(isSelected || isPrimary || isBallCarrier) && (
                <circle
                  cx={currentPos.x}
                  cy={currentPos.y}
                  r="4.2"
                  fill={isSelected ? '#facc15' : (isBallCarrier ? '#ef4444' : '#38bdf8')}
                  opacity="0.3"
                  className="animate-pulse"
                />
              )}

              {/* Player Token Circle */}
              <circle
                cx={currentPos.x}
                cy={currentPos.y}
                r="2.8"
                fill={tokenBg}
                stroke={tokenBorder}
                strokeWidth={isSelected ? '0.9' : '0.6'}
                className="transition-all duration-75 group-hover:scale-110"
              />

              {/* Player Position / Jersey # Label Text */}
              <text
                x={currentPos.x}
                y={currentPos.y + (tokenMainText.length > 2 ? 0.7 : 0.95)}
                textAnchor="middle"
                fontSize={tokenMainText.length > 2 ? '1.6' : '2.0'}
                fontWeight="900"
                fill={textColor}
                className="font-mono pointer-events-none select-none tracking-tighter"
              >
                {tokenMainText}
              </text>

              {/* Small '#' badge indicator in top right if jersey number is shown */}
              {isJerseyRendered && (
                <text
                  x={currentPos.x + 2.2}
                  y={currentPos.y - 1.5}
                  textAnchor="middle"
                  fontSize="1.1"
                  fontWeight="800"
                  fill="#facc15"
                  className="font-mono pointer-events-none select-none"
                >
                  #
                </text>
              )}

              {/* Tag tooltip label below player if active */}
              {showLabels && (
                <text
                  x={currentPos.x}
                  y={currentPos.y + 5.1}
                  textAnchor="middle"
                  fontSize="1.55"
                  fontWeight="700"
                  fill="#f8fafc"
                  className="font-sans pointer-events-none select-none drop-shadow"
                >
                  {subLabelText}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Field HUD Overlay: Formation info & strength */}
      <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md border border-slate-700/60 rounded-xl px-3 py-1.5 shadow-lg flex items-center gap-2 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <div className="text-xs">
          <span className="font-semibold text-slate-200">{play.formationName}</span>
          <span className="mx-1.5 text-slate-500">•</span>
          <span className="text-amber-400 font-mono font-medium">{play.playType}</span>
        </div>
      </div>

      {/* Fullscreen, Whiteboard, Roster & Coaching Mode Toggle Buttons (Top Right) */}
      <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
        {onToggleCoachingOverlay && (
          <button
            id="fieldboard-coaching-tips-btn"
            onClick={() => onToggleCoachingOverlay(!isCoachingOverlayOpen)}
            title="Toggle Video Tutorial HUD & Coaching Tips Overlay on Field"
            className={`backdrop-blur-md px-2.5 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5 text-xs font-bold transition-all active:scale-95 border cursor-pointer ${
              isCoachingOverlayOpen
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-300 shadow-amber-950/40'
                : 'bg-slate-900/85 hover:bg-slate-800 text-amber-300 hover:text-amber-200 border-amber-500/50 shadow-slate-950/40'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Tips HUD</span>
            {isCoachingOverlayOpen && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            )}
          </button>
        )}

        {onOpenRoster && (
          <button
            id="fieldboard-open-roster-btn"
            onClick={onOpenRoster}
            title="Open Roster & Jersey Numbers Management"
            className="backdrop-blur-md px-2.5 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5 text-xs font-bold transition-all active:scale-95 border bg-blue-600/90 hover:bg-blue-600 text-white border-blue-400/50 shadow-blue-950/40 cursor-pointer"
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Roster (#{tokenDisplayMode.toUpperCase()})</span>
          </button>
        )}

        {onOpenWhiteboard && (
          <button
            id="fieldboard-draw-whiteboard-btn"
            onClick={onOpenWhiteboard}
            title="Draw Play on Tactical Whiteboard (Tablet / Touch Pen Mode)"
            className="backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5 text-xs font-bold transition-all active:scale-95 border bg-emerald-600/90 hover:bg-emerald-600 text-white border-emerald-400/50 shadow-emerald-950/40 cursor-pointer"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Whiteboard</span>
          </button>
        )}

        <button
          id="fieldboard-fullscreen-toggle-btn"
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit Full Screen (ESC)' : 'Full Screen'}
          className={`backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5 text-xs font-bold transition-all active:scale-95 border cursor-pointer ${
            isFullscreen
              ? 'bg-red-600/90 hover:bg-red-600 text-white border-red-400/50 shadow-red-600/30'
              : 'bg-slate-900/85 hover:bg-slate-800 text-slate-200 hover:text-white border-slate-700/60 hover:border-slate-500 shadow-slate-950/40'
          }`}
        >
          {isFullscreen ? (
            <>
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Exit Full Screen (ESC)</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-3.5 h-3.5 text-sky-400" />
              <span>Full Screen</span>
            </>
          )}
        </button>
      </div>

      {/* Selected Player Detail Badge (Bottom Center) */}
      {selectedPlayerId && play.players[selectedPlayerId] && (
        (() => {
          const selPlayer = play.players[selectedPlayerId];
          const assignedRosterPlayer = getPlayerAssignedToSlot(selectedPlayerId, roster);

          return (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md border border-amber-500/50 rounded-xl px-4 py-2 shadow-2xl flex items-center gap-3 text-xs animate-in fade-in zoom-in-95 duration-150 z-20">
              <div
                className="w-7 h-7 rounded-lg text-white font-mono font-black flex items-center justify-center shadow-xs"
                style={{ backgroundColor: assignedRosterPlayer?.avatarColor || '#ea580c' }}
              >
                {assignedRosterPlayer ? `#${assignedRosterPlayer.jerseyNumber}` : selectedPlayerId}
              </div>
              <div>
                <div className="font-bold text-slate-100 flex items-center gap-1.5">
                  {assignedRosterPlayer && (
                    <span className="text-amber-300 font-extrabold">{assignedRosterPlayer.name}</span>
                  )}
                  <span>({selPlayer.label})</span>
                  <span className="text-slate-400 text-[11px] font-normal">
                    {selPlayer.positionName}
                  </span>
                </div>
                <div className="text-sky-400 font-medium font-mono text-[11px]">
                  Route: {selPlayer.route.name}
                  {selPlayer.route.routeNumber !== undefined && ` [Route #${selPlayer.route.routeNumber}]`}
                </div>
              </div>
              <button
                onClick={() => onSelectPlayer?.(null)}
                className="ml-2 text-slate-400 hover:text-slate-200 text-xs underline cursor-pointer"
              >
                Clear
              </button>
            </div>
          );
        })()
      )}

      {/* ================= Floating Coaching Video Tutorial Overlay (HUD) ================= */}
      {isCoachingOverlayOpen && (
        <CoachingVideoOverlay
          concept={activeConcept}
          allAvailableConcepts={matchedConcepts.length > 0 ? matchedConcepts : ROUTE_CONCEPTS_DATABASE}
          onSelectConcept={(c) => onSelectRouteConceptId?.(c.id)}
          onOpenFullModal={() => onOpenCoachingModal?.()}
          onClose={() => onToggleCoachingOverlay?.(false)}
          showFieldHighlights={showCoachingFieldHighlights}
          onToggleFieldHighlights={(val) => setShowCoachingFieldHighlights(val)}
        />
      )}

    </div>
  );

  if (isFullscreen) {
    return (
      <div
        ref={containerRef}
        id="tactical-field-board-fullscreen"
        className="fixed inset-0 z-50 w-screen h-screen bg-slate-950/98 backdrop-blur-md p-3 sm:p-5 flex flex-col justify-between items-center select-none overflow-hidden"
      >
        {/* Fullscreen Top Header Info Bar */}
        <div className="w-full max-w-6xl flex items-center justify-between gap-4 py-1">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {play.category}
            </span>
            <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
              {play.code}
            </h3>
            <span className="hidden md:inline text-xs text-slate-400 truncate max-w-md">
              {play.englishName}
            </span>
          </div>

          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-600 text-xs font-semibold shadow-lg transition-all"
          >
            <Minimize2 className="w-4 h-4 text-rose-400" />
            <span>Close (ESC)</span>
          </button>
        </div>

        {/* Center SVG Board in Fullscreen */}
        <div className="flex-1 w-full flex items-center justify-center my-auto min-h-0">
          {fieldBoardContent}
        </div>

        {/* Fullscreen Floating Playback Bar */}
        <div className="w-full max-w-3xl bg-slate-900/90 backdrop-blur-md border border-slate-700/70 rounded-2xl px-4 py-2.5 shadow-2xl flex items-center gap-3 sm:gap-4 mt-2">
          {onTogglePlay && (
            <button
              onClick={onTogglePlay}
              className={`p-2.5 rounded-xl text-white font-bold transition-all shadow-md active:scale-95 ${
                isPlaying
                  ? 'bg-amber-600 hover:bg-amber-500'
                  : 'bg-emerald-600 hover:bg-emerald-500'
              }`}
              title={isPlaying ? 'Durdur (Pause)' : 'Oynat (Play)'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
            </button>
          )}

          {onSeek && (
            <button
              onClick={() => onSeek(0)}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all active:scale-95"
              title="Başa Sar (Reset)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* Timeline slider in fullscreen */}
          <div className="flex-1 flex items-center gap-3">
            <span className="text-xs font-mono font-semibold text-slate-400 hidden sm:inline">Timeline</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={progress}
              onChange={(e) => onSeek?.(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <span className="text-xs font-mono font-bold text-emerald-400 min-w-[3rem] text-right">
              {Math.round(progress * 100)}%
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} id="tactical-field-board" className="relative w-full">
      {fieldBoardContent}
    </div>
  );
};
