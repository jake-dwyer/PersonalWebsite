import { useId } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import LegendContent from "./LegendContent";

const formatDate = (date) => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  });
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
      sleepScore: row.sleepScore ?? null,
      activity: row.activityScore ?? null,
    }));

  return (
    <section className="relative mt-10 overflow-hidden border border-outline bg-background/40 p-5">
      <div className="mb-4 flex flex-col gap-3">
        <p className="font-plex text-xs uppercase tracking-[0.2em] text-secondary">
          Trend watch
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-geist text-2xl text-primary">
            Readiness, Sleep, Activity
          </h2>
          <LegendContent
            payload={[
              { value: "Activity score", color: "#FF75C3" },
              { value: "Readiness", color: "#28FF8A" },
              { value: "Sleep score", color: "#2E84FF" },
            ]}
          />
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="font-plex text-sm text-secondary">
          No data in this range yet.
        </p>
      ) : (
        <div className="relative h-[420px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 40, right: 20, left: 0, bottom: 28 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.08)"
              />
              <XAxis
                dataKey="date"
                stroke="#A1A1A1"
                tickLine={false}
                axisLine={false}
                tick={{ dy: 8 }}
              />
              <YAxis stroke="#A1A1A1" tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#050505",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "0.75rem",
                }}
                labelStyle={{
                  color: "#A1A1A1",
                  fontFamily: "Space Mono, monospace",
                }}
                formatter={(value, name) => [
                  value === null || value === undefined ? "—" : value,
                  name,
                ]}
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
                dataKey="sleepScore"
                stroke="#2E84FF"
                fillOpacity={1}
                fill={`url(#${gradients.sleep})`}
                name="Sleep score"
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
