const express = require('express');
const fetch = require('node-fetch');

const BASE_URL = 'https://api.ouraring.com/v2/usercollection';
const TOKEN_URL = process.env.OURA_TOKEN_URL || 'https://api.ouraring.com/oauth/token';

const formatDate = (date) => date.toISOString().split('T')[0];

function buildUrl(resource, params) {
  const url = new URL(`${BASE_URL}/${resource}`);
  params.forEach((value, key) => {
    url.searchParams.set(key, value);
  });
  return url.toString();
}

const performFetch = (url, token) =>
  fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(async (response) => {
    const body = await response.json();
    if (!response.ok) {
      const error = new Error(body?.detail || body?.message || 'Oura API error.');
      error.status = response.status;
      error.meta = body;
      throw error;
    }
    return body;
  });

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
    const error = new Error(
      'Missing Oura OAuth credentials. Set OURA_CLIENT_ID, OURA_CLIENT_SECRET, and OURA_REFRESH_TOKEN or provide OURA_API_TOKEN.'
    );
    error.code = 'missing_token';
    throw error;
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
    const tokenError = new Error(data.error_description || data.error || 'Unable to refresh Oura access token.');
    tokenError.code = 'token_refresh_failed';
    throw tokenError;
  }

  cachedAccessToken = data.access_token;
  const expiresIn = Number(data.expires_in) || 240;
  cachedExpiry = Date.now() + expiresIn * 1000;

  if (data.refresh_token && data.refresh_token !== refreshToken) {
    console.warn('Received new Oura refresh token. Update OURA_REFRESH_TOKEN to persist it.');
  }

  return cachedAccessToken;
}

module.exports = function setupProxy(app) {
  const secureRouter = express.Router();

  secureRouter.use((req, res) => {
    const requiredPass = process.env.OURA_DASHBOARD_PASSWORD;
    const providedPass = req.headers['x-oura-pass'];

    if (requiredPass && requiredPass !== providedPass) {
      res.status(401).json({ error: 'Unauthorized', code: 'unauthorized' });
      return;
    }

    const { resources, resource = 'daily_readiness', start_date: startDate, end_date: endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({
        error: 'start_date and end_date query params are required.',
        code: 'missing_range',
      });
      return;
    }

    const params = new URLSearchParams({ start_date: startDate, end_date: endDate });

    (async () => {
      let token;
      try {
        token = await resolveAccessToken();
      } catch (tokenError) {
        res.status(500).json({ error: tokenError.message, code: tokenError.code || 'missing_token' });
        return;
      }

      try {
        if (resources) {
          const requested = resources
            .split(',')
            .map((r) => r.trim())
            .filter(Boolean);
          if (!requested.length) {
            res.status(400).json({ error: 'invalid resources', code: 'invalid_resources' });
            return;
          }

          const responses = await Promise.allSettled(
            requested.map((name) => performFetch(buildUrl(name, params), token))
          );

          const data = {};
          const errors = [];

          responses.forEach((result, index) => {
            const name = requested[index];
            if (result.status === 'fulfilled') {
              data[name] = result.value;
            } else {
              errors.push({ resource: name, error: result.reason.message });
            }
          });

          if (errors.length === requested.length) {
            res.status(502).json({ error: 'All Oura requests failed', code: 'oura_error', meta: errors });
            return;
          }

          res.status(errors.length ? 207 : 200).json({ ...data, errors });
          return;
        }

        const payload = await performFetch(buildUrl(resource, params), token);
        res.status(200).json(payload);
      } catch (error) {
        res.status(error.status || 500).json({
          error: error.message || 'Failed to reach Oura.',
          code: error.code || 'proxy_failure',
          meta: error.meta,
        });
      }
    })();
  });

  app.use('/api/oura', secureRouter);

  const summaryRouter = express.Router();

  summaryRouter.use((req, res) => {
    const days = Math.max(7, Math.min(60, Number(req.query.days) || 30));
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - (days - 1));
    const start = formatDate(startDate);
    const end = formatDate(endDate);

    (async () => {
      let token;
      try {
        token = await resolveAccessToken();
      } catch (tokenError) {
        res.status(500).json({ error: tokenError.message, code: tokenError.code || 'missing_token' });
        return;
      }

      try {
        const params = new URLSearchParams({ start_date: start, end_date: end });
        const readinessResponse = await performFetch(buildUrl('daily_readiness', params), token);
        const sleepResponse = await performFetch(buildUrl('daily_sleep', params), token);
        const sessionsResponse = await performFetch(buildUrl('sleep', params), token);

        const readiness = readinessResponse.data || readinessResponse;
        const sleep = sleepResponse.data || sleepResponse;
        const sessions = sessionsResponse.data || sessionsResponse;

        const readinessMap = new Map(
          readiness.map((entry) => [entry.day ?? entry.timestamp?.split('T')[0], entry])
        );
        const sleepMap = new Map(
          sleep.map((entry) => [entry.day ?? entry.timestamp?.split('T')[0], entry])
        );

        const sessionMap = sessions.reduce((map, session) => {
          const date =
            session.day ?? session.bedtime_end?.split('T')[0] ?? session.bedtime_start?.split('T')[0];
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

        const dates = new Set([...readinessMap.keys(), ...sleepMap.keys(), ...sessionMap.keys()]);
        const rows = Array.from(dates)
          .filter(Boolean)
          .sort((a, b) => (a < b ? 1 : -1))
          .map((date) => {
            const readinessEntry = readinessMap.get(date) || {};
            const sleepEntry = sleepMap.get(date) || {};
            const sessionDuration = sessionMap.get(date) ?? null;
            const sleepSeconds = sessionDuration ?? pickNumber(
              sleepEntry.total_sleep_duration,
              sleepEntry.total_sleep,
              sleepEntry.sleep_duration,
              sleepEntry.time_asleep,
              sleepEntry.duration
            );
            return {
              date,
              readinessScore: readinessEntry.score ?? readinessEntry.readiness_score ?? null,
              sleepSeconds,
            };
          });

        const average = (values) => {
          if (!values.length) return null;
          return values.reduce((acc, value) => acc + value, 0) / values.length;
        };

        const readinessValues = rows
          .map((row) => row.readinessScore)
          .filter((value) => typeof value === 'number');
        const sleepValues = rows
          .map((row) => row.sleepSeconds)
          .filter((value) => typeof value === 'number');

        const readinessAvg = average(readinessValues);
        const sleepAvg = average(sleepValues);

        const currentWindow = rows.slice(0, 7);
        const previousWindow = rows.slice(7, 14);

        const readinessCurrent = average(
          currentWindow.map((row) => row.readinessScore).filter((value) => typeof value === 'number')
        );
        const readinessPrevious = average(
          previousWindow.map((row) => row.readinessScore).filter((value) => typeof value === 'number')
        );
        const sleepCurrent = average(
          currentWindow.map((row) => row.sleepSeconds).filter((value) => typeof value === 'number')
        );
        const sleepPrevious = average(
          previousWindow.map((row) => row.sleepSeconds).filter((value) => typeof value === 'number')
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
                ? 'Less sleep is showing up as lower readiness.'
                : readinessChange > 0
                  ? 'Readiness is trending up even with mixed sleep.'
                  : 'Sleep looks steady, but readiness dipped slightly.'
            : 'Keeping an eye on recovery + sleep trends.';

        const trend = rows.slice(0, 14).map((row) => ({
          date: row.date,
          readiness: row.readinessScore ?? null,
          sleepHours:
            typeof row.sleepSeconds === 'number'
              ? Number((row.sleepSeconds / 3600).toFixed(1))
              : null,
        }));

        res.status(200).json({
          summary: {
            readinessAvg,
            readinessChange,
            sleepAvg: sleepAvg !== null ? sleepAvg / 3600 : null,
            sleepChange: sleepChange !== null ? sleepChange / 3600 : null,
            qualitativeNote,
          },
          trend,
        });
      } catch (error) {
        res.status(error.status || 500).json({
          error: error.message || 'Failed to reach Oura.',
          code: error.code || 'proxy_failure',
          meta: error.meta,
        });
      }
    })();
  });

  app.use('/api/oura-summary', summaryRouter);
};
