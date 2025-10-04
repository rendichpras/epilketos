"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type Row = { name: string; votes: number };

export default function ResultsChart({ data }: { data: Row[] }) {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.2)" />
          <XAxis 
            dataKey="name" 
            stroke="hsl(var(--foreground))"
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            allowDecimals={false}
            stroke="hsl(var(--foreground))"
            fontSize={12}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.5rem",
              fontSize: "0.875rem"
            }}
          />
          <Bar 
            dataKey="votes" 
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
