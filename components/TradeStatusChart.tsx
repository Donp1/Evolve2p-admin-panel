"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export type TradeStatusData = {
  total: number;
  completed: number;
  pending: number;
  cancelled: number;
};

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b"];
// green = completed, blue = pending, orange = cancelled

export function TradeStatusChart({ rawData }: { rawData: TradeStatusData }) {
  const tradeStatusData = [
    { name: "Completed", value: rawData?.completed },
    { name: "Pending", value: rawData?.pending },
    { name: "Cancelled", value: rawData?.cancelled },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade Status Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={tradeStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={60}
                label={({ name, value }) =>
                  value && value > 0 ? `${name}: ${value}` : ""
                }
              >
                {tradeStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
