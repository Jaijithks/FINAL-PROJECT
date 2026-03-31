import { useState, useEffect } from 'react';
import { supabase, RainReading } from '../lib/supabase';
import { FilterBar } from './FilterBar';
import { RainTable } from './RainTable';
import { RainPrediction } from "./RainPrediction";
import { RainTrendChart } from "./rain_chart";

import { LogOut, Droplets, TrendingUp, MapPin, Activity } from 'lucide-react';
import * as XLSX from 'xlsx';
import { motion } from "framer-motion";

export function Dashboard({ userEmail, onLogout }: any) {
  const [allReadings, setAllReadings] = useState<RainReading[]>([]);
  const [filteredReadings, setFilteredReadings] = useState<RainReading[]>([]);
  const [places, setPlaces] = useState<string[]>([]);
  const [selectedPlace, setSelectedPlace] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const sortByLatest = (data: RainReading[]) =>
    data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const loadData = async () => {
    const { data } = await supabase
      .from('rain_reading')
      .select('*')
      .order('created_at', { ascending: false });

    const fixed = (data || []).map(r => ({
      ...r,
      recorded_at: r.created_at
    }));

    const sorted = sortByLatest(fixed);
    setAllReadings(sorted);
    setFilteredReadings(sorted);
    setPlaces(Array.from(new Set(sorted.map(r => r.place))));
    setIsLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...allReadings];

    if (selectedPlace) filtered = filtered.filter(r => r.place === selectedPlace);
    if (fromDate) filtered = filtered.filter(r => r.created_at.slice(0, 10) >= fromDate);
    if (toDate) filtered = filtered.filter(r => r.created_at.slice(0, 10) <= toDate);

    setFilteredReadings(sortByLatest(filtered));
  };

  const resetFilters = () => {
    setSelectedPlace('');
    setFromDate('');
    setToDate('');
    setFilteredReadings(sortByLatest([...allReadings]));
  };

  const exportToExcel = () => {
    const rows = filteredReadings.map(r => ({
      Value: r.gauge_value,
      Place: r.place,
      Time: new Date(r.created_at).toLocaleString()
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Rain Data');
    XLSX.writeFile(wb, 'rain_data.xlsx');
  };

  const stats = {
    total: filteredReadings.length,
    avg: filteredReadings.length
      ? (filteredReadings.reduce((s, r) => s + r.gauge_value, 0) / filteredReadings.length).toFixed(1)
      : '0',
    alerts: filteredReadings.filter(r => r.gauge_value >= 65).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 text-gray-800">

      {/* HEADER */}
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/80 backdrop-blur-lg border-b shadow-sm sticky top-0 z-10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-3 rounded-xl shadow-md">
              <Droplets className="text-white" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight">Rain Analytics</h1>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600"
          >
            Logout
          </motion.button>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-6 py-8">

        {isLoading && (
          <div className="bg-white p-6 rounded-xl shadow text-center">
            Loading...
          </div>
        )}

        {!isLoading && (
          <>
            {/* STATS */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">

              <StatCard title="Total" value={stats.total} icon={<Activity />} accent="blue" />
              <StatCard title="Average" value={stats.avg} icon={<TrendingUp />} accent="green" />
              <StatCard title="Alerts" value={stats.alerts} icon={<Droplets />} accent="red" />

            </div>

            {/* FILTER */}
            <GlassCard>
              <FilterBar
                places={places}
                selectedPlace={selectedPlace}
                fromDate={fromDate}
                toDate={toDate}
                onPlaceChange={setSelectedPlace}
                onFromDateChange={setFromDate}
                onToDateChange={setToDate}
                onApplyFilter={applyFilters}
                onResetFilter={resetFilters}
                onRefresh={loadData}
                onExport={exportToExcel}
                hasData={filteredReadings.length > 0}
              />
            </GlassCard>

            {/* CHART + PREDICTION */}
            <div className="grid md:grid-cols-2 gap-8 my-8">
              <GlassCard>
                <RainPrediction readings={filteredReadings} />
              </GlassCard>

              <GlassCard>
                <RainTrendChart readings={filteredReadings} />
              </GlassCard>
            </div>

            {/* TABLE */}
            <GlassCard>
              <RainTable readings={filteredReadings} />
            </GlassCard>
          </>
        )}
      </main>
    </div>
  );
}

/* ELITE STAT CARD */
function StatCard({ title, value, icon, accent }: any) {
  const colors: any = {
    blue: "border-blue-500 hover:shadow-blue-100",
    green: "border-green-500 hover:shadow-green-100",
    red: "border-red-500 hover:shadow-red-100"
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className={`bg-white p-6 rounded-xl border-l-4 ${colors[accent]} shadow-sm transition`}
    >
      <div className="flex justify-between text-gray-500 mb-2">
        {title}
        {icon}
      </div>
      <h2 className="text-3xl font-bold">{value}</h2>
    </motion.div>
  );
}

/* GLASS CARD */
function GlassCard({ children }: any) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-md border"
    >
      {children}
    </motion.div>
  );
}