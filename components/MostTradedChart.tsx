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

// Reformat to { name, value }

const COLORS = ["#f59e0b", "#22c55e", "#3b82f6", "#a855f7"];

export function MostTradedAssetsChart({ rawData }: { rawData: any[] }) {
  const assetData = rawData.map((item) => ({
    name: item.crypto,
    value: item.trades,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Most Traded Assets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={assetData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent, value }) =>
                  value > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ""
                } // hide labels for 0-trade assets
              >
                {assetData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
