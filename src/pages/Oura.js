import { useEffect, useMemo, useState } from 'react';
import OuraSummaryCards from '../components/Oura/OuraSummaryCards';
import TrendChart from '../components/Oura/TrendChart';
import DataTable from '../components/Oura/DataTable';
import RangeSelector from '../components/Oura/RangeSelector';
import InsightCard from '../components/Oura/InsightCard';
import MiniTrend from '../components/Oura/MiniTrend';

const RESOURCES = ['daily_readiness', 'daily_sleep', 'daily_activity', 'sleep'];

const createEmptyData = () => ({
  readiness: [],
  sleep: [],
  activity: [],
  sleepSessions: [],
});

const formatDate = (date) => date.toISOString().split('T')[0];

function Oura() {
  const [dayWindow, setDayWindow] = useState(7);
  const [rawData, setRawData] = useState(createEmptyData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorCode, setErrorCode] = useState('');
  const [requestId, setRequestId] = useState(0);
  const [accessKey, setAccessKey] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [unlockError, setUnlockError] = useState('');
  const [unlocking, setUnlocking] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [publicSummary, setPublicSummary] = useState(null);
  const [publicTrend, setPublicTrend] = useState([]);
  const [publicLoading, setPublicLoading] = useState(true);
  const [publicError, setPublicError] = useState('');

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
    if (!accessKey) {
      return;
    }

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
            'x-oura-pass': accessKey,
          },
        });

        let payload = null;

        try {
          payload = await response.json();
        } catch (parseError) {
          payload = null;
        }

        if (response.status === 401) {
          if (isMounted) {
            setUnlockError('Incorrect passphrase. Try again.');
            setHasAccess(false);
            setAccessKey('');
            setPasswordInput('');
            setRawData(createEmptyData());
          }
          return;
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
          setHasAccess(true);
          setUnlockError('');
        }
      } catch (fetchError) {
        if (fetchError.name === 'AbortError') return;
        if (isMounted) {
          setRawData(createEmptyData());
          setError(fetchError.message || 'Something went wrong while talking to Oura.');
          setErrorCode(fetchError.code || 'unknown');
          setHasAccess(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setUnlocking(false);
        }
      }
    }

    fetchOuraData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [accessKey, dateRange.end, dateRange.start, requestId]);

  useEffect(() => {
    let isMounted = true;
    setPublicLoading(true);
    setPublicError('');

    fetch('/api/oura-summary?days=30')
      .then(async (response) => {
        const payload = await response.json().catch(() => null);

        if (!response.ok) {
          const message = payload?.error || `Summary fetch failed (${response.status})`;
          throw new Error(message);
        }

        if (isMounted) {
          setPublicSummary(payload.summary || null);
          setPublicTrend(payload.trend || []);
          setPublicLoading(false);
        }
      })
      .catch((summaryError) => {
        if (isMounted) {
          setPublicSummary(null);
          setPublicTrend([]);
          setPublicError(summaryError.message || 'Unable to load public summary.');
          setPublicLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleUnlock = (event) => {
    event.preventDefault();
    if (!passwordInput.trim()) {
      setUnlockError('Enter the passphrase to continue.');
      return;
    }

    setUnlockError('');
    setAccessKey(passwordInput.trim());
    setUnlocking(true);
  };

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

  const formatDelta = (value, suffix) => {
    if (value === null || value === undefined) return 'No change';
    if (value === 0) return 'Flat week-over-week';
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}${suffix}`;
  };

  const hasReadinessAvg =
    publicSummary && publicSummary.readinessAvg !== null && publicSummary.readinessAvg !== undefined;
  const hasReadinessChange =
    publicSummary &&
    publicSummary.readinessChange !== null &&
    publicSummary.readinessChange !== undefined;
  const hasSleepAvg =
    publicSummary && publicSummary.sleepAvg !== null && publicSummary.sleepAvg !== undefined;
  const hasSleepChange =
    publicSummary && publicSummary.sleepChange !== null && publicSummary.sleepChange !== undefined;

  const readinessMetric = hasReadinessAvg
    ? `${publicSummary.readinessAvg.toFixed(1)}/100`
    : publicLoading
      ? '…'
      : '—';
  const readinessDelta = hasReadinessChange
    ? formatDelta(publicSummary.readinessChange, ' pts vs last week')
    : publicLoading
      ? 'Calculating…'
      : 'No trend yet';

  const sleepMetric = hasSleepAvg
    ? `${publicSummary.sleepAvg.toFixed(1)}h`
    : publicLoading
      ? '…'
      : '—';
  const sleepDelta = hasSleepChange
    ? formatDelta(publicSummary.sleepChange, 'h vs last week')
    : publicLoading
      ? 'Crunching logs…'
      : 'No change yet';

  const qualitativeNote =
    publicSummary?.qualitativeNote ||
    (publicLoading ? 'Synthesizing insights…' : 'Keeping an eye on recovery + sleep trends.');

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
          {hasAccess ? (
            <RangeSelector
              value={dayWindow}
              onChange={setDayWindow}
              onRefresh={() => setRequestId((id) => id + 1)}
              loading={loading}
            />
          ) : (
            <form
              onSubmit={handleUnlock}
              className="flex flex-col gap-3 rounded-2xl border border-outline p-4 lg:min-w-[320px]"
            >
              <label className="font-plex text-xs uppercase tracking-[0.2em] text-secondary">
                Private preview
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(event) => setPasswordInput(event.target.value)}
                className="rounded-xl border border-outline bg-transparent px-4 py-2 font-geist text-sm text-primary outline-none focus:border-primary"
                placeholder="Enter passphrase"
              />
              {unlockError && <p className="text-xs text-red-400">{unlockError}</p>}
              <button
                type="submit"
                className="rounded-xl border border-outline px-4 py-2 text-sm text-secondary transition-colors hover:border-primary hover:text-primary"
                disabled={unlocking}
              >
                {unlocking ? 'Unlocking…' : 'Unlock dashboard'}
              </button>
              <p className="font-plex text-xs text-secondary">
                Invite-only view. Reach out if you want to geek out over the raw data.
              </p>
            </form>
          )}
        </div>
      </header>

      {missingToken && hasAccess && (
        <div className="mb-6 rounded-xl border border-outline bg-background/40 p-4 text-sm text-secondary">
          <p>
            Missing token. Add <code className="mx-1 bg-outline/30 px-1">OURA_API_TOKEN</code> to your
            <code className="mx-1 bg-outline/30 px-1">.env.local</code> (and hosting provider) so the proxy can call
            Oura on your behalf.
          </p>
        </div>
      )}

      {error && !missingToken && hasAccess && (
        <div className="mb-6 rounded-xl border border-outline bg-background/40 p-4 text-sm text-secondary">
          {error}
        </div>
      )}

      <section className="mb-10 space-y-6 rounded-2xl border border-outline bg-background/30 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <InsightCard
            title="Readiness balance"
            metric={readinessMetric}
            delta={readinessDelta}
            helper="Weekly average readiness score"
          />
          <InsightCard
            title="Sleep consistency"
            metric={sleepMetric}
            delta={sleepDelta}
            helper="Average hours slept per night"
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-outline p-4">
            <p className="font-plex text-xs uppercase tracking-[0.2em] text-secondary">Readiness trend</p>
            {publicTrend.length ? (
              <MiniTrend rows={publicTrend} metricKey="readiness" color="#EDEDED" label="Readiness" />
            ) : (
              <p className="mt-4 font-plex text-xs text-secondary">
                {publicLoading ? 'Plotting latest data…' : publicError || 'No trend available yet.'}
              </p>
            )}
          </div>
          <div className="rounded-2xl border border-outline p-4">
            <p className="font-plex text-xs uppercase tracking-[0.2em] text-secondary">Sleep trend</p>
            {publicTrend.length ? (
              <MiniTrend rows={publicTrend} metricKey="sleepHours" color="#A1A1A1" label="Sleep (h)" />
            ) : (
              <p className="mt-4 font-plex text-xs text-secondary">
                {publicLoading ? 'Crunching nightly logs…' : publicError || 'No trend available yet.'}
              </p>
            )}
          </div>
        </div>
        <div className="rounded-2xl border border-outline p-4">
          <p className="font-plex text-xs uppercase tracking-[0.2em] text-secondary">Weekly takeaway</p>
          <p className="mt-3 font-geist text-base leading-6 text-primary">{qualitativeNote}</p>
          {publicError && (
            <p className="mt-2 font-plex text-xs text-red-400">{publicError}. Showing cached insight.</p>
          )}
        </div>
      </section>

      {hasAccess ? (
        <>
          <OuraSummaryCards rows={mergedRows} loading={loading} />
          <TrendChart rows={mergedRows} loading={loading} />
          <DataTable rows={mergedRows} loading={loading} />
        </>
      ) : (
        <section className="rounded-2xl border border-outline bg-background/30 p-6 text-secondary">
          <p className="font-plex text-xs uppercase tracking-[0.2em]">Preview Mode</p>
          <h2 className="mt-2 font-geist text-2xl text-primary">Detailed trends stay hidden</h2>
          <p className="mt-3 font-geist text-base leading-6 text-secondary">
            This experiment ingests my private Oura metrics. I keep the nitty-gritty behind a passphrase so interviews
            and casual visitors only see the concept, not daily biometrics. Ask and I can share the live view.
          </p>
        </section>
      )}
    </section>
  );
}

export default Oura;
