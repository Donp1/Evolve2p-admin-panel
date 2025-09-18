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

const rawData = [
  { paymentMethod: "Bank Transfer", trades: 13 },
  { paymentMethod: "Paypal", trades: 0 },
  { paymentMethod: "Cash App", trades: 0 },
  { paymentMethod: "Zelle", trades: 0 },
];

const COLORS = ["#3b82f6", "#f59e0b", "#22c55e", "#ef4444"];

interface pageProps {
  paymentMethodsData: any[];
}

export function PaymentMethodsChart({ paymentMethodsData }: pageProps) {
  // Reformat to { name, value }
  const paymentData = paymentMethodsData.map((item) => ({
    name: item.paymentMethod,
    value: item.trades,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={paymentData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent, value }) =>
                  value > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ""
                } // hide labels for 0 trades
              >
                {paymentData.map((entry, index) => (
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
