import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  PenTool,
  Eraser,
  RotateCcw,
  Download,
  X,
  Maximize2,
  Minimize2,
  Trash2,
  Sparkles,
  Layers,
  Circle,
  Square,
  ArrowRight,
  Type,
  Eye,
  EyeOff,
  Move,
  Save,
  HelpCircle,
  Palette,
  Undo2,
  Redo2,
  Users,
  Magnet,
  Grid3X3,
} from 'lucide-react';
import { Play, PlayerAssignment } from '../types';

interface CoachWhiteboardProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlay?: Play | null;
  onSaveAsCustomPlay?: (play: Play) => void;
}

type ToolMode = 'pen' | 'line' | 'arrow' | 'dashed-arrow' | 'o-token' | 'x-token' | 'text' | 'eraser' | 'select';

interface DrawnElement {
  id: string;
  type: 'freehand' | 'line' | 'arrow' | 'dashed-arrow' | 'token' | 'text';
  color: string;
  strokeWidth: number;
  points?: { x: number; y: number }[];
  x?: number;
  y?: number;
  text?: string;
  tokenType?: 'O' | 'X' | 'QB' | 'C' | 'WR' | 'RB' | 'CB' | 'S' | 'LB';
}

const PRESET_COLORS = [
  { name: 'Sky Blue', hex: '#38bdf8' },
  { name: 'Vibrant Yellow', hex: '#facc15' },
  { name: 'Neon Green', hex: '#4ade80' },
  { name: 'Hot Orange', hex: '#fb923c' },
  { name: 'Bright Pink', hex: '#f472b6' },
  { name: 'Pure White', hex: '#ffffff' },
  { name: 'Signal Red', hex: '#ef4444' },
  { name: 'Purple Accent', hex: '#c084fc' },
];

const STROKE_SIZES = [
  { label: 'Fine', value: 2 },
  { label: 'Normal', value: 4 },
  { label: 'Bold', value: 7 },
  { label: 'Thick', value: 12 },
];

const TOKEN_PRESETS = [
  { label: 'O (Offense)', value: 'O', color: '#38bdf8' },
  { label: 'X (Defense)', value: 'X', color: '#ef4444' },
  { label: 'QB', value: 'QB', color: '#ef4444' },
  { label: 'C', value: 'C', color: '#64748b' },
  { label: 'WR', value: 'WR', color: '#38bdf8' },
  { label: 'RB', value: 'RB', color: '#a855f7' },
  { label: 'CB', value: 'CB', color: '#f59e0b' },
  { label: 'S', value: 'S', color: '#ec4899' },
];

export const CoachWhiteboard: React.FC<CoachWhiteboardProps> = ({
  isOpen,
  onClose,
  currentPlay,
}) => {
  const [tool, setTool] = useState<ToolMode>('pen');
  const [color, setColor] = useState<string>('#facc15');
  const [strokeWidth, setStrokeWidth] = useState<number>(4);
  const [selectedTokenType, setSelectedTokenType] = useState<'O' | 'X' | 'QB' | 'C' | 'WR' | 'RB' | 'CB' | 'S' | 'LB'>('O');
  
  // Field backgrounds: tactical chalkboard, grass green, navy pro
  const [fieldTheme, setFieldTheme] = useState<'chalkboard' | 'turf' | 'dark'>('chalkboard');
  const [showUnderlayPlay, setShowUnderlayPlay] = useState<boolean>(true);
  const [showGridlines, setShowGridlines] = useState<boolean>(true);
  const [snapToGrid, setSnapToGrid] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');
  const [isAddingText, setIsAddingText] = useState<boolean>(false);
  const [textCoord, setTextCoord] = useState<{ x: number; y: number } | null>(null);

  // Drawing state
  const [elements, setElements] = useState<DrawnElement[]>([]);
  const [history, setHistory] = useState<DrawnElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);
  const currentPathRef = useRef<{ x: number; y: number }[]>([]);
  const startPointRef = useRef<{ x: number; y: number } | null>(null);

  // Tablet stylus pressure / smoothing
  const [lastTouchTime, setLastTouchTime] = useState<number>(0);

  // Football Field Standard Grid Snapping (5% horizontal & 5% vertical yard intervals)
  const snapToFootballGrid = useCallback(
    (pt: { x: number; y: number }): { x: number; y: number } => {
      if (!snapToGrid) return pt;
      const stepX = 0.05;
      const stepY = 0.05;
      const snappedX = Math.max(0.05, Math.min(0.95, Math.round(pt.x / stepX) * stepX));
      const snappedY = Math.max(0.05, Math.min(0.95, Math.round(pt.y / stepY) * stepY));
      return {
        x: Number(snappedX.toFixed(3)),
        y: Number(snappedY.toFixed(3)),
      };
    },
    [snapToGrid]
  );

  // Update history snapshot
  const pushState = useCallback((newElements: DrawnElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newElements);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setElements(newElements);
  }, [history, historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setElements(prev);
    } else if (historyIndex === 0) {
      setHistoryIndex(-1);
      setElements([]);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setElements(next);
    }
  }, [history, historyIndex]);

  const handleClearAll = () => {
    if (elements.length === 0) return;
    pushState([]);
  };

  // Keyboard shortcuts (Z for undo, Y for redo, Esc to close)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement).tagName.toLowerCase())) {
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      } else if (e.key === 'g' || e.key === 'G') {
        if (!e.ctrlKey && !e.metaKey) {
          setSnapToGrid((prev) => !prev);
        }
      } else if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFullscreen, handleUndo, handleRedo, onClose]);

  // Handle Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {});
      }
      setIsFullscreen(true);
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // Canvas drawing & render loop
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Field Background & Yardlines
    if (fieldTheme === 'turf') {
      ctx.fillStyle = '#14532d'; // Dark grass green
    } else if (fieldTheme === 'dark') {
      ctx.fillStyle = '#090d16'; // Deep navy
    } else {
      ctx.fillStyle = '#1e293b'; // Chalkboard slate
    }
    ctx.fillRect(0, 0, width, height);

    // Endzone header
    const endzoneHeight = height * 0.15;
    ctx.fillStyle = fieldTheme === 'turf' ? '#166534' : fieldTheme === 'dark' ? '#0f172a' : '#0f172a';
    ctx.fillRect(0, 0, width, endzoneHeight);

    // Endzone text
    ctx.font = `bold ${Math.max(16, width * 0.024)}px monospace`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('E N D   Z O N E', width / 2, endzoneHeight / 2);

    // Goal Line (Thick white)
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, endzoneHeight);
    ctx.lineTo(width, endzoneHeight);
    ctx.stroke();

    // Field Grid & Yardlines
    if (showGridlines) {
      const yardYPercentages = [0.35, 0.50, 0.65, 0.80];
      const yardLabels = ['10 YD', '1st DOWN (20 YD)', 'LINE OF SCRIMMAGE (LOS)', 'BACKFIELD'];

      yardYPercentages.forEach((p, idx) => {
        const y = height * p;
        const isLos = idx === 2;
        const isFirstDown = idx === 1;

        ctx.lineWidth = isLos ? 3 : isFirstDown ? 2.5 : 1.5;
        ctx.strokeStyle = isLos ? '#0284c7' : isFirstDown ? '#eab308' : 'rgba(255, 255, 255, 0.18)';
        
        if (!isLos) {
          ctx.setLineDash([8, 8]);
        } else {
          ctx.setLineDash([]);
        }

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Label
        ctx.font = `bold ${Math.max(11, width * 0.013)}px monospace`;
        ctx.fillStyle = isLos ? '#38bdf8' : isFirstDown ? '#fde047' : 'rgba(255, 255, 255, 0.35)';
        ctx.textAlign = 'left';
        ctx.fillText(yardLabels[idx], 16, y - 6);
      });

      // Hash marks
      const hashes = [0.25, 0.40, 0.60, 0.75];
      hashes.forEach((hx) => {
        const x = width * hx;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        for (let y = endzoneHeight + 20; y < height - 20; y += 30) {
          ctx.beginPath();
          ctx.moveTo(x - 4, y);
          ctx.lineTo(x + 4, y);
          ctx.stroke();
        }
      });
    }

    // 1b. Tactical Snap-to-Grid Alignment Matrix (when Snap-to-Grid is active)
    if (snapToGrid) {
      ctx.save();
      for (let gx = 0.05; gx <= 0.95; gx += 0.05) {
        for (let gy = 0.15; gy <= 0.90; gy += 0.05) {
          const x = gx * width;
          const y = gy * height;
          ctx.fillStyle = fieldTheme === 'turf' ? 'rgba(255, 255, 255, 0.22)' : 'rgba(56, 189, 248, 0.25)';
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }

    // 2. Render Underlay of Current Selected Play (if toggled on)
    if (showUnderlayPlay && currentPlay && currentPlay.players) {
      ctx.save();
      ctx.globalAlpha = 0.4;

      (Object.values(currentPlay.players) as PlayerAssignment[]).forEach((p) => {
        const px = (p.initialPos.x / 100) * width;
        const py = (p.initialPos.y / 100) * height;

        // Draw offensive route path
        if (p.route && p.route.points && p.route.points.length > 1) {
          ctx.beginPath();
          ctx.lineWidth = 2.5;
          ctx.strokeStyle = p.route.color || '#38bdf8';
          const pts = p.route.points;
          ctx.moveTo((pts[0].x / 100) * width, (pts[0].y / 100) * height);
          for (let i = 1; i < pts.length; i++) {
            ctx.lineTo((pts[i].x / 100) * width, (pts[i].y / 100) * height);
          }
          ctx.stroke();
        }

        // Draw player token circle
        ctx.beginPath();
        ctx.arc(px, py, 14, 0, Math.PI * 2);
        ctx.fillStyle = p.id === 'QB' ? '#dc2626' : p.id === 'C' ? '#475569' : '#0284c7';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.id, px, py);
      });

      ctx.restore();
    }

    // 3. Render User Drawn Elements
    elements.forEach((el) => {
      ctx.save();
      ctx.strokeStyle = el.color;
      ctx.fillStyle = el.color;
      ctx.lineWidth = el.strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (el.type === 'freehand' && el.points && el.points.length > 0) {
        ctx.beginPath();
        ctx.moveTo(el.points[0].x * width, el.points[0].y * height);
        for (let i = 1; i < el.points.length; i++) {
          ctx.lineTo(el.points[i].x * width, el.points[i].y * height);
        }
        ctx.stroke();
      } else if (el.type === 'line' && el.points && el.points.length === 2) {
        ctx.beginPath();
        ctx.moveTo(el.points[0].x * width, el.points[0].y * height);
        ctx.lineTo(el.points[1].x * width, el.points[1].y * height);
        ctx.stroke();
      } else if ((el.type === 'arrow' || el.type === 'dashed-arrow') && el.points && el.points.length === 2) {
        const fromX = el.points[0].x * width;
        const fromY = el.points[0].y * height;
        const toX = el.points[1].x * width;
        const toY = el.points[1].y * height;

        if (el.type === 'dashed-arrow') {
          ctx.setLineDash([8, 6]);
        }

        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw Arrowhead
        const angle = Math.atan2(toY - fromY, toX - fromX);
        const headlen = Math.max(12, el.strokeWidth * 3.5);
        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(
          toX - headlen * Math.cos(angle - Math.PI / 6),
          toY - headlen * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          toX - headlen * Math.cos(angle + Math.PI / 6),
          toY - headlen * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();
      } else if (el.type === 'token' && el.x !== undefined && el.y !== undefined) {
        const tx = el.x * width;
        const ty = el.y * height;
        const radius = Math.max(16, el.strokeWidth * 4.5);

        if (el.tokenType === 'X') {
          // Defense 'X' Mark
          const offset = radius * 0.75;
          ctx.beginPath();
          ctx.lineWidth = Math.max(3, el.strokeWidth);
          ctx.moveTo(tx - offset, ty - offset);
          ctx.lineTo(tx + offset, ty + offset);
          ctx.moveTo(tx + offset, ty - offset);
          ctx.lineTo(tx - offset, ty + offset);
          ctx.stroke();
        } else {
          // Offense / Player Token Circle
          ctx.beginPath();
          ctx.arc(tx, ty, radius, 0, Math.PI * 2);
          ctx.fillStyle = el.color;
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Token Text
          ctx.fillStyle = '#0f172a';
          ctx.font = `bold ${Math.round(radius * 0.95)}px monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(el.tokenType || 'O', tx, ty);
        }
      } else if (el.type === 'text' && el.x !== undefined && el.y !== undefined && el.text) {
        const tx = el.x * width;
        const ty = el.y * height;
        ctx.font = `bold ${Math.max(14, el.strokeWidth * 4)}px sans-serif`;
        ctx.fillStyle = el.color;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        // Background chip behind text for high legibility
        const metrics = ctx.measureText(el.text);
        const padding = 6;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(tx - padding, ty - padding, metrics.width + padding * 2, el.strokeWidth * 4 + padding * 2);

        ctx.fillStyle = el.color;
        ctx.fillText(el.text, tx, ty);
      }

      ctx.restore();
    });

    // 4. Render Active In-Progress Live Stroke
    if (isDrawingRef.current && currentPathRef.current.length > 0) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (tool === 'pen' || tool === 'eraser') {
        if (tool === 'eraser') {
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
          ctx.lineWidth = 20;
        }
        ctx.beginPath();
        ctx.moveTo(currentPathRef.current[0].x * width, currentPathRef.current[0].y * height);
        for (let i = 1; i < currentPathRef.current.length; i++) {
          ctx.lineTo(currentPathRef.current[i].x * width, currentPathRef.current[i].y * height);
        }
        ctx.stroke();
      } else if ((tool === 'line' || tool === 'arrow' || tool === 'dashed-arrow') && startPointRef.current) {
        const fromX = startPointRef.current.x * width;
        const fromY = startPointRef.current.y * height;
        const toX = currentPathRef.current[currentPathRef.current.length - 1].x * width;
        const toY = currentPathRef.current[currentPathRef.current.length - 1].y * height;

        if (tool === 'dashed-arrow') {
          ctx.setLineDash([8, 6]);
        }

        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
        ctx.setLineDash([]);

        if (tool === 'arrow' || tool === 'dashed-arrow') {
          const angle = Math.atan2(toY - fromY, toX - fromX);
          const headlen = Math.max(12, strokeWidth * 3.5);
          ctx.beginPath();
          ctx.moveTo(toX, toY);
          ctx.lineTo(
            toX - headlen * Math.cos(angle - Math.PI / 6),
            toY - headlen * Math.sin(angle - Math.PI / 6)
          );
          ctx.lineTo(
            toX - headlen * Math.cos(angle + Math.PI / 6),
            toY - headlen * Math.sin(angle + Math.PI / 6)
          );
          ctx.closePath();
          ctx.fill();
        }
      }

      // Magnetic snap reticle indicator on active endpoint when Snap-to-Grid is ON
      if (snapToGrid && currentPathRef.current.length > 0) {
        const lastPt = currentPathRef.current[currentPathRef.current.length - 1];
        const snapped = snapToFootballGrid(lastPt);
        const sx = snapped.x * width;
        const sy = snapped.y * height;
        ctx.save();
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(sx, sy, 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(sx - 12, sy);
        ctx.lineTo(sx + 12, sy);
        ctx.moveTo(sx, sy - 12);
        ctx.lineTo(sx, sy + 12);
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore();
    }
  }, [
    elements,
    fieldTheme,
    showUnderlayPlay,
    showGridlines,
    snapToGrid,
    snapToFootballGrid,
    currentPlay,
    color,
    strokeWidth,
    tool,
  ]);

  // Synchronize canvas size on mount / resize
  const syncCanvasDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      // High-DPI screen sharp rendering
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      redrawCanvas();
    }
  }, [redrawCanvas]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(syncCanvasDimensions, 50);
      window.addEventListener('resize', syncCanvasDimensions);
      return () => window.removeEventListener('resize', syncCanvasDimensions);
    }
  }, [isOpen, syncCanvasDimensions]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  // Pointer event helpers for Tablet Stylus / Finger / Mouse
  const getNormalizedCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    return { x, y };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    isDrawingRef.current = true;
    setLastTouchTime(Date.now());

    const rawCoords = getNormalizedCoords(e);
    const coords = snapToFootballGrid(rawCoords);
    startPointRef.current = coords;
    currentPathRef.current = [coords];

    if (tool === 'o-token' || tool === 'x-token') {
      // Place token cleanly aligned to grid
      const newEl: DrawnElement = {
        id: `token-${Date.now()}`,
        type: 'token',
        color: tool === 'x-token' ? '#ef4444' : color,
        strokeWidth,
        x: coords.x,
        y: coords.y,
        tokenType: tool === 'x-token' ? 'X' : selectedTokenType,
      };
      pushState([...elements, newEl]);
      isDrawingRef.current = false;
      return;
    }

    if (tool === 'text') {
      setTextCoord(coords);
      setIsAddingText(true);
      isDrawingRef.current = false;
      return;
    }

    if (tool === 'eraser') {
      // Erase elements near tap
      eraseElementsNear(rawCoords);
    }

    redrawCanvas();
  };

  const eraseElementsNear = (pt: { x: number; y: number }) => {
    const threshold = 0.035; // Normalized distance threshold
    const filtered = elements.filter((el) => {
      if (el.x !== undefined && el.y !== undefined) {
        const d = Math.hypot(el.x - pt.x, el.y - pt.y);
        return d > threshold;
      }
      if (el.points) {
        return !el.points.some((p) => Math.hypot(p.x - pt.x, p.y - pt.y) < threshold);
      }
      return true;
    });

    if (filtered.length !== elements.length) {
      pushState(filtered);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();

    const rawCoords = getNormalizedCoords(e);

    if (tool === 'eraser') {
      eraseElementsNear(rawCoords);
      return;
    }

    if (tool === 'pen') {
      currentPathRef.current.push(rawCoords);
    } else if (tool === 'line' || tool === 'arrow' || tool === 'dashed-arrow') {
      const snapped = snapToFootballGrid(rawCoords);
      currentPathRef.current = [startPointRef.current || snapped, snapped];
    }

    redrawCanvas();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    isDrawingRef.current = false;

    const rawCoords = getNormalizedCoords(e);

    if (tool === 'pen' && currentPathRef.current.length > 1) {
      const points = [...currentPathRef.current];
      if (snapToGrid) {
        // Snap start and end anchors cleanly to grid
        points[0] = snapToFootballGrid(points[0]);
        points[points.length - 1] = snapToFootballGrid(points[points.length - 1]);
      }
      const newEl: DrawnElement = {
        id: `pen-${Date.now()}`,
        type: 'freehand',
        color,
        strokeWidth,
        points,
      };
      pushState([...elements, newEl]);
    } else if ((tool === 'line' || tool === 'arrow' || tool === 'dashed-arrow') && startPointRef.current) {
      const snappedEnd = snapToFootballGrid(rawCoords);
      const newEl: DrawnElement = {
        id: `${tool}-${Date.now()}`,
        type: tool,
        color,
        strokeWidth,
        points: [startPointRef.current, snappedEnd],
      };
      pushState([...elements, newEl]);
    }

    currentPathRef.current = [];
    startPointRef.current = null;
    redrawCanvas();
  };

  // Submit Text Annotation
  const handleAddTextSubmit = () => {
    if (!inputText.trim() || !textCoord) {
      setIsAddingText(false);
      return;
    }
    const newEl: DrawnElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      color,
      strokeWidth,
      x: textCoord.x,
      y: textCoord.y,
      text: inputText.trim(),
    };
    pushState([...elements, newEl]);
    setInputText('');
    setTextCoord(null);
    setIsAddingText(false);
  };

  // Export Whiteboard to PNG Image
  const handleExportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Create high-res export canvas
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = 1920;
    exportCanvas.height = 1080;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    // Draw full resolution snapshot
    ctx.drawImage(canvas, 0, 0, exportCanvas.width, exportCanvas.height);

    exportCanvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.download = `Tactical_Whiteboard_Drawing_${Date.now()}.png`;
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      id="coach-whiteboard-modal"
      className={`fixed inset-0 z-50 flex flex-col bg-slate-950/95 text-slate-100 select-none overflow-hidden ${
        isFullscreen ? 'w-screen h-screen' : 'p-2 sm:p-4'
      }`}
    >
      {/* Main Whiteboard Container */}
      <div className={`relative flex-1 flex flex-col bg-slate-900 border border-slate-700/80 ${
        isFullscreen ? 'rounded-none' : 'rounded-2xl shadow-2xl'
      } overflow-hidden`}>
        
        {/* Top Floating Action Bar */}
        <div className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2 z-20">
          {/* Brand & Active Play Context */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <PenTool className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black font-display text-white tracking-tight">
                  Tactical Whiteboard
                </h2>
                <span className="hidden sm:inline px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Tablet & Touch Ready
                </span>
              </div>
              {currentPlay && (
                <p className="text-[11px] text-slate-400 font-mono truncate max-w-xs sm:max-w-md">
                  Active Underlay: <span className="text-amber-400 font-bold">{currentPlay.code}</span> ({currentPlay.englishName})
                </p>
              )}
            </div>
          </div>

          {/* Quick Actions (Undo, Redo, Clear, Export, Fullscreen, Close) */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= -1}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-300 hover:text-white transition-all"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-300 hover:text-white transition-all"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-4 h-4" />
            </button>

            {/* Snap to Grid Quick Toggle */}
            <button
              id="wb-top-snap-to-grid-btn"
              onClick={() => setSnapToGrid(!snapToGrid)}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                snapToGrid
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-xs'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
              title="Toggle Grid Magnet Snapping (Shortcut: G) — Align player positions and routes cleanly"
            >
              <Magnet className={`w-3.5 h-3.5 ${snapToGrid ? 'text-amber-400' : ''}`} />
              <span className="hidden md:inline">Snap-to-Grid: {snapToGrid ? 'ON' : 'OFF'}</span>
              <span className="md:hidden">Snap {snapToGrid ? 'ON' : 'OFF'}</span>
            </button>

            <div className="h-5 w-px bg-slate-700 mx-1" />

            <button
              onClick={handleClearAll}
              className="p-2 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/50 transition-all text-xs font-semibold flex items-center gap-1"
              title="Clear Whiteboard Canvas"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden md:inline">Clear Board</span>
            </button>

            <button
              onClick={handleExportPNG}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all active:scale-95"
              title="Export High Resolution PNG"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export PNG</span>
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
              title={isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
              title="Close Whiteboard"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Workspace: Tools Rail + Canvas Stage */}
        <div className="relative flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Floating Left Toolbar (Optimized for Finger / Stylus Reach on Tablets) */}
          <div className="bg-slate-950/90 backdrop-blur-md border-b md:border-b-0 md:border-r border-slate-800 p-2 sm:p-3 flex md:flex-col items-center justify-between md:justify-start gap-2 sm:gap-3 z-20 overflow-x-auto md:overflow-y-auto">
            
            {/* Primary Drawing Tools Group */}
            <div className="flex md:flex-col items-center gap-1.5">
              <button
                onClick={() => setTool('pen')}
                className={`p-2.5 rounded-xl flex items-center gap-2 text-xs font-bold transition-all ${
                  tool === 'pen'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title="Freehand Pen (Draw Routes / Paths)"
              >
                <PenTool className="w-4 h-4" />
                <span className="hidden lg:inline">Pen</span>
              </button>

              <button
                onClick={() => setTool('arrow')}
                className={`p-2.5 rounded-xl flex items-center gap-2 text-xs font-bold transition-all ${
                  tool === 'arrow'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title="Straight Arrow (Route Stem & Break)"
              >
                <ArrowRight className="w-4 h-4" />
                <span className="hidden lg:inline">Solid Arrow</span>
              </button>

              <button
                onClick={() => setTool('dashed-arrow')}
                className={`p-2.5 rounded-xl flex items-center gap-2 text-xs font-bold transition-all ${
                  tool === 'dashed-arrow'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title="Dashed Arrow (Motion / Secondary Route)"
              >
                <span className="w-4 h-4 flex items-center justify-center font-mono font-bold text-xs border border-dashed border-current rounded">
                  ⇢
                </span>
                <span className="hidden lg:inline">Dashed Motion</span>
              </button>

              <button
                onClick={() => setTool('o-token')}
                className={`p-2.5 rounded-xl flex items-center gap-2 text-xs font-bold transition-all ${
                  tool === 'o-token'
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 ring-2 ring-amber-300'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title="Place Offensive Player Token (O / QB / WR / RB)"
              >
                <Circle className="w-4 h-4" />
                <span className="hidden lg:inline">Offense Token</span>
              </button>

              <button
                onClick={() => setTool('x-token')}
                className={`p-2.5 rounded-xl flex items-center gap-2 text-xs font-bold transition-all ${
                  tool === 'x-token'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 ring-2 ring-red-400'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title="Place Defensive Player Token (X)"
              >
                <span className="font-mono font-black text-sm w-4 h-4 flex items-center justify-center">X</span>
                <span className="hidden lg:inline">Defense Token</span>
              </button>

              <button
                onClick={() => setTool('text')}
                className={`p-2.5 rounded-xl flex items-center gap-2 text-xs font-bold transition-all ${
                  tool === 'text'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title="Text Annotation"
              >
                <Type className="w-4 h-4" />
                <span className="hidden lg:inline">Text Note</span>
              </button>

              <button
                onClick={() => setTool('eraser')}
                className={`p-2.5 rounded-xl flex items-center gap-2 text-xs font-bold transition-all ${
                  tool === 'eraser'
                    ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30 ring-2 ring-pink-400'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title="Eraser (Tap or drag over strokes to remove)"
              >
                <Eraser className="w-4 h-4" />
                <span className="hidden lg:inline">Eraser</span>
              </button>
            </div>

            <div className="hidden md:block w-full h-px bg-slate-800 my-1" />

            {/* Color Palette Picker */}
            <div className="flex md:flex-col items-center gap-1.5">
              <span className="hidden lg:block text-[10px] font-mono text-slate-500 font-bold uppercase">Color</span>
              <div className="grid grid-cols-4 gap-1">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={`wb-color-${c.hex}`}
                    onClick={() => setColor(c.hex)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-6 h-6 rounded-full transition-transform active:scale-90 ${
                      color === c.hex ? 'ring-2 ring-white scale-110 shadow-sm' : 'opacity-80 hover:opacity-100'
                    }`}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            <div className="hidden md:block w-full h-px bg-slate-800 my-1" />

            {/* Stroke Thickness Picker */}
            <div className="flex md:flex-col items-center gap-1">
              <span className="hidden lg:block text-[10px] font-mono text-slate-500 font-bold uppercase">Stroke</span>
              <div className="flex items-center gap-1">
                {STROKE_SIZES.map((sz) => (
                  <button
                    key={`wb-stroke-${sz.value}`}
                    onClick={() => setStrokeWidth(sz.value)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                      strokeWidth === sz.value
                        ? 'bg-blue-500 text-white shadow-xs'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                    }`}
                    title={`${sz.label} stroke size`}
                  >
                    {sz.value}
                  </button>
                ))}
              </div>
            </div>

            {/* Offense Token Type Submenu (Visible when O-Token selected) */}
            {tool === 'o-token' && (
              <div className="hidden lg:flex flex-col gap-1 w-full pt-1 border-t border-slate-800">
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">Token Label</span>
                <div className="grid grid-cols-4 gap-1">
                  {['O', 'QB', 'C', 'WR', 'RB', 'H', 'Y', 'Z'].map((lbl) => (
                    <button
                      key={`token-lbl-${lbl}`}
                      onClick={() => setSelectedTokenType(lbl as any)}
                      className={`p-1 rounded text-[10px] font-mono font-bold transition-all ${
                        selectedTokenType === lbl
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Center Interactive Drawing Canvas */}
          <div className="relative flex-1 bg-slate-950 flex items-center justify-center p-2 overflow-hidden touch-none">
            
            {/* Canvas Element with Touch/Pointer Events */}
            <canvas
              ref={canvasRef}
              id="coach-whiteboard-canvas"
              className="w-full h-full max-w-6xl max-h-[85vh] aspect-[16/9] rounded-xl shadow-2xl border border-slate-800 cursor-crosshair touch-none"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            />

            {/* Text Input Floating Modal */}
            {isAddingText && textCoord && (
              <div
                style={{
                  left: `${Math.min(80, Math.max(10, textCoord.x * 100))}%`,
                  top: `${Math.min(80, Math.max(10, textCoord.y * 100))}%`,
                }}
                className="absolute z-30 bg-slate-900 border border-blue-500 rounded-xl p-3 shadow-2xl space-y-2 animate-in fade-in zoom-in-95 duration-150 min-w-[240px]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-400 flex items-center gap-1">
                    <Type className="w-3.5 h-3.5" /> Add Field Annotation
                  </span>
                  <button onClick={() => setIsAddingText(false)} className="text-slate-400 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <input
                  type="text"
                  autoFocus
                  placeholder="e.g., Read Middle Safety, Check Flat..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddTextSubmit();
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 font-medium"
                />
                <div className="flex justify-end gap-1.5">
                  <button
                    onClick={() => setIsAddingText(false)}
                    className="px-2.5 py-1 rounded text-[11px] text-slate-400 hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddTextSubmit}
                    className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold shadow-xs"
                  >
                    Place Note
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Floating Canvas Options Pill */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl px-3 py-1.5 shadow-2xl flex items-center gap-3 text-xs z-20">
              {/* Field Theme Toggle */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setFieldTheme('chalkboard')}
                  className={`px-2 py-1 rounded-lg font-mono text-[11px] font-semibold transition-all ${
                    fieldTheme === 'chalkboard'
                      ? 'bg-slate-700 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Chalkboard
                </button>
                <button
                  onClick={() => setFieldTheme('turf')}
                  className={`px-2 py-1 rounded-lg font-mono text-[11px] font-semibold transition-all ${
                    fieldTheme === 'turf'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Grass Turf
                </button>
                <button
                  onClick={() => setFieldTheme('dark')}
                  className={`px-2 py-1 rounded-lg font-mono text-[11px] font-semibold transition-all ${
                    fieldTheme === 'dark'
                      ? 'bg-blue-900/80 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Navy
                </button>
              </div>

              <div className="h-4 w-px bg-slate-700" />

              {/* Toggle Underlay */}
              {currentPlay && (
                <button
                  onClick={() => setShowUnderlayPlay(!showUnderlayPlay)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all ${
                    showUnderlayPlay
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Toggle active play alignment underlay"
                >
                  {showUnderlayPlay ? <Eye className="w-3.5 h-3.5 text-blue-400" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">Play Underlay</span>
                </button>
              )}

              {/* Toggle Gridlines */}
              <button
                onClick={() => setShowGridlines(!showGridlines)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all ${
                  showGridlines
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Toggle yardlines and hash marks"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Yardlines</span>
              </button>

              <div className="h-4 w-px bg-slate-700" />

              {/* Snap-to-Grid Toggle */}
              <button
                id="wb-snap-to-grid-btn"
                onClick={() => setSnapToGrid(!snapToGrid)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all ${
                  snapToGrid
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
                title="Snap to Grid (Shortcut: G) — Align player tokens and routes precisely to field grid"
              >
                <Magnet className={`w-3.5 h-3.5 ${snapToGrid ? 'text-amber-400' : ''}`} />
                <span className="hidden sm:inline">Snap to Grid:</span>
                <span className={`font-mono text-[11px] font-bold ${snapToGrid ? 'text-amber-400' : 'text-slate-400'}`}>
                  {snapToGrid ? 'ON' : 'OFF'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
