"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

export interface BarChartData {
  name: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarChartData[];
  height?: number;
  width?: number;
  showAxis?: boolean;
  showTooltip?: boolean;
  barSize?: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-3 shadow-lg">
        <p className="text-sm font-semibold text-[#0F172A]">{label}</p>
        <p className="text-sm text-[#64748B]">
          Value: <span className="font-bold text-[#2563EB]">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

const BarChartComponent = ({
  data,
  height = 200,
  width = 400,
  showAxis = true,
  showTooltip = true,
  barSize = 40,
}: BarChartProps) => {
  return (
    <ResponsiveContainer width={width} height={height}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        {showAxis && (
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "#64748B" }}
            axisLine={{ stroke: "#E5E7EB" }}
            tickLine={false}
          />
        )}
        {showAxis && (
          <YAxis
            tick={{ fontSize: 12, fill: "#64748B" }}
            axisLine={{ stroke: "#E5E7EB" }}
            tickLine={false}
          />
        )}
        {showTooltip && <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F8FAFC" }} />}
        <Bar
          dataKey="value"
          radius={[8, 8, 0, 0]}
          barSize={barSize}
        >
          {data.map((entry, index) => (
            <rect
              key={`bar-${index}`}
              fill={entry.color || "#2563EB"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export { BarChartComponent as BarChart };