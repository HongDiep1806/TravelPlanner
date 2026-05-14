export function ProgressBar({ packed, total }) {
  const pct = total ? Math.round((packed / total) * 100) : 0;

  return (
    <div className="bg-gray-50 rounded-2xl px-6 py-5 mb-8 border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-1">
        <span className="text-base font-bold text-gray-700">Packing Progress</span>
        <span className="text-sm sm:text-base text-gray-500">
          <span className="font-bold text-green-600">{packed}</span>
          {" / "}{total} items packed
          <span className="ml-1.5 text-gray-400">({pct}%)</span>
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3.5 overflow-hidden">
        <div
          className="h-3.5 rounded-full bg-green-500 transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
