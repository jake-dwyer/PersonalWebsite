import { useId } from 'react';
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
  const gradientBaseId = useId();
  const gradients = {
    readiness: `${gradientBaseId}-readiness`,
    sleep: `${gradientBaseId}-sleep`,
    activity: `${gradientBaseId}-activity`,
  };

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
    <section className="relative mt-10 overflow-hidden border border-outline bg-background/40 p-5">
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute -left-24 top-6 h-48 w-48 bg-[radial-gradient(circle,_rgba(255,117,195,0.35),_transparent_65%)] blur-3xl" />
        <div className="absolute right-0 top-0 h-40 w-40 bg-[radial-gradient(circle,_rgba(51,255,194,0.25),_transparent_70%)] blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-52 w-52 bg-[radial-gradient(circle,_rgba(138,92,246,0.25),_transparent_65%)] blur-3xl" />
      </div>

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
        <div className="relative h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={gradients.readiness} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="10%" stopColor="#28FF8A" stopOpacity={0.9} />
                  <stop offset="90%" stopColor="#28FF8A" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id={gradients.sleep} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="10%" stopColor="#2E84FF" stopOpacity={0.7} />
                  <stop offset="90%" stopColor="#2E84FF" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id={gradients.activity} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="10%" stopColor="#FF75C3" stopOpacity={0.7} />
                  <stop offset="90%" stopColor="#FF75C3" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="date" stroke="#A1A1A1" tickLine={false} axisLine={false} />
              <YAxis stroke="#A1A1A1" tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#050505',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '0.75rem',
                }}
                labelStyle={{ color: '#A1A1A1', fontFamily: 'Space Mono, monospace' }}
                formatter={(value, name) => [
                  value === null || value === undefined ? '—' : value,
                  name,
                ]}
              />
              <Legend
                verticalAlign="top"
                height={36}
                iconType="circle"
                wrapperStyle={{ paddingTop: 8, color: '#A1A1A1' }}
              />
              <Area
                type="monotone"
                dataKey="readiness"
                stroke="#28FF8A"
                fillOpacity={1}
                fill={`url(#${gradients.readiness})`}
                name="Readiness"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="sleepHours"
                stroke="#2E84FF"
                fillOpacity={1}
                fill={`url(#${gradients.sleep})`}
                name="Sleep (h)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="activity"
                stroke="#FF75C3"
                fillOpacity={1}
                fill={`url(#${gradients.activity})`}
                name="Activity Score"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default TrendChart;
