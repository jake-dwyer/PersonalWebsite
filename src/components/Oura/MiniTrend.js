import { useId } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts';

const formatLabel = (date) => {
  const formatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
  return formatter.format(new Date(date));
};

function MiniTrend({ rows = [], metricKey, color = '#EDEDED', label = 'Metric' }) {
  const gradientId = useId();
  const data = rows
    .slice(0, 14)
    .reverse()
    .map((row) => ({
      date: formatLabel(row.date),
      value: typeof row[metricKey] === 'number' ? row[metricKey] : null,
    }));

  const hasValues = data.some((point) => typeof point.value === 'number');

  return (
    <div className="relative h-32 w-full overflow-hidden bg-transparent p-2">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-8 right-6 h-24 w-24" />
        <div className="absolute bottom-0 left-0 h-20 w-20" />
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 6, left: 6, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0E0E0E" stopOpacity="0.2" />
              <stop offset="45%" stopColor={color} stopOpacity="0.9" />
              <stop offset="100%" stopColor={color} stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <Tooltip
            contentStyle={{
              backgroundColor: '#050505',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '0.75rem',
            }}
            labelStyle={{ color: '#A1A1A1' }}
            formatter={(value) => [
              value === null || value === undefined ? '—' : value,
              label,
            ]}
          />
          {hasValues ? (
            <Line
              type="monotone"
              dataKey="value"
              stroke={`url(#${gradientId})`}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, stroke: '#050505', strokeWidth: 2 }}
            />
          ) : null}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MiniTrend;
