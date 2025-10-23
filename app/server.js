// server.js
const express = require('express');
const client = require('prom-client');
const path = require('path');

const app = express();
const port = 8080;

// Serve static files (frontend UI)
app.use(express.static(path.join(__dirname, 'public')));

// Enable default system metrics (CPU, memory, event loop lag, etc.)
client.collectDefaultMetrics();

// Define custom metrics
const requestCount = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const requestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 1, 3, 5]
});

// Middleware to record only *real user* traffic (skip Prometheus scrapes)
app.use((req, res, next) => {
  if (req.path === '/metrics') return next(); // 👈 ignore Prometheus scrapes
  const end = requestDuration.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.path, status_code: res.statusCode });
    requestCount.inc({ method: req.method, route: req.path, status_code: res.statusCode });
  });
  next();
});

// Main route (your web page)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint to simulate random success/failure (for dashboard tests)
app.get('/fail', (req, res) => {
  if (Math.random() > 0.5) {
    res.status(500).send('💥 Simulated Failure!');
  } else {
    res.send('✅ Success');
  }
});

// Expose Prometheus metrics
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// Start server
app.listen(port, () => {
  console.log(`✅ App running on port ${port}`);
});
