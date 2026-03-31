import { TrendingUp } from "lucide-react";
import { RainReading } from "../lib/supabase";

interface RainPredictionProps {
  readings: RainReading[];
}

export function RainPrediction({ readings }: RainPredictionProps) {
  // 1. Group rainfall by date
  const dailyRain: Record<string, number> = {};
  readings.forEach((r) => {
    const date = r.recorded_at.slice(0, 10);
    dailyRain[date] = (dailyRain[date] || 0) + r.gauge_value;
  });

  const dates = Object.keys(dailyRain).sort();
  const values = dates.map((d) => dailyRain[d]);

  // We need enough historical data to form patterns (at least 7 days recommended)
  if (values.length < 7) {
    return (
      <div className="p-4 bg-white rounded-xl shadow">
        <p className="text-gray-500">Collecting more historical data for k-NN prediction...</p>
      </div>
    );
  }

  // ---- k-NN Implementation ----
  
  const K = 3; // Number of similar patterns to find
  const WINDOW_SIZE = 3; // How many days back make up a "pattern"

  // Current pattern (the last 3 days of data we have)
  const currentPattern = values.slice(-WINDOW_SIZE);

  // Find neighbors in history
  const neighbors: { distance: number; nextDayValue: number }[] = [];

  // Loop through history (stop before the end so we know the 'nextDayValue')
  for (let i = 0; i < values.length - WINDOW_SIZE - 1; i++) {
    const historicalPattern = values.slice(i, i + WINDOW_SIZE);
    const nextDayValue = values[i + WINDOW_SIZE];

    // Calculate Euclidean Distance: sqrt(sum((a - b)^2))
    const distance = Math.sqrt(
      historicalPattern.reduce((sum, val, idx) => sum + Math.pow(val - currentPattern[idx], 2), 0)
    );

    neighbors.push({ distance, nextDayValue });
  }

  // Sort by closest distance and take top K
  const nearestNeighbors = neighbors
    .sort((a, b) => a.distance - b.distance)
    .slice(0, K);

  // Calculate prediction (average of the K nearest outcomes)
  const predictionValue = 
    nearestNeighbors.reduce((sum, n) => sum + n.nextDayValue, 0) / nearestNeighbors.length;

  return (
    <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl shadow">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="text-indigo-600" />
        <h3 className="text-lg font-semibold">k-NN Weather Forecast</h3>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <span>📅 <b>Tomorrow's Est:</b></span>
          <span className="text-lg font-mono font-bold text-indigo-700">
            {predictionValue.toFixed(1)} mm
          </span>
        </div>
        
        <div className="pt-2 border-t border-indigo-100">
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
            Confidence Metric
          </p>
          <p className="text-xs text-gray-500">
            Based on {K} historical periods with similar rainfall patterns.
          </p>
        </div>
      </div>
    </div>
  );
}