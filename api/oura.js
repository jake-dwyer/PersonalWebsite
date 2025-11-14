const BASE_URL = 'https://api.ouraring.com/v2/usercollection';
const TOKEN_URL = process.env.OURA_TOKEN_URL || 'https://api.ouraring.com/oauth/token';

const VALID_RESOURCES = ['daily_readiness', 'daily_sleep', 'daily_activity'];

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

function buildSingleRequest(resource, start, end) {
  const url = new URL(`${BASE_URL}/${resource}`);
  url.searchParams.set('start_date', start);
  url.searchParams.set('end_date', end);
  return url.toString();
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: 'Method Not Allowed', code: 'method_not_allowed' });
    return;
  }

  const requiredPass = process.env.OURA_DASHBOARD_PASSWORD;
  const providedPass = req.headers['x-oura-pass'];

  if (requiredPass && requiredPass !== providedPass) {
    res.status(401).json({
      error: 'Unauthorized',
      code: 'unauthorized',
    });
    return;
  }

  const {
    resource = 'daily_readiness',
    resources,
    start_date: startDate,
    end_date: endDate,
  } = req.query;

  if (!startDate || !endDate) {
    res.status(400).json({
      error: 'start_date and end_date query params are required.',
      code: 'missing_range',
    });
    return;
  }

  try {
    const token = await resolveAccessToken();
    if (resources) {
      const requested = resources
        .split(',')
        .map((r) => r.trim())
        .filter((r) => VALID_RESOURCES.includes(r));

      if (requested.length === 0) {
        res.status(400).json({
          error: 'At least one valid resource is required.',
          code: 'invalid_resources',
        });
        return;
      }

      const responses = await Promise.allSettled(
        requested.map((resourceName) =>
          fetch(buildSingleRequest(resourceName, startDate, endDate), {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then(async (response) => {
            const body = await response.json();
            if (!response.ok) {
              throw new Error(body?.detail || body?.message || 'Oura API error.');
            }
            return [resourceName, body];
          })
        )
      );

      const data = {};
      const errors = [];

      responses.forEach((result, index) => {
        const name = requested[index];
        if (result.status === 'fulfilled') {
          data[name] = result.value[1];
        } else {
          errors.push({ resource: name, error: result.reason.message });
        }
      });

      if (errors.length === requested.length) {
        res.status(502).json({
          error: 'All Oura requests failed',
          code: 'oura_error',
          meta: errors,
        });
        return;
      }

      res.status(errors.length ? 207 : 200).json({
        ...data,
        errors,
      });
      return;
    }

    const ouraResponse = await fetch(buildSingleRequest(resource, startDate, endDate), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await ouraResponse.json();

    if (!ouraResponse.ok) {
      res.status(ouraResponse.status).json({
        error: data?.detail || data?.message || 'Oura API error.',
        code: 'oura_error',
        meta: data,
      });
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: error.message || 'Failed to reach Oura.',
      code: error.code || 'proxy_failure',
    });
  }
}
