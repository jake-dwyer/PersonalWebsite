import { useMemo } from 'react';

function OuraSummaryCards({ rows = [], loading }) {
  const stats = useMemo(() => {
    const sum = rows.reduce(
      (acc, row) => {
        if (typeof row.readinessScore === 'number') {
          acc.readiness += row.readinessScore;
          acc.readinessCount += 1;
        }
        if (typeof row.totalSleep === 'number') {
          acc.sleepDuration += row.totalSleep;
          acc.sleepDurationCount += 1;
        }
        if (typeof row.activityScore === 'number') {
          acc.activityScore += row.activityScore;
          acc.activityScoreCount += 1;
        }
        if (typeof row.sleepEfficiency === 'number') {
          acc.sleepEfficiency += row.sleepEfficiency;
          acc.sleepEfficiencyCount += 1;
        }
        return acc;
      },
      {
        readiness: 0,
        readinessCount: 0,
        sleepDuration: 0,
        sleepDurationCount: 0,
        activityScore: 0,
        activityScoreCount: 0,
        sleepEfficiency: 0,
        sleepEfficiencyCount: 0,
      }
    );

    return {
      readinessAvg: sum.readinessCount ? sum.readiness / sum.readinessCount : null,
      sleepAvg: sum.sleepDurationCount ? sum.sleepDuration / sum.sleepDurationCount : null,
      activityAvg: sum.activityScoreCount ? sum.activityScore / sum.activityScoreCount : null,
      sleepEfficiencyAvg: sum.sleepEfficiencyCount ? sum.sleepEfficiency / sum.sleepEfficiencyCount : null,
    };
  }, [rows]);

  const cards = [
    {
      label: 'Avg readiness',
      value: stats.readinessAvg ? stats.readinessAvg.toFixed(1) : '—',
      helper: 'Score / 100',
    },
    {
      label: 'Avg total sleep',
      value: stats.sleepAvg ? `${(stats.sleepAvg / 3600).toFixed(1)}h` : '—',
      helper: 'Hours per night',
    },
    {
      label: 'Avg activity',
      value: stats.activityAvg ? stats.activityAvg.toFixed(1) : '—',
      helper: 'Activity score',
    },
    {
      label: 'Sleep efficiency',
      value: stats.sleepEfficiencyAvg ? `${stats.sleepEfficiencyAvg.toFixed(0)}%` : '—',
      helper: 'Quality over quantity',
    },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article key={card.label} className="border border-outline p-5">
          <p className="font-plex text-xs uppercase tracking-[0.2em] text-secondary">{card.label}</p>
          <p className="mt-3 font-geist text-4xl text-primary">{loading ? '…' : card.value}</p>
          <p className="font-plex text-xs text-secondary">{card.helper}</p>
        </article>
      ))}
    </section>
  );
}

export default OuraSummaryCards;
