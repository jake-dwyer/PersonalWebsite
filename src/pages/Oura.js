import { useEffect, useMemo, useState } from 'react';
import OuraSummaryCards from '../components/Oura/OuraSummaryCards';
import TrendChart from '../components/Oura/TrendChart';
import DataTable from '../components/Oura/DataTable';
import RangeSelector from '../components/Oura/RangeSelector';

const RESOURCES = ['daily_readiness', 'daily_sleep', 'daily_activity', 'sleep'];

const formatDate = (date) => date.toISOString().split('T')[0];

function Oura() {
  const [dayWindow, setDayWindow] = useState(7);
  const [rawData, setRawData] = useState({
    readiness: [],
    sleep: [],
    activity: [],
    sleepSessions: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorCode, setErrorCode] = useState('');
  const [requestId, setRequestId] = useState(0);

  const dateRange = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - (dayWindow - 1));
    return {
      start: formatDate(start),
      end: formatDate(end),
    };
  }, [dayWindow]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchOuraData() {
      setLoading(true);
      setError('');
      setErrorCode('');

      const params = new URLSearchParams({
        start_date: dateRange.start,
        end_date: dateRange.end,
        resources: RESOURCES.join(','),
      });

      try {
        const response = await fetch(`/api/oura?${params.toString()}`, {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        let payload = null;

        try {
          payload = await response.json();
        } catch (parseError) {
          payload = null;
        }

        if (!response.ok) {
          const requestError = new Error(
            payload?.error || payload?.message || `Oura API request failed (${response.status})`
          );
          requestError.code = payload?.code;
          throw requestError;
        }

        const readiness = payload?.daily_readiness?.data ?? payload?.readiness ?? payload?.data ?? [];
        const sleep = payload?.daily_sleep?.data ?? payload?.sleep ?? [];
        const activity = payload?.daily_activity?.data ?? payload?.activity ?? [];
        const sleepSessions = payload?.sleep?.data ?? payload?.sleep_sessions ?? [];

        if (isMounted) {
          setRawData({
            readiness,
            sleep,
            activity,
            sleepSessions,
          });
        }
      } catch (fetchError) {
        if (fetchError.name === 'AbortError') return;
        if (isMounted) {
          setRawData({ readiness: [], sleep: [], activity: [], sleepSessions: [] });
          setError(fetchError.message || 'Something went wrong while talking to Oura.');
          setErrorCode(fetchError.code || 'unknown');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchOuraData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [dateRange.end, dateRange.start, requestId]);

  const missingToken = errorCode === 'missing_token';

  const mergedRows = useMemo(() => {
    const toNumber = (value) => {
      if (typeof value === 'number') {
        return Number.isFinite(value) ? value : null;
      }
      if (typeof value === 'string') {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : null;
      }
      return null;
    };

    const pickNumber = (...values) => {
      for (const value of values) {
        const numeric = toNumber(value);
        if (numeric !== null) {
          return numeric;
        }
      }
      return null;
    };

    const readinessMap = new Map(
      rawData.readiness.map((entry) => [entry.day ?? entry.timestamp?.split('T')[0], entry])
    );
    const sleepMap = new Map(
      rawData.sleep.map((entry) => [entry.day ?? entry.timestamp?.split('T')[0], entry])
    );
    const activityMap = new Map(
      rawData.activity.map((entry) => [entry.day ?? entry.timestamp?.split('T')[0], entry])
    );

    const sleepSessionMap = rawData.sleepSessions.reduce((map, session) => {
      const sessionDate =
        session.day ?? session.bedtime_end?.split('T')[0] ?? session.bedtime_start?.split('T')[0];
      if (!sessionDate) {
        return map;
      }
      const duration = pickNumber(
        session.total_sleep_duration,
        session.sleep_duration,
        session.duration,
        session.time_in_bed
      );
      if (duration !== null) {
        map.set(sessionDate, (map.get(sessionDate) ?? 0) + duration);
      }
      return map;
    }, new Map());

    const dates = new Set([
      ...Array.from(readinessMap.keys()),
      ...Array.from(sleepMap.keys()),
      ...Array.from(activityMap.keys()),
    ]);

    const rows = Array.from(dates)
      .filter(Boolean)
      .sort((a, b) => (a < b ? 1 : -1))
      .map((date) => {
        const readiness = readinessMap.get(date) || {};
        const sleep = sleepMap.get(date) || {};
        const activity = activityMap.get(date) || {};
        const sessionDuration = sleepSessionMap.get(date) ?? null;
        const totalSleepSeconds = sessionDuration ?? pickNumber(
          sleep.total_sleep_duration,
          sleep.total_sleep,
          sleep.sleep_duration,
          sleep.time_asleep,
          sleep.duration
        );
        const sleepEfficiency = pickNumber(
          sleep.sleep_efficiency,
          sleep.efficiency,
          sleep.contributors?.sleep_efficiency,
          sleep.contributors?.efficiency
        );

        return {
          date,
          readinessScore: readiness.score ?? readiness.readiness_score ?? null,
          restingHeartRate: readiness.contributors?.resting_heart_rate ?? sleep.resting_heart_rate ?? null,
          hrvBalance: readiness.contributors?.heart_rate_variability_balance ?? null,
          totalSleep: totalSleepSeconds,
          sleepEfficiency,
          totalSteps: activity.steps ?? null,
          calories: activity.active_calories ?? activity.calories ?? null,
          activityScore: activity.score ?? null,
        };
      });

    return rows;
  }, [rawData.activity, rawData.readiness, rawData.sleep, rawData.sleepSessions]);

  return (
    <section className="mx-auto w-full max-w-[1200px] px-5 py-16 text-primary">
      <header className="mb-10 space-y-4">
        <p className="font-plex text-sm text-secondary uppercase tracking-[0.2em]">
          OURA HEALTH EXPERIMENT
        </p>
        <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-2">
            <h1 className="font-geist text-3xl text-primary 2xl:text-4xl">Wellness control center</h1>
            <p className="font-geist text-base leading-6 text-secondary">
              Admin-style dashboard that merges readiness, sleep, and activity data. Compare ranges, watch trends,
              and figure out how each habit day impacts the next.
            </p>
          </div>
          <RangeSelector
            value={dayWindow}
            onChange={setDayWindow}
            onRefresh={() => setRequestId((id) => id + 1)}
            loading={loading}
          />
        </div>
      </header>

      {missingToken && (
        <div className="mb-6 rounded-xl border border-outline bg-background/40 p-4 text-sm text-secondary">
          <p>
            Missing token. Add <code className="mx-1 bg-outline/30 px-1">OURA_API_TOKEN</code> to your
            <code className="mx-1 bg-outline/30 px-1">.env.local</code> (and hosting provider) so the proxy can call
            Oura on your behalf.
          </p>
        </div>
      )}

      {error && !missingToken && (
        <div className="mb-6 rounded-xl border border-outline bg-background/40 p-4 text-sm text-secondary">
          {error}
        </div>
      )}

      <OuraSummaryCards rows={mergedRows} loading={loading} />
      <TrendChart rows={mergedRows} loading={loading} />
      <DataTable rows={mergedRows} loading={loading} />
    </section>
  );
}

export default Oura;
