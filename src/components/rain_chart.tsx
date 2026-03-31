import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { RainReading } from "../lib/supabase";

interface Props {
  readings: RainReading[];
}

export function RainTrendChart({ readings }: Props) {
  if (!readings.length) return null;

  // Sort by date (oldest → newest)
  const sorted = [...readings].sort(
    (a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
  );

  const chartData = sorted.map(r => ({
    date: new Date(r.recorded_at).toLocaleDateString(),
    rainfall: r.gauge_value
  }));

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-700">
        Rainfall Trend Analysis
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis unit=" mm" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="rainfall"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}