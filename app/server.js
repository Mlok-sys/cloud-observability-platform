const express = require('express');
const client = require('prom-client');

const app = express();
const port = 8080;

// 🧠 Collect default Node.js system metrics
client.collectDefaultMetrics();

// 🧮 Custom metrics
const requestCount = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

const requestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 1, 3, 5],
});

// ⚙️ Middleware to collect metrics for every request
app.use((req, res, next) => {
  const end = requestDuration.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.path, status_code: res.statusCode });
    requestCount.inc({ method: req.method, route: req.path, status_code: res.statusCode });
  });
  next();
});

// 🏠 Homepage (main route)
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cloud Observability Platform</title>
      <style>
        body {
          background: #0b1120;
          color: #f4f4f4;
          font-family: 'Segoe UI', sans-serif;
          text-align: center;
          padding: 80px;
        }
        h1 { color: #00d1b2; font-size: 2.5em; }
        p { color: #ccc; font-size: 1.1em; }
        img { width: 70%; border-radius: 12px; margin-top: 30px; box-shadow: 0 0 15px rgba(0,0,0,0.5); }
        a { color: #00d1b2; text-decoration: none; font-weight: bold; }
        a:hover { text-decoration: underline; }
        footer { margin-top: 60px; color: #666; font-size: 0.9em; }
      </style>
    </head>
    <body>
      <h1>🚀 Cloud Observability Platform</h1>
      <p>Built with <b>Prometheus</b>, <b>Grafana</b>, <b>Loki</b>, and <b>Node Exporter</b></p>
      <img src="https://raw.githubusercontent.com/Mlok-sys/cloud-observability-platform/main/architecture.png" alt="Architecture Diagram">
      <p><a href="/metrics">📊 View Prometheus Metrics</a></p>
      <footer>© ${new Date().getFullYear()} Abdulmelik Alorayfij — <a href="https://abdulmalikalorayfijstudying.com">Portfolio</a></footer>
    </body>
    </html>
  `);
});

// 💥 Test failure endpoint (to simulate app errors)
app.get('/fail', (req, res) => {
  if (Math.random() > 0.5) res.status(500).send('💥 Simulated Failure!');
  else res.send('✅ Success');
});

// 📈 Expose Prometheus metrics
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// 🚀 Start server
app.listen(port, () => {
  console.log(`✅ App running on port ${port}`);
});
