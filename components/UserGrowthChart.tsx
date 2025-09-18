"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

// Define the shape of user growth data
type UserGrowth = {
  year: number;
  month: string;
  users: number;
  date: string; // computed as month + year
};

// Custom tooltip component with proper typing
const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg bg-white p-2 shadow-md border text-sm">
        <p className="font-medium text-blue-400">{label}</p>
        <p className="text-blue-600">Users: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

// Main chart
export default function UserGrowthChart({
  growthData,
}: {
  growthData: UserGrowth[];
}) {
  const [data, setData] = useState<UserGrowth[]>([]);

  useEffect(() => {
    if (growthData && growthData.length > 0) {
      const formatted: UserGrowth[] = growthData.map((item) => ({
        ...item,
        date: `${item.month} ${item.year}`,
      }));
      setData(formatted);
    }
  }, [growthData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Growth</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#2563eb"
                fill="#3b82f6"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
