const express = require('express');
const fetch = require('node-fetch');

module.exports = function setupProxy(app) {
  const router = express.Router();

  router.use((req, res, next) => {
    const token = process.env.OURA_API_TOKEN || process.env.OURA_TOKEN;

    if (!token) {
      res.status(500).json({
        error: 'Missing OURA_API_TOKEN. Add it to your .env.local for local development.',
        code: 'missing_token',
      });
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

    const baseParams = new URLSearchParams({ start_date: startDate, end_date: endDate });
    const headers = { Authorization: `Bearer ${token}` };
    const baseUrl = 'https://api.ouraring.com/v2/usercollection';

    const performFetch = (url) =>
      fetch(url, { headers }).then(async (response) => {
        const body = await response.json();
        if (!response.ok) {
          const err = new Error(body?.detail || body?.message || 'Oura API error.');
          err.status = response.status;
          err.meta = body;
          throw err;
        }
        return body;
      });

    (async () => {
      try {
        if (resources) {
          const requested = resources
            .split(',')
            .map((r) => r.trim())
            .filter(Boolean);

          if (!requested.length) {
            res.status(400).json({
              error: 'At least one valid resource must be provided.',
              code: 'invalid_resources',
            });
            return;
          }

          const responses = await Promise.allSettled(
            requested.map((name) => performFetch(`${baseUrl}/${name}?${baseParams.toString()}`))
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
            res.status(502).json({
              error: 'All Oura requests failed',
              code: 'oura_error',
              meta: errors,
            });
            return;
          }

          res.status(errors.length ? 207 : 200).json({ ...data, errors });
          return;
        }

        const payload = await performFetch(`${baseUrl}/${resource}?${baseParams.toString()}`);
        res.status(200).json(payload);
      } catch (err) {
        res.status(err.status || 500).json({
          error: err.message || 'Failed to reach Oura.',
          code: err.code || 'proxy_failure',
          meta: err.meta,
        });
      }
    })();
  });

  app.use('/api/oura', router);
};
