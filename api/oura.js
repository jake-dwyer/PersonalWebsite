const BASE_URL = 'https://api.ouraring.com/v2/usercollection';

const VALID_RESOURCES = ['daily_readiness', 'daily_sleep', 'daily_activity'];

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

  const token = process.env.OURA_API_TOKEN || process.env.OURA_TOKEN;
  const requiredPass = process.env.OURA_DASHBOARD_PASSWORD;
  const providedPass = req.headers['x-oura-pass'];

  if (requiredPass && requiredPass !== providedPass) {
    res.status(401).json({
      error: 'Unauthorized',
      code: 'unauthorized',
    });
    return;
  }

  if (!token) {
    res.status(500).json({
      error: 'Missing Oura API token. Set OURA_API_TOKEN in your environment.',
      code: 'missing_token',
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
      code: 'proxy_failure',
    });
  }
}
