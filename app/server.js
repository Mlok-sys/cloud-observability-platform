const express = require('express');
const client = require('prom-client');

const app = express();
const port = 8080;

// 1️⃣ Collect default system metrics (CPU, memory, event loop lag, etc.)
client.collectDefaultMetrics();

// 2️⃣ Create a registry and custom metrics
const requestCount = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code']
});

const requestDuration = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.3, 0.5, 1, 3, 5] // latency buckets
});

// 3️⃣ Middleware to measure requests
app.use((req, res, next) => {
    const end = requestDuration.startTimer();
    res.on('finish', () => {
        end({ method: req.method, route: req.path, status_code: res.statusCode });
        requestCount.inc({ method: req.method, route: req.path, status_code: res.statusCode });
    });
    next();
});

// 4️⃣ Your main route
app.get('/', (req, res) => {
    res.send('<h1>🚀 Cloud Observability Platform</h1><p>Now with Prometheus metrics!</p>');
});

// 5️⃣ Simulate a random failure route for testing
app.get('/fail', (req, res) => {
    if (Math.random() > 0.5) {
        res.status(500).send('💥 Simulated Failure!');
    } else {
        res.send('✅ Success');
    }
});

// 6️⃣ Expose the /metrics endpoint
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

// 7️⃣ Start the server
app.listen(port, () => {
    console.log(`✅ App running and collecting metrics on port ${port}`);
});
