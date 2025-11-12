const formatHours = (seconds) => {
  if (!seconds && seconds !== 0) return '—';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

const formatNumber = (value, unit = '') => {
  if (value === null || value === undefined) return '—';
  return `${value}${unit}`;
};

const headers = [
  { key: 'date', label: 'Date' },
  { key: 'readinessScore', label: 'Readiness' },
  { key: 'restingHeartRate', label: 'Resting HR' },
  { key: 'totalSleep', label: 'Total sleep' },
  { key: 'sleepEfficiency', label: 'Eff%' },
  { key: 'totalSteps', label: 'Steps' },
  { key: 'calories', label: 'Calories' },
  { key: 'activityScore', label: 'Activity' },
];

function DataTable({ rows = [], loading }) {
  return (
    <section className="mt-10 rounded-2xl border border-outline">
      <div className="border-b border-outline px-5 py-4">
        <p className="font-plex text-xs uppercase tracking-[0.2em] text-secondary">Daily breakdown</p>
        <p className="font-geist text-base text-primary">
          {loading ? 'Refreshing entries…' : `${rows.length} days loaded`}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-background/60 text-left text-xs uppercase tracking-[0.2em] text-secondary">
              {headers.map((header) => (
                <th key={header.key} className="whitespace-nowrap px-4 py-3 font-plex font-normal">
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="px-4 py-6 text-center font-plex text-sm text-secondary">
                  {loading ? 'Loading data…' : 'No data available for this range.'}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.date} className="border-t border-outline/50 text-sm text-primary">
                  <td className="whitespace-nowrap px-4 py-3 font-plex text-xs uppercase tracking-[0.2em] text-secondary">
                    {row.date}
                  </td>
                  <td className="px-4 py-3">{formatNumber(row.readinessScore)}</td>
                  <td className="px-4 py-3">{formatNumber(row.restingHeartRate, ' bpm')}</td>
                  <td className="px-4 py-3">{formatHours(row.totalSleep)}</td>
                  <td className="px-4 py-3">{formatNumber(row.sleepEfficiency, '%')}</td>
                  <td className="px-4 py-3">{formatNumber(row.totalSteps)}</td>
                  <td className="px-4 py-3">{formatNumber(row.calories)}</td>
                  <td className="px-4 py-3">{formatNumber(row.activityScore)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default DataTable;
