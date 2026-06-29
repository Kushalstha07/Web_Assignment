"use client";

import { Line, LineChart, ResponsiveContainer } from "recharts";

export interface SparklineData {
  value: number;
}

interface SparklineProps {
  data: SparklineData[];
  color?: string;
  height?: number;
  width?: number;
  strokeWidth?: number;
}

const Sparkline = ({
  data,
  color = "#2563EB",
  height = 40,
  width = 300,
  strokeWidth = 2,
}: SparklineProps) => {
  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={strokeWidth}
          dot={false}
          activeDot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export { Sparkline };