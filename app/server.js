const express = require('express');
const client = require('prom-client');
const path = require('path');

const app = express();
const port = 8080;

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Collect system metrics
client.collectDefaultMetrics();

// Custom metrics
const requestCount = new client.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

const requestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 1, 3, 5],
});

// Middleware for metrics
app.use((req, res, next) => {
  const end = requestDuration.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.path, status_code: res.statusCode });
    requestCount.inc({ method: req.method, route: req.path, status_code: res.statusCode });
  });
  next();
});

// Simulate random 500 errors
app.get('/fail', (req, res) => {
  if (Math.random() > 0.5) {
    res.status(500).send('💥 Simulated Failure!');
  } else {
    res.send('✅ Success');
  }
});

// Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// Start the app
app.listen(port, () => {
  console.log(`✅ App running on port ${port}`);
});
