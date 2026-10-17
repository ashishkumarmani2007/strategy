import React from 'react';
import { WindowResult } from '../../engine/DetectionEngine';

export interface RiskChartProps {
  windows: WindowResult[];
  maxWindows?: number;
  className?: string;
}

export const RiskChart: React.FC<RiskChartProps> = ({
  windows,
  maxWindows = 6,
  className = '',
}) => {
  const width = 360;
  const height = 180;
  const padding = { top: 20, right: 30, bottom: 30, left: 40 };

  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // Compute points
  const pointsCount = Math.max(maxWindows, windows.length);
  const getX = (index: number) => padding.left + (index / (pointsCount - 1 || 1)) * chartW;
  const getY = (score: number) => padding.top + chartH - score * chartH;

  // Threshold Y coordinates
  const y03 = getY(0.3);
  const y07 = getY(0.7);

  // Calculate smoothed scores for chart points
  const smoothedScores: number[] = [];
  for (let i = 0; i < windows.length; i++) {
    const slice = windows.slice(Math.max(0, i - 2), i + 1);
    const avg = slice.reduce((acc, w) => acc + w.spoofScore, 0) / slice.length;
    smoothedScores.push(avg);
  }

  // Generate paths
  const rawPoints = windows.map((w, idx) => `${getX(idx)},${getY(w.spoofScore)}`).join(' ');
  const smoothedPoints = smoothedScores.map((score, idx) => `${getX(idx)},${getY(score)}`).join(' ');

  return (
    <div className={`w-full bg-vsNavy/60 rounded-xl p-3 border border-white/10 ${className}`}>
      <div className="flex items-center justify-between text-xs mb-2">
        <span className="font-semibold text-white">Live Sliding Window Risk Chart</span>
        <div className="flex items-center gap-3 text-[10px] font-mono">
          <span className="flex items-center gap-1 text-vsMuted">
            <span className="w-2.5 h-0.5 bg-vsMuted/60 inline-block" /> Raw Spoof
          </span>
          <span className="flex items-center gap-1 text-vsBlue font-bold">
            <span className="w-2.5 h-1 bg-vsBlue inline-block rounded" /> Smoothed MA-3
          </span>
        </div>
      </div>

      <div className="relative w-full aspect-[2/1]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible font-mono text-[9px]"
        >
          {/* Shaded Risk Zones */}
          {/* Red Zone (>0.70) */}
          <rect
            x={padding.left}
            y={padding.top}
            width={chartW}
            height={y07 - padding.top}
            fill="#FF6B5E"
            fillOpacity="0.08"
          />
          {/* Amber Zone (0.30 - 0.70) */}
          <rect
            x={padding.left}
            y={y07}
            width={chartW}
            height={y03 - y07}
            fill="#FFC14D"
            fillOpacity="0.06"
          />
          {/* Green Zone (<0.30) */}
          <rect
            x={padding.left}
            y={y03}
            width={chartW}
            height={padding.top + chartH - y03}
            fill="#3DDC97"
            fillOpacity="0.06"
          />

          {/* Grid lines and Thresholds */}
          {/* 0.70 line */}
          <line
            x1={padding.left}
            y1={y07}
            x2={width - padding.right}
            y2={y07}
            stroke="#FF6B5E"
            strokeDasharray="4 3"
            strokeWidth="1.2"
          />
          <text x={width - padding.right + 4} y={y07 + 3} fill="#FF6B5E" fontSize="8">
            0.70 AI
          </text>

          {/* 0.30 line */}
          <line
            x1={padding.left}
            y1={y03}
            x2={width - padding.right}
            y2={y03}
            stroke="#3DDC97"
            strokeDasharray="4 3"
            strokeWidth="1.2"
          />
          <text x={width - padding.right + 4} y={y03 + 3} fill="#3DDC97" fontSize="8">
            0.30 Safe
          </text>

          {/* Y Axis Baseline */}
          <line
            x1={padding.left}
            y1={padding.top + chartH}
            x2={width - padding.right}
            y2={padding.top + chartH}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
          />

          {/* Y Axis labels */}
          <text x={padding.left - 6} y={padding.top + 4} fill="#9FB0CC" textAnchor="end">
            1.0
          </text>
          <text x={padding.left - 6} y={y07 + 3} fill="#9FB0CC" textAnchor="end">
            0.7
          </text>
          <text x={padding.left - 6} y={y03 + 3} fill="#9FB0CC" textAnchor="end">
            0.3
          </text>
          <text x={padding.left - 6} y={padding.top + chartH} fill="#9FB0CC" textAnchor="end">
            0.0
          </text>

          {/* X Axis Ticks for 3-second windows */}
          {Array.from({ length: pointsCount }).map((_, idx) => {
            const x = getX(idx);
            return (
              <g key={idx}>
                <line
                  x1={x}
                  y1={padding.top + chartH}
                  x2={x}
                  y2={padding.top + chartH + 4}
                  stroke="rgba(255,255,255,0.2)"
                />
                <text
                  x={x}
                  y={padding.top + chartH + 14}
                  fill="#9FB0CC"
                  textAnchor="middle"
                  fontSize="8"
                >
                  W{idx + 1}
                </text>
              </g>
            );
          })}

          {/* Raw Score Line */}
          {windows.length > 1 && (
            <polyline
              fill="none"
              stroke="#9FB0CC"
              strokeWidth="1.2"
              strokeDasharray="2 2"
              opacity="0.6"
              points={rawPoints}
            />
          )}

          {/* Smoothed Score Line */}
          {smoothedScores.length > 1 && (
            <polyline
              fill="none"
              stroke="#2D8CFF"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={smoothedPoints}
            />
          )}

          {/* Data points for smoothed */}
          {smoothedScores.map((score, idx) => {
            const cx = getX(idx);
            const cy = getY(score);
            const dotColor = score > 0.7 ? '#FF6B5E' : score < 0.3 ? '#3DDC97' : '#FFC14D';
            return (
              <circle
                key={idx}
                cx={cx}
                cy={cy}
                r="4"
                fill={dotColor}
                stroke="#071226"
                strokeWidth="1.5"
              />
            );
          })}
        </svg>
      </div>

      <div className="flex justify-between items-center text-[10px] text-vsMuted mt-1 px-1">
        <span>Window Duration: ~3s each</span>
        <span className="font-mono">
          Last Smoothed: {smoothedScores.length ? smoothedScores[smoothedScores.length - 1].toFixed(2) : '0.00'}
        </span>
      </div>
    </div>
  );
};
