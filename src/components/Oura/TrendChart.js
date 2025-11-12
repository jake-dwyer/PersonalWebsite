import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const formatDate = (date) => {
  const formatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
  return formatter.format(new Date(date));
};

function TrendChart({ rows = [], loading }) {
  const chartData = rows
    .slice()
    .reverse()
    .map((row) => ({
      date: formatDate(row.date),
      readiness: row.readinessScore ?? null,
      sleepHours: row.totalSleep ? Math.round((row.totalSleep / 3600) * 10) / 10 : null,
      activity: row.activityScore ?? null,
    }));

  return (
    <section className="mt-10 rounded-2xl border border-outline bg-background/40 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-plex text-xs uppercase tracking-[0.2em] text-secondary">Trend watch</p>
          <h2 className="font-geist text-2xl text-primary">Readiness, sleep, activity</h2>
        </div>
        {loading && <p className="font-plex text-xs text-secondary">Updating…</p>}
      </div>

      {rows.length === 0 ? (
        <p className="font-plex text-sm text-secondary">No data in this range yet.</p>
      ) : (
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorReadiness" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EDEDED" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#EDEDED" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A1A1A1" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#A1A1A1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#404040" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#404040" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="#A1A1A1" />
              <YAxis stroke="#A1A1A1" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#050505',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '0.75rem',
                }}
                labelStyle={{ color: '#A1A1A1' }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="readiness"
                stroke="#EDEDED"
                fillOpacity={1}
                fill="url(#colorReadiness)"
                name="Readiness"
              />
              <Area
                type="monotone"
                dataKey="sleepHours"
                stroke="#A1A1A1"
                fillOpacity={1}
                fill="url(#colorSleep)"
                name="Sleep (h)"
              />
              <Area
                type="monotone"
                dataKey="activity"
                stroke="#404040"
                fillOpacity={1}
                fill="url(#colorActivity)"
                name="Activity Score"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default TrendChart;
