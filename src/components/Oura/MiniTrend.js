import { Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts';

const formatLabel = (date) => {
  const formatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
  return formatter.format(new Date(date));
};

function MiniTrend({ rows = [], metricKey, color = '#EDEDED', label = 'Metric' }) {
  const data = rows
    .slice(0, 14)
    .reverse()
    .map((row) => ({
      date: formatLabel(row.date),
      value: typeof row[metricKey] === 'number' ? row[metricKey] : null,
    }));

  return (
    <div className="h-32 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Tooltip
            contentStyle={{
              backgroundColor: '#050505',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '0.75rem',
            }}
            labelStyle={{ color: '#A1A1A1' }}
            formatter={(value) => [`${value}`, label]}
          />
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MiniTrend;
