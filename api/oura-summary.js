const BASE_URL = 'https://api.ouraring.com/v2/usercollection';
const TOKEN_URL = process.env.OURA_TOKEN_URL || 'https://api.ouraring.com/oauth/token';

const formatDate = (date) => date.toISOString().split('T')[0];

let cachedAccessToken = null;
let cachedExpiry = 0;

async function resolveAccessToken() {
  const legacyToken = process.env.OURA_API_TOKEN || process.env.OURA_TOKEN;
  if (legacyToken) {
    return legacyToken;
  }

  const clientId = process.env.OURA_CLIENT_ID;
  const clientSecret = process.env.OURA_CLIENT_SECRET;
  const refreshToken = process.env.OURA_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    const configError = new Error(
      'Missing Oura OAuth credentials. Set OURA_CLIENT_ID, OURA_CLIENT_SECRET, and OURA_REFRESH_TOKEN or provide OURA_API_TOKEN.'
    );
    configError.code = 'missing_token';
    throw configError;
  }

  if (cachedAccessToken && Date.now() < cachedExpiry - 30000) {
    return cachedAccessToken;
  }

  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
  });

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.access_token) {
    const error = new Error(data.error_description || data.error || 'Unable to refresh Oura access token.');
    error.code = 'token_refresh_failed';
    throw error;
  }

  cachedAccessToken = data.access_token;
  const expiresIn = Number(data.expires_in) || 240;
  cachedExpiry = Date.now() + expiresIn * 1000;

  if (data.refresh_token && data.refresh_token !== refreshToken) {
    console.warn(
      'Received new Oura refresh token. Update OURA_REFRESH_TOKEN in your environment to persist it.'
    );
  }

  return cachedAccessToken;
}

async function fetchResource(resource, start, end, token) {
  const url = new URL(`${BASE_URL}/${resource}`);
  url.searchParams.set('start_date', start);
  url.searchParams.set('end_date', end);

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const body = await response.json();

  if (!response.ok) {
    const error = new Error(body?.detail || body?.message || 'Oura API error');
    error.status = response.status;
    error.meta = body;
    throw error;
  }

  return body.data || body;
}

function toNumber(value) {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function pickNumber(...values) {
  for (const value of values) {
    const numeric = toNumber(value);
    if (numeric !== null) {
      return numeric;
    }
  }
  return null;
}

function buildRows(readiness, sleep, sessions = []) {
  const readinessMap = new Map(
    readiness.map((entry) => [entry.day ?? entry.timestamp?.split('T')[0], entry])
  );
  const sleepMap = new Map(
    sleep.map((entry) => [entry.day ?? entry.timestamp?.split('T')[0], entry])
  );
  const sessionMap = sessions.reduce((map, session) => {
    const date = session.day ?? session.bedtime_end?.split('T')[0] ?? session.bedtime_start?.split('T')[0];
    if (!date) return map;
    const duration = pickNumber(
      session.total_sleep_duration,
      session.sleep_duration,
      session.duration,
      session.time_in_bed
    );
    if (duration !== null) {
      map.set(date, (map.get(date) ?? 0) + duration);
    }
    return map;
  }, new Map());

  const dates = new Set([...readinessMap.keys(), ...sleepMap.keys()]);

  return Array.from(dates)
    .filter(Boolean)
    .sort((a, b) => (a < b ? 1 : -1))
    .map((date) => {
      const readinessEntry = readinessMap.get(date) || {};
      const sleepEntry = sleepMap.get(date) || {};
      const sessionDuration = sessionMap.get(date) ?? null;
      const totalSleepSeconds = sessionDuration ?? pickNumber(
        sleepEntry.total_sleep_duration,
        sleepEntry.total_sleep,
        sleepEntry.sleep_duration,
        sleepEntry.time_asleep,
        sleepEntry.duration
      );

      return {
        date,
        readinessScore: readinessEntry.score ?? readinessEntry.readiness_score ?? null,
        sleepSeconds: totalSleepSeconds,
      };
    });
}

function average(values) {
  if (!values.length) return null;
  const sum = values.reduce((acc, value) => acc + value, 0);
  return sum / values.length;
}

function hours(seconds) {
  if (seconds === null || seconds === undefined) return null;
  return seconds / 3600;
}

function buildSummary(rows) {
  const readinessValues = rows
    .map((row) => row.readinessScore)
    .filter((value) => typeof value === 'number');
  const sleepValues = rows
    .map((row) => row.sleepSeconds)
    .filter((value) => typeof value === 'number');

  const readinessAvg = average(readinessValues);
  const sleepAvg = hours(average(sleepValues));

  const currentWindow = rows.slice(0, 7);
  const previousWindow = rows.slice(7, 14);

  const readinessCurrent = average(
    currentWindow.map((row) => row.readinessScore).filter((value) => typeof value === 'number')
  );
  const readinessPrevious = average(
    previousWindow.map((row) => row.readinessScore).filter((value) => typeof value === 'number')
  );
  const sleepCurrent = hours(
    average(currentWindow.map((row) => row.sleepSeconds).filter((value) => typeof value === 'number'))
  );
  const sleepPrevious = hours(
    average(previousWindow.map((row) => row.sleepSeconds).filter((value) => typeof value === 'number'))
  );

  const readinessChange =
    readinessCurrent !== null && readinessPrevious !== null
      ? readinessCurrent - readinessPrevious
      : null;
  const sleepChange =
    sleepCurrent !== null && sleepPrevious !== null ? sleepCurrent - sleepPrevious : null;

  const qualitativeNote =
    readinessChange && sleepChange
      ? readinessChange > 0 && sleepChange > 0
        ? 'More sleep seems to be boosting readiness this week.'
        : readinessChange < 0 && sleepChange < 0
          ? 'Less sleep is showing up as lower readiness; time to recharge.'
          : readinessChange > 0
            ? 'Readiness is trending up even with mixed sleep.'
            : 'Sleep looks steady, but readiness dipped slightly.'
      : 'Keeping an eye on recovery + sleep trends.';

  return {
    readinessAvg,
    readinessChange,
    sleepAvg,
    sleepChange,
    qualitativeNote,
  };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: 'Method Not Allowed', code: 'method_not_allowed' });
    return;
  }

  const days = Math.max(7, Math.min(60, Number(req.query.days) || 30));
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - (days - 1));

  const start = formatDate(startDate);
  const end = formatDate(endDate);

  try {
    const token = await resolveAccessToken();
    const [readiness, sleep, sleepSessions] = await Promise.all([
      fetchResource('daily_readiness', start, end, token),
      fetchResource('daily_sleep', start, end, token),
      fetchResource('sleep', start, end, token),
    ]);

    const rows = buildRows(readiness, sleep, sleepSessions);
    const summary = buildSummary(rows);
    const trend = rows.slice(0, 14).map((row) => ({
      date: row.date,
      readiness: row.readinessScore ?? null,
      sleepHours:
        typeof row.sleepSeconds === 'number'
          ? Number((row.sleepSeconds / 3600).toFixed(1))
          : null,
    }));

    res.status(200).json({
      summary,
      trend,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.message || 'Failed to reach Oura.',
      code: error.code || 'proxy_failure',
      meta: error.meta,
    });
  }
}
