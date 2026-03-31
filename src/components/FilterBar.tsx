import { Calendar, Filter, RefreshCw, RotateCcw, Download } from 'lucide-react';

interface FilterBarProps {
  places: string[];
  selectedPlace: string;
  fromDate: string;
  toDate: string;
  onPlaceChange: (place: string) => void;
  onFromDateChange: (date: string) => void;
  onToDateChange: (date: string) => void;
  onApplyFilter: () => void;
  onResetFilter: () => void;
  onRefresh: () => void;
  onExport: () => void;
  hasData: boolean;
}

export function FilterBar({
  places,
  selectedPlace,
  fromDate,
  toDate,
  onPlaceChange,
  onFromDateChange,
  onToDateChange,
  onApplyFilter,
  onResetFilter,
  onRefresh,
  onExport,
  hasData
}: FilterBarProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200 animate-slide-in-up">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-bold text-gray-800">Filters</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Location</label>
          <select
            value={selectedPlace}
            onChange={(e) => onPlaceChange(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 outline-none bg-white"
          >
            <option value="">All Places</option>
            {places.map((place) => (
              <option key={place} value={place}>
                {place}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">From Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={fromDate}
              onChange={(e) => onFromDateChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">To Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={toDate}
              onChange={(e) => onToDateChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 opacity-0">Actions</label>
          <div className="flex gap-2">
            <button
              onClick={onApplyFilter}
              className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transform transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
            >
              Apply
            </button>
            <button
              onClick={onResetFilter}
              className="px-4 py-2.5 rounded-lg font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transform transition-all duration-300 hover:scale-105"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transform transition-all duration-300 hover:scale-105"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Data
        </button>
        <button
          onClick={onExport}
          disabled={!hasData}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 transform transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <Download className="w-4 h-4" />
          Export to Excel
        </button>
      </div>
    </div>
  );
}
