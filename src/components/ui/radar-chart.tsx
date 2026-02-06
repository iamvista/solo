"use client";

import { useMemo } from "react";

interface RadarChartProps {
  data: {
    label: string;
    value: number; // 0-100
    fullMark?: number;
  }[];
  size?: number;
  className?: string;
}

export function RadarChart({ data, size = 320, className = "" }: RadarChartProps) {
  // 增加 padding 來避免標籤被切掉
  const padding = 50;
  const viewBoxSize = size + padding * 2;
  const center = viewBoxSize / 2;
  const radius = (size / 2) * 0.65; // 縮小雷達圖本身，留更多空間給標籤

  const { points, labelPositions, gridLevels } = useMemo(() => {
    const angleStep = (2 * Math.PI) / data.length;
    const startAngle = -Math.PI / 2; // 從頂部開始

    // 計算數據點位置
    const points = data.map((item, index) => {
      const angle = startAngle + index * angleStep;
      const r = (item.value / 100) * radius;
      return {
        x: center + r * Math.cos(angle),
        y: center + r * Math.sin(angle),
      };
    });

    // 計算標籤位置 - 增加距離
    const labelPositions = data.map((item, index) => {
      const angle = startAngle + index * angleStep;
      const labelRadius = radius + 35; // 增加標籤距離
      return {
        x: center + labelRadius * Math.cos(angle),
        y: center + labelRadius * Math.sin(angle),
        label: item.label,
        value: item.value,
        angle,
        index,
      };
    });

    // 網格層級 (20, 40, 60, 80, 100)
    const gridLevels = [20, 40, 60, 80, 100].map((level) => {
      const r = (level / 100) * radius;
      const gridPoints = data.map((_, index) => {
        const angle = startAngle + index * angleStep;
        return {
          x: center + r * Math.cos(angle),
          y: center + r * Math.sin(angle),
        };
      });
      return { level, points: gridPoints };
    });

    return { points, labelPositions, gridLevels };
  }, [data, center, radius]);

  // 生成多邊形路徑
  const polygonPath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  // 生成網格路徑
  const generateGridPath = (gridPoints: { x: number; y: number }[]) =>
    gridPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  // 生成軸線
  const axisLines = data.map((_, index) => {
    const angle = -Math.PI / 2 + index * ((2 * Math.PI) / data.length);
    return {
      x2: center + radius * Math.cos(angle),
      y2: center + radius * Math.sin(angle),
    };
  });

  // 根據五邊形的角度計算每個標籤的對齊方式
  // 角度: 頂部(-90°), 右上(18°), 右下(90°+36°=126°), 左下(180°+54°=234°), 左上(270°+72°=342°=-18°)
  const getTextAlignment = (index: number, angle: number) => {
    // 五邊形的五個位置
    // index 0: 頂部 (angle = -π/2 = -90°)
    // index 1: 右上 (angle ≈ -18°)
    // index 2: 右下 (angle ≈ 54°)
    // index 3: 左下 (angle ≈ 126°)
    // index 4: 左上 (angle ≈ 198°)

    let textAnchor: "start" | "middle" | "end" = "middle";
    let dx = 0;
    let dy = 0;

    const angleDeg = (angle * 180) / Math.PI;

    if (index === 0) {
      // 頂部
      textAnchor = "middle";
      dy = -12;
    } else if (index === 1) {
      // 右上
      textAnchor = "start";
      dx = 5;
      dy = -2;
    } else if (index === 2) {
      // 右下
      textAnchor = "start";
      dx = 5;
      dy = 5;
    } else if (index === 3) {
      // 左下
      textAnchor = "end";
      dx = -5;
      dy = 5;
    } else if (index === 4) {
      // 左上
      textAnchor = "end";
      dx = -5;
      dy = -2;
    }

    return { textAnchor, dx, dy };
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        style={{ overflow: 'visible' }}
      >
        {/* 背景網格 */}
        {gridLevels.map(({ level, points: gridPoints }) => (
          <path
            key={level}
            d={generateGridPath(gridPoints)}
            fill="none"
            stroke="currentColor"
            strokeWidth={level === 100 ? 1.5 : 0.5}
            className="text-stone-200"
            strokeDasharray={level === 100 ? "none" : "2,2"}
          />
        ))}

        {/* 軸線 */}
        {axisLines.map((line, index) => (
          <line
            key={index}
            x1={center}
            y1={center}
            x2={line.x2}
            y2={line.y2}
            stroke="currentColor"
            strokeWidth={0.5}
            className="text-stone-300"
          />
        ))}

        {/* 數據區域 - 漸層填充 */}
        <defs>
          <linearGradient id="radarGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgb(220, 38, 38)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="rgb(239, 68, 68)" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        <path
          d={polygonPath}
          fill="url(#radarGradient)"
          stroke="rgb(220, 38, 38)"
          strokeWidth={2.5}
          strokeLinejoin="round"
        />

        {/* 數據點 */}
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={5}
            fill="white"
            stroke="rgb(220, 38, 38)"
            strokeWidth={2.5}
          />
        ))}

        {/* 標籤 */}
        {labelPositions.map((pos) => {
          const { textAnchor, dx, dy } = getTextAlignment(pos.index, pos.angle);

          return (
            <g key={pos.index}>
              <text
                x={pos.x + dx}
                y={pos.y + dy}
                textAnchor={textAnchor}
                className="fill-stone-700 font-medium"
                style={{ fontSize: '13px' }}
                dominantBaseline="middle"
              >
                {pos.label}
              </text>
              <text
                x={pos.x + dx}
                y={pos.y + dy + 16}
                textAnchor={textAnchor}
                className="fill-red-600 font-bold"
                style={{ fontSize: '14px' }}
                dominantBaseline="middle"
              >
                {pos.value}
              </text>
            </g>
          );
        })}

        {/* 中心分數 */}
        <text
          x={center}
          y={center - 10}
          textAnchor="middle"
          className="fill-stone-400"
          style={{ fontSize: '11px' }}
          dominantBaseline="middle"
        >
          總分
        </text>
        <text
          x={center}
          y={center + 12}
          textAnchor="middle"
          className="fill-red-600 font-bold"
          style={{ fontSize: '22px' }}
          dominantBaseline="middle"
        >
          {Math.round(data.reduce((sum, item) => sum + item.value, 0) / data.length)}
        </text>
      </svg>
    </div>
  );
}
